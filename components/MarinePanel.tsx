'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MarinePoint } from '@/lib/types';

interface MarinePanelProps {
  marineData: MarinePoint[];
  loading: boolean;
}

function degToCompass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function waveColor(h: number): string {
  if (h < 1) return 'text-green-400';
  if (h < 2.5) return 'text-yellow-400';
  if (h < 4) return 'text-orange-400';
  return 'text-red-400';
}

export default function MarinePanel({ marineData, loading }: MarinePanelProps) {
  if (loading && marineData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400 animate-pulse">
        Loading marine data...
      </div>
    );
  }

  const maxWave = marineData.length
    ? marineData.reduce((a, b) => (a.waveHeight > b.waveHeight ? a : b))
    : null;

  const chartData = marineData.map((d) => ({
    name: d.name.replace(' ', '\n'),
    waveHeight: d.waveHeight,
    swellHeight: d.swellHeight,
  }));

  return (
    <div className="space-y-6">
      {maxWave && (
        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4">
          <div className="text-blue-400 text-xs mb-1">🌊 Highest Waves</div>
          <div className="text-white font-bold">{maxWave.name}</div>
          <div className={`text-2xl font-bold ${waveColor(maxWave.waveHeight)}`}>
            {maxWave.waveHeight.toFixed(2)} m
          </div>
          <div className="text-gray-400 text-xs">
            Period: {maxWave.wavePeriod.toFixed(1)}s · Direction: {degToCompass(maxWave.waveDirection)}
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {marineData.map((d) => (
          <div key={d.name} className="bg-gray-800 rounded-xl border border-gray-700 p-3">
            <div className="text-gray-300 text-xs font-semibold mb-1">{d.name}</div>
            {d.error ? (
              <div className="text-red-400 text-xs">Error</div>
            ) : (
              <>
                <div className={`text-xl font-bold ${waveColor(d.waveHeight)}`}>
                  {d.waveHeight.toFixed(2)} m
                </div>
                <div className="text-gray-400 text-xs space-y-0.5 mt-1">
                  <div>🌀 {degToCompass(d.waveDirection)} {d.waveDirection.toFixed(0)}°</div>
                  <div>⏱ {d.wavePeriod.toFixed(1)}s period</div>
                  <div>🌊 Swell {d.swellHeight.toFixed(2)} m</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="text-white font-semibold mb-3">Wave Height Comparison</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} unit=" m" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#e5e7eb' }}
              formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(2)} m`]}
            />
            <Bar dataKey="waveHeight" fill="#60a5fa" name="Wave Height" radius={[3, 3, 0, 0]} />
            <Bar dataKey="swellHeight" fill="#34d399" name="Swell Height" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
