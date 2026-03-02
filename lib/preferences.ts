'use client';

import { useState, useCallback } from 'react';

export interface Preferences {
  units: 'metric' | 'imperial';
  defaultLat: number;
  defaultLng: number;
  visiblePanels: string[];
  refreshInterval: number;
  alertThresholds: {
    earthquakeMag: number;
    aqi: number;
    uv: number;
    wildfires: number;
  };
}

export const DEFAULT_PREFERENCES: Preferences = {
  units: 'metric',
  defaultLat: 37.7749,
  defaultLng: -122.4194,
  visiblePanels: ['earthquakes', 'weather', 'air-quality', 'wildfires', 'oceans'],
  refreshInterval: 60,
  alertThresholds: {
    earthquakeMag: 6.0,
    aqi: 150,
    uv: 8,
    wildfires: 50,
  },
};

const STORAGE_KEY = 'earth-monitor-preferences';

export function getPreferences(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setPreferences(p: Partial<Preferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getPreferences();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...p }));
  } catch {
    // ignore
  }
}

export function resetPreferences(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function usePreferences(): [Preferences, (p: Partial<Preferences>) => void, () => void] {
  const [prefs, setPrefsState] = useState<Preferences>(() => getPreferences());

  const update = useCallback((p: Partial<Preferences>) => {
    setPreferences(p);
    setPrefsState(getPreferences());
  }, []);

  const reset = useCallback(() => {
    resetPreferences();
    setPrefsState(DEFAULT_PREFERENCES);
  }, []);

  return [prefs, update, reset];
}
