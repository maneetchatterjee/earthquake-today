import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Earth Monitor',
    short_name: 'Earth Monitor',
    description: 'Real-time global Earth monitoring platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0E1A',
    theme_color: '#0A0E1A',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}
