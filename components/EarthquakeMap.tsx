'use client';

import { useEffect, useRef } from 'react';
import { USGSFeature } from '@/lib/types';
import { getMagnitudeRadius, getDepthColor, formatTimeAgo } from '@/lib/utils';

interface EarthquakeMapProps {
  features: USGSFeature[];
}

export default function EarthquakeMap({ features }: EarthquakeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerGroupRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamic import for Leaflet (no SSR)
    import('leaflet').then((L) => {
      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current!, {
          center: [20, 0],
          zoom: 2,
          minZoom: 1,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);

        // Add legend
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const legend = (L.control as any)({ position: 'bottomright' });
        legend.onAdd = () => {
          const div = L.DomUtil.create('div', 'leaflet-legend');
          div.style.cssText =
            'background:rgba(17,24,39,0.9);padding:10px;border-radius:8px;border:1px solid #374151;font-size:11px;color:#d1d5db;min-width:120px';
          div.innerHTML = `
            <div style="font-weight:bold;margin-bottom:6px;color:#fff">Depth</div>
            <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ef4444;margin-right:5px"></span>0-30 km</div>
            <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f59e0b;margin-right:5px"></span>30-100 km</div>
            <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#22c55e;margin-right:5px"></span>100-300 km</div>
            <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#6366f1;margin-right:5px"></span>300+ km</div>
            <div style="font-weight:bold;margin-top:6px;margin-bottom:4px;color:#fff">Size = Magnitude</div>
          `;
          return div;
        };
        legend.addTo(map);
      }

      // Clear and re-add markers
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
      }

      features.forEach((f) => {
        const [lng, lat, depth] = f.geometry.coordinates;
        const mag = f.properties.mag;
        if (lat == null || lng == null) return;

        const circle = L.circleMarker([lat, lng], {
          radius: getMagnitudeRadius(mag),
          fillColor: getDepthColor(depth),
          color: 'rgba(0,0,0,0.3)',
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.75,
        });

        circle.bindPopup(`
          <div style="font-family:sans-serif;min-width:200px">
            <div style="font-size:16px;font-weight:bold;margin-bottom:6px">M${mag?.toFixed(1)} Earthquake</div>
            <div style="color:#6b7280;margin-bottom:4px">${f.properties.place}</div>
            <div><b>Depth:</b> ${depth?.toFixed(0)} km</div>
            <div><b>Time:</b> ${formatTimeAgo(f.properties.time)}</div>
            ${f.properties.tsunami ? '<div style="color:#3b82f6;font-weight:bold;margin-top:4px">🌊 Tsunami Alert</div>' : ''}
            <a href="${f.properties.url}" target="_blank" rel="noopener noreferrer" style="color:#f97316;display:block;margin-top:8px">View on USGS ↗</a>
          </div>
        `);

        if (layerGroupRef.current) {
          circle.addTo(layerGroupRef.current);
        }
      });
    });
  }, [features]);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">🗺️ Interactive World Map</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          Circle size = magnitude · Color = depth · Click for details
        </p>
      </div>
      <div ref={mapRef} className="w-full" style={{ height: '480px' }} />
    </div>
  );
}
