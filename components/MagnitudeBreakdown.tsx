'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { USGSFeature } from '@/lib/types';
import { getMagnitudeBuckets } from '@/lib/utils';

const BUCKET_COLORS: Record<string, string> = {
  'M 0-1': '#6b7280',
  'M 1-2': '#22c55e',
  'M 2-3': '#86efac',
  'M 3-4': '#fbbf24',
  'M 4-5': '#f97316',
  'M 5-6': '#ef4444',
  'M 6-7': '#dc2626',
  'M 7+': '#991b1b',
};

interface MagnitudeBreakdownProps {
  features: USGSFeature[];
}

export default function MagnitudeBreakdown({ features }: MagnitudeBreakdownProps) {
  const buckets = getMagnitudeBuckets(features);
  const data = Object.entries(buckets).map(([range, count]) => ({
    range,
    count,
    color: BUCKET_COLORS[range] || '#6b7280',
  }));

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <h2 className="text-white font-semibold text-lg mb-4">📊 Magnitude Breakdown</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="range"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                width={55}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#f9fafb' }}
                itemStyle={{ color: '#d1d5db' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Counter rows */}
        <div className="flex flex-col gap-2">
          {data.map(({ range, count, color }) => (
            <div key={range} className="flex items-center gap-3">
              <div className="w-14 text-xs font-mono text-gray-400">{range}</div>
              <div
                className="h-5 rounded flex-1 min-w-0 relative"
                style={{ backgroundColor: '#374151' }}
              >
                <div
                  className="h-5 rounded transition-all duration-700"
                  style={{
                    width: `${features.length > 0 ? (count / features.length) * 100 : 0}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <div className="w-10 text-right text-white font-semibold text-sm">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
