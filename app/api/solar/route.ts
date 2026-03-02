import { NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';

const TTL_MS = 300_000; // 5 minutes

const ENDPOINTS = {
  kp: 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
  plasma: 'https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json',
  flares: 'https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json',
  sunspots: 'https://services.swpc.noaa.gov/json/solar-cycle/sunspots.json',
};

async function fetchWithTimeout(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const cacheKey = 'solar:all';
  const cached = cacheGet<unknown>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const [kpResult, plasmaResult, flaresResult, sunspotsResult] = await Promise.allSettled([
    fetchWithTimeout(ENDPOINTS.kp),
    fetchWithTimeout(ENDPOINTS.plasma),
    fetchWithTimeout(ENDPOINTS.flares),
    fetchWithTimeout(ENDPOINTS.sunspots),
  ]);

  const data = {
    kp: kpResult.status === 'fulfilled' ? kpResult.value : null,
    plasma: plasmaResult.status === 'fulfilled' ? plasmaResult.value : null,
    flares: flaresResult.status === 'fulfilled' ? flaresResult.value : null,
    sunspots: sunspotsResult.status === 'fulfilled' ? sunspotsResult.value : null,
  };

  cacheSet(cacheKey, data, TTL_MS);
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
