'use client';
import { useState, useEffect, useCallback } from 'react';
import { CITIES } from '@/lib/cities';
import { WeatherData, City } from '@/lib/types';

const REFRESH_INTERVAL = 300000;

interface WeatherState {
  weatherData: WeatherData[];
  loading: boolean;
  lastUpdated: Date | null;
}

async function fetchCityWeather(city: City): Promise<WeatherData> {
  try {
    const url = `/api/weather?lat=${city.lat}&lng=${city.lng}`;
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current;
    return {
      city,
      temperature: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      windGusts: c.wind_gusts_10m,
      precipitation: c.precipitation,
      rain: c.rain,
      snowfall: c.snowfall,
      weatherCode: c.weather_code,
      cloudCover: c.cloud_cover,
      pressure: c.pressure_msl,
      loading: false,
      error: null,
    };
  } catch (err) {
    return {
      city,
      temperature: 0,
      feelsLike: 0,
      humidity: 0,
      windSpeed: 0,
      windDirection: 0,
      windGusts: 0,
      precipitation: 0,
      rain: 0,
      snowfall: 0,
      weatherCode: 0,
      cloudCover: 0,
      pressure: 0,
      loading: false,
      error: err instanceof Error ? err.message : 'Failed to fetch weather data',
    };
  }
}

export function useWeatherData() {
  const [state, setState] = useState<WeatherState>({
    weatherData: [],
    loading: true,
    lastUpdated: null,
  });

  const fetchAll = useCallback(async () => {
    try {
      const results = await Promise.all(CITIES.map(fetchCityWeather));
      setState({ weatherData: results, loading: false, lastUpdated: new Date() });
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return state;
}
