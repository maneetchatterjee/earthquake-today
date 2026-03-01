'use client';

import { USGSFeature } from '@/lib/types';
import {
  formatEnergy,
  getTotalEnergy,
  getDepthCategory,
  getUniqueRegions,
} from '@/lib/utils';

interface StatsPanelProps {
  features: USGSFeature[];
}

export default function StatsPanel({ features }: StatsPanelProps) {
  if (features.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  const deepest = features.reduce(
    (max, f) => (f.geometry.coordinates[2] > max.geometry.coordinates[2] ? f : max),
    features[0]
  );
  const shallowest = features.reduce(
    (min, f) => (f.geometry.coordinates[2] < min.geometry.coordinates[2] ? f : min),
    features[0]
  );
  const avgDepth =
    features.reduce((sum, f) => sum + f.geometry.coordinates[2], 0) / features.length;
  const regions = getUniqueRegions(features);
  const totalEnergy = getTotalEnergy(features);

  const stats = [
    {
      label: 'Deepest Earthquake',
      value: `${deepest.geometry.coordinates[2].toFixed(0)} km`,
      sub: deepest.properties.place,
      icon: '⬇️',
    },
    {
      label: 'Shallowest Earthquake',
      value: `${shallowest.geometry.coordinates[2].toFixed(0)} km`,
      sub: shallowest.properties.place,
      icon: '⬆️',
    },
    {
      label: 'Average Depth',
      value: `${avgDepth.toFixed(1)} km`,
      sub: getDepthCategory(avgDepth),
      icon: '📏',
    },
    {
      label: 'Regions Affected',
      value: regions.toLocaleString(),
      sub: 'unique regions/countries',
      icon: '🗺️',
    },
    {
      label: 'Total Energy Released',
      value: formatEnergy(totalEnergy),
      sub: 'via Gutenberg-Richter formula',
      icon: '⚡',
    },
    {
      label: 'Daily Activity',
      value: `${features.length} quakes`,
      sub: 'Daily average: ~50 felt worldwide',
      icon: '📈',
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <h2 className="text-white font-semibold text-lg mb-4">📋 Statistics Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub, icon }) => (
          <div key={label} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
              {icon} {label}
            </div>
            <div className="text-white font-bold text-lg">{value}</div>
            {sub && <div className="text-gray-500 text-xs mt-0.5 truncate">{sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
