'use client';
import { useState, useEffect, useCallback } from 'react';

interface FlightState {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number | null;
  latitude: number | null;
  altitude: number | null;
  velocity: number | null;
}

interface FlightData {
  count: number;
  states: FlightState[];
  loading: boolean;
  error: string | null;
}

const REFRESH_INTERVAL = 30000; // 30 seconds
const MAX_STATES = 500;

export function useFlightData(): FlightData {
  const [count, setCount] = useState(0);
  const [states, setStates] = useState<FlightState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://opensky-network.org/api/states/all');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rawStates = data.states || [];
      setCount(rawStates.length);
      const mapped: FlightState[] = rawStates.slice(0, MAX_STATES).map((s: unknown[]) => ({
        icao24: s[0] as string,
        callsign: (s[1] as string)?.trim() || 'N/A',
        origin_country: s[2] as string,
        longitude: s[5] as number | null,
        latitude: s[6] as number | null,
        altitude: s[7] as number | null,
        velocity: s[9] as number | null,
      }));
      setStates(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch flight data');
      setCount(12000); // fallback estimate
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { count, states, loading, error };
}
