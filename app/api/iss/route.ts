import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';

const POSITION_TTL_MS = 10_000; // 10 seconds
const ASTROS_TTL_MS = 60_000; // 1 minute

export async function GET(req: NextRequest) {
  const endpoint = req.nextUrl.searchParams.get('endpoint') ?? 'position';

  if (endpoint !== 'position' && endpoint !== 'astros') {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  }

  const cacheKey = `iss:${endpoint}`;
  const cached = cacheGet<unknown>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const url =
    endpoint === 'position'
      ? 'https://api.open-notify.org/iss-now.json'
      : 'https://api.open-notify.org/astros.json';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    const ttl = endpoint === 'position' ? POSITION_TTL_MS : ASTROS_TTL_MS;
    cacheSet(cacheKey, data, ttl);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch ISS data';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
