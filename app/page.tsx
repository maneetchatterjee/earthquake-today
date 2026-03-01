'use client';

import Link from 'next/link';
import { useEarthquakeData } from '@/hooks/useEarthquakeData';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useAirQualityData } from '@/hooks/useAirQualityData';
import { useWildfireData } from '@/hooks/useWildfireData';
import { useNewsData } from '@/hooks/useNewsData';
import { calculateHealthScore } from '@/lib/healthScore';
import RadialGauge from '@/components/ui/RadialGauge';
import GlassCard from '@/components/ui/GlassCard';
import dynamic from 'next/dynamic';

const EEWBanner = dynamic(() => import('@/components/EEWBanner'), { ssr: false });

const MODULE_LINKS = [
  { icon: '🌋', label: 'Earthquakes', href: '/earthquakes', color: '#FF3366' },
  { icon: '🌡️', label: 'Weather', href: '/weather', color: '#FFB800' },
  { icon: '💨', label: 'Air Quality', href: '/air-quality', color: '#00FF88' },
  { icon: '🔥', label: 'Wildfires', href: '/wildfires', color: '#FF6600' },
  { icon: '🌊', label: 'Oceans', href: '/oceans', color: '#3B82F6' },
  { icon: '🌌', label: 'Space', href: '/space', color: '#A855F7' },
  { icon: '⚡', label: 'Energy', href: '/energy', color: '#00FFFF' },
  { icon: '🧲', label: 'Atmosphere', href: '/atmosphere', color: '#94A3B8' },
  { icon: '🛩️', label: 'Human Activity', href: '/human', color: '#F97316' },
  { icon: '📰', label: 'News', href: '/news', color: '#64748B' },
  { icon: '📍', label: 'My Location', href: '/my-location', color: '#10B981' },
  { icon: '🏆', label: 'Records', href: '/records', color: '#EAB308' },
];


