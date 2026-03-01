'use client';

import { useSolarData } from '@/hooks/useSolarData';
import RadialGauge from '@/components/ui/RadialGauge';

export default function AtmospherePage() {
  const { kpIndex, loading: solarLoading } = useSolarData();

  // Aurora probability based on Kp index
  const auroraProbability = Math.min(100, Math.round((kpIndex / 9) * 100));
  const auroraVisible = kpIndex >= 5 ? 'High - Aurora may be visible at mid-latitudes' :
    kpIndex >= 3 ? 'Moderate - Aurora visible at high latitudes' :
    'Low - Aurora only visible near poles';

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">🧲 Atmosphere & Science</h1>

        {/* Geomagnetic activity */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-6">🧲 Geomagnetic Activity</h2>
          {solarLoading ? (
            <div className="text-slate-400 animate-pulse">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <RadialGauge value={kpIndex} min={0} max={9} label="Planetary Kp Index" unit="" colorScheme={[
                  { limit: 3, color: '#00FF88' },
                  { limit: 6, color: '#FFB800' },
                  { color: '#FF3366' },
                ]} />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-slate-400 text-sm">Storm Level</div>
                  <div className={`text-xl font-bold ${kpIndex >= 7 ? 'text-red-400' : kpIndex >= 5 ? 'text-amber-400' : 'text-green-400'}`}>
                    {kpIndex >= 7 ? 'G3-G5 Severe Storm' : kpIndex >= 5 ? 'G1-G2 Minor Storm' : 'G0 Quiet'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Aurora Probability</div>
                  <div className="text-xl font-bold text-purple-400">{auroraProbability}%</div>
                  <div className="text-sm text-slate-400 mt-1">{auroraVisible}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Radiation baseline */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">☢️ Background Radiation Levels</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { location: 'Sea Level', dose: '0.24', unit: 'mSv/yr', status: 'Normal' },
              { location: 'High Altitude', dose: '1.5', unit: 'mSv/yr', status: 'Elevated' },
              { location: 'Cosmic Ray', dose: '0.39', unit: 'mSv/yr', status: 'Normal' },
              { location: 'Space Station', dose: '80', unit: 'mSv/yr', status: 'High' },
            ].map((r) => (
              <div key={r.location} className="bg-white/5 rounded-xl p-4">
                <div className="text-slate-400 text-xs">{r.location}</div>
                <div className="text-2xl font-bold text-green-400 font-mono mt-1">{r.dose}</div>
                <div className="text-xs text-slate-500">{r.unit}</div>
                <div className={`text-xs mt-1 ${r.status === 'Normal' ? 'text-green-400' : r.status === 'Elevated' ? 'text-amber-400' : 'text-red-400'}`}>{r.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Atmosphere composition */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">🌫️ Atmosphere Composition</h2>
          <div className="space-y-3">
            {[
              { gas: 'Nitrogen (N₂)', percent: 78.09, color: '#3B82F6' },
              { gas: 'Oxygen (O₂)', percent: 20.95, color: '#00FF88' },
              { gas: 'Argon (Ar)', percent: 0.93, color: '#A855F7' },
              { gas: 'Carbon Dioxide (CO₂)', percent: 0.0425, color: '#FF3366' },
              { gas: 'Other', percent: 0.0175, color: '#94A3B8' },
            ].map((g) => (
              <div key={g.gas} className="flex items-center gap-3">
                <div className="w-32 text-sm text-slate-300">{g.gas}</div>
                <div className="flex-1 bg-white/5 rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, g.percent)}%`, background: g.color }} />
                </div>
                <div className="text-right font-mono text-sm text-white w-16">{g.percent}%</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
