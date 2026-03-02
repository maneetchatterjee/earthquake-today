import { NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';

const TTL_MS = 300_000; // 5 minutes

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
  const cacheKey = 'energy:uk';
  const cached = cacheGet<unknown>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const [intensityResult, generationResult] = await Promise.allSettled([
    fetchWithTimeout('https://api.carbonintensity.org.uk/intensity'),
    fetchWithTimeout('https://api.carbonintensity.org.uk/generation'),
  ]);

  const data = {
    intensity: intensityResult.status === 'fulfilled' ? intensityResult.value : null,
    generation: generationResult.status === 'fulfilled' ? generationResult.value : null,
  };

  cacheSet(cacheKey, data, TTL_MS);
  return NextResponse.json(data);
}
