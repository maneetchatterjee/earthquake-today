import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';

const USGS_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';
const TTL_MS = 60_000; // 60 seconds

const PERIOD_MAP: Record<string, string> = {
  hour: `${USGS_BASE}/all_hour.geojson`,
  day: `${USGS_BASE}/all_day.geojson`,
  week: `${USGS_BASE}/all_week.geojson`,
  month: `${USGS_BASE}/all_month.geojson`,
};

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

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    cacheSet(cacheKey, data, TTL_MS);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch earthquake data';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
