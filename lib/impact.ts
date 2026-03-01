import { USGSFeature } from './types';

// Impact score formula weights
const MAX_MAGNITUDE = 9;        // maximum possible earthquake magnitude
const MAGNITUDE_WEIGHT = 40;    // contribution of magnitude to score (0-40)
const DEPTH_WEIGHT = 30;        // contribution of depth to score (0-30, shallow = more impact)
const MAX_DEPTH_THRESHOLD = 700; // depth (km) at which impact contribution reaches 0
const SIG_WEIGHT = 30;          // contribution of USGS significance rating (0-30)
const MAX_SIG = 1000;           // maximum USGS significance rating

export function calculateImpactScore(mag: number, depth: number, sig: number): number {
  const score =
    (mag / MAX_MAGNITUDE * MAGNITUDE_WEIGHT) +
    ((1 - Math.min(depth, MAX_DEPTH_THRESHOLD) / MAX_DEPTH_THRESHOLD) * DEPTH_WEIGHT) +
    (sig / MAX_SIG * SIG_WEIGHT);
  return Math.max(0, Math.min(100, score));
}

export function getImpactColor(score: number): string {
  if (score < 25) return '#22c55e';
  if (score < 50) return '#eab308';
  if (score < 75) return '#f97316';
  return '#ef4444';
}

export function getImpactLabel(score: number): string {
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Critical';
}
