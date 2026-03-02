export interface AnomalyResult {
  index: number;
  value: number;
  zScore: number;
  isAnomaly: boolean;
}

export function detectAnomalies(values: number[], windowSize = 10): AnomalyResult[] {
  return values.map((value, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const window = values.slice(start, index + 1);

    const mean = window.reduce((s, v) => s + v, 0) / window.length;
    const variance = window.reduce((s, v) => s + (v - mean) ** 2, 0) / window.length;
    const std = Math.sqrt(variance);

    const zScore = std > 0 ? (value - mean) / std : 0;

    return { index, value, zScore, isAnomaly: Math.abs(zScore) > 2 };
  });
}
