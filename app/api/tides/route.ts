import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';

const TTL_MS = 900_000; // 15 minutes

export async function GET(req: NextRequest) {
  const station = req.nextUrl.searchParams.get('station');
  const beginDate = req.nextUrl.searchParams.get('begin_date');
  const endDate = req.nextUrl.searchParams.get('end_date');

  if (!station || !beginDate || !endDate) {
    return NextResponse.json({ error: 'station, begin_date, and end_date are required' }, { status: 400 });
  }

  // Validate inputs to prevent injection
  if (!/^\d{7}$/.test(station)) {
    return NextResponse.json({ error: 'Invalid station ID' }, { status: 400 });
  }
  if (!/^\d{8}$/.test(beginDate) || !/^\d{8}$/.test(endDate)) {
    return NextResponse.json({ error: 'Invalid date format (expected YYYYMMDD)' }, { status: 400 });
  }

  const cacheKey = `tides:${station}:${beginDate}:${endDate}`;
  const cached = cacheGet<unknown>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&begin_date=${beginDate}&end_date=${endDate}&datum=MLLW&station=${station}&time_zone=gmt&units=metric&interval=hilo&format=json`;

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
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch tide data';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
