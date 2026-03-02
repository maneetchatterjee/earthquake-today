import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';

const TTL_MS = 300_000; // 5 minutes

const OPEN_METEO_PARAMS =
  'current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto';

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  const cacheKey = `weather:${latNum.toFixed(4)}:${lngNum.toFixed(4)}`;
  const cached = cacheGet<unknown>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latNum}&longitude=${lngNum}&${OPEN_METEO_PARAMS}`;

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
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
