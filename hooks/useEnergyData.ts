'use client';
import { useState, useEffect, useCallback } from 'react';

interface GenerationMix {
  fuel: string;
  perc: number;
}

interface EnergyData {
  carbonIntensity: number;
  renewablePercent: number;
  generationMix: GenerationMix[];
  loading: boolean;
  error: string | null;
}

const REFRESH_INTERVAL = 300000; // 5 min

export function useEnergyData(): EnergyData {
  const [carbonIntensity, setCarbonIntensity] = useState(0);
  const [renewablePercent, setRenewablePercent] = useState(0);
  const [generationMix, setGenerationMix] = useState<GenerationMix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/energy');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.intensity) {
        const d = data.intensity;
        const intensity = d.data?.[0]?.intensity?.actual || d.data?.[0]?.intensity?.forecast || 0;
        setCarbonIntensity(intensity);
      }

      if (data.generation) {
        const d = data.generation;
        const mix: GenerationMix[] = d.data?.generationmix || [];
        setGenerationMix(mix);
        const renewables = ['wind', 'solar', 'hydro', 'biomass', 'nuclear'];
        const renewPerc = mix
          .filter((g) => renewables.includes(g.fuel.toLowerCase()))
          .reduce((sum, g) => sum + g.perc, 0);
        setRenewablePercent(Math.round(renewPerc));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch energy data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { carbonIntensity, renewablePercent, generationMix, loading, error };
}
