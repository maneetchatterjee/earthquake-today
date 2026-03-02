import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';

const TTL_MS = 60_000; // 60 seconds

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const minLat = searchParams.get('minlatitude');
  const maxLat = searchParams.get('maxlatitude');
  const minLng = searchParams.get('minlongitude');
  const maxLng = searchParams.get('maxlongitude');

  if (!minLat || !maxLat || !minLng || !maxLng) {
    return NextResponse.json(
      { error: 'minlatitude, maxlatitude, minlongitude, maxlongitude are required' },
      { status: 400 }
    );
  }

  // Validate coordinates
  const coords = [minLat, maxLat, minLng, maxLng].map(parseFloat);
  if (coords.some(isNaN)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }
  const [minLatN, maxLatN, minLngN, maxLngN] = coords;
  if (minLatN < -90 || maxLatN > 90 || minLngN < -180 || maxLngN > 180) {
    return NextResponse.json({ error: 'Coordinates out of range' }, { status: 400 });
  }

  const cacheKey = `eq-local:${minLatN.toFixed(2)}:${maxLatN.toFixed(2)}:${minLngN.toFixed(2)}:${maxLngN.toFixed(2)}`;
  const cached = cacheGet<unknown>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=${minLatN}&maxlatitude=${maxLatN}&minlongitude=${minLngN}&maxlongitude=${maxLngN}&minmagnitude=2&orderby=time&limit=5`;

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
    const message = err instanceof Error ? err.message : 'Failed to fetch local earthquake data';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
