'use client';
import { useState, useEffect, useCallback } from 'react';
import { WildfirePoint } from '@/lib/types';

const REFRESH_INTERVAL = 1800000; // 30 minutes
const FIRMS_API_KEY = process.env.NEXT_PUBLIC_FIRMS_MAP_KEY;
const FIRMS_API_URL = FIRMS_API_KEY
  ? `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${FIRMS_API_KEY}/VIIRS_SNPP_NRT/world/1`
  : 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_Global_24h.csv';

function parseCSV(csv: string): WildfirePoint[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  return lines.slice(1, 5001).map((line) => {
    const values = line.split(',');
    const get = (key: string) => values[headers.indexOf(key)]?.trim() ?? '';
    return {
      lat: parseFloat(get('latitude')) || 0,
      lng: parseFloat(get('longitude')) || 0,
      brightness: parseFloat(get('bright_ti4') || get('brightness')) || 0,
      scan: parseFloat(get('scan')) || 0,
      track: parseFloat(get('track')) || 0,
      acqDate: get('acq_date'),
      acqTime: get('acq_time'),
      satellite: get('satellite'),
      confidence: get('confidence'),
      brightT31: parseFloat(get('bright_ti5') || get('bright_t31')) || 0,
      frp: parseFloat(get('frp')) || 0,
    };
  }).filter((p) => p.lat !== 0 && p.lng !== 0);
}

export function useWildfireData() {
  const [fires, setFires] = useState<WildfirePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(!!FIRMS_API_KEY);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchFires = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(FIRMS_API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseCSV(text);
      setFires(parsed);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wildfire data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setHasApiKey(!!FIRMS_API_KEY);
    fetchFires();
    const interval = setInterval(fetchFires, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchFires]);

  return { fires, loading, error, hasApiKey, lastUpdated };
}
