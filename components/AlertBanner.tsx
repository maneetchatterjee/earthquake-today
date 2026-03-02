'use client';

import { Alert } from '@/lib/alertEngine';

interface AlertBannerProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

const severityClasses: Record<Alert['severity'], string> = {
  red: 'bg-red-900/80 border-red-700 text-red-100',
  orange: 'bg-orange-900/80 border-orange-700 text-orange-100',
  yellow: 'bg-yellow-900/80 border-yellow-700 text-yellow-100',
};

const severityIcons: Record<Alert['type'], string> = {
  earthquake: '🌍',
  aqi: '💨',
  wildfire: '🔥',
  uv: '☀️',
};

export default function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  if (!alerts.length) return null;

  return (
    <div className="space-y-2 mb-4" role="alert" aria-live="assertive">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start justify-between px-4 py-3 rounded-lg border ${severityClasses[alert.severity]}`}
        >
          <div className="flex items-center gap-2">
            <span>{severityIcons[alert.type]}</span>
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
          <button
            onClick={() => onDismiss(alert.id)}
            className="ml-4 text-current opacity-70 hover:opacity-100 text-lg leading-none shrink-0"
            aria-label="Dismiss alert"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
