import { USGSFeature } from './types';
import { formatTimeAgo, formatEnergy, getTotalEnergy } from './utils';

function getMostActiveRegion(features: USGSFeature[]): { name: string; count: number } {
  const regions: Record<string, number> = {};
  features.forEach(f => {
    const place = f.properties.place;
    const match = place.match(/of\s+(.+)$/i);
    const region = match ? match[1].trim() : place;
    regions[region] = (regions[region] || 0) + 1;
  });
  const sorted = Object.entries(regions).sort(([, a], [, b]) => b - a);
  if (!sorted.length) return { name: 'Unknown', count: 0 };
  return { name: sorted[0][0], count: sorted[0][1] };
}

export function generateSummary(
  day: USGSFeature[],
  week: USGSFeature[],
  month: USGSFeature[]
): string {
  const total = day.length;
  const largest = [...day].sort((a, b) => b.properties.mag - a.properties.mag)[0];
  const above4 = day.filter(f => f.properties.mag >= 4).length;
  const above5 = day.filter(f => f.properties.mag >= 5).length;
  const tsunamiCount = day.filter(f => f.properties.tsunami === 1).length;
  const dailyAvg = Math.round(month.length / 30);
  const activeRegion = getMostActiveRegion(day);
  const energy = getTotalEnergy(day);

  let trend = 'at';
  if (total > dailyAvg * 1.1) trend = 'above';
  else if (total < dailyAvg * 0.9) trend = 'below';

  const tsunamiText = tsunamiCount > 0
    ? `⚠️ ${tsunamiCount} tsunami alert${tsunamiCount > 1 ? 's' : ''} are active.`
    : '✅ No active tsunami alerts.';

  if (!largest) return 'No earthquake data available for today.';

  return `Today, ${total} earthquakes have been recorded worldwide. The strongest was a magnitude M${largest.properties.mag.toFixed(1)} near ${largest.properties.place} ${formatTimeAgo(largest.properties.time)}. ${above4} earthquakes exceeded M4.0 and ${above5} exceeded M5.0. Seismic activity is ${trend === 'at' ? 'at' : trend} the daily average of ~${dailyAvg}. The most active region today is ${activeRegion.name} with ${activeRegion.count} events. ${tsunamiText} Total energy released: ${formatEnergy(energy)}.`;
}