export default function OverviewPage() {
  const { day, loading: eqLoading } = useEarthquakeData();
  const { weatherData } = useWeatherData();
  const { aqiData } = useAirQualityData();
  const { fires } = useWildfireData();
  const { articles } = useNewsData();

  const maxMag = day.reduce((max, f) => Math.max(max, f.properties.mag || 0), 0);
  const avgAqi = aqiData.length ? Math.round(aqiData.reduce((s, d) => s + d.usAqi, 0) / aqiData.length) : 50;
  const avgTemp = weatherData.length ? weatherData.reduce((s, d) => s + d.temperature, 0) / weatherData.length : 15;

  const healthScore = calculateHealthScore({
    earthquakeCount: day.length,
    maxMagnitude: maxMag,
    avgAqi,
    avgTemp,
    fireCount: fires.length,
  });

  const stats = [
    { label: 'Earthquakes Today', value: day.length, unit: '', icon: '🌋', color: '#FF3366', href: '/earthquakes' },
    { label: 'Max Magnitude', value: maxMag.toFixed(1), unit: '', icon: '📊', color: '#FFB800', href: '/earthquakes' },
    { label: 'Avg AQI', value: avgAqi, unit: '', icon: '💨', color: '#00FF88', href: '/air-quality' },
    { label: 'Active Fires', value: fires.length.toLocaleString(), unit: '', icon: '🔥', color: '#FF6600', href: '/wildfires' },
    { label: 'Avg Temp', value: avgTemp.toFixed(1), unit: '°C', icon: '🌡️', color: '#FFB800', href: '/weather' },
    { label: 'CO₂ Level', value: '425.3', unit: 'ppm', icon: '🌫️', color: '#A855F7', href: '/energy' },
    { label: 'News Articles', value: articles.length, unit: '', icon: '📰', color: '#64748B', href: '/news' },
    { label: 'Monitoring Since', value: '2024', unit: '', icon: '📡', color: '#00FFFF', href: '/records' },
  ];

  const healthStatus =
    healthScore >= 70
      ? { label: 'Conditions Normal', tone: 'text-green-400 border-green-500/30 bg-green-500/20', icon: '✅' }
      : healthScore >= 40
        ? { label: 'Elevated Risk Signals', tone: 'text-amber-400 border-amber-500/30 bg-amber-500/20', icon: '⚠️' }
        : { label: 'Critical Conditions', tone: 'text-red-400 border-red-500/30 bg-red-500/20', icon: '🚨' };

  const topEarthquake = day[0];

  return (
    <div className="min-h-screen bg-[#0A0E1A] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.24),transparent_34%),radial-gradient(circle_at_84%_12%,rgba(168,85,247,0.2),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.16),transparent_32%)]" />
      <EEWBanner />
      <main className="relative max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-xs px-3 py-1 tracking-wide">Global live dashboard</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">🌍 Earth Monitor</h1>
              <p className="text-slate-300 max-w-2xl">Track seismic, weather, air quality, and wildfire signals in one place with fast links to each live intelligence module.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
                <span className="text-emerald-300 font-bold text-sm tracking-widest">LIVE</span>
              </div>
              <Link href="/earthquakes" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                Open Seismic Feed →
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-slate-400">Strongest event</p>
              <p className="text-xl font-bold text-white mt-1">M{maxMag.toFixed(1)}</p>
              <p className="text-xs text-slate-400 mt-1 truncate">{topEarthquake?.properties.place ?? 'No event data yet'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-slate-400">Latest headline</p>
              <p className="text-sm text-slate-200 mt-1 line-clamp-2">{articles[0]?.title ?? 'No environmental headlines available right now.'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-slate-400">Updated</p>
              <p className="text-sm text-slate-200 mt-1">{new Date().toLocaleString()}</p>
              <p className="text-xs text-cyan-300 mt-1">Data stream synchronized</p>
            </div>
          </div>
        </div>

        <GlassCard className="p-8 border border-white/15">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <RadialGauge
                value={eqLoading ? 50 : healthScore}
                min={0}
                max={100}
                label="Earth Health Score"
                unit=""
                colorScheme={[
                  { limit: 33, color: '#FF3366' },
                  { limit: 66, color: '#FFB800' },
                  { color: '#00FF88' },
                ]}
              />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">Global Status</h2>
                <span className={`border rounded-full px-3 py-1 text-sm ${healthStatus.tone}`}>{healthStatus.icon} {healthStatus.label}</span>
              </div>
              <p className="text-slate-400 mb-4">Composite signal from seismic activity, air quality, temperature anomalies, wildfire burden, and emissions pressure.</p>
              <div className="w-full h-2 rounded-full bg-white/10 mb-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, healthScore))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Health score</span>
                <span className="font-mono text-slate-200">{healthScore}/100</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="group">
              <GlassCard className="p-4 cursor-pointer border border-white/5 group-hover:border-white/20 transition-all duration-200 group-hover:-translate-y-1">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>
                  {stat.value}{stat.unit}
                </div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </GlassCard>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="text-white font-semibold text-xl mb-4">🔗 Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {MODULE_LINKS.map((mod) => (
              <Link key={mod.href} href={mod.href} className="group">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-200 cursor-pointer group-hover:-translate-y-1 group-hover:border-white/30">
                  <div className="text-3xl mb-2">{mod.icon}</div>
                  <div className="text-xs text-slate-300 font-medium">{mod.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-white font-semibold text-xl">⚡ Recent Seismic Activity</h2>
            <Link href="/earthquakes" className="text-xs text-cyan-300 hover:text-cyan-200">View all →</Link>
          </div>
          {eqLoading ? (
            <div className="text-slate-400 animate-pulse">Loading live feed...</div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {day.slice(0, 15).map((eq) => {
                const magnitude = eq.properties.mag || 0;
                const magTone = magnitude >= 6 ? 'text-red-300 bg-red-500/15 border-red-500/30' : magnitude >= 4 ? 'text-amber-300 bg-amber-500/15 border-amber-500/30' : 'text-green-300 bg-green-500/15 border-green-500/30';

                return (
                  <div key={eq.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                    <span className={`text-sm font-bold font-mono px-2 py-1 rounded-lg border ${magTone}`}>M{magnitude.toFixed(1)}</span>
                    <span className="text-sm text-slate-300 flex-1 truncate">{eq.properties.place}</span>
                    <span className="text-xs text-slate-500">{new Date(eq.properties.time).toLocaleTimeString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
