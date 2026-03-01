'use client';
import { useState, useEffect, useCallback } from 'react';

interface Asteroid {
  id: string;
  name: string;
  diameter_min_km: number;
  diameter_max_km: number;
  velocity_km_s: number;
  miss_distance_km: number;
  close_approach_date: string;
  is_potentially_hazardous: boolean;
}

interface AsteroidData {
  asteroids: Asteroid[];
  count: number;
  closestApproach: Asteroid | null;
  loading: boolean;
  error: string | null;
}

const NASA_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

export function useAsteroidData(): AsteroidData {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [count, setCount] = useState(0);
  const [closestApproach, setClosestApproach] = useState<Asteroid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsteroids = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const end = new Date(today);
      end.setDate(end.getDate() + 3);
      const startStr = today.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      const res = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startStr}&end_date=${endStr}&api_key=${NASA_KEY}`
      );
      const data = await res.json();

      const allAsteroids: Asteroid[] = [];
      Object.values(data.near_earth_objects || {}).forEach((dayList: unknown) => {
        (dayList as Record<string, unknown>[]).forEach((neo: Record<string, unknown>) => {
          const ca = (neo.close_approach_data as Record<string, unknown>[])[0];
          allAsteroids.push({
            id: neo.id as string,
            name: neo.name as string,
            diameter_min_km: ((neo.estimated_diameter as Record<string, unknown>).kilometers as Record<string, number>).estimated_diameter_min,
            diameter_max_km: ((neo.estimated_diameter as Record<string, unknown>).kilometers as Record<string, number>).estimated_diameter_max,
            velocity_km_s: parseFloat((ca.relative_velocity as Record<string, string>).kilometers_per_second),
            miss_distance_km: parseFloat((ca.miss_distance as Record<string, string>).kilometers),
            close_approach_date: ca.close_approach_date as string,
            is_potentially_hazardous: neo.is_potentially_hazardous_asteroid as boolean,
          });
        });
      });

      allAsteroids.sort((a, b) => a.miss_distance_km - b.miss_distance_km);
      setAsteroids(allAsteroids);
      setCount(data.element_count || allAsteroids.length);
      setClosestApproach(allAsteroids[0] || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch asteroid data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAsteroids();
    const interval = setInterval(fetchAsteroids, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, [fetchAsteroids]);

  return { asteroids, count, closestApproach, loading, error };
}
