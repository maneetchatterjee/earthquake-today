'use client';

import { useEffect, useState } from 'react';
import { USGSFeature } from '@/lib/types';
import { Volcano, getEarthquakeVolcanoAlerts } from '@/lib/volcanoes';
import { getMagnitudeColor, formatTimeAgo } from '@/lib/utils';

interface VolcanoAlertsProps {
  features: USGSFeature[];
}

export default function VolcanoAlerts({ features }: VolcanoAlertsProps) {
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);

  useEffect(() => {
    fetch('/data/volcanoes.json')
      .then(r => r.json())
      .then(setVolcanoes)
      .catch(() => {});
  }, []);

  const alerts = getEarthquakeVolcanoAlerts(features, volcanoes);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">🌋 Volcano Proximity Alerts</h2>
        <p className="text-gray-400 text-sm mt-0.5">M4+ earthquakes within 100km of active volcanoes</p>
      </div>
      {alerts.length === 0 ? (
        <div className="p-6 text-center">
          <div className="text-gray-500 text-2xl mb-2">🌋</div>
          <div className="text-gray-400">No earthquake-volcano proximity alerts</div>
        </div>
      ) : (
        <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
          {alerts.slice(0, 20).map(({ quake, nearbyVolcanoes }) => {
            const isHighAlert = quake.properties.mag >= 5 && nearbyVolcanoes.some(v => v.distance <= 50);
            return (
              <div key={quake.id} className={`p-4 ${isHighAlert ? 'bg-red-900/20' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm" style={{ color: getMagnitudeColor(quake.properties.mag) }}>
                        M{quake.properties.mag.toFixed(1)}
                      </span>
                      {isHighAlert && (
                        <span className="bg-red-700 text-red-100 text-xs px-2 py-0.5 rounded-full font-semibold">
                          ⚠️ HIGH ALERT
                        </span>
                      )}
                      <span className="text-gray-400 text-xs">{formatTimeAgo(quake.properties.time)}</span>
                    </div>
                    <div className="text-gray-300 text-sm truncate">{quake.properties.place}</div>
                    <div className="mt-2 space-y-1">
                      {nearbyVolcanoes.slice(0, 3).map(v => (
                        <div key={v.name} className="text-xs text-gray-400 flex items-center gap-1">
                          <span>🌋</span>
                          <span className="text-gray-300">{v.name}</span>
                          <span className="text-gray-500">({v.country})</span>
                          <span className="text-orange-400 font-semibold">{v.distance.toFixed(0)} km away</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
