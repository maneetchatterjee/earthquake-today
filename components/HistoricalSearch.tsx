'use client';

import { useState } from 'react';
import { USGSFeature, USGSResponse } from '@/lib/types';
import EarthquakeTable from './EarthquakeTable';

export default function HistoricalSearch() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minMag, setMinMag] = useState(4);
  const [maxMag, setMaxMag] = useState(9);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<USGSFeature[] | null>(null);

  async function handleSearch() {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&minmagnitude=${minMag}&maxmagnitude=${maxMag}&limit=500`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: USGSResponse = await res.json();
      setResults(data.features);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">🔍 Historical Earthquake Search</h2>
        <p className="text-gray-400 text-sm mt-0.5">Search USGS historical earthquake database</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-xs uppercase block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase block mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase block mb-1">Min Magnitude: {minMag}</label>
            <input
              type="range"
              min={0}
              max={9}
              step={0.1}
              value={minMag}
              onChange={e => setMinMag(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase block mb-1">Max Magnitude: {maxMag}</label>
            <input
              type="range"
              min={0}
              max={9}
              step={0.1}
              value={maxMag}
              onChange={e => setMaxMag(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          {loading ? '⏳ Searching...' : '🔍 Search'}
        </button>
        {error && <div className="mt-3 text-red-400 text-sm">⚠️ {error}</div>}
      </div>
      {results !== null && (
        <div className="border-t border-gray-700">
          <div className="px-4 py-3 bg-gray-900/50">
            <span className="text-gray-300 text-sm">
              Found <strong className="text-white">{results.length}</strong>{results.length === 500 && <span className="text-yellow-400 ml-1">(limit reached — try narrowing your search)</span>} earthquakes between{' '}
              <strong className="text-orange-400">{startDate}</strong> and{' '}
              <strong className="text-orange-400">{endDate}</strong>{' '}
              (M{minMag}–M{maxMag})
            </span>
          </div>
          {results.length > 0 ? (
            <EarthquakeTable features={results} />
          ) : (
            <div className="px-4 py-6 text-gray-500 text-center">No earthquakes found for the selected criteria.</div>
          )}
        </div>
      )}
    </div>
  );
}
