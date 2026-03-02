import { NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';

const TTL_MS = 1_800_000; // 30 minutes — same as hook refresh interval

export async function GET() {
  const cacheKey = 'firms:global';
  const cached = cacheGet<string>(cacheKey);
  if (cached) {
    return new NextResponse(cached, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const apiKey = process.env.FIRMS_MAP_KEY;
  const url = apiKey
    ? `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/VIIRS_SNPP_NRT/world/1`
    : 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_Global_24h.csv';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000); // CSV can be large
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: 502 });
    }

    const text = await res.text();
    cacheSet(cacheKey, text, TTL_MS);
    return new NextResponse(text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch wildfire data';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
