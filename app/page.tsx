'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useEarthquakeData } from '@/hooks/useEarthquakeData';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useAirQualityData } from '@/hooks/useAirQualityData';
import { useWildfireData } from '@/hooks/useWildfireData';
import { useTidesData } from '@/hooks/useTidesData';
import { useMarineData } from '@/hooks/useMarineData';
import { useNewsData } from '@/hooks/useNewsData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
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
import WeatherDashboard from '@/components/WeatherDashboard';
import AirQualityPanel from '@/components/AirQualityPanel';
import WildfireTracker from '@/components/WildfireTracker';
import TidesPanel from '@/components/TidesPanel';
import MarinePanel from '@/components/MarinePanel';
import NewsPanel from '@/components/NewsPanel';
import EnvironmentCounters from '@/components/EnvironmentCounters';
import SevereWeatherPanel from '@/components/SevereWeatherPanel';
import UVIndexPanel from '@/components/UVIndexPanel';
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

export default function Home() {
  const { hour, day, week, month, lastUpdated, loading, error } = useEarthquakeData();
  const { weatherData, loading: weatherLoading } = useWeatherData();
  const { aqiData, loading: aqiLoading } = useAirQualityData();
  const { fires, loading: firesLoading, error: firesError, hasApiKey } = useWildfireData();
  const { predictions, selectedStation, setSelectedStation, loading: tidesLoading } = useTidesData();
  const { marineData, loading: marineLoading } = useMarineData();
  const { articles, loading: newsLoading } = useNewsData();

  const [activeSection, setActiveSection] = useState('overview');
  const [mapPeriod, setMapPeriod] = useState<TimePeriod>('day');
  const [tablePeriod, setTablePeriod] = useState<TimePeriod>('day');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [globeView, setGlobeView] = useState(false);

  const mapData = filterByRegion({ hour, day, week, month }[mapPeriod], selectedRegion);
  const tableData = filterByRegion({ hour, day, week, month }[tablePeriod], selectedRegion);

  return (
    <div className="min-h-screen bg-gray-950">
      <EEWBanner />
      <Header lastUpdated={lastUpdated} loading={loading} />
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-12">
        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-xl p-4 text-red-300">
            ⚠️ Error loading earthquake data: {error}
          </div>
        )}

        {/* Overview */}
        <section id="overview" className="space-y-6">
          <h2 className="text-white font-bold text-2xl">🌍 Overview</h2>
          {loading && !day.length ? (
            <div className="text-center py-12 text-gray-400 animate-pulse">Loading earthquake data...</div>
          ) : (
            <CounterGrid day={day} hour={hour} week={week} month={month} />
          )}
        </section>

        {/* Earthquakes */}
        <section id="earthquakes" className="space-y-6">
          <h2 className="text-white font-bold text-2xl">🌋 Earthquakes</h2>
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

        {/* Weather */}
        <section id="weather" className="space-y-6">
          <h2 className="text-white font-bold text-2xl">🌡️ Weather</h2>
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">⚠️ Severe Weather Alerts</h3>
            <SevereWeatherPanel weatherData={weatherData} />
          </div>
          <WeatherDashboard weatherData={weatherData} loading={weatherLoading} />
        </section>

        {/* Air Quality */}
        <section id="airquality" className="space-y-6">
          <h2 className="text-white font-bold text-2xl">💨 Air Quality</h2>
          <AirQualityPanel aqiData={aqiData} loading={aqiLoading} />
        </section>

        {/* Wildfires */}
        <section id="wildfires" className="space-y-6">
          <h2 className="text-white font-bold text-2xl">🔥 Wildfires</h2>
          <WildfireTracker fires={fires} loading={firesLoading} hasApiKey={hasApiKey} error={firesError} />
        </section>

        {/* Oceans */}
        <section id="oceans" className="space-y-6">
          <h2 className="text-white font-bold text-2xl">🌊 Oceans & Tides</h2>
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">🌊 Tide Predictions</h3>
            <TidesPanel
              predictions={predictions}
              selectedStation={selectedStation}
              setSelectedStation={setSelectedStation}
              loading={tidesLoading}
            />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">🌊 Marine Conditions</h3>
            <MarinePanel marineData={marineData} loading={marineLoading} />
          </div>
        </section>

        {/* Environment */}
        <section id="environment" className="space-y-6">
          <h2 className="text-white font-bold text-2xl">🌍 Environment</h2>
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">☀️ UV Index</h3>
            <UVIndexPanel />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">🌡️ Environmental Counters</h3>
            <EnvironmentCounters />
          </div>
        </section>

        {/* News */}
        <section id="news" className="space-y-6">
          <h2 className="text-white font-bold text-2xl">📰 Environmental News</h2>
          <NewsPanel articles={articles} loading={newsLoading} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
