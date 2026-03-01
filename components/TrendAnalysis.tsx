'use client';

import { USGSFeature } from '@/lib/types';
import { getHourlyBreakdown } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendAnalysisProps {
  day: USGSFeature[];
  week: USGSFeature[];
  month: USGSFeature[];
}

export default function TrendAnalysis({ day, week, month }: TrendAnalysisProps) {
  const dailyAvg = Math.round(month.length / 30);
  const weeklyAvg = Math.round(month.length / 4);

  const todayCount = day.length;
  const weekCount = week.length;

  const dayDiff = dailyAvg > 0 ? Math.round((todayCount - dailyAvg) / dailyAvg * 100) : 0;
  const weekDiff = weeklyAvg > 0 ? Math.round((weekCount - weeklyAvg) / weeklyAvg * 100) : 0;

  function getTrendIcon(diff: number) {
    if (diff > 10) return { icon: '↑', label: 'Above Average', color: '#ef4444' };
    if (diff < -10) return { icon: '↓', label: 'Below Average', color: '#22c55e' };
    return { icon: '→', label: 'Normal', color: '#eab308' };
  }

  const dayTrend = getTrendIcon(dayDiff);
  const weekTrend = getTrendIcon(weekDiff);
  const hourlyData = getHourlyBreakdown(day).reverse();

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">📊 Trend Analysis</h2>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-3">
          <div className="text-gray-400 text-xs uppercase mb-1">Today vs Daily Average</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: dayTrend.color }}>{dayTrend.icon}</span>
            <div>
              <div className="text-white font-semibold">{dayTrend.label}</div>
              <div className="text-gray-400 text-sm">
                {todayCount} events ({dayDiff > 0 ? '+' : ''}{dayDiff}% vs avg ~{dailyAvg}/day)
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3">
          <div className="text-gray-400 text-xs uppercase mb-1">This Week vs Weekly Average</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: weekTrend.color }}>{weekTrend.icon}</span>
            <div>
              <div className="text-white font-semibold">{weekTrend.label}</div>
              <div className="text-gray-400 text-sm">
                {weekCount} events ({weekDiff > 0 ? '+' : ''}{weekDiff}% vs avg ~{weeklyAvg}/week)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="text-gray-400 text-xs uppercase mb-2">Hourly Activity (Last 24h)</div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={hourlyData}>
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#6b7280' }} interval={5} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} width={30} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 6 }}
              labelStyle={{ color: '#d1d5db' }}
              itemStyle={{ color: '#f97316' }}
            />
            <Area type="monotone" dataKey="count" stroke="#f97316" fill="#f9731620" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
