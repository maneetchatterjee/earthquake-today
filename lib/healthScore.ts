interface HealthScoreInput {
  earthquakeCount?: number;
  maxMagnitude?: number;
  avgAqi?: number;
  avgTemp?: number;
  fireCount?: number;
  kpIndex?: number;
  carbonIntensity?: number;
}

export function calculateHealthScore(input: HealthScoreInput): number {
  let score = 100;

  // Earthquake penalty
  if (input.earthquakeCount !== undefined) {
    score -= Math.min(20, input.earthquakeCount * 0.05);
  }
  if (input.maxMagnitude !== undefined && input.maxMagnitude > 5) {
    score -= Math.min(10, (input.maxMagnitude - 5) * 3);
  }

  // AQI penalty
  if (input.avgAqi !== undefined) {
    if (input.avgAqi > 150) score -= 20;
    else if (input.avgAqi > 100) score -= 10;
    else if (input.avgAqi > 50) score -= 5;
  }

  // Temperature anomaly penalty
  if (input.avgTemp !== undefined) {
    const anomaly = Math.abs(input.avgTemp - 15);
    score -= Math.min(10, anomaly * 0.3);
  }

  // Fire penalty
  if (input.fireCount !== undefined) {
    score -= Math.min(15, input.fireCount * 0.001);
  }

  // Geomagnetic storm penalty
  if (input.kpIndex !== undefined && input.kpIndex > 5) {
    score -= Math.min(10, (input.kpIndex - 5) * 2);
  }

  // Carbon intensity penalty
  if (input.carbonIntensity !== undefined) {
    if (input.carbonIntensity > 200) score -= 10;
    else if (input.carbonIntensity > 100) score -= 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
