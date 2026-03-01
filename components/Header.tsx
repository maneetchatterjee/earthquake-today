'use client';

import { formatTimeAgo } from '@/lib/utils';

interface HeaderProps {
  lastUpdated: Date | null;
  loading: boolean;
}

export default function Header({ lastUpdated, loading }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            🌍 <span className="text-orange-400">Earthquakes</span>{' '}
            <span className="text-white">Today</span>
          </h1>
          <p className="text-gray-400 text-sm">Real-time global seismic activity</p>
        </div>
        <div className="flex items-center gap-3">
          {loading && (
            <span className="flex items-center gap-2 text-orange-400 text-sm">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full" />
              Updating...
            </span>
          )}
          {lastUpdated && !loading && (
            <span className="text-gray-400 text-sm">
              Last updated:{' '}
              <span className="text-green-400">{formatTimeAgo(lastUpdated.getTime())}</span>
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
