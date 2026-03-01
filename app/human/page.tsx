'use client';

import { useState, useEffect } from 'react';
import { useFlightData } from '@/hooks/useFlightData';
import { getCurrentPopulation, getBirthsToday, getDeathsToday } from '@/lib/populationData';

export default function HumanPage() {
  const { count: flightCount, loading: flightLoading, error: flightError } = useFlightData();
  const [population, setPopulation] = useState(0);
  const [births, setBirths] = useState(0);
  const [deaths, setDeaths] = useState(0);

  useEffect(() => {
    const update = () => {
      setPopulation(getCurrentPopulation());
      setBirths(getBirthsToday());
      setDeaths(getDeathsToday());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">🛩️ Human Activity</h1>

        {/* Population */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-slate-400 text-lg mb-2">World Population</h2>
          <div className="text-5xl md:text-7xl font-bold text-white font-mono tabular-nums">
            {population.toLocaleString()}
          </div>
          <div className="flex justify-center gap-8 mt-6">
            <div>
              <div className="text-slate-400 text-sm">Births Today</div>
              <div className="text-2xl font-bold text-green-400 font-mono">{births.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Deaths Today</div>
              <div className="text-2xl font-bold text-red-400 font-mono">{deaths.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Net Growth Today</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono">{(births - deaths).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Flights */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">✈️ Live Flights</h2>
          {flightLoading ? (
            <div className="text-slate-400 animate-pulse">Loading flight data...</div>
          ) : (
            <>
              <div className="text-5xl font-bold text-cyan-400 font-mono mb-2">
                {flightCount.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm mb-4">aircraft currently in the air</div>
              {flightError && (
                <div className="text-amber-400 text-sm">⚠️ Using estimated count (API rate limited)</div>
              )}
            </>
          )}
        </div>

        {/* Internet stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(() => {
            const secondsToday = (Date.now() - new Date(new Date().setHours(0,0,0,0)).getTime()) / 1000;
            return [
              { label: 'Emails Sent Today', value: Math.round(secondsToday * 3400000).toLocaleString(), icon: '📧' },
              { label: 'Google Searches Today', value: Math.round(secondsToday * 100000).toLocaleString(), icon: '🔍' },
              { label: 'Tweets Today', value: Math.round(secondsToday * 6000).toLocaleString(), icon: '🐦' },
              { label: 'YouTube Videos Watched', value: Math.round(secondsToday * 80000).toLocaleString(), icon: '▶️' },
            ];
          })().map((stat) => (
            <div key={stat.label} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-lg font-bold text-white font-mono">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
