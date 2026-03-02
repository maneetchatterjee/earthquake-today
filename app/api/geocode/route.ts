import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';

const TTL_MS = 86_400_000; // 24 hours — location names rarely change

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

  const cacheKey = `geocode:${latNum.toFixed(3)}:${lngNum.toFixed(3)}`;
  const cached = cacheGet<unknown>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latNum}&lon=${lngNum}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'EarthMonitor/1.0' },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    cacheSet(cacheKey, data, TTL_MS);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to reverse geocode';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
