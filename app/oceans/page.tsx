'use client';

import { useTidesData } from '@/hooks/useTidesData';
import { useMarineData } from '@/hooks/useMarineData';
import TidesPanel from '@/components/TidesPanel';
import MarinePanel from '@/components/MarinePanel';

export default function OceansPage() {
  const { predictions, selectedStation, setSelectedStation, loading: tidesLoading } = useTidesData();
  const { marineData, loading: marineLoading } = useMarineData();

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">🌊 Oceans & Tides</h1>

        <div>
          <h2 className="text-white font-semibold text-xl mb-4">🌊 Tide Predictions</h2>
          <TidesPanel
            predictions={predictions}
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
            loading={tidesLoading}
          />
        </div>

        <div>
          <h2 className="text-white font-semibold text-xl mb-4">🌊 Marine Conditions</h2>
          <MarinePanel marineData={marineData} loading={marineLoading} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Pacific Ocean', temp: 18.5, trend: '+0.3°C' },
            { name: 'Atlantic Ocean', temp: 20.1, trend: '+0.5°C' },
            { name: 'Indian Ocean', temp: 27.3, trend: '+0.2°C' },
            { name: 'Arctic Ocean', temp: -1.2, trend: '+1.1°C' },
            { name: 'Southern Ocean', temp: 4.8, trend: '+0.4°C' },
            { name: 'Mediterranean', temp: 22.6, trend: '+0.6°C' },
          ].map((ocean) => (
            <div key={ocean.name} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-white font-medium">{ocean.name}</h3>
              <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{ocean.temp}°C</div>
              <div className="text-xs text-amber-400 mt-1">Annual trend: {ocean.trend}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
