'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ISSMapProps {
  position: { lat: number; lng: number };
}

const issIcon = typeof window !== 'undefined' ? L.divIcon({
  html: '🛸',
  className: 'bg-transparent border-none text-2xl',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
}) : undefined;

export default function ISSMap({ position }: ISSMapProps) {
  return (
    <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        key={`${position.lat}-${position.lng}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {issIcon && (
          <Marker position={[position.lat, position.lng]} icon={issIcon}>
            <Popup>
              🛸 ISS<br />
              Lat: {position.lat.toFixed(4)}°<br />
              Lng: {position.lng.toFixed(4)}°
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
