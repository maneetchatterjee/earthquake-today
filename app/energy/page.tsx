'use client';

import { useState, useEffect } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { EMISSIONS_BY_SECTOR, getElapsedCO2, CO2_PPM } from '@/lib/emissionsData';
import RadialGauge from '@/components/ui/RadialGauge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function EnergyPage() {
  const { carbonIntensity, renewablePercent, generationMix, loading } = useEnergyData();
  const [co2Count, setCo2Count] = useState(0);

  useEffect(() => {
    setCo2Count(getElapsedCO2());
    const interval = setInterval(() => setCo2Count(getElapsedCO2()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">⚡ Energy & Emissions</h1>

        {/* Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-xl mb-4">🇬🇧 UK Carbon Intensity</h2>
            {loading ? (
              <div className="text-slate-400 animate-pulse">Loading...</div>
            ) : (
              <div className="flex justify-center">
                <RadialGauge value={carbonIntensity} min={0} max={500} label="gCO₂/kWh" unit="" colorScheme={[
                  { limit: 100, color: '#00FF88' },
                  { limit: 250, color: '#FFB800' },
                  { color: '#FF3366' },
                ]} />
              </div>
            )}
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-xl mb-4">♻️ Renewable Energy %</h2>
            {loading ? (
              <div className="text-slate-400 animate-pulse">Loading...</div>
            ) : (
              <div className="flex justify-center">
                <RadialGauge value={renewablePercent} min={0} max={100} label="% Renewable" unit="%" colorScheme={[
                  { limit: 33, color: '#FF3366' },
                  { limit: 66, color: '#FFB800' },
                  { color: '#00FF88' },
                ]} />
              </div>
            )}
          </div>
        </div>

        {/* CO2 Counter */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">🌫️ CO₂ Emissions (Since Jan 1, 2026)</h2>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-slate-400 text-sm mb-1">Total emitted</div>
              <div className="text-4xl font-bold text-red-400 font-mono">{co2Count.toLocaleString()} tons</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Atmospheric CO₂</div>
              <div className="text-4xl font-bold text-amber-400 font-mono">{CO2_PPM} ppm</div>
            </div>
          </div>
        </div>

        {/* Generation Mix */}
        {!loading && generationMix.length > 0 && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-xl mb-4">🔋 Generation Mix</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generationMix}>
                  <XAxis dataKey="fuel" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }} />
                  <Bar dataKey="perc" fill="#00FFFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Emissions by Sector */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">🏭 Emissions by Sector</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={EMISSIONS_BY_SECTOR} dataKey="percent" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {EMISSIONS_BY_SECTOR.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {EMISSIONS_BY_SECTOR.map((sector) => (
                <div key={sector.name} className="flex items-center gap-3">
                  <span>{sector.emoji}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${sector.percent}%`, background: sector.color }} />
                  </div>
                  <span className="text-white font-mono text-sm w-12 text-right">{sector.percent}%</span>
                  <span className="text-slate-400 text-sm w-20">{sector.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
