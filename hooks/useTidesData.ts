'use client';
import { useState, useEffect, useCallback } from 'react';
import { TIDE_STATIONS } from '@/lib/tideStations';
import { TidePrediction, TideStation } from '@/lib/types';

const REFRESH_INTERVAL = 900000; // 15 minutes

function formatDate(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

async function fetchTidePredictions(station: TideStation): Promise<TidePrediction[]> {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&begin_date=${formatDate(today)}&end_date=${formatDate(tomorrow)}&datum=MLLW&station=${station.id}&time_zone=gmt&units=metric&interval=hilo&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.predictions ?? [];
  } catch {
    return [];
  }
}

export function useTidesData() {
  const [predictions, setPredictions] = useState<Record<string, TidePrediction[]>>({});
  const [selectedStation, setSelectedStation] = useState<TideStation>(TIDE_STATIONS[0]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    const results = await Promise.all(TIDE_STATIONS.map(fetchTidePredictions));
    const map: Record<string, TidePrediction[]> = {};
    TIDE_STATIONS.forEach((s, i) => { map[s.id] = results[i]; });
    setPredictions(map);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { predictions, selectedStation, setSelectedStation, loading, lastUpdated };
}
