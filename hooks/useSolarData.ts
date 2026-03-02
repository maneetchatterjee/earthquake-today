'use client';
import { useState, useEffect, useCallback } from 'react';

interface SolarFlare {
  begin_time: string;
  max_time: string;
  end_time: string;
  class_type: string;
  region_num: string;
}

interface SolarData {
  kpIndex: number;
  solarWindSpeed: number;
  sunspotNumber: number;
  latestFlare: SolarFlare | null;
  loading: boolean;
  error: string | null;
}

const REFRESH_INTERVAL = 300000; // 5 min

export function useSolarData(): SolarData {
  const [kpIndex, setKpIndex] = useState(0);
  const [solarWindSpeed, setSolarWindSpeed] = useState(0);
  const [sunspotNumber, setSunspotNumber] = useState(0);
  const [latestFlare, setLatestFlare] = useState<SolarFlare | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/solar');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data.kp) && data.kp.length > 1) {
        const last = data.kp[data.kp.length - 1];
        setKpIndex(parseFloat(last[1]) || 0);
      }

      if (Array.isArray(data.plasma) && data.plasma.length > 1) {
        const last = data.plasma[data.plasma.length - 1];
        setSolarWindSpeed(parseFloat(last[1]) || 0);
      }

      if (Array.isArray(data.flares) && data.flares.length > 0) {
        setLatestFlare(data.flares[data.flares.length - 1]);
      }

      if (Array.isArray(data.sunspots) && data.sunspots.length > 0) {
        const last = data.sunspots[data.sunspots.length - 1];
        setSunspotNumber(parseFloat(last.smoothed_ssn) || parseFloat(last.ssn) || 0);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch solar data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { kpIndex, solarWindSpeed, sunspotNumber, latestFlare, loading, error };
}
