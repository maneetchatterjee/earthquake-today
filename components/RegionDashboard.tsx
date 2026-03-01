'use client';

import { USGSFeature } from '@/lib/types';
import { SEISMIC_REGIONS, filterByRegion } from '@/lib/regions';
import { getMagnitudeColor } from '@/lib/utils';

interface RegionDashboardProps {
  features: USGSFeature[];
  onRegionChange: (regionId: string) => void;
  selectedRegion: string;
}

export default function RegionDashboard({ features, onRegionChange, selectedRegion }: RegionDashboardProps) {
  const filtered = filterByRegion(features, selectedRegion);
  const largest = filtered.length > 0
    ? [...filtered].sort((a, b) => b.properties.mag - a.properties.mag)[0]
    : null;
  const region = SEISMIC_REGIONS.find(r => r.id === selectedRegion);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h2 className="text-white font-semibold text-lg">🌍 Region Dashboard</h2>
        <select
          value={selectedRegion}
          onChange={e => onRegionChange(e.target.value)}
          className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:outline-none focus:border-orange-500"
        >
          {SEISMIC_REGIONS.map(r => (
            <option key={r.id} value={r.id}>{r.emoji} {r.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-gray-900/50 rounded-lg p-3">
          <div className="text-gray-400 text-xs uppercase mb-1">Region</div>
          <div className="text-white font-semibold text-sm">{region?.emoji} {region?.name}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3">
          <div className="text-gray-400 text-xs uppercase mb-1">Events</div>
          <div className="text-white font-bold text-xl">{filtered.length}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 col-span-2 sm:col-span-1">
          <div className="text-gray-400 text-xs uppercase mb-1">Largest</div>
          {largest ? (
            <div>
              <span className="font-bold" style={{ color: getMagnitudeColor(largest.properties.mag) }}>
                M{largest.properties.mag.toFixed(1)}
              </span>
              <div className="text-gray-300 text-xs truncate">{largest.properties.place}</div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No data</div>
          )}
        </div>
      </div>
    </div>
  );
}
