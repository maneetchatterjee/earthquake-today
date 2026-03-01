'use client';

import { useWeatherData } from '@/hooks/useWeatherData';
import WeatherDashboard from '@/components/WeatherDashboard';
import SevereWeatherPanel from '@/components/SevereWeatherPanel';

export default function WeatherPage() {
  const { weatherData, loading } = useWeatherData();

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">🌡️ Weather</h1>
        <div>
          <h2 className="text-white font-semibold text-xl mb-4">⚠️ Severe Weather Alerts</h2>
          <SevereWeatherPanel weatherData={weatherData} />
        </div>
        <WeatherDashboard weatherData={weatherData} loading={loading} />
      </main>
    </div>
  );
}
