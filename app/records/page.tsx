'use client';

import { useEarthquakeData } from '@/hooks/useEarthquakeData';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useAirQualityData } from '@/hooks/useAirQualityData';
import { useWildfireData } from '@/hooks/useWildfireData';
import { useEnergyData } from '@/hooks/useEnergyData';
import { calculateHealthScore } from '@/lib/healthScore';
import RadialGauge from '@/components/ui/RadialGauge';

export default function RecordsPage() {
  const { day, loading: eqLoading } = useEarthquakeData();
  const { weatherData, loading: weatherLoading } = useWeatherData();
  const { aqiData, loading: aqiLoading } = useAirQualityData();
  const { fires, loading: firesLoading } = useWildfireData();
  const { carbonIntensity, loading: energyLoading } = useEnergyData();

  const maxMag = day.reduce((max, f) => Math.max(max, f.properties.mag || 0), 0);
  const avgAqi = aqiData.length ? Math.round(aqiData.reduce((sum, d) => sum + d.usAqi, 0) / aqiData.length) : 50;
  const avgTemp = weatherData.length ? weatherData.reduce((sum, d) => sum + d.temperature, 0) / weatherData.length : 15;
  const hottestCity = weatherData.reduce((max, d) => d.temperature > (max?.temperature ?? -Infinity) ? d : max, weatherData[0]);
  const coldestCity = weatherData.reduce((min, d) => d.temperature < (min?.temperature ?? Infinity) ? d : min, weatherData[0]);

  const healthScore = calculateHealthScore({
    earthquakeCount: day.length,
    maxMagnitude: maxMag,
    avgAqi,
    avgTemp,
    fireCount: fires.length,
    carbonIntensity,
  });

  const loading = eqLoading && weatherLoading && aqiLoading;

  // Suppress unused variable warnings
  void firesLoading;
  void energyLoading;

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">🏆 Records & Earth Health Score</h1>

        {/* Health Score */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-white font-semibold text-2xl mb-6 text-center">🌍 Earth Health Score</h2>
          <div className="flex justify-center">
            <RadialGauge
              value={loading ? 50 : healthScore}
              min={0}
              max={100}
              label="Overall Earth Health"
              unit=""
              colorScheme={[
                { limit: 33, color: '#FF3366' },
                { limit: 66, color: '#FFB800' },
                { color: '#00FF88' },
              ]}
            />
          </div>
          <div className="text-center mt-4 text-slate-400">
            Based on seismic activity, air quality, temperature, wildfires, and carbon intensity
          </div>
        </div>

        {/* Daily Records */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">📊 Today&apos;s Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-slate-400 text-xs">Largest Earthquake</div>
              <div className="text-2xl font-bold text-red-400 font-mono mt-1">M{maxMag.toFixed(1)}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-slate-400 text-xs">Earthquakes Today</div>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{day.length}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-slate-400 text-xs">Avg Air Quality Index</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{avgAqi}</div>
            </div>
            {hottestCity && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-slate-400 text-xs">Hottest City</div>
                <div className="text-lg font-bold text-red-400 mt-1">{hottestCity.city?.name}</div>
                <div className="text-white font-mono">{hottestCity.temperature?.toFixed(1)}°C</div>
              </div>
            )}
            {coldestCity && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-slate-400 text-xs">Coldest City</div>
                <div className="text-lg font-bold text-blue-400 mt-1">{coldestCity.city?.name}</div>
                <div className="text-white font-mono">{coldestCity.temperature?.toFixed(1)}°C</div>
              </div>
            )}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-slate-400 text-xs">Active Fire Points</div>
              <div className="text-2xl font-bold text-orange-400 font-mono mt-1">{fires.length.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* All-time records */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">🏆 Historical Records</h2>
          <div className="space-y-3">
            {[
              { record: 'Largest Earthquake Ever Recorded', value: 'M9.5 - Valdivia, Chile (1960)', icon: '🌋' },
              { record: 'Highest Temperature Ever Recorded', value: '56.7°C - Death Valley, USA (1913)', icon: '🌡️' },
              { record: 'Lowest Temperature Ever Recorded', value: '-89.2°C - Vostok Station, Antarctica (1983)', icon: '❄️' },
              { record: 'Highest Recorded Wind Speed', value: '408 km/h - Barrow Island, Australia (1996)', icon: '💨' },
              { record: 'Deepest Ocean Point', value: '10,935 m - Challenger Deep, Mariana Trench', icon: '🌊' },
              { record: 'Highest Atmospheric CO₂ (recorded)', value: '426.9 ppm - Mauna Loa (2024)', icon: '🌫️' },
            ].map((r) => (
              <div key={r.record} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                <span className="text-xl">{r.icon}</span>
                <div>
                  <div className="text-slate-400 text-xs">{r.record}</div>
                  <div className="text-white font-medium text-sm mt-0.5">{r.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
