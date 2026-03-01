'use client';

import { useAirQualityData } from '@/hooks/useAirQualityData';
import AirQualityPanel from '@/components/AirQualityPanel';

export default function AirQualityPage() {
  const { aqiData, loading } = useAirQualityData();

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">💨 Air Quality</h1>
        <AirQualityPanel aqiData={aqiData} loading={loading} />
      </main>
    </div>
  );
}
