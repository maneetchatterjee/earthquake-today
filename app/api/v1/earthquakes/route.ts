import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT = 100; // requests per hour per IP
const WINDOW_MS = 60 * 60 * 1000;

const ipCounters = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounters.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounters.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 100 requests/hour.' },
      { status: 429, headers: CORS_HEADERS }
    );
  }

  const period = req.nextUrl.searchParams.get('period') ?? 'day';
  const validPeriods = ['hour', 'day', 'week', 'month'];
  if (!validPeriods.includes(period)) {
    return NextResponse.json(
      { error: `Invalid period. Must be one of: ${validPeriods.join(', ')}` },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const base = req.nextUrl.origin;
  const upstream = `${base}/api/earthquakes?period=${period}`;

  try {
    const res = await fetch(upstream);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error ${res.status}` },
        { status: 502, headers: CORS_HEADERS }
      );
    }
    const data: unknown = await res.json();
    return NextResponse.json(data, {
      headers: {
        ...CORS_HEADERS,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch earthquake data';
    return NextResponse.json({ error: message }, { status: 502, headers: CORS_HEADERS });
  }
}
