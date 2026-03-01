'use client';
import { useState, useEffect, useCallback } from 'react';

interface ISSPosition {
  lat: number;
  lng: number;
}

interface Astronaut {
  name: string;
  craft: string;
}

interface ISSData {
  position: ISSPosition;
  peopleInSpace: number;
  astronauts: Astronaut[];
  loading: boolean;
  error: string | null;
}

const REFRESH_INTERVAL = 10000; // 10 seconds

export function useISSData(): ISSData {
  const [position, setPosition] = useState<ISSPosition>({ lat: 0, lng: 0 });
  const [peopleInSpace, setPeopleInSpace] = useState(0);
  const [astronauts, setAstronauts] = useState<Astronaut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosition = useCallback(async () => {
    try {
      const res = await fetch('https://api.open-notify.org/iss-now.json');
      const data = await res.json();
      if (data.iss_position) {
        setPosition({
          lat: parseFloat(data.iss_position.latitude),
          lng: parseFloat(data.iss_position.longitude),
        });
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch ISS position');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAstronauts = useCallback(async () => {
    try {
      const res = await fetch('https://api.open-notify.org/astros.json');
      const data = await res.json();
      if (data.people) {
        setAstronauts(data.people);
        setPeopleInSpace(data.number || data.people.length);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchPosition();
    fetchAstronauts();
    const posInterval = setInterval(fetchPosition, REFRESH_INTERVAL);
    const astroInterval = setInterval(fetchAstronauts, 60000);
    return () => {
      clearInterval(posInterval);
      clearInterval(astroInterval);
    };
  }, [fetchPosition, fetchAstronauts]);

  return { position, peopleInSpace, astronauts, loading, error };
}
