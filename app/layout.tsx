import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Earthquakes Today | Real-time Global Seismic Activity',
  description:
    'Real-time earthquake monitoring dashboard. Live data from USGS Earthquake Hazards Program. Track earthquakes worldwide with interactive maps, charts, and statistics.',
  keywords: ['earthquake', 'seismic', 'USGS', 'real-time', 'monitoring', 'map'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
