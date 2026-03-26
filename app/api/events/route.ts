import { NextRequest } from 'next/server';

const USGS_HOUR_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
const POLL_INTERVAL_MS = 30_000;

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const seenIds = new Set<string>();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const send = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      const poll = async () => {
        try {
          const res = await fetch(USGS_HOUR_URL, { cache: 'no-store' });
          if (!res.ok) return;
          const json = await res.json() as { features?: Array<{ id: string; properties: unknown; geometry: unknown }> };
          const features = json.features ?? [];

          for (const feature of features) {
            if (!seenIds.has(feature.id)) {
              seenIds.add(feature.id);
              send(JSON.stringify(feature));
            }
          }
        } catch {
          // silently skip failed polls
        }
      };

      // Initial poll to seed seenIds without sending events
      try {
        const res = await fetch(USGS_HOUR_URL, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json() as { features?: Array<{ id: string }> };
          for (const f of json.features ?? []) seenIds.add(f.id);
        }
      } catch {
        // ignore seed failure
      }

      // Send a heartbeat comment to confirm connection
      controller.enqueue(encoder.encode(': connected\n\n'));

      const interval = setInterval(poll, POLL_INTERVAL_MS);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
