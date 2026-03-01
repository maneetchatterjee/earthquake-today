'use client';
import { useState, useEffect, useCallback } from 'react';
import { NewsArticle } from '@/lib/types';

const REFRESH_INTERVAL = 900000; // 15 minutes

const RSS_SOURCES: { url: string; source: NewsArticle['source'] }[] = [
  { url: 'https://earthobservatory.nasa.gov/feeds/earth-observatory.rss', source: 'NASA' },
  { url: 'https://reliefweb.int/disasters/rss.xml', source: 'ReliefWeb' },
  { url: 'https://news.un.org/feed/subscribe/en/news/topic/climate-change/feed/rss.xml', source: 'UN' },
  { url: 'https://www.theguardian.com/environment/rss', source: 'Guardian' },
];

/** Remove HTML tags by splitting on angle brackets, keeping only even-indexed (non-tag) segments */
function stripHtml(html: string): string {
  return html.split('<').map((seg, i) => (i === 0 ? seg : seg.substring(seg.indexOf('>') + 1))).join('');
}

async function fetchRSS(source: { url: string; source: NewsArticle['source'] }): Promise<NewsArticle[]> {
  try {
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}&count=10`;
    const res = await fetch(proxyUrl);
    const data = await res.json();
    if (data.status !== 'ok') return [];
    return (data.items || []).map((item: { title: string; description: string; link: string; pubDate: string }) => ({
      title: item.title || '',
      description: stripHtml(item.description || '').slice(0, 200),
      link: item.link || '',
      pubDate: item.pubDate || '',
      source: source.source,
    }));
  } catch {
    return [];
  }
}

export function useNewsData() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    const results = await Promise.all(RSS_SOURCES.map(fetchRSS));
    const all = results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    setArticles(all.slice(0, 30));
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { articles, loading, lastUpdated };
}
