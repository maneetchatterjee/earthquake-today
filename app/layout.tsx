import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Earth Monitor | Real-time Global Earth Monitoring',
  description:
    'Real-time Earth monitoring platform. Track earthquakes, weather, air quality, wildfires, oceans, space activity and more.',
  keywords: ['earthquake', 'weather', 'air quality', 'wildfire', 'earth monitor', 'real-time', 'monitoring'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-[#0A0E1A] text-slate-100 min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
