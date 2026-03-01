'use client';

import { WildfirePoint } from '@/lib/types';

interface WildfireTrackerProps {
  fires: WildfirePoint[];
  loading: boolean;
  hasApiKey: boolean;
  error: string | null;
}

export default function WildfireTracker({ fires, loading, hasApiKey, error }: WildfireTrackerProps) {
  if (!hasApiKey) {
    return (
      <div className="bg-orange-900/20 border border-orange-700/40 rounded-xl p-6 space-y-3">
        <h3 className="text-orange-400 font-bold text-lg">🔥 Wildfire Tracker — API Key Required</h3>
        <p className="text-gray-300 text-sm">
          To enable real-time wildfire data, set your NASA FIRMS API key as an environment variable.
        </p>
        <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
          <li>
            Register for a free API key at{' '}
            <a
              href="https://firms.modaps.eosdis.nasa.gov/api/area/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 underline"
            >
              NASA FIRMS
            </a>
          </li>
          <li>
            Add to your <code className="bg-gray-700 px-1 rounded">.env.local</code>:{' '}
            <code className="bg-gray-700 px-1 rounded">NEXT_PUBLIC_FIRMS_MAP_KEY=your_key_here</code>
          </li>
          <li>Restart the dev server</li>
        </ol>
        <p className="text-gray-500 text-xs">
          Without a key, the app attempts to load the public VIIRS CSV dataset, which may fail due to CORS restrictions.
        </p>
      </div>
    );
  }

  if (loading && fires.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400 animate-pulse">
        Loading wildfire data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-6">
        <h3 className="text-red-400 font-semibold mb-2">⚠️ Failed to load wildfire data</h3>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  const uniqueDates = new Set(fires.map((f) => f.acqDate)).size;
  const maxFrp = fires.length ? Math.max(...fires.map((f) => f.frp)) : 0;
  const satellites = [...new Set(fires.map((f) => f.satellite))].filter(Boolean);
  const recent = [...fires].slice(0, 20);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: '🔥', label: 'Active Fire Detections', value: fires.length.toLocaleString(), color: 'text-orange-400' },
          { icon: '📅', label: 'Detection Days', value: uniqueDates.toString(), color: 'text-yellow-400' },
          { icon: '⚡', label: 'Max FRP (MW)', value: maxFrp.toFixed(1), color: 'text-red-400' },
          { icon: '🛰️', label: 'Satellite Sources', value: satellites.join(', ') || '—', color: 'text-blue-400' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <div className="text-gray-400 text-xs mb-1">{icon} {label}</div>
            <div className={`font-bold text-lg ${color} truncate`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Recent detections */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Recent Fire Detections (latest 20)</h3>
        </div>
        {fires.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No fire detections loaded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-gray-700">
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Time (UTC)</th>
                  <th className="text-right px-4 py-2">Lat</th>
                  <th className="text-right px-4 py-2">Lng</th>
                  <th className="text-right px-4 py-2">Brightness</th>
                  <th className="text-right px-4 py-2">FRP (MW)</th>
                  <th className="text-right px-4 py-2">Confidence</th>
                  <th className="text-left px-4 py-2">Satellite</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((f, i) => (
                  <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="px-4 py-2 text-gray-300">{f.acqDate}</td>
                    <td className="px-4 py-2 text-gray-300">{f.acqTime}</td>
                    <td className="px-4 py-2 text-right text-gray-300">{f.lat.toFixed(3)}</td>
                    <td className="px-4 py-2 text-right text-gray-300">{f.lng.toFixed(3)}</td>
                    <td className="px-4 py-2 text-right text-orange-400">{f.brightness.toFixed(1)} K</td>
                    <td className="px-4 py-2 text-right text-red-400">{f.frp.toFixed(1)}</td>
                    <td className="px-4 py-2 text-right text-gray-300">{f.confidence}</td>
                    <td className="px-4 py-2 text-blue-400">{f.satellite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
