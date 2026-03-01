'use client';

import { useState, useMemo } from 'react';
import { USGSFeature } from '@/lib/types';
import { formatTimeAgo, formatDateTime, getMagnitudeColor } from '@/lib/utils';

interface EarthquakeTableProps {
  features: USGSFeature[];
}

type SortKey = 'time' | 'mag' | 'depth';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 20;

function getRowColor(mag: number): string {
  if (mag >= 6) return 'bg-red-900/30 border-red-800/30';
  if (mag >= 5) return 'bg-orange-900/30 border-orange-800/30';
  if (mag >= 3) return 'bg-yellow-900/20 border-yellow-800/20';
  return 'border-gray-700/50';
}

export default function EarthquakeTable({ features }: EarthquakeTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('time');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [minMag, setMinMag] = useState(0);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    return [...features]
      .filter((f) => f.properties.mag >= minMag)
      .sort((a, b) => {
        let av: number, bv: number;
        if (sortKey === 'time') {
          av = a.properties.time;
          bv = b.properties.time;
        } else if (sortKey === 'mag') {
          av = a.properties.mag;
          bv = b.properties.mag;
        } else {
          av = a.geometry.coordinates[2];
          bv = b.geometry.coordinates[2];
        }
        return sortDir === 'desc' ? bv - av : av - bv;
      });
  }, [features, sortKey, sortDir, minMag]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="text-gray-600 ml-1">↕</span>;
    return <span className="text-orange-400 ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>;
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-700 flex flex-wrap gap-3 items-center">
        <h2 className="text-white font-semibold text-lg mr-auto">🗒 Recent Earthquakes</h2>
        <label className="text-gray-400 text-sm flex items-center gap-2">
          Min magnitude:
          <select
            value={minMag}
            onChange={(e) => { setMinMag(Number(e.target.value)); setPage(0); }}
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600"
          >
            {[0, 1, 2, 3, 4, 5, 6].map((m) => (
              <option key={m} value={m}>M{m}+</option>
            ))}
          </select>
        </label>
        <span className="text-gray-500 text-sm">{sorted.length} events</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-xs uppercase">
              <th
                className="text-left px-4 py-3 cursor-pointer hover:text-white"
                onClick={() => toggleSort('time')}
              >
                Time <SortIcon k="time" />
              </th>
              <th
                className="text-left px-4 py-3 cursor-pointer hover:text-white"
                onClick={() => toggleSort('mag')}
              >
                Mag <SortIcon k="mag" />
              </th>
              <th className="text-left px-4 py-3">Location</th>
              <th
                className="text-left px-4 py-3 cursor-pointer hover:text-white"
                onClick={() => toggleSort('depth')}
              >
                Depth <SortIcon k="depth" />
              </th>
              <th className="text-left px-4 py-3">Tsunami</th>
              <th className="text-left px-4 py-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((f) => (
              <tr
                key={f.id}
                className={`border-b transition-colors hover:bg-gray-700/50 ${getRowColor(f.properties.mag)}`}
              >
                <td className="px-4 py-2 text-gray-300 whitespace-nowrap">
                  <div>{formatTimeAgo(f.properties.time)}</div>
                  <div className="text-gray-500 text-xs">{formatDateTime(f.properties.time)}</div>
                </td>
                <td className="px-4 py-2 font-bold" style={{ color: getMagnitudeColor(f.properties.mag) }}>
                  M{f.properties.mag?.toFixed(1)}
                </td>
                <td className="px-4 py-2 text-gray-300 max-w-xs truncate">{f.properties.place}</td>
                <td className="px-4 py-2 text-gray-300">
                  {f.geometry.coordinates[2].toFixed(0)} km
                </td>
                <td className="px-4 py-2">
                  {f.properties.tsunami === 1 ? (
                    <span className="text-blue-400 font-semibold">🌊 Yes</span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <a
                    href={f.properties.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline text-xs"
                  >
                    USGS ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-gray-700 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-40 hover:bg-gray-600 text-sm"
          >
            ← Prev
          </button>
          <span className="text-gray-400 text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-40 hover:bg-gray-600 text-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
