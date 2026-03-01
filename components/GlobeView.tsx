'use client';

import { useEffect, useRef, useState } from 'react';
import { USGSFeature } from '@/lib/types';
import { getDepthColor } from '@/lib/utils';

interface GlobeViewProps {
  features: USGSFeature[];
}

export default function GlobeView({ features }: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let globe: any;

    import('globe.gl').then(mod => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Globe = mod.default as any;
      globe = Globe()(containerRef.current!);
      globeRef.current = globe;

      const isDark = document.documentElement.classList.contains('dark');
      globe
        .globeImageUrl(
          isDark
            ? '//unpkg.com/three-globe/example/img/earth-night.jpg'
            : '//unpkg.com/three-globe/example/img/earth-day.jpg'
        )
        .atmosphereColor(isDark ? '#1a3a6b' : '#87ceeb')
        .atmosphereAltitude(0.15)
        .backgroundColor('rgba(0,0,0,0)')
        .width(containerRef.current!.clientWidth)
        .height(480);

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;

      const container = containerRef.current!;
      container.addEventListener('mouseenter', () => { globe.controls().autoRotate = false; });
      container.addEventListener('mouseleave', () => { globe.controls().autoRotate = true; });

      setReady(true);
    }).catch(() => {});

    return () => {
      if (globe && globe._destructor) globe._destructor();
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current || !ready) return;
    const points = features
      .filter(f => f.geometry.coordinates[0] != null && f.geometry.coordinates[1] != null)
      .map(f => ({
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        altitude: (f.properties.mag / 10) * 0.5,
        radius: Math.max(0.3, f.properties.mag * 0.15),
        color: getDepthColor(f.geometry.coordinates[2]),
        label: `M${f.properties.mag.toFixed(1)} - ${f.properties.place}`,
      }));
    globeRef.current.pointsData(points)
      .pointAltitude('altitude')
      .pointRadius('radius')
      .pointColor('color')
      .pointLabel('label');
  }, [features, ready]);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">🌐 3D Globe View</h2>
        <p className="text-gray-400 text-sm mt-0.5">Point altitude = magnitude · Color = depth · Hover to pause rotation</p>
      </div>
      <div ref={containerRef} className="w-full bg-gray-950" style={{ height: '480px' }} />
    </div>
  );
}
