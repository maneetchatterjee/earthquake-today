'use client';

import { useState, useEffect } from 'react';

interface LocalWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  precipitation: number;
}

interface LocalEarthquake {
  id: string;
  place: string;
  magnitude: number;
  distance: number;
  time: number;
}

function getWeatherDescription(code: number): string {
  if (code === 0) return '☀️ Clear sky';
  if (code <= 3) return '🌤️ Partly cloudy';
  if (code <= 9) return '🌫️ Foggy';
  if (code <= 19) return '🌦️ Drizzle';
  if (code <= 29) return '🌧️ Rain';
  if (code <= 39) return '❄️ Snow';
  if (code <= 49) return '🌫️ Fog';
  if (code <= 59) return '🌦️ Drizzle';
  if (code <= 69) return '🌧️ Rain';
  if (code <= 79) return '❄️ Snow';
  if (code <= 84) return '🌧️ Rain showers';
  if (code <= 94) return '⛈️ Thunderstorm';
  return '⛈️ Severe thunderstorm';
}

export default function MyLocationPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [weather, setWeather] = useState<LocalWeather | null>(null);
  const [earthquakes, setEarthquakes] = useState<LocalEarthquake[]>([]);
  const [aqi, setAqi] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        () => {
          setError('Location access denied. Please enable location services.');
          setLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!location) return;
    const { lat, lng } = location;

    // Fetch weather
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation&timezone=auto`)
      .then(r => r.json())
      .then(d => {
        const c = d.current;
        setWeather({
          temperature: c.temperature_2m,
          humidity: c.relative_humidity_2m,
          windSpeed: c.wind_speed_10m,
          weatherCode: c.weather_code,
          precipitation: c.precipitation,
        });
      })
      .catch((e) => console.warn('Could not fetch local weather:', e));

    // Fetch AQI
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi&timezone=auto`)
      .then(r => r.json())
      .then(d => setAqi(d.current?.us_aqi ?? null))
      .catch((e) => console.warn('Could not fetch local AQI:', e));

    // Fetch nearby earthquakes
    const minLat = lat - 5, maxLat = lat + 5, minLng = lng - 5, maxLng = lng + 5;
    fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=${minLat}&maxlatitude=${maxLat}&minlongitude=${minLng}&maxlongitude=${maxLng}&minmagnitude=2&orderby=time&limit=5`)
      .then(r => r.json())
      .then(d => {
        const features = d.features || [];
        setEarthquakes(features.map((f: { id: string; properties: { place: string; mag: number; time: number }; geometry: { coordinates: number[] } }) => ({
          id: f.id,
          place: f.properties.place,
          magnitude: f.properties.mag,
          distance: Math.sqrt(Math.pow((f.geometry.coordinates[1] - lat) * 111, 2) + Math.pow((f.geometry.coordinates[0] - lng) * 111 * Math.cos(lat * Math.PI / 180), 2)),
          time: f.properties.time,
        })));
      })
      .catch((e) => console.warn('Could not fetch nearby earthquakes:', e));

    // Reverse geocode
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(r => r.json())
      .then(d => setLocationName(d.display_name?.split(',').slice(0, 3).join(', ') || ''))
      .catch((e) => console.warn('Could not reverse geocode location:', e));
  }, [location]);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">📍 My Location</h1>

        {loading && (
          <div className="text-slate-400 animate-pulse">Getting your location...</div>
        )}

        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-xl p-4 text-red-300">⚠️ {error}</div>
        )}

        {location && (
          <>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-xl mb-2">📍 Your Location</h2>
              {locationName && <div className="text-slate-300 mb-2">{locationName}</div>}
              <div className="text-slate-400 font-mono text-sm">{location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°</div>
            </div>

            {weather && (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-semibold text-xl mb-4">🌡️ Local Weather</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs">Condition</div>
                    <div className="text-white font-medium mt-1">{getWeatherDescription(weather.weatherCode)}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs">Temperature</div>
                    <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{weather.temperature}°C</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs">Humidity</div>
                    <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{weather.humidity}%</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs">Wind</div>
                    <div className="text-2xl font-bold text-green-400 font-mono mt-1">{weather.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
            )}

            {aqi !== null && (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-semibold text-xl mb-4">💨 Local Air Quality</h2>
                <div className="text-5xl font-bold font-mono" style={{
                  color: aqi <= 50 ? '#00FF88' : aqi <= 100 ? '#FFB800' : aqi <= 150 ? '#FF8800' : '#FF3366'
                }}>{aqi}</div>
                <div className="text-slate-400 mt-1">
                  {aqi <= 50 ? '✅ Good' : aqi <= 100 ? '⚠️ Moderate' : aqi <= 150 ? '⚠️ Unhealthy for Sensitive Groups' : '❌ Unhealthy'}
                </div>
              </div>
            )}

            {earthquakes.length > 0 && (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-semibold text-xl mb-4">🌋 Nearby Earthquakes (M2.0+)</h2>
                <div className="space-y-2">
                  {earthquakes.map((eq) => (
                    <div key={eq.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-3">
                      <div className={`text-xl font-bold font-mono ${eq.magnitude >= 5 ? 'text-red-400' : eq.magnitude >= 3 ? 'text-amber-400' : 'text-green-400'}`}>
                        M{eq.magnitude.toFixed(1)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm">{eq.place}</div>
                        <div className="text-slate-400 text-xs">{new Date(eq.time).toLocaleString()}</div>
                      </div>
                      <div className="text-slate-400 text-sm font-mono">{eq.distance.toFixed(0)} km</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!location && !loading && !error && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📍</div>
            <div className="text-white text-xl mb-2">Enable Location Access</div>
            <div className="text-slate-400">Click below to share your location for personalized Earth Monitor data</div>
          </div>
        )}
      </main>
    </div>
  );
}
