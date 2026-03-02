'use client';
import { useState, useEffect, useCallback } from 'react';
import { CITIES } from '@/lib/cities';
import { AirQualityData, City } from '@/lib/types';

const REFRESH_INTERVAL = 600000; // 10 minutes

async function fetchCityAQI(city: City): Promise<AirQualityData> {
  try {
    const url = `/api/air-quality?lat=${city.lat}&lng=${city.lng}`;
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current;
    return {
      city,
      usAqi: c.us_aqi ?? 0,
      europeanAqi: c.european_aqi ?? 0,
      pm25: c.pm2_5 ?? 0,
      pm10: c.pm10 ?? 0,
      ozone: c.ozone ?? 0,
      no2: c.nitrogen_dioxide ?? 0,
      so2: c.sulphur_dioxide ?? 0,
      co: c.carbon_monoxide ?? 0,
      loading: false,
      error: null,
    };
  } catch (err) {
    return {
      city,
      usAqi: 0,
      europeanAqi: 0,
      pm25: 0,
      pm10: 0,
      ozone: 0,
      no2: 0,
      so2: 0,
      co: 0,
      loading: false,
      error: err instanceof Error ? err.message : 'Failed to fetch AQI data',
    };
  }
}

export function useAirQualityData() {
  const [aqiData, setAqiData] = useState<AirQualityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    const results = await Promise.all(CITIES.map(fetchCityAQI));
    setAqiData(results);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { aqiData, loading, lastUpdated };
}
