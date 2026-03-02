'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: string;
  color?: string;
  animate?: boolean;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

export default function CounterCard({
  title,
  value,
  subtitle,
  icon,
  color = 'orange',
  animate = false,
}: CounterCardProps) {
  const colorClasses: Record<string, string> = {
    orange: 'text-orange-400 border-orange-400/20 bg-orange-400/5',
    red: 'text-red-400 border-red-400/20 bg-red-400/5',
    blue: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
    green: 'text-green-400 border-green-400/20 bg-green-400/5',
    yellow: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
    purple: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
    cyan: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
    pink: 'text-pink-400 border-pink-400/20 bg-pink-400/5',
  };

  const cls = colorClasses[color] || colorClasses.orange;

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-1 ${cls}`}>
      <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wider">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-3xl font-bold text-white mt-1" role="status" aria-live="polite">
        {animate && typeof value === 'number' ? (
          <AnimatedNumber value={value} />
        ) : (
          value
        )}
      </div>
      {subtitle && <div className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</div>}
    </div>
  );
}
