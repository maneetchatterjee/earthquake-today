'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { USGSFeature } from '@/lib/types';
import { getMagnitudeRadius, getDepthColor, formatTimeAgo } from '@/lib/utils';

interface EarthquakeMapProps {
  features: USGSFeature[];
}

type ViewMode = 'markers' | 'heatmap' | 'both';

function getTileLayer(L: typeof import('leaflet'), isDark: boolean) {
  return isDark
    ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
      })
    : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      });
}

export default function EarthquakeMap({ features }: EarthquakeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);
  const layerGroupRef = useRef<import('leaflet').LayerGroup | null>(null);
  const plateLayerRef = useRef<import('leaflet').GeoJSON | null>(null);
  const heatLayerRef = useRef<import('leaflet').Layer | null>(null);
  const tileLayerRef = useRef<import('leaflet').TileLayer | null>(null);

  const [showPlates, setShowPlates] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('markers');

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      if (mapInstanceRef.current) return;

      const isDark = document.documentElement.classList.contains('dark');
      const map = L.map(mapRef.current!, {
        center: [20, 0],
        zoom: 2,
        minZoom: 1,
      });

      const tile = getTileLayer(L, isDark);
      tile.addTo(map);
      tileLayerRef.current = tile;
      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);

      // Add legend
      const legend = new L.Control({ position: 'bottomright' });
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
          <div><span style="display:inline-block;width:10px;height:4px;background:#f97316;margin-right:5px;border-radius:2px"></span>Tectonic Plates</div>
        `;
        return div;
      };
      legend.addTo(map);

      // Listen for theme changes (MutationObserver on html class)
      const observer = new MutationObserver(() => {
        if (!mapInstanceRef.current) return;
        import('leaflet').then((Lm) => {
          if (tileLayerRef.current) {
            mapInstanceRef.current.removeLayer(tileLayerRef.current);
          }
          const newDark = document.documentElement.classList.contains('dark');
          tileLayerRef.current = getTileLayer(Lm, newDark);
          tileLayerRef.current.addTo(mapInstanceRef.current);
          if (layerGroupRef.current) layerGroupRef.current.bringToFront();
          if (plateLayerRef.current) plateLayerRef.current.bringToFront();
        });
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    });
  }, []);

  // Update markers and heatmap when features change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then(async (L) => {
      // Update markers
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
      }

      const showMarkers = viewMode === 'markers' || viewMode === 'both';
      if (showMarkers && layerGroupRef.current) {
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

          circle.addTo(layerGroupRef.current);
        });
      }

      // Update heatmap
      if (heatLayerRef.current) {
        mapInstanceRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }

      const showHeat = viewMode === 'heatmap' || viewMode === 'both';
      if (showHeat) {
        await import('leaflet.heat');
        const heatPoints = features
          .filter(f => f.geometry.coordinates[0] != null && f.geometry.coordinates[1] != null)
          .map(f => [
            f.geometry.coordinates[1],
            f.geometry.coordinates[0],
            Math.pow(10, f.properties.mag) / 1000,
          ]);
        heatLayerRef.current = (L as typeof L & { heatLayer: Function }).heatLayer(heatPoints, { radius: 25, blur: 15 }).addTo(mapInstanceRef.current);
      }
    });
  }, [features, viewMode]);

  // Toggle plate boundaries
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then(async (L) => {
      if (showPlates) {
        if (plateLayerRef.current) return;
        try {
          const res = await fetch('/data/PB2002_boundaries.json');
          const data = await res.json();
          plateLayerRef.current = L.geoJSON(data, {
            style: { color: '#f97316', weight: 2, opacity: 0.6 },
          });
          plateLayerRef.current.addTo(mapInstanceRef.current);
          if (layerGroupRef.current) {
            layerGroupRef.current.bringToFront();
          }
        } catch {
          // silently fail
        }
      } else {
        if (plateLayerRef.current) {
          mapInstanceRef.current.removeLayer(plateLayerRef.current);
          plateLayerRef.current = null;
        }
      }
    });
  }, [showPlates]);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-white font-semibold text-lg">🗺️ Interactive World Map</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Circle size = magnitude · Color = depth · Click for details
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* View mode toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-600 text-xs">
              {(['markers', 'heatmap', 'both'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 capitalize transition-colors ${
                    viewMode === mode
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {mode === 'markers' ? '📍 Markers' : mode === 'heatmap' ? '🔥 Heatmap' : '⚡ Both'}
                </button>
              ))}
            </div>
            {/* Plate toggle */}
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showPlates}
                onChange={e => setShowPlates(e.target.checked)}
                className="accent-orange-500 w-4 h-4"
              />
              <span>Tectonic Plates</span>
            </label>
          </div>
        </div>
      </div>
      <div ref={mapRef} className="w-full" style={{ height: '480px' }} />
    </div>
  );
}
