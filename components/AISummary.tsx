'use client';

import { useMemo, useState } from 'react';
import { USGSFeature } from '@/lib/types';
import { generateSummary } from '@/lib/summaryGenerator';

interface AISummaryProps {
  day: USGSFeature[];
  week: USGSFeature[];
  month: USGSFeature[];
}

export default function AISummary({ day, week, month }: AISummaryProps) {
  const [copied, setCopied] = useState(false);
  const summary = useMemo(() => generateSummary(day, week, month), [day, week, month]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">📋 Daily Seismic Summary</h2>
          <p className="text-gray-400 text-sm mt-0.5">Auto-generated from live data</p>
        </div>
        <button
          onClick={handleCopy}
          className="text-sm px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors border border-gray-600"
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
      <div className="p-4">
        <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
