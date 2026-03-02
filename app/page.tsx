'use client';

import { useEffect, useState } from 'react';
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


const LIVE_FEEDS = [
  {
    title: 'NOAA Live Weather Satellite',
    topic: 'Weather / Atmosphere',
    embedUrl: 'https://www.youtube.com/embed/O9mYwRlucZY',
  },
  {
    title: 'USGS Earthquake Briefing Stream',
    topic: 'Earthquakes',
    embedUrl: 'https://www.youtube.com/embed/h3Yl8ec4f7Q',
  },
  {
    title: 'NASA Earth & Space Live',
    topic: 'Earth Systems / Space',
    embedUrl: 'https://www.youtube.com/embed/21X5lGlDOfg',
  },
  {
    title: 'Global News Live (Environment)',
    topic: 'Breaking News',
    embedUrl: 'https://www.youtube.com/embed/gCNeDWCI0vo',
  },
];

const TOPIC_KEYWORDS: Record<string, string[]> = {
  Earthquakes: ['earthquake', 'seismic', 'tsunami', 'fault'],
  Weather: ['weather', 'storm', 'cyclone', 'hurricane', 'flood'],
  Climate: ['climate', 'warming', 'carbon', 'emission', 'temperature'],
  Wildfires: ['wildfire', 'fire', 'smoke', 'burn'],
  Oceans: ['ocean', 'marine', 'sea', 'coastal'],
};

function toTopicBuckets(titles: string[]) {
  return Object.entries(TOPIC_KEYWORDS).map(([topic, keywords]) => ({
    topic,
    matches: titles.filter((title) => {
      const lower = title.toLowerCase();
      return keywords.some((keyword) => lower.includes(keyword));
    }).slice(0, 3),
  })).filter((bucket) => bucket.matches.length > 0);
}

function getScoreBreakdown(earthquakeCount: number, maxMagnitude: number, avgAqi: number, avgTemp: number, fireCount: number) {
  const earthquakeVolumePenalty = Math.min(20, earthquakeCount * 0.05);
  const magnitudePenalty = maxMagnitude > 5 ? Math.min(10, (maxMagnitude - 5) * 3) : 0;
  const aqiPenalty = avgAqi > 150 ? 20 : avgAqi > 100 ? 10 : avgAqi > 50 ? 5 : 0;
  const temperaturePenalty = Math.min(10, Math.abs(avgTemp - 15) * 0.3);
  const wildfirePenalty = Math.min(15, fireCount * 0.001);

  return [
    { key: 'Earthquake volume', penalty: earthquakeVolumePenalty },
    { key: 'Seismic intensity', penalty: magnitudePenalty },
    { key: 'Air quality stress', penalty: aqiPenalty },
    { key: 'Temperature anomaly', penalty: temperaturePenalty },
    { key: 'Wildfire load', penalty: wildfirePenalty },
  ];
}

