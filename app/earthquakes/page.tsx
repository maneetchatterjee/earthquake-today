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
import TsunamiPanel from '@/components/TsunamiPanel';
import AISummary from '@/components/AISummary';
import TrendAnalysis from '@/components/TrendAnalysis';
import RegionDashboard from '@/components/RegionDashboard';
import HistoricalSearch from '@/components/HistoricalSearch';
import VolcanoAlerts from '@/components/VolcanoAlerts';
import { filterByRegion } from '@/lib/regions';
import { TimePeriod } from '@/lib/types';

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

const GlobeView = dynamic(() => import('@/components/GlobeView'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">🌐 3D Globe View</h2>
      </div>
      <div className="flex items-center justify-center" style={{ height: '480px' }}>
        <div className="text-gray-400 animate-pulse">Loading globe...</div>
      </div>
    </div>
  ),
});

const EEWBanner = dynamic(() => import('@/components/EEWBanner'), { ssr: false });

export default function EarthquakesPage() {
  const { hour, day, week, month, lastUpdated, loading, error } = useEarthquakeData();
  const [mapPeriod, setMapPeriod] = useState<TimePeriod>('day');
  const [tablePeriod, setTablePeriod] = useState<TimePeriod>('day');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [globeView, setGlobeView] = useState(false);

  const mapData = filterByRegion({ hour, day, week, month }[mapPeriod], selectedRegion);
  const tableData = filterByRegion({ hour, day, week, month }[tablePeriod], selectedRegion);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <EEWBanner />
      <Header lastUpdated={lastUpdated} loading={loading} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-xl p-4 text-red-300">
            ⚠️ Error loading earthquake data: {error}
          </div>
        )}

        <section className="space-y-6">
          <h1 className="text-white font-bold text-3xl">🌋 Earthquakes</h1>
          {loading && !day.length ? (
            <div className="text-center py-12 text-gray-400 animate-pulse">Loading earthquake data...</div>
          ) : (
            <CounterGrid day={day} hour={hour} week={week} month={month} />
          )}

          {day.length > 0 && <AISummary day={day} week={week} month={month} />}
          {day.length > 0 && <TrendAnalysis day={day} week={week} month={month} />}
          <TsunamiPanel features={day} />
          <RegionDashboard features={day} onRegionChange={setSelectedRegion} selectedRegion={selectedRegion} />

          <div>
            <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-white font-semibold text-lg">🗺️ World Map</h2>
                <div className="flex rounded-lg overflow-hidden border border-gray-600 text-xs">
                  <button
                    onClick={() => setGlobeView(false)}
                    className={`px-3 py-1.5 transition-colors ${!globeView ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                    🗺️ 2D Map
                  </button>
                  <button
                    onClick={() => setGlobeView(true)}
                    className={`px-3 py-1.5 transition-colors ${globeView ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                    🌐 3D Globe
                  </button>
                </div>
              </div>
              <TimePeriodSelector selected={mapPeriod} onChange={setMapPeriod} />
            </div>
            {globeView ? <GlobeView features={mapData} /> : <EarthquakeMap features={mapData} />}
          </div>

          <MagnitudeBreakdown features={day} />

          <div>
            <h2 className="text-white font-semibold text-lg mb-3">📈 Charts & Analytics</h2>
            <Charts features={day} />
          </div>

          <StatsPanel features={day} />
          <HistoricalSearch />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold text-lg">🗒 Earthquake Table</h2>
              <TimePeriodSelector selected={tablePeriod} onChange={setTablePeriod} />
            </div>
            <EarthquakeTable features={tableData} />
          </div>

          <VolcanoAlerts features={day} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
