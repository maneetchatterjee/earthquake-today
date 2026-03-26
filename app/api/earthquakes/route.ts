import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { EarthquakeSchema } from '@/lib/schemas';

const USGS_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';
const EMSC_URL = 'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=100&orderby=time';
const TTL_MS = 60_000; // 60 seconds

const PERIOD_MAP: Record<string, string> = {
  hour: `${USGS_BASE}/all_hour.geojson`,
  day: `${USGS_BASE}/all_day.geojson`,
  week: `${USGS_BASE}/all_week.geojson`,
  month: `${USGS_BASE}/all_month.geojson`,
};

type GeoJSONFeatureCollection = { type: string; features: unknown[]; metadata?: Record<string, unknown>; _source?: string };

// Normalize an EMSC FDSN response to USGS GeoJSON FeatureCollection format
function normalizeEmsc(emsc: { features?: unknown[] }): GeoJSONFeatureCollection {
  const features = (emsc.features ?? []).map((f: unknown) => {
    const feat = f as {
      properties: {
        unid?: string;
        flynn_region?: string;
        mag?: number;
        time?: string;
        tsunami?: number;
        evtype?: string;
      };
      geometry: { coordinates: [number, number, number] };
    };
    return {
      type: 'Feature',
      id: feat.properties.unid ?? '',
      properties: {
        mag: feat.properties.mag ?? null,
        place: feat.properties.flynn_region ?? null,
        time: feat.properties.time ? new Date(feat.properties.time).getTime() : null,
        updated: null,
        tsunami: feat.properties.tsunami ?? 0,
        type: feat.properties.evtype ?? 'earthquake',
      },
      geometry: {
        type: 'Point',
        coordinates: feat.geometry.coordinates,
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features,
    metadata: { count: features.length, title: 'EMSC Earthquake Feed' },
    _source: 'emsc',
  };
}

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get('period') ?? 'day';
  const url = PERIOD_MAP[period];

  if (!url) {
    return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
  }

  const cacheKey = `earthquakes:${period}`;
  const cached = cacheGet<unknown>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  let data: unknown;

  // Try USGS with retry
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetchWithRetry(url, { signal: controller.signal });
    clearTimeout(timeout);
    data = await res.json();
  } catch {
    // USGS failed — fall back to EMSC
    try {
      const emscRes = await fetchWithRetry(EMSC_URL);
      const emscData = await emscRes.json();
      data = normalizeEmsc(emscData as { features?: unknown[] });
    } catch (emscErr) {
      const message = emscErr instanceof Error ? emscErr.message : 'Failed to fetch earthquake data';
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  // Schema validation (non-blocking)
  const parsed = EarthquakeSchema.safeParse(data);
  if (!parsed.success) {
    console.warn('Earthquake data validation failed:', parsed.error.message);
    const invalidated = { ...(data as object), _validated: false };
    cacheSet(cacheKey, invalidated, TTL_MS);
    return NextResponse.json(invalidated, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  }

  cacheSet(cacheKey, data, TTL_MS);
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