export default function OverviewPage() {
  const { hour, day, week, lastUpdated: eqUpdated, loading: eqLoading } = useEarthquakeData();
  const { weatherData, lastUpdated: weatherUpdated } = useWeatherData();
  const { aqiData, lastUpdated: aqiUpdated } = useAirQualityData();
  const { fires, lastUpdated: fireUpdated, error: wildfireError } = useWildfireData();
  const { articles, lastUpdated: newsUpdated } = useNewsData();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const breakdown = getScoreBreakdown(day.length, maxMag, avgAqi, avgTemp, fires.length);
  const explainedPenalty = breakdown.reduce((sum, item) => sum + item.penalty, 0);

  const sourceStatuses = [
    { name: 'Earthquakes', updated: eqUpdated, available: day.length > 0 },
    { name: 'Weather', updated: weatherUpdated, available: weatherData.length > 0 },
    { name: 'Air Quality', updated: aqiUpdated, available: aqiData.length > 0 },
    { name: 'Wildfires', updated: fireUpdated, available: !wildfireError },
    { name: 'News', updated: newsUpdated, available: articles.length > 0 },
  ];

  const availableSources = sourceStatuses.filter((s) => s.available).length;
  const confidencePct = Math.round((availableSources / sourceStatuses.length) * 100);

  const incidentLevel =
    maxMag >= 6.5 || day.length >= 2500 || avgAqi >= 140 || fires.length > 12000
      ? { label: 'High', tone: 'text-red-300 bg-red-500/20 border-red-500/40', action: 'Activate incident workflows and watch official advisories.' }
      : maxMag >= 5.5 || day.length >= 1200 || avgAqi >= 100 || fires.length > 8000
        ? { label: 'Elevated', tone: 'text-amber-300 bg-amber-500/20 border-amber-500/40', action: 'Increase monitoring cadence and verify regional impacts.' }
        : { label: 'Routine', tone: 'text-green-300 bg-green-500/20 border-green-500/40', action: 'Continue standard monitoring across all feeds.' };

  const hourlyProjection = Math.round(hour.length * 24);
  const acceleration = day.length - hourlyProjection;

  const healthStatus =
    healthScore >= 70
      ? { label: 'Conditions Normal', tone: 'text-green-400 border-green-500/30 bg-green-500/20', icon: '✅' }
      : healthScore >= 40
        ? { label: 'Elevated Risk Signals', tone: 'text-amber-400 border-amber-500/30 bg-amber-500/20', icon: '⚠️' }
        : { label: 'Critical Conditions', tone: 'text-red-400 border-red-500/30 bg-red-500/20', icon: '🚨' };

  const topEarthquake = day[0];


  const topicBuckets = toTopicBuckets(articles.map((article) => article.title));

  const stats = [
    { label: 'Earthquakes Today', value: day.length, unit: '', icon: '🌋', color: '#FF3366', href: '/earthquakes' },
    { label: 'Max Magnitude', value: maxMag.toFixed(1), unit: '', icon: '📊', color: '#FFB800', href: '/earthquakes' },
    { label: 'Avg AQI', value: avgAqi, unit: '', icon: '💨', color: '#00FF88', href: '/air-quality' },
    { label: 'Active Fires', value: fires.length.toLocaleString(), unit: '', icon: '🔥', color: '#FF6600', href: '/wildfires' },
    { label: '24h Trend', value: acceleration > 0 ? `+${acceleration}` : acceleration, unit: '', icon: '📈', color: acceleration > 0 ? '#F97316' : '#10B981', href: '/earthquakes' },
    { label: 'Data Confidence', value: confidencePct, unit: '%', icon: '🧪', color: '#60A5FA', href: '/records' },
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
              <p className="text-slate-300 max-w-2xl">Live risk intelligence with explainable scoring, source reliability, and incident guidance.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className={`flex items-center gap-3 rounded-full border px-4 py-2 ${incidentLevel.tone}`}>
                <div className="w-2 h-2 rounded-full bg-current animate-live-pulse" />
                <span className="font-bold text-sm tracking-widest">INCIDENT: {incidentLevel.label.toUpperCase()}</span>
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
              <p className="text-xs text-slate-400">Recommended action</p>
              <p className="text-sm text-cyan-200 mt-1">{incidentLevel.action}</p>
            </div>
          </div>
        </div>

        <GlassCard className="p-8 border border-white/15">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 min-h-[220px] min-w-[220px] flex items-center justify-center">
              {isMounted ? (
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
              ) : (
                <div className="h-[220px] w-[220px] rounded-full border border-white/10 bg-white/5 animate-pulse" aria-hidden />
              )}
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-white">Global Status</h2>
                <span className={`border rounded-full px-3 py-1 text-sm ${healthStatus.tone}`}>{healthStatus.icon} {healthStatus.label}</span>
              </div>
              <p className="text-slate-400">Composite signal from seismic activity, air quality, temperature anomalies, wildfire burden, and emissions pressure.</p>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, healthScore))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Health score</span>
                <span className="font-mono text-slate-200">{healthScore}/100</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
                {breakdown.map((item) => (
                  <div key={item.key} className="rounded-lg border border-white/10 bg-white/5 px-2 py-2">
                    <p className="text-slate-400">{item.key}</p>
                    <p className="text-slate-200 font-mono">-{item.penalty.toFixed(1)}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">Explained penalty total: {explainedPenalty.toFixed(1)} points.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border border-white/10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-white text-lg font-semibold">📡 Data reliability and freshness</h3>
            <span className="text-xs text-cyan-300">Confidence: {confidencePct}%</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {sourceStatuses.map((source) => (
              <div key={source.name} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm text-slate-200 font-medium">{source.name}</p>
                <p className={`text-xs mt-1 ${source.available ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {source.available ? 'Available' : 'Degraded'}
                </p>
                <p className="text-xs text-slate-500 mt-1">{source.updated ? source.updated.toLocaleTimeString() : 'No refresh time'}</p>
              </div>
            ))}
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


        <GlassCard className="p-6 border border-white/10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-white text-lg font-semibold">🎥 Live Earth Monitor Video Feeds</h3>
            <span className="text-xs text-slate-400">Embedded live streams</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {LIVE_FEEDS.map((feed) => (
              <div key={feed.title} className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    title={feed.title}
                    src={feed.embedUrl}
                    className="w-full h-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm text-slate-100 font-medium">{feed.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{feed.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 border border-white/10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-white text-lg font-semibold">📰 Live Topic News Desk</h3>
            <Link href="/news" className="text-xs text-cyan-300 hover:text-cyan-200">Open full news feed →</Link>
          </div>
          {topicBuckets.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {topicBuckets.map((bucket) => (
                <div key={bucket.topic} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <h4 className="text-sm font-semibold text-slate-100 mb-2">{bucket.topic}</h4>
                  <ul className="space-y-2">
                    {bucket.matches.map((headline) => (
                      <li key={headline} className="text-xs text-slate-300 leading-relaxed">• {headline}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-400">No topic-classified headlines available yet. Check back after the next news refresh.</div>
          )}
        </GlassCard>

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

        <GlassCard className="p-6 border border-white/10">
          <h3 className="text-white text-lg font-semibold mb-3">📊 Trend intelligence</h3>
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-slate-400">1h → 24h projection</p>
              <p className="text-slate-200 font-mono mt-1">{hour.length} × 24 = {hourlyProjection}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-slate-400">Observed 24h count</p>
              <p className="text-slate-200 font-mono mt-1">{day.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-slate-400">Acceleration signal</p>
              <p className={`font-mono mt-1 ${acceleration > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                {acceleration > 0 ? `+${acceleration}` : acceleration} vs projected baseline
              </p>
              <p className="text-xs text-slate-500 mt-1">7d total monitored: {week.length}</p>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
