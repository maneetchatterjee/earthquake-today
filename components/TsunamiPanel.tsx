'use client';

import { USGSFeature } from '@/lib/types';
import { getMagnitudeColor, formatTimeAgo } from '@/lib/utils';

interface TsunamiPanelProps {
  features: USGSFeature[];
}

function getSeverityBg(mag: number): string {
  if (mag >= 7) return 'bg-red-900/60 border-red-700';
  if (mag >= 6) return 'bg-orange-900/60 border-orange-700';
  return 'bg-yellow-900/60 border-yellow-700';
}

export default function TsunamiPanel({ features }: TsunamiPanelProps) {
  const tsunamiEvents = features.filter(f => f.properties.tsunami === 1);

  if (tsunamiEvents.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <div className="text-green-400 font-semibold">No Active Tsunami Alerts</div>
          <div className="text-gray-400 text-sm">All clear — no tsunami-flagged earthquakes in current data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-orange-700 overflow-hidden">
      <div className="bg-orange-900/40 px-4 py-3 border-b border-orange-700 flex items-center gap-2">
        <span className="text-xl">⚠️</span>
        <span className="text-orange-300 font-bold text-lg">
          {tsunamiEvents.length} Tsunami Alert{tsunamiEvents.length > 1 ? 's' : ''} Active
        </span>
      </div>
      <div className="p-4 space-y-3">
        {tsunamiEvents.map(f => (
          <div key={f.id} className={`rounded-lg border p-3 ${getSeverityBg(f.properties.mag)}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm" style={{ color: getMagnitudeColor(f.properties.mag) }}>
                M{f.properties.mag.toFixed(1)}
              </span>
              <span className="text-gray-400 text-xs">{formatTimeAgo(f.properties.time)}</span>
            </div>
            <div className="text-white text-sm mt-1">{f.properties.place}</div>
            <div className="text-gray-400 text-xs mt-1">Depth: {f.geometry.coordinates[2].toFixed(0)} km</div>
          </div>
        ))}
      </div>
    </div>
  );
}
