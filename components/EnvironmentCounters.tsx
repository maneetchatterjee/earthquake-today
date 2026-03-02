'use client';

import { useState, useEffect } from 'react';

interface Counter {
  label: string;
  icon: string;
  value: number;
  unit: string;
  color: string;
  ratePerSecond: number;
  methodology: string;
}

function formatCounterValue(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(3)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(3)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(3)}K`;
  return value.toFixed(2);
}

const ANNUAL_RATES = {
  co2Gt: 40,
  forestHa: 6.8e6,
  desertHa: 12e6,
  waterKm3: 4000,
  wasteBt: 2.12,
};

const SECONDS_PER_YEAR = 365.25 * 24 * 3600;

function getElapsedSecondsToday(): number {
  const now = new Date();
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return (now.getTime() - midnight.getTime()) / 1000;
}

export default function EnvironmentCounters() {
  const [elapsed, setElapsed] = useState(getElapsedSecondsToday());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsedSecondsToday());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const counters: Counter[] = [
    {
      label: 'CO₂ Emitted Today',
      icon: '💨',
      value: (ANNUAL_RATES.co2Gt * 1e9 * elapsed) / SECONDS_PER_YEAR,
      unit: 'tonnes',
      color: 'text-yellow-400',
      ratePerSecond: (ANNUAL_RATES.co2Gt * 1e9) / SECONDS_PER_YEAR,
      methodology: 'Based on ~40 Gt CO₂/year global emissions (IEA/IPCC estimates)',
    },
    {
      label: 'Forest Lost Today',
      icon: '🌲',
      value: (ANNUAL_RATES.forestHa * elapsed) / SECONDS_PER_YEAR,
      unit: 'hectares',
      color: 'text-green-400',
      ratePerSecond: ANNUAL_RATES.forestHa / SECONDS_PER_YEAR,
      methodology: 'Based on ~6.8 million ha/year deforestation (FAO)',
    },
    {
      label: 'Land Desertified Today',
      icon: '🏜️',
      value: (ANNUAL_RATES.desertHa * elapsed) / SECONDS_PER_YEAR,
      unit: 'hectares',
      color: 'text-orange-400',
      ratePerSecond: ANNUAL_RATES.desertHa / SECONDS_PER_YEAR,
      methodology: 'Based on ~12 million ha/year of desertification (UNCCD)',
    },
    {
      label: 'Water Used Today',
      icon: '💧',
      value: (ANNUAL_RATES.waterKm3 * 1e9 * elapsed) / SECONDS_PER_YEAR,
      unit: 'm³',
      color: 'text-blue-400',
      ratePerSecond: (ANNUAL_RATES.waterKm3 * 1e9) / SECONDS_PER_YEAR,
      methodology: 'Based on ~4,000 km³/year global freshwater withdrawal (FAO AQUASTAT)',
    },
    {
      label: 'Waste Dumped Today',
      icon: '🗑️',
      value: (ANNUAL_RATES.wasteBt * 1e9 * elapsed) / SECONDS_PER_YEAR,
      unit: 'tonnes',
      color: 'text-red-400',
      ratePerSecond: (ANNUAL_RATES.wasteBt * 1e9) / SECONDS_PER_YEAR,
      methodology: 'Based on ~2.12 billion tonnes/year solid waste generation (World Bank)',
    },
  ];

  const fmtTime = () => {
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = Math.floor(elapsed % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Real-time estimates based on annual rates. Elapsed today (UTC): <span className="text-white font-mono">{fmtTime()}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {counters.map((c) => (
          <div key={c.label} className="bg-gray-800 rounded-xl border border-gray-700 p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wider">
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </div>
            <div className={`text-2xl font-bold font-mono tabular-nums ${c.color}`} aria-live="polite" role="status">
              {formatCounterValue(c.value)}
            </div>
            <div className="text-gray-500 text-xs">{c.unit}</div>
            <div className="text-gray-500 text-xs border-t border-gray-700 pt-2" title={c.methodology}>
              ℹ️ {c.methodology}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
