'use client';

import { useState, useEffect, useCallback } from 'react';
import { USGSFeature, USGSResponse, TimePeriod } from '@/lib/types';

interface EarthquakeData {
  hour: USGSFeature[];
  day: USGSFeature[];
  week: USGSFeature[];
  month: USGSFeature[];
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
}

const REFRESH_INTERVAL = 60000; // 60 seconds

export function useEarthquakeData() {
  const [data, setData] = useState<EarthquakeData>({
    hour: [],
    day: [],
    week: [],
    month: [],
    lastUpdated: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      const [hourRes, dayRes, weekRes, monthRes] = await Promise.all([
        fetch('/api/earthquakes?period=hour'),
        fetch('/api/earthquakes?period=day'),
        fetch('/api/earthquakes?period=week'),
        fetch('/api/earthquakes?period=month'),
      ]);

      const [hourData, dayData, weekData, monthData]: USGSResponse[] = await Promise.all([
        hourRes.json(),
        dayRes.json(),
        weekRes.json(),
        monthRes.json(),
      ]);

      setData({
        hour: hourData.features,
        day: dayData.features,
        week: weekData.features,
        month: monthData.features,
        lastUpdated: new Date(),
        loading: false,
        error: null,
      });
    } catch (err) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch earthquake data',
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return data;
}

export type { TimePeriod };
