'use client';

import { useState, useEffect, useRef } from 'react';
import { USGSFeature } from '@/lib/types';

interface EventStreamState {
  events: USGSFeature[];
  connected: boolean;
  error: string | null;
}

const INITIAL_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;

export function useEventStream() {
  const [state, setState] = useState<EventStreamState>({
    events: [],
    connected: false,
    error: null,
  });

  const backoffRef = useRef(INITIAL_BACKOFF_MS);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const connectRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    function connect() {
      if (esRef.current) {
        esRef.current.close();
      }

      const es = new EventSource('/api/events');
      esRef.current = es;

      es.onopen = () => {
        backoffRef.current = INITIAL_BACKOFF_MS;
        setState((prev) => ({ ...prev, connected: true, error: null }));
      };

      es.onmessage = (ev) => {
        try {
          const feature = JSON.parse(ev.data) as USGSFeature;
          setState((prev) => ({
            ...prev,
            events: [feature, ...prev.events].slice(0, 200),
          }));
        } catch {
          // skip malformed events
        }
      };

      es.onerror = () => {
        es.close();
        esRef.current = null;
        setState((prev) => ({ ...prev, connected: false, error: 'Connection lost. Reconnecting…' }));

        const delay = backoffRef.current;
        backoffRef.current = Math.min(delay * 2, MAX_BACKOFF_MS);

        retryTimerRef.current = setTimeout(() => connectRef.current?.(), delay);
      };
    }

    connectRef.current = connect;
    connect();

    return () => {
      esRef.current?.close();
      esRef.current = null;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  return state;
}
