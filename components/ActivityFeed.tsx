'use client';

import { useState, useEffect } from 'react';

interface ActivityEvent {
  id: string;
  type: 'earthquake' | 'weather' | 'fire' | 'space' | 'general';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
}

interface ActivityFeedProps {
  events?: ActivityEvent[];
  maxItems?: number;
}

const TYPE_ICONS: Record<ActivityEvent['type'], string> = {
  earthquake: '🌋',
  weather: '🌡️',
  fire: '🔥',
  space: '🌌',
  general: '📡',
};

const SEVERITY_COLORS: Record<ActivityEvent['severity'], string> = {
  info: 'text-green-400',
  warning: 'text-amber-400',
  critical: 'text-red-400',
};

export default function ActivityFeed({ events = [], maxItems = 20 }: ActivityFeedProps) {
  const [items, setItems] = useState<ActivityEvent[]>(events.slice(0, maxItems));

  useEffect(() => {
    setItems(events.slice(0, maxItems));
  }, [events, maxItems]);

  if (items.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="font-mono text-green-400 text-xs mb-3">{'>'} EARTH MONITOR ACTIVITY FEED</div>
        <div className="text-slate-500 text-sm font-mono">No recent events...</div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="font-mono text-green-400 text-xs mb-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-live-pulse" />
        {'>'} EARTH MONITOR ACTIVITY FEED
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs">
        {items.map((event) => (
          <div key={event.id} className="flex items-start gap-2">
            <span className="text-slate-500 flex-shrink-0 w-20">
              {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="flex-shrink-0">{TYPE_ICONS[event.type]}</span>
            <span className={SEVERITY_COLORS[event.severity]}>{event.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
