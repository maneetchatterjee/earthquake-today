'use client';

import { useNewsData } from '@/hooks/useNewsData';
import NewsPanel from '@/components/NewsPanel';

export default function NewsPage() {
  const { articles, loading } = useNewsData();

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-white font-bold text-3xl">📰 Environmental News</h1>
        <NewsPanel articles={articles} loading={loading} />
      </main>
    </div>
  );
}
