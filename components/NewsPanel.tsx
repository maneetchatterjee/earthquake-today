'use client';

import { useState } from 'react';
import { NewsArticle } from '@/lib/types';

interface NewsPanelProps {
  articles: NewsArticle[];
  loading: boolean;
}

type FilterSource = 'All' | NewsArticle['source'];

const SOURCE_COLORS: Record<NewsArticle['source'], string> = {
  NASA: 'bg-blue-700 text-blue-200',
  UN: 'bg-cyan-700 text-cyan-200',
  Guardian: 'bg-green-700 text-green-200',
  ReliefWeb: 'bg-orange-700 text-orange-200',
};

const BREAKING_NEWS_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function isBreaking(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < BREAKING_NEWS_THRESHOLD_MS;
}

export default function NewsPanel({ articles, loading }: NewsPanelProps) {
  const [filter, setFilter] = useState<FilterSource>('All');

  if (loading && articles.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400 animate-pulse">
        Loading news...
      </div>
    );
  }

  const filtered = filter === 'All' ? articles : articles.filter((a) => a.source === filter);
  const breaking = articles.filter((a) => isBreaking(a.pubDate));

  const filters: FilterSource[] = ['All', 'NASA', 'UN', 'Guardian', 'ReliefWeb'];

  return (
    <div className="space-y-4">
      {/* Breaking news ticker */}
      {breaking.length > 0 && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold text-xs whitespace-nowrap">🚨 BREAKING</span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-marquee whitespace-nowrap">
                {breaking.map((a, i) => (
                  <span key={i} className="text-red-200 text-xs">
                    {a.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
            }`}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({articles.filter((a) => a.source === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No articles loaded.</div>
        ) : (
          filtered.map((article, i) => (
            <a
              key={i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${SOURCE_COLORS[article.source]}`}>
                    {article.source}
                  </span>
                  {isBreaking(article.pubDate) && (
                    <span className="text-xs bg-red-700 text-red-200 px-2 py-0.5 rounded font-medium">
                      BREAKING
                    </span>
                  )}
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap">{timeAgo(article.pubDate)}</span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1 leading-tight">{article.title}</h4>
              {article.description && (
                <p className="text-gray-400 text-xs line-clamp-2">{article.description}</p>
              )}
            </a>
          ))
        )}
      </div>
    </div>
  );
}
