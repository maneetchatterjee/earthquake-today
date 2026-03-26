'use client';

interface FeedItem {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  lastUpdated: string;
}

interface FeedStatusProps {
  feeds: FeedItem[];
}

const STATUS_STYLES: Record<FeedItem['status'], { dot: string; badge: string; label: string }> = {
  online:   { dot: 'bg-green-400',  badge: 'bg-green-400/10 border-green-400/30 text-green-400',  label: 'Online' },
  degraded: { dot: 'bg-yellow-400', badge: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400', label: 'Degraded' },
  offline:  { dot: 'bg-red-400',    badge: 'bg-red-400/10 border-red-400/30 text-red-400',    label: 'Offline' },
};

export default function FeedStatus({ feeds }: FeedStatusProps) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
        Data Feeds
      </h3>
      <ul className="space-y-2">
        {feeds.map((feed) => {
          const s = STATUS_STYLES[feed.status];
          return (
            <li key={feed.name} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm text-gray-200 truncate">
                <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                {feed.name}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium flex-shrink-0 ${s.badge}`}>
                {s.label}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0 hidden sm:block">
                {feed.lastUpdated}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
