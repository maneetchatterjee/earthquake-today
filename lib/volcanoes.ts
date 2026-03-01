import { USGSFeature } from './types';

export interface Volcano {
  name: string;
  lat: number;
  lng: number;
  country: string;
  type: string;
  lastEruption: number;
  elevation: number;
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearbyVolcanoes(
  lat: number, lng: number, radiusKm: number, volcanoes: Volcano[]
): Array<Volcano & { distance: number }> {
  return volcanoes
    .map(v => ({ ...v, distance: haversineDistance(lat, lng, v.lat, v.lng) }))
    .filter(v => v.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

export function getEarthquakeVolcanoAlerts(
  features: USGSFeature[],
  volcanoes: Volcano[]
): Array<{ quake: USGSFeature; nearbyVolcanoes: Array<Volcano & { distance: number }> }> {
  return features
    .filter(f => f.properties.mag >= 4)
    .map(f => {
      const [lng, lat] = f.geometry.coordinates;
      const nearby = findNearbyVolcanoes(lat, lng, 100, volcanoes);
      return { quake: f, nearbyVolcanoes: nearby };
    })
    .filter(item => item.nearbyVolcanoes.length > 0);
}
