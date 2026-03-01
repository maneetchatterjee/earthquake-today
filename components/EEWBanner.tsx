'use client';

import { useState, useEffect } from 'react';

interface EEWEvent {
  magnitude?: number;
  magnitude2?: number;
  location?: string;
  title?: string;
  originTime?: string;
  time?: string;
  source?: string;
}

export default function EEWBanner() {
  const [eewEvent, setEewEvent] = useState<EEWEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let dismissTimer: ReturnType<typeof setTimeout>;

    async function fetchEEW() {
      try {
        const res = await fetch('https://api.wolfx.jp/jma_eew.json', {
          signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        if (data && data.magnitude && data.magnitude >= 4) {
          setEewEvent(data);
          setDismissed(false);
          dismissTimer = setTimeout(() => setDismissed(true), 60000);
        }
      } catch {
        // silently fail
      }
    }

    fetchEEW();
    const interval = setInterval(fetchEEW, 30000);
    return () => {
      clearInterval(interval);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, []);

  if (!eewEvent || dismissed) return null;

  const mag = eewEvent.magnitude ?? eewEvent.magnitude2 ?? 0;
  const location = eewEvent.location ?? eewEvent.title ?? 'Unknown location';
  const time = eewEvent.originTime ?? eewEvent.time ?? '';

  return (
    <div className="relative bg-red-900/90 border-b-2 border-red-500 px-4 py-3 flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <div className="text-red-100 font-bold text-sm">
            EARTHQUAKE EARLY WARNING — M{Number(mag).toFixed(1)}
          </div>
          <div className="text-red-200 text-xs">
            {location} · {time} {eewEvent.source ? `· Source: ${eewEvent.source}` : ''}
          </div>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-red-200 hover:text-white text-lg font-bold px-2"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
