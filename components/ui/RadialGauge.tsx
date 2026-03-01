'use client';

import GaugeComponent from 'react-gauge-component';

interface RadialGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  unit?: string;
  colorScheme?: Array<{ limit?: number; color: string }>;
}

export default function RadialGauge({ value, min = 0, max = 100, label, unit = '', colorScheme }: RadialGaugeProps) {
  const defaultColors = [
    { limit: max * 0.33, color: '#00FF88' },
    { limit: max * 0.66, color: '#FFB800' },
    { color: '#FF3366' },
  ];

  return (
    <div className="flex flex-col items-center">
      <GaugeComponent
        value={value}
        minValue={min}
        maxValue={max}
        arc={{
          subArcs: colorScheme || defaultColors,
          padding: 0.02,
          width: 0.3,
        }}
        pointer={{ type: 'needle', color: '#00FFFF', animationDuration: 3000, animationDelay: 100 }}
        labels={{
          valueLabel: {
            formatTextValue: (v: number) => `${v}${unit}`,
            style: { fontFamily: 'JetBrains Mono, monospace', fill: '#00FFFF', fontSize: '28px' },
          },
          tickLabels: { type: 'outer' as const, hideMinMax: true },
        }}
        style={{ width: '100%', maxWidth: '220px' }}
      />
      <span className="text-sm text-slate-400 mt-1 font-medium">{label}</span>
    </div>
  );
}
