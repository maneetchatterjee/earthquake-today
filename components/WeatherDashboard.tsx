'use client';

import { useState } from 'react';
import { WeatherData } from '@/lib/types';

interface WeatherDashboardProps {
  weatherData: WeatherData[];
  loading: boolean;
}

function weatherCodeToEmoji(code: number): { emoji: string; desc: string } {
  if (code === 0) return { emoji: '☀️', desc: 'Clear sky' };
  if (code <= 3) return { emoji: '🌤️', desc: 'Partly cloudy' };
  if (code === 45 || code === 48) return { emoji: '🌫️', desc: 'Fog' };
  if (code >= 51 && code <= 55) return { emoji: '🌦️', desc: 'Drizzle' };
  if (code >= 61 && code <= 65) return { emoji: '🌧️', desc: 'Rain' };
  if (code >= 71 && code <= 75) return { emoji: '🌨️', desc: 'Snow' };
  if (code >= 80 && code <= 82) return { emoji: '🌦️', desc: 'Showers' };
  if (code >= 95 && code <= 99) return { emoji: '⛈️', desc: 'Thunderstorm' };
  return { emoji: '🌡️', desc: 'Unknown' };
}

function degToCompass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function toF(c: number) {
  return (c * 9) / 5 + 32;
}

export default function WeatherDashboard({ weatherData, loading }: WeatherDashboardProps) {
  const [useFahrenheit, setUseFahrenheit] = useState(false);

  if (loading && weatherData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400 animate-pulse">
        Loading weather data...
      </div>
    );
  }

  const valid = weatherData.filter((d) => !d.error);
  const hottest = valid.length ? valid.reduce((a, b) => (a.temperature > b.temperature ? a : b)) : null;
  const coldest = valid.length ? valid.reduce((a, b) => (a.temperature < b.temperature ? a : b)) : null;
  const rainiest = valid.length ? valid.reduce((a, b) => (a.precipitation > b.precipitation ? a : b)) : null;
  const windiest = valid.length ? valid.reduce((a, b) => (a.windSpeed > b.windSpeed ? a : b)) : null;
  const avgTemp = valid.length ? valid.reduce((s, d) => s + d.temperature, 0) / valid.length : 0;

  const fmt = (t: number) =>
    useFahrenheit ? `${toF(t).toFixed(1)}°F` : `${t.toFixed(1)}°C`;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: '🔥 Hottest', city: hottest, val: hottest ? fmt(hottest.temperature) : '—' },
          { label: '🧊 Coldest', city: coldest, val: coldest ? fmt(coldest.temperature) : '—' },
          { label: '🌧️ Rainiest', city: rainiest, val: rainiest ? `${rainiest.precipitation}mm` : '—' },
          { label: '💨 Windiest', city: windiest, val: windiest ? `${windiest.windSpeed} km/h` : '—' },
          { label: '🌡️ Avg Temp', city: null, val: fmt(avgTemp) },
        ].map(({ label, city, val }) => (
          <div key={label} className="bg-gray-800 rounded-xl border border-gray-700 p-3">
            <div className="text-gray-400 text-xs mb-1">{label}</div>
            <div className="text-white font-bold text-lg">{val}</div>
            {city && <div className="text-gray-400 text-xs mt-0.5">{city.city.name}</div>}
          </div>
        ))}
      </div>

      {/* C/F Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">City Weather</h3>
        <div className="flex rounded-lg overflow-hidden border border-gray-600 text-xs">
          <button
            onClick={() => setUseFahrenheit(false)}
            className={`px-3 py-1.5 transition-colors ${!useFahrenheit ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            °C
          </button>
          <button
            onClick={() => setUseFahrenheit(true)}
            className={`px-3 py-1.5 transition-colors ${useFahrenheit ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            °F
          </button>
        </div>
      </div>

      {/* City Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {weatherData.map((d) => {
          const { emoji, desc } = weatherCodeToEmoji(d.weatherCode);
          return (
            <div key={d.city.name} className="bg-gray-800 rounded-xl border border-gray-700 p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">{d.city.name}</div>
                  <div className="text-gray-500 text-xs">{d.city.country}</div>
                </div>
                <span className="text-2xl">{emoji}</span>
              </div>
              {d.error ? (
                <div className="text-red-400 text-xs">Error loading</div>
              ) : (
                <>
                  <div className="text-orange-400 font-bold text-xl">{fmt(d.temperature)}</div>
                  <div className="text-gray-400 text-xs">Feels {fmt(d.feelsLike)}</div>
                  <div className="text-gray-400 text-xs">{desc}</div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-400 pt-1 border-t border-gray-700">
                    <span>💧 {d.humidity}%</span>
                    <span>💨 {d.windSpeed} km/h</span>
                    <span>🧭 {degToCompass(d.windDirection)}</span>
                    <span>🌧️ {d.precipitation}mm</span>
                    <span>☁️ {d.cloudCover}%</span>
                    <span>🔵 {d.pressure} hPa</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
