import { USGSFeature } from './types';

export interface SeismicRegion {
  id: string;
  name: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  emoji: string;
}

export const SEISMIC_REGIONS: SeismicRegion[] = [
  { id: 'global', name: 'Global', minLat: -90, maxLat: 90, minLng: -180, maxLng: 180, emoji: '🌐' },
  { id: 'japan', name: 'Japan & Surrounding', minLat: 25, maxLat: 50, minLng: 125, maxLng: 150, emoji: '🗾' },
  { id: 'alaska', name: 'Alaska & Aleutians', minLat: 50, maxLat: 72, minLng: -180, maxLng: -130, emoji: '🧊' },
  { id: 'california', name: 'California & Nevada', minLat: 32, maxLat: 42, minLng: -125, maxLng: -113, emoji: '🌉' },
  { id: 'pacific_nw', name: 'Pacific Northwest', minLat: 42, maxLat: 50, minLng: -125, maxLng: -115, emoji: '🌲' },
  { id: 'chile', name: 'Chile & Peru', minLat: -55, maxLat: -5, minLng: -80, maxLng: -65, emoji: '🏔️' },
  { id: 'indonesia', name: 'Indonesia & SE Asia', minLat: -10, maxLat: 10, minLng: 95, maxLng: 141, emoji: '🌴' },
  { id: 'mediterranean', name: 'Mediterranean', minLat: 28, maxLat: 48, minLng: -10, maxLng: 45, emoji: '🏛️' },
  { id: 'middle_east', name: 'Middle East & Turkey', minLat: 20, maxLat: 42, minLng: 25, maxLng: 65, emoji: '🕌' },
  { id: 'new_zealand', name: 'New Zealand & Tonga', minLat: -50, maxLat: -15, minLng: 165, maxLng: 180, emoji: '🥝' },
  { id: 'caribbean', name: 'Caribbean & Central America', minLat: 7, maxLat: 24, minLng: -92, maxLng: -60, emoji: '🌊' },
];

export function filterByRegion(features: USGSFeature[], regionId: string): USGSFeature[] {
  if (regionId === 'global') return features;
  const region = SEISMIC_REGIONS.find(r => r.id === regionId);
  if (!region) return features;
  return features.filter(f => {
    const [lng, lat] = f.geometry.coordinates;
    return lat >= region.minLat && lat <= region.maxLat && lng >= region.minLng && lng <= region.maxLng;
  });
}
