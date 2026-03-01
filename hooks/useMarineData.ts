'use client';
import { useState, useEffect, useCallback } from 'react';
import { MarinePoint } from '@/lib/types';

const REFRESH_INTERVAL = 300000; // 5 minutes

const OCEAN_POINTS = [
  { name: 'North Atlantic', lat: 40, lng: -40 },
  { name: 'South Atlantic', lat: -20, lng: -20 },
  { name: 'North Pacific', lat: 40, lng: -160 },
  { name: 'South Pacific', lat: -20, lng: -140 },
  { name: 'Indian Ocean', lat: -10, lng: 70 },
  { name: 'Caribbean Sea', lat: 15, lng: -70 },
  { name: 'Mediterranean', lat: 35, lng: 18 },
  { name: 'Norwegian Sea', lat: 65, lng: 5 },
  { name: 'Arabian Sea', lat: 15, lng: 65 },
  { name: 'Coral Sea', lat: -20, lng: 155 },
];

async function fetchMarinePoint(point: { name: string; lat: number; lng: number }): Promise<MarinePoint> {
  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${point.lat}&longitude=${point.lng}&current=wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height&daily=wave_height_max`;
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current;
    return {
      name: point.name,
      lat: point.lat,
      lng: point.lng,
      waveHeight: c?.wave_height ?? 0,
      waveDirection: c?.wave_direction ?? 0,
      wavePeriod: c?.wave_period ?? 0,
      swellHeight: c?.swell_wave_height ?? 0,
      windWaveHeight: c?.wind_wave_height ?? 0,
      loading: false,
      error: null,
    };
  } catch (err) {
    return {
      name: point.name,
      lat: point.lat,
      lng: point.lng,
      waveHeight: 0,
      waveDirection: 0,
      wavePeriod: 0,
      swellHeight: 0,
      windWaveHeight: 0,
      loading: false,
      error: err instanceof Error ? err.message : 'Failed to fetch marine data',
    };
  }
}

export function useMarineData() {
  const [marineData, setMarineData] = useState<MarinePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const results = await Promise.all(OCEAN_POINTS.map(fetchMarinePoint));
    setMarineData(results);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { marineData, loading, lastUpdated };
}
