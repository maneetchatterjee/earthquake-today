'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TidePrediction, TideStation } from '@/lib/types';
import { TIDE_STATIONS } from '@/lib/tideStations';

interface TidesPanelProps {
  predictions: Record<string, TidePrediction[]>;
  selectedStation: TideStation;
  setSelectedStation: (s: TideStation) => void;
  loading: boolean;
}

export default function TidesPanel({ predictions, selectedStation, setSelectedStation, loading }: TidesPanelProps) {
  const stationPredictions = predictions[selectedStation.id] ?? [];

  const chartData = stationPredictions.map((p) => ({
    time: p.t.substring(11, 16),
    height: parseFloat(p.v),
    type: p.type,
  }));

  const now = new Date();
  const upcoming = stationPredictions.filter((p) => new Date(p.t) > now);
  const nextHigh = upcoming.find((p) => p.type === 'H');
  const nextLow = upcoming.find((p) => p.type === 'L');

  const heights = stationPredictions.map((p) => parseFloat(p.v));
  const tidalRange = heights.length
    ? (Math.max(...heights) - Math.min(...heights)).toFixed(2)
    : '—';

  if (loading && stationPredictions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400 animate-pulse">
        Loading tide data...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Counter cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4">
          <div className="text-blue-400 text-xs mb-1">🌊 Next High Tide</div>
          <div className="text-white font-bold">{nextHigh ? nextHigh.t.substring(11, 16) : '—'}</div>
          <div className="text-gray-400 text-xs">{nextHigh ? `${parseFloat(nextHigh.v).toFixed(2)} m` : ''}</div>
        </div>
        <div className="bg-cyan-900/20 border border-cyan-700/40 rounded-xl p-4">
          <div className="text-cyan-400 text-xs mb-1">🏖️ Next Low Tide</div>
          <div className="text-white font-bold">{nextLow ? nextLow.t.substring(11, 16) : '—'}</div>
          <div className="text-gray-400 text-xs">{nextLow ? `${parseFloat(nextLow.v).toFixed(2)} m` : ''}</div>
        </div>
        <div className="bg-indigo-900/20 border border-indigo-700/40 rounded-xl p-4">
          <div className="text-indigo-400 text-xs mb-1">📏 Tidal Range</div>
          <div className="text-white font-bold">{tidalRange !== '—' ? `${tidalRange} m` : '—'}</div>
        </div>
      </div>

      {/* Station selector */}
      <div className="flex items-center gap-3">
        <label className="text-gray-400 text-sm">Station:</label>
        <select
          value={selectedStation.id}
          onChange={(e) => {
            const s = TIDE_STATIONS.find((st) => st.id === e.target.value);
            if (s) setSelectedStation(s);
          }}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none"
        >
          {TIDE_STATIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="text-white font-semibold mb-3">
          Tide Predictions — {selectedStation.name}
        </h3>
        {chartData.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No tide data available for this station.</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} unit=" m" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(2)} m`, 'Height' as const]}
              />
              <Line
                type="monotone"
                dataKey="height"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ fill: '#60a5fa', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
