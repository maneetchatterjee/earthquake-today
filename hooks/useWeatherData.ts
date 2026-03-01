'use client';
import { useState, useEffect, useCallback } from 'react';
import { CITIES } from '@/lib/cities';
import { WeatherData, City } from '@/lib/types';

const REFRESH_INTERVAL = 300000;

async function fetchCityWeather(city: City): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;
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
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const results = await Promise.all(CITIES.map(fetchCityWeather));
    setWeatherData(results);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { weatherData, loading, lastUpdated };
}
