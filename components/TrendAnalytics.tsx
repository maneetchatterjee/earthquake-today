'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getHistory, Snapshot } from '@/lib/historyStore';

type Range = '7d' | '30d';

export default function TrendAnalytics() {
  const [range, setRange] = useState<Range>('7d');

  const history = useMemo(() => getHistory(), []);

  const data = useMemo(() => {
    const days = range === '7d' ? 7 : 30;
    return [...history]
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-days)
      .map((s: Snapshot) => ({
        date: s.date,
        'Earthquakes': s.earthquakeCount,
        'Max Mag': s.maxMagnitude,
        'Avg AQI': s.avgAqi,
        'Wildfires': s.wildfireCount,
      }));
  }, [history, range]);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold text-lg">📈 Trend Analytics</h2>
        <div className="flex gap-1">
          {(['7d', '30d'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                range === r
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  : 'bg-gray-700 text-gray-400 hover:text-white border border-gray-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-12">
          No historical data yet. Data will accumulate over time.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Earthquake frequency */}
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Earthquake Frequency</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data}>
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Earthquakes" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Air quality trend */}
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Air Quality Trend (AQI)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data}>
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Avg AQI" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wildfire count */}
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Wildfire Count</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data}>
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Wildfires" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
