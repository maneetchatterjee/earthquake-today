'use client';

import dynamic from 'next/dynamic';
import { useSolarData } from '@/hooks/useSolarData';
import { useISSData } from '@/hooks/useISSData';
import { useAsteroidData } from '@/hooks/useAsteroidData';
import { getMoonPhase } from '@/lib/astronomy';
import RadialGauge from '@/components/ui/RadialGauge';
import PanelSkeleton from '@/components/ui/PanelSkeleton';

const ISSMap = dynamic(() => import('@/components/ISSMap'), { ssr: false, loading: () => <PanelSkeleton height="300px" /> });

export default function SpacePage() {
  const { kpIndex, solarWindSpeed, sunspotNumber, latestFlare, loading: solarLoading } = useSolarData();
  const { position, peopleInSpace, astronauts, loading: issLoading } = useISSData();
  const { asteroids, count, closestApproach, loading: asteroidLoading } = useAsteroidData();
  const moon = getMoonPhase();

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">🌌 Space</h1>

        {/* Moon Phase */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">🌙 Moon Phase</h2>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="text-8xl">{moon.emoji}</div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">{moon.phaseName}</div>
              <div className="text-slate-400">Illumination: <span className="text-cyan-400 font-mono">{moon.illumination}%</span></div>
              <div className="text-slate-400">Next Full Moon: <span className="text-amber-400">{moon.nextFullMoon.toLocaleDateString()}</span></div>
              <div className="text-slate-400">Next New Moon: <span className="text-amber-400">{moon.nextNewMoon.toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>

        {/* Solar Activity */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-6">☀️ Solar Activity</h2>
          {solarLoading ? (
            <div className="text-slate-400 animate-pulse">Loading solar data...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RadialGauge value={kpIndex} min={0} max={9} label="Kp Index" unit="" colorScheme={[
                  { limit: 3, color: '#00FF88' },
                  { limit: 6, color: '#FFB800' },
                  { color: '#FF3366' },
                ]} />
                <RadialGauge value={Math.min(solarWindSpeed, 900)} min={0} max={900} label="Solar Wind (km/s)" unit="" />
                <RadialGauge value={Math.min(sunspotNumber, 300)} min={0} max={300} label="Sunspot Number" unit="" />
              </div>
              {latestFlare && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <span className="text-amber-400 font-medium">Latest Flare: </span>
                  <span className="text-white font-mono">{latestFlare.class_type}</span>
                  <span className="text-slate-400 ml-2 text-sm">at {latestFlare.begin_time}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* ISS Tracker */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">🛸 ISS Tracker</h2>
          {issLoading ? (
            <div className="text-slate-400 animate-pulse">Locating ISS...</div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-slate-400 text-xs">Latitude</div>
                  <div className="text-cyan-400 font-mono font-bold">{position.lat.toFixed(4)}°</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-slate-400 text-xs">Longitude</div>
                  <div className="text-cyan-400 font-mono font-bold">{position.lng.toFixed(4)}°</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-slate-400 text-xs">Crew</div>
                  <div className="text-green-400 font-mono font-bold">{peopleInSpace} people</div>
                </div>
              </div>
              <ISSMap position={position} />
              {astronauts.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-slate-400 text-sm mb-2">Current Crew:</h3>
                  <div className="flex flex-wrap gap-2">
                    {astronauts.map((a) => (
                      <span key={a.name} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white">
                        👨‍🚀 {a.name} <span className="text-slate-400">({a.craft})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Asteroid Tracker */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">☄️ Near-Earth Asteroids</h2>
          {asteroidLoading ? (
            <div className="text-slate-400 animate-pulse">Fetching asteroid data...</div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-slate-400 text-xs">Total (next 3 days)</div>
                  <div className="text-cyan-400 font-mono font-bold text-2xl">{count}</div>
                </div>
                {closestApproach && (
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-slate-400 text-xs">Closest Approach</div>
                    <div className="text-amber-400 font-medium">{closestApproach.name}</div>
                    <div className="text-white font-mono text-sm">{(closestApproach.miss_distance_km / 1000).toFixed(0)}k km</div>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/10">
                      <th className="text-left pb-2">Name</th>
                      <th className="text-right pb-2">Miss Distance</th>
                      <th className="text-right pb-2">Velocity</th>
                      <th className="text-right pb-2">Diameter</th>
                      <th className="text-right pb-2">Hazardous</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asteroids.slice(0, 10).map((a) => (
                      <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 text-white">{a.name}</td>
                        <td className="py-2 text-right text-cyan-400 font-mono">{(a.miss_distance_km / 1000000).toFixed(2)}M km</td>
                        <td className="py-2 text-right text-slate-300 font-mono">{a.velocity_km_s.toFixed(1)} km/s</td>
                        <td className="py-2 text-right text-slate-300 font-mono">{(a.diameter_max_km * 1000).toFixed(0)}m</td>
                        <td className="py-2 text-right">{a.is_potentially_hazardous ? '⚠️' : '✅'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
