'use client';

import { useWildfireData } from '@/hooks/useWildfireData';
import WildfireTracker from '@/components/WildfireTracker';

export default function WildfiresPage() {
  const { fires, loading, error, hasApiKey } = useWildfireData();

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">🔥 Wildfires</h1>
        <WildfireTracker fires={fires} loading={loading} hasApiKey={hasApiKey} error={error} />
      </main>
    </div>
  );
}
