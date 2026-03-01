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
      const [kpRes, plasmaRes, flareRes, sunspotRes] = await Promise.allSettled([
        fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'),
        fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json'),
        fetch('https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json'),
        fetch('https://services.swpc.noaa.gov/json/solar-cycle/sunspots.json'),
      ]);

      if (kpRes.status === 'fulfilled') {
        const kpData = await kpRes.value.json();
        if (Array.isArray(kpData) && kpData.length > 1) {
          const last = kpData[kpData.length - 1];
          setKpIndex(parseFloat(last[1]) || 0);
        }
      }

      if (plasmaRes.status === 'fulfilled') {
        const plasmaData = await plasmaRes.value.json();
        if (Array.isArray(plasmaData) && plasmaData.length > 1) {
          const last = plasmaData[plasmaData.length - 1];
          setSolarWindSpeed(parseFloat(last[1]) || 0);
        }
      }

      if (flareRes.status === 'fulfilled') {
        const flareData = await flareRes.value.json();
        if (Array.isArray(flareData) && flareData.length > 0) {
          setLatestFlare(flareData[flareData.length - 1]);
        }
      }

      if (sunspotRes.status === 'fulfilled') {
        const ssData = await sunspotRes.value.json();
        if (Array.isArray(ssData) && ssData.length > 0) {
          const last = ssData[ssData.length - 1];
          setSunspotNumber(parseFloat(last.smoothed_ssn) || parseFloat(last.ssn) || 0);
        }
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
