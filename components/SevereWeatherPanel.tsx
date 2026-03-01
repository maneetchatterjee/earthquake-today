'use client';

import { WeatherData } from '@/lib/types';

interface SevereWeatherPanelProps {
  weatherData: WeatherData[];
}

interface Alert {
  city: string;
  type: string;
  value: string;
  severity: 'warning' | 'danger' | 'extreme';
  icon: string;
}

export default function SevereWeatherPanel({ weatherData }: SevereWeatherPanelProps) {
  const alerts: Alert[] = [];

  for (const d of weatherData) {
    if (d.error) continue;
    if (d.weatherCode >= 95 && d.weatherCode <= 99) {
      alerts.push({ city: d.city.name, type: 'Thunderstorm', value: `Code ${d.weatherCode}`, severity: 'danger', icon: '⛈️' });
    }
    if (d.windSpeed > 60) {
      alerts.push({ city: d.city.name, type: 'High Winds', value: `${d.windSpeed} km/h`, severity: d.windSpeed > 90 ? 'extreme' : 'warning', icon: '💨' });
    }
    if (d.temperature > 40) {
      alerts.push({ city: d.city.name, type: 'Extreme Heat', value: `${d.temperature.toFixed(1)}°C`, severity: d.temperature > 45 ? 'extreme' : 'danger', icon: '🔥' });
    }
    if (d.temperature < -20) {
      alerts.push({ city: d.city.name, type: 'Extreme Cold', value: `${d.temperature.toFixed(1)}°C`, severity: d.temperature < -35 ? 'extreme' : 'danger', icon: '🧊' });
    }
    if (d.precipitation > 20) {
      alerts.push({ city: d.city.name, type: 'Heavy Rain', value: `${d.precipitation}mm`, severity: d.precipitation > 50 ? 'extreme' : 'warning', icon: '🌧️' });
    }
    if (d.snowfall > 10) {
      alerts.push({ city: d.city.name, type: 'Heavy Snow', value: `${d.snowfall}cm`, severity: d.snowfall > 25 ? 'extreme' : 'warning', icon: '🌨️' });
    }
  }

  const severityStyle = (s: Alert['severity']) => {
    if (s === 'extreme') return 'bg-red-950/40 border-red-600/50 text-red-300';
    if (s === 'danger') return 'bg-orange-900/30 border-orange-600/40 text-orange-300';
    return 'bg-yellow-900/20 border-yellow-600/30 text-yellow-300';
  };

  const severityBadge = (s: Alert['severity']) => {
    if (s === 'extreme') return 'bg-red-700 text-red-100';
    if (s === 'danger') return 'bg-orange-700 text-orange-100';
    return 'bg-yellow-700 text-yellow-100';
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-6 text-center">
        <div className="text-green-400 text-2xl mb-2">✅</div>
        <div className="text-green-300 font-semibold">No severe weather alerts</div>
        <div className="text-gray-400 text-sm mt-1">All monitored cities show normal conditions.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-gray-400 text-sm">{alerts.length} severe weather alert{alerts.length !== 1 ? 's' : ''} detected</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {alerts.map((a, i) => (
          <div key={i} className={`rounded-xl border p-4 ${severityStyle(a.severity)}`}>
            <div className="flex items-start justify-between mb-1">
              <span className="text-xl">{a.icon}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium uppercase ${severityBadge(a.severity)}`}>
                {a.severity}
              </span>
            </div>
            <div className="text-white font-semibold">{a.city}</div>
            <div className="text-sm font-medium">{a.type}</div>
            <div className="text-xs mt-1 opacity-80">{a.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
