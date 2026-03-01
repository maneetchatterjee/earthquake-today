'use client';

import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { USGSFeature } from '@/lib/types';
import {
  getMagnitudeBuckets,
  getHourlyBreakdown,
  getDepthBuckets,
  getDepthColor,
} from '@/lib/utils';

interface ChartsProps {
  features: USGSFeature[];
}

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: 8,
  },
  labelStyle: { color: '#f9fafb' },
  itemStyle: { color: '#d1d5db' },
};

export default function Charts({ features }: ChartsProps) {
  const magBuckets = getMagnitudeBuckets(features);
  const magData = Object.entries(magBuckets).map(([range, count]) => ({ range, count }));

  const hourlyData = getHourlyBreakdown(features);
  const depthData = getDepthBuckets(features);

  const scatterData = features
    .filter((f) => f.properties.mag != null && f.geometry.coordinates[2] != null)
    .map((f) => ({
      mag: Number(f.properties.mag.toFixed(1)),
      depth: Number(f.geometry.coordinates[2].toFixed(0)),
      color: getDepthColor(f.geometry.coordinates[2]),
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Magnitude Distribution */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold mb-4">Magnitude Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={magData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Activity */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold mb-4">Hourly Activity (last 24h)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={hourlyData.slice(0, 24).reverse()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" tick={{ fill: '#9ca3af', fontSize: 10 }} interval={3} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Depth Distribution */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold mb-4">Depth Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={depthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {depthData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={
                    idx === 0 || idx === 1
                      ? '#ef4444'
                      : idx === 2
                      ? '#f59e0b'
                      : idx === 3
                      ? '#22c55e'
                      : '#6366f1'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Magnitude vs Depth scatter */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold mb-4">Magnitude vs Depth</h3>
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="mag"
              name="Magnitude"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              label={{ value: 'Magnitude', fill: '#6b7280', fontSize: 11, position: 'insideBottom', offset: -2 }}
            />
            <YAxis
              dataKey="depth"
              name="Depth (km)"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              label={{ value: 'Depth (km)', fill: '#6b7280', fontSize: 11, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={tooltipStyle.contentStyle}
              itemStyle={tooltipStyle.itemStyle}
            />
            <Scatter data={scatterData} fill="#f97316">
              {scatterData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
