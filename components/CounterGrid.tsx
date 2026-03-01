'use client';

import CounterCard from './CounterCard';
import { USGSFeature } from '@/lib/types';
import { formatTimeAgo } from '@/lib/utils';

interface CounterGridProps {
  day: USGSFeature[];
  hour: USGSFeature[];
  week: USGSFeature[];
  month: USGSFeature[];
}

export default function CounterGrid({ day, hour, week, month }: CounterGridProps) {
  const largestToday = day.length > 0
    ? day.reduce((max, f) => (f.properties.mag > max.properties.mag ? f : max), day[0])
    : null;

  const mostRecent = day.length > 0
    ? day.reduce((latest, f) => (f.properties.time > latest.properties.time ? f : latest), day[0])
    : null;

  const tsunamiAlerts = day.filter((f) => f.properties.tsunami === 1).length;

  const avgMag = day.length > 0
    ? day.reduce((sum, f) => sum + f.properties.mag, 0) / day.length
    : 0;

  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <CounterCard
        title="Earthquakes Today"
        value={day.length}
        icon="🌍"
        color="orange"
        animate
      />
      <CounterCard
        title="This Hour"
        value={hour.length}
        icon="⏰"
        color="yellow"
        animate
      />
      <CounterCard
        title="This Week"
        value={week.length}
        icon="📅"
        color="blue"
        animate
      />
      <CounterCard
        title="This Month"
        value={month.length}
        icon="📆"
        color="purple"
        animate
      />
      <CounterCard
        title="Largest Today"
        value={largestToday ? `M${largestToday.properties.mag.toFixed(1)}` : 'N/A'}
        subtitle={largestToday?.properties.place}
        icon="💥"
        color="red"
      />
      <CounterCard
        title="Most Recent"
        value={mostRecent ? `M${mostRecent.properties.mag.toFixed(1)}` : 'N/A'}
        subtitle={mostRecent ? `${mostRecent.properties.place} · ${formatTimeAgo(mostRecent.properties.time)}` : undefined}
        icon="🕐"
        color="cyan"
      />
      <CounterCard
        title="Tsunami Alerts"
        value={tsunamiAlerts}
        icon="🌊"
        color="blue"
        animate
      />
      <CounterCard
        title="Avg Magnitude"
        value={avgMag.toFixed(2)}
        icon="📊"
        color="green"
      />
    </section>
  );
}
