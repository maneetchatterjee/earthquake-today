'use client';

import { useState, useEffect } from 'react';
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

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <EEWBanner />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">🌍 Earth Monitor</h1>
            <p className="text-slate-400 mt-1">Real-time global Earth monitoring platform</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
            <span className="text-red-400 font-bold text-sm tracking-widest">LIVE</span>
          </div>
        </div>

        {/* Earth Health Score */}
        <GlassCard className="p-8">
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
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Global Status</h2>
              <p className="text-slate-400 mb-4">
                Composite score based on seismic activity, air quality, temperature anomalies, wildfires, and carbon emissions.
              </p>
              <div className="flex flex-wrap gap-2">
                {healthScore >= 70 && <span className="bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-3 py-1 text-sm">✅ Conditions Normal</span>}
                {healthScore < 70 && healthScore >= 40 && <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 text-sm">⚠️ Some Concerns</span>}
                {healthScore < 40 && <span className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-3 py-1 text-sm">🚨 Critical Conditions</span>}
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-3 py-1 text-sm">📡 Live Data</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <GlassCard className="p-4 cursor-pointer">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>
                  {stat.value}{stat.unit}
                </div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white font-semibold text-xl mb-4">🔗 Quick Access</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {MODULE_LINKS.map((mod) => (
              <Link key={mod.href} href={mod.href}>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-200 cursor-pointer">
                  <div className="text-3xl mb-2">{mod.icon}</div>
                  <div className="text-xs text-slate-300 font-medium">{mod.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <GlassCard className="p-6">
          <h2 className="text-white font-semibold text-xl mb-4">⚡ Recent Seismic Activity</h2>
          {eqLoading ? (
            <div className="text-slate-400 animate-pulse">Loading...</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {day.slice(0, 15).map((eq) => (
                <div key={eq.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <span className={`text-lg font-bold font-mono ${
                    (eq.properties.mag || 0) >= 6 ? 'text-red-400' :
                    (eq.properties.mag || 0) >= 4 ? 'text-amber-400' : 'text-green-400'
                  }`}>M{(eq.properties.mag || 0).toFixed(1)}</span>
                  <span className="text-sm text-slate-300 flex-1 truncate">{eq.properties.place}</span>
                  <span className="text-xs text-slate-500">{new Date(eq.properties.time).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* News Ticker */}
        {articles.length > 0 && (
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <span className="bg-red-500/20 text-red-400 border border-red-500/30 rounded px-2 py-0.5 text-xs font-bold flex-shrink-0">📰 NEWS</span>
              <div className="overflow-hidden flex-1">
                <div className="text-sm text-slate-300 truncate">
                  {articles[0]?.title}
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}
