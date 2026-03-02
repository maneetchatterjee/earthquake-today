'use client';

import { useState, useEffect } from 'react';

interface FeedInfo {
  url: string;
  status?: string;
}

interface HealthData {
  status: string;
  timestamp: string;
  feeds: Record<string, FeedInfo>;
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data: HealthData) => { setHealth(data); setLoading(false); })
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : 'Failed'); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🌍 System Status</h1>
        <p className="text-gray-400 mb-8">Upstream API feed availability</p>

        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {health && (
          <>
            <div className="flex items-center gap-3 mb-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="font-semibold text-green-400 uppercase tracking-wide">
                {health.status}
              </span>
              <span className="text-gray-500 text-sm ml-auto">
                {new Date(health.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="grid gap-3">
              {Object.entries(health.feeds).map(([name, info]) => (
                <div
                  key={name}
                  className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="font-medium capitalize w-32">{name}</span>
                  <span className="text-gray-400 text-sm font-mono">{info.url}</span>
                  <span className="ml-auto text-green-400 text-xs font-semibold">Healthy</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
