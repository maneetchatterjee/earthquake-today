'use client';

import { useState } from 'react';
import { AirQualityData } from '@/lib/types';

interface AirQualityPanelProps {
  aqiData: AirQualityData[];
  loading: boolean;
}

function aqiColor(aqi: number): string {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-purple-500';
  return 'bg-red-900';
}

function aqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (Sensitive)';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function aqiTextColor(aqi: number): string {
  if (aqi <= 50) return 'text-green-400';
  if (aqi <= 100) return 'text-yellow-400';
  if (aqi <= 150) return 'text-orange-400';
  if (aqi <= 200) return 'text-red-400';
  if (aqi <= 300) return 'text-purple-400';
  return 'text-red-700';
}

const AQI_CATEGORIES = [
  { label: 'Good', range: '0-50', color: 'bg-green-500' },
  { label: 'Moderate', range: '51-100', color: 'bg-yellow-500' },
  { label: 'Unhealthy (Sensitive)', range: '101-150', color: 'bg-orange-500' },
  { label: 'Unhealthy', range: '151-200', color: 'bg-red-500' },
  { label: 'Very Unhealthy', range: '201-300', color: 'bg-purple-500' },
  { label: 'Hazardous', range: '300+', color: 'bg-red-900' },
];

export default function AirQualityPanel({ aqiData, loading }: AirQualityPanelProps) {
  const [sortDesc, setSortDesc] = useState(true);

  if (loading && aqiData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400 animate-pulse">
        Loading air quality data...
      </div>
    );
  }

  const valid = aqiData.filter((d) => !d.error);
  const sorted = [...valid].sort((a, b) => sortDesc ? b.usAqi - a.usAqi : a.usAqi - b.usAqi);
  const best = valid.length ? valid.reduce((a, b) => (a.usAqi < b.usAqi ? a : b)) : null;
  const worst = valid.length ? valid.reduce((a, b) => (a.usAqi > b.usAqi ? a : b)) : null;

  const categoryCounts = AQI_CATEGORIES.map((cat) => {
    const isOpenEnded = cat.range.endsWith('+');
    const [minStr, maxStr] = cat.range.replace('+', '').split('-');
    const minV = parseInt(minStr);
    const maxV = isOpenEnded ? Infinity : parseInt(maxStr) + 1;
    return {
      ...cat,
      count: valid.filter((d) => d.usAqi >= minV && d.usAqi < maxV).length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Category counts */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {categoryCounts.map((cat) => (
          <div key={cat.label} className="bg-gray-800 rounded-xl border border-gray-700 p-3 text-center">
            <div className={`w-3 h-3 rounded-full ${cat.color} mx-auto mb-1`} />
            <div className="text-white font-bold text-lg">{cat.count}</div>
            <div className="text-gray-400 text-xs leading-tight">{cat.label}</div>
            <div className="text-gray-500 text-xs">{cat.range}</div>
          </div>
        ))}
      </div>

      {/* Best / Worst */}
      <div className="grid grid-cols-2 gap-3">
        {best && (
          <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
            <div className="text-green-400 text-xs mb-1">✅ Best Air Quality</div>
            <div className="text-white font-bold">{best.city.name}</div>
            <div className={`text-xl font-bold ${aqiTextColor(best.usAqi)}`}>AQI {best.usAqi}</div>
            <div className="text-gray-400 text-xs">{aqiLabel(best.usAqi)}</div>
          </div>
        )}
        {worst && (
          <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
            <div className="text-red-400 text-xs mb-1">⚠️ Worst Air Quality</div>
            <div className="text-white font-bold">{worst.city.name}</div>
            <div className={`text-xl font-bold ${aqiTextColor(worst.usAqi)}`}>AQI {worst.usAqi}</div>
            <div className="text-gray-400 text-xs">{aqiLabel(worst.usAqi)}</div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-white font-semibold">City AQI Rankings</h3>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
          >
            Sort: {sortDesc ? 'Worst first ↓' : 'Best first ↑'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-700">
                <th className="text-left px-4 py-2">City</th>
                <th className="text-right px-4 py-2">US AQI</th>
                <th className="text-right px-4 py-2">EU AQI</th>
                <th className="text-right px-4 py-2">PM2.5</th>
                <th className="text-right px-4 py-2">PM10</th>
                <th className="text-right px-4 py-2">O₃</th>
                <th className="text-right px-4 py-2">NO₂</th>
                <th className="px-4 py-2">AQI Bar</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr key={d.city.name} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="px-4 py-2 text-white font-medium">{d.city.name}</td>
                  <td className={`px-4 py-2 text-right font-bold ${aqiTextColor(d.usAqi)}`}>{d.usAqi}</td>
                  <td className="px-4 py-2 text-right text-gray-300">{d.europeanAqi}</td>
                  <td className="px-4 py-2 text-right text-gray-300">{d.pm25.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right text-gray-300">{d.pm10.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right text-gray-300">{d.ozone.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right text-gray-300">{d.no2.toFixed(1)}</td>
                  <td className="px-4 py-2 w-32">
                    <div className="bg-gray-700 rounded-full h-2 w-full">
                      <div
                        className={`h-2 rounded-full ${aqiColor(d.usAqi)} transition-all`}
                        style={{ width: `${Math.min((d.usAqi / 300) * 100, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {AQI_CATEGORIES.map((cat) => (
          <div key={cat.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${cat.color}`} />
            <span className="text-gray-400 text-xs">{cat.label} ({cat.range})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
