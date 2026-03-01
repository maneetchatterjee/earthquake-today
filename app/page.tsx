'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useEarthquakeData } from '@/hooks/useEarthquakeData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CounterGrid from '@/components/CounterGrid';
import TimePeriodSelector from '@/components/TimePeriodSelector';
import MagnitudeBreakdown from '@/components/MagnitudeBreakdown';
import EarthquakeTable from '@/components/EarthquakeTable';
import Charts from '@/components/Charts';
import StatsPanel from '@/components/StatsPanel';
import { TimePeriod } from '@/lib/types';

// Dynamic import for map (no SSR - Leaflet requirement)
const EarthquakeMap = dynamic(() => import('@/components/EarthquakeMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">🗺️ Interactive World Map</h2>
      </div>
      <div className="flex items-center justify-center" style={{ height: '480px' }}>
        <div className="text-gray-400 animate-pulse">Loading map...</div>
      </div>
    </div>
  ),
});

export default function Home() {
  const { hour, day, week, month, lastUpdated, loading, error } = useEarthquakeData();
  const [mapPeriod, setMapPeriod] = useState<TimePeriod>('day');
  const [tablePeriod, setTablePeriod] = useState<TimePeriod>('day');

  const mapData = { hour, day, week, month }[mapPeriod];
  const tableData = { hour, day, week, month }[tablePeriod];

  return (
    <div className="min-h-screen bg-gray-950">
      <Header lastUpdated={lastUpdated} loading={loading} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-xl p-4 text-red-300">
            ⚠️ Error loading earthquake data: {error}
          </div>
        )}

        {loading && !day.length && (
          <div className="text-center py-12 text-gray-400 animate-pulse">
            Loading earthquake data...
          </div>
        )}

        {/* Counter Grid */}
        <CounterGrid day={day} hour={hour} week={week} month={month} />

        {/* Map */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-lg">🗺️ World Map</h2>
            <TimePeriodSelector selected={mapPeriod} onChange={setMapPeriod} />
          </div>
          <EarthquakeMap features={mapData} />
        </div>

        {/* Magnitude Breakdown */}
        <MagnitudeBreakdown features={day} />

        {/* Charts */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">📈 Charts & Analytics</h2>
          <Charts features={day} />
        </div>

        {/* Stats Panel */}
        <StatsPanel features={day} />

        {/* Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-lg">🗒 Earthquake Table</h2>
            <TimePeriodSelector selected={tablePeriod} onChange={setTablePeriod} />
          </div>
          <EarthquakeTable features={tableData} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
