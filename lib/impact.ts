import { USGSFeature } from './types';

export function calculateImpactScore(mag: number, depth: number, sig: number): number {
  const score = (mag / 9 * 40) + ((1 - Math.min(depth, 700) / 700) * 30) + (sig / 1000 * 30);
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
