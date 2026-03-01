'use client';

import { USGSFeature } from '@/lib/types';
import { calculateImpactScore, getImpactColor, getImpactLabel } from '@/lib/impact';

interface ImpactScoreProps {
  feature: USGSFeature;
}

export default function ImpactScore({ feature }: ImpactScoreProps) {
  const { mag, sig } = feature.properties;
  const depth = feature.geometry.coordinates[2];
  const score = calculateImpactScore(mag, depth, sig);
  const color = getImpactColor(score);
  const label = getImpactLabel(score);

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
    >
      {score.toFixed(0)} · {label}
    </span>
  );
}
