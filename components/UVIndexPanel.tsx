'use client';

import { useState, useEffect, useCallback } from 'react';
import { CITIES } from '@/lib/cities';
import { City } from '@/lib/types';

interface UVData {
  city: City;
  uvIndex: number;
  uvIndexClearSky: number;
  uvIndexMax: number;
  loading: boolean;
  error: string | null;
}

function uvColor(uv: number): string {
  if (uv <= 2) return 'text-green-400';
  if (uv <= 5) return 'text-yellow-400';
  if (uv <= 7) return 'text-orange-400';
  if (uv <= 10) return 'text-red-400';
  return 'text-purple-400';
}

function uvBg(uv: number): string {
  if (uv <= 2) return 'bg-green-900/20 border-green-700/40';
  if (uv <= 5) return 'bg-yellow-900/20 border-yellow-700/40';
  if (uv <= 7) return 'bg-orange-900/20 border-orange-700/40';
  if (uv <= 10) return 'bg-red-900/20 border-red-700/40';
  return 'bg-purple-900/20 border-purple-700/40';
}

function uvCategory(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

function uvSafety(uv: number): string {
  if (uv <= 2) return 'No protection needed.';
  if (uv <= 5) return 'Wear sunscreen, hat.';
  if (uv <= 7) return 'Sunscreen SPF 30+, limit midday sun.';
  if (uv <= 10) return 'SPF 50+, seek shade 10am–4pm.';
  return 'Avoid sun exposure, wear protective clothing.';
}

async function fetchUV(city: City): Promise<UVData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&daily=uv_index_max&current=uv_index,uv_index_clear_sky&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    return {
      city,
      uvIndex: data.current?.uv_index ?? 0,
      uvIndexClearSky: data.current?.uv_index_clear_sky ?? 0,
      uvIndexMax: data.daily?.uv_index_max?.[0] ?? 0,
      loading: false,
      error: null,
    };
  } catch (err) {
    return {
      city,
      uvIndex: 0,
      uvIndexClearSky: 0,
      uvIndexMax: 0,
      loading: false,
      error: err instanceof Error ? err.message : 'Failed',
    };
  }
}

export default function UVIndexPanel() {
  const [uvData, setUvData] = useState<UVData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const results = await Promise.all(CITIES.map(fetchUV));
    setUvData(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, [fetchAll]);

  if (loading && uvData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400 animate-pulse">
        Loading UV index data...
      </div>
    );
  }

  const valid = uvData.filter((d) => !d.error);
  const highest = valid.length ? valid.reduce((a, b) => (a.uvIndex > b.uvIndex ? a : b)) : null;

  return (
    <div className="space-y-4">
      {highest && (
        <div className={`rounded-xl border p-4 ${uvBg(highest.uvIndex)}`}>
          <div className={`text-xs mb-1 ${uvColor(highest.uvIndex)}`}>☀️ Highest UV Index</div>
          <div className="text-white font-bold">{highest.city.name}</div>
          <div className={`text-2xl font-bold ${uvColor(highest.uvIndex)}`}>{highest.uvIndex.toFixed(1)}</div>
          <div className="text-gray-400 text-xs">{uvCategory(highest.uvIndex)} — {uvSafety(highest.uvIndex)}</div>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {uvData.map((d) => (
          <div key={d.city.name} className={`rounded-xl border p-3 ${uvBg(d.uvIndex)}`}>
            <div className="text-white text-sm font-semibold">{d.city.name}</div>
            <div className={`text-2xl font-bold ${uvColor(d.uvIndex)}`}>{d.uvIndex.toFixed(1)}</div>
            <div className={`text-xs ${uvColor(d.uvIndex)}`}>{uvCategory(d.uvIndex)}</div>
            <div className="text-gray-500 text-xs mt-1">{uvSafety(d.uvIndex)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
