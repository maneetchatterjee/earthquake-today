'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

interface HeatmapProps {
  earthquakes?: { lat: number; lng: number; mag: number }[];
  wildfires?: { lat: number; lng: number }[];
  aqi?: { lat: number; lng: number; value: number }[];
}

function RiskHeatmapInner({ earthquakes = [], wildfires = [], aqi = [] }: HeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let map: import('leaflet').Map;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let heatLayer: any;

    (async () => {
      const L = (await import('leaflet')).default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const heat = await import('leaflet.heat' as any);
      (heat.default ?? heat)(L);

      map = L.map(mapRef.current!, { zoomControl: true }).setView([20, 0], 2);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
      }).addTo(map);

      const points: [number, number, number][] = [
        ...earthquakes.map((e) => [e.lat, e.lng, Math.min(1, e.mag / 8)] as [number, number, number]),
        ...wildfires.map((w) => [w.lat, w.lng, 0.6] as [number, number, number]),
        ...aqi.map((a) => [a.lat, a.lng, Math.min(1, a.value / 300)] as [number, number, number]),
      ];

      const L_any = L as unknown as { heatLayer: (pts: unknown, opts: unknown) => { addTo: (m: unknown) => void } };
      heatLayer = L_any.heatLayer(points, { radius: 25, blur: 20, maxZoom: 10 });
      heatLayer.addTo(map);
    })();

    return () => {
      map?.remove();
    };
  }, [earthquakes, wildfires, aqi]);

  return <div ref={mapRef} className="w-full h-96 rounded-xl overflow-hidden" />;
}

// Dynamic import to avoid SSR issues with Leaflet
const RiskHeatmap = dynamic(() => Promise.resolve(RiskHeatmapInner), { ssr: false });
export default RiskHeatmap;
