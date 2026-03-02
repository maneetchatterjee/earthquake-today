import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    feeds: {
      usgs: { url: '/api/earthquakes' },
      nasa: { url: '/api/nasa' },
      firms: { url: '/api/firms' },
      weather: { url: '/api/weather' },
      airQuality: { url: '/api/air-quality' },
      marine: { url: '/api/marine' },
      solar: { url: '/api/solar' },
      energy: { url: '/api/energy' },
      flights: { url: '/api/flights' },
      tides: { url: '/api/tides' },
      news: { url: '/api/news' },
      iss: { url: '/api/iss' },
    },
  }, {
    headers: { 'Cache-Control': 'no-cache' },
  });
}
