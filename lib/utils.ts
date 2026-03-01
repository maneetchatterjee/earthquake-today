import { USGSFeature } from './types';

export const USGS_FEEDS = {
  hour: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
  day: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
  week: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
  month: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
};

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}

export function getMagnitudeColor(mag: number): string {
  if (mag < 2) return '#22c55e';
  if (mag < 3) return '#86efac';
  if (mag < 4) return '#fbbf24';
  if (mag < 5) return '#f97316';
  if (mag < 6) return '#ef4444';
  if (mag < 7) return '#dc2626';
  return '#991b1b';
}

export function getMagnitudeCategory(mag: number): string {
  if (mag < 2) return 'Minor';
  if (mag < 3) return 'Light';
  if (mag < 4) return 'Moderate';
  if (mag < 5) return 'Intermediate';
  if (mag < 6) return 'Strong';
  if (mag < 7) return 'Major';
  return 'Great';
}

export function getDepthColor(depth: number): string {
  if (depth < 30) return '#ef4444';
  if (depth < 100) return '#f59e0b';
  if (depth < 300) return '#22c55e';
  return '#6366f1';
}

export function getDepthCategory(depth: number): string {
  if (depth < 30) return 'Shallow (0-30km)';
  if (depth < 100) return 'Intermediate (30-100km)';
  if (depth < 300) return 'Deep (100-300km)';
  return 'Very Deep (300+km)';
}

export function getMagnitudeRadius(mag: number): number {
  return Math.max(3, Math.pow(2, mag) * 0.8);
}

export function calculateEnergy(mag: number): number {
  // Gutenberg-Richter formula: log10(E) = 1.5*M + 4.8, E in Joules
  return Math.pow(10, 1.5 * mag + 4.8);
}

export function formatEnergy(joules: number): string {
  const tonsOfTNT = joules / 4.184e9;
  if (tonsOfTNT < 1000) return `${tonsOfTNT.toFixed(1)} tons TNT`;
  if (tonsOfTNT < 1e6) return `${(tonsOfTNT / 1000).toFixed(1)}K tons TNT`;
  if (tonsOfTNT < 1e9) return `${(tonsOfTNT / 1e6).toFixed(2)}M tons TNT`;
  return `${(tonsOfTNT / 1e9).toFixed(2)}B tons TNT`;
}

export function getTotalEnergy(features: USGSFeature[]): number {
  return features.reduce((sum, f) => sum + calculateEnergy(f.properties.mag), 0);
}

export function getMagnitudeBuckets(features: USGSFeature[]): Record<string, number> {
  const buckets: Record<string, number> = {
    'M 0-1': 0,
    'M 1-2': 0,
    'M 2-3': 0,
    'M 3-4': 0,
    'M 4-5': 0,
    'M 5-6': 0,
    'M 6-7': 0,
    'M 7+': 0,
  };
  features.forEach((f) => {
    const mag = f.properties.mag;
    if (mag < 1) buckets['M 0-1']++;
    else if (mag < 2) buckets['M 1-2']++;
    else if (mag < 3) buckets['M 2-3']++;
    else if (mag < 4) buckets['M 3-4']++;
    else if (mag < 5) buckets['M 4-5']++;
    else if (mag < 6) buckets['M 5-6']++;
    else if (mag < 7) buckets['M 6-7']++;
    else buckets['M 7+']++;
  });
  return buckets;
}

export function getHourlyBreakdown(features: USGSFeature[]): { hour: string; count: number }[] {
  const now = Date.now();
  const hours: Record<number, number> = {};
  for (let i = 23; i >= 0; i--) {
    hours[i] = 0;
  }
  features.forEach((f) => {
    const hoursAgo = Math.floor((now - f.properties.time) / 3600000);
    if (hoursAgo < 24) {
      hours[hoursAgo] = (hours[hoursAgo] || 0) + 1;
    }
  });
  return Object.entries(hours)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([h, count]) => ({
      hour: `${h}h ago`,
      count,
    }));
}

export function getDepthBuckets(features: USGSFeature[]): { range: string; count: number }[] {
  const buckets = [
    { range: '0-10km', min: 0, max: 10, count: 0 },
    { range: '10-30km', min: 10, max: 30, count: 0 },
    { range: '30-70km', min: 30, max: 70, count: 0 },
    { range: '70-150km', min: 70, max: 150, count: 0 },
    { range: '150-300km', min: 150, max: 300, count: 0 },
    { range: '300km+', min: 300, max: Infinity, count: 0 },
  ];
  features.forEach((f) => {
    const depth = f.geometry.coordinates[2];
    const bucket = buckets.find((b) => depth >= b.min && depth < b.max);
    if (bucket) bucket.count++;
  });
  return buckets.map(({ range, count }) => ({ range, count }));
}

export function getUniqueRegions(features: USGSFeature[]): number {
  const regions = new Set<string>();
  features.forEach((f) => {
    const place = f.properties.place;
    const match = place.match(/of\s+(.+)$/i);
    if (match) regions.add(match[1].trim());
    else regions.add(place);
  });
  return regions.size;
}
