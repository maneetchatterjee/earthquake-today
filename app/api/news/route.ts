import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';
import { stripHtml } from '@/lib/security';

const TTL_MS = 900_000; // 15 minutes

type NewsSource = 'NASA' | 'UN' | 'Guardian' | 'ReliefWeb';

const RSS_SOURCES: { url: string; source: NewsSource }[] = [
  { url: 'https://earthobservatory.nasa.gov/feeds/earth-observatory.rss', source: 'NASA' },
  { url: 'https://reliefweb.int/disasters/rss.xml', source: 'ReliefWeb' },
  { url: 'https://news.un.org/feed/subscribe/en/news/topic/climate-change/feed/rss.xml', source: 'UN' },
  { url: 'https://www.theguardian.com/environment/rss', source: 'Guardian' },
];

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: NewsSource;
}

async function fetchRSS(source: { url: string; source: NewsSource }): Promise<RSSItem[]> {
  try {
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}&count=10`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeout);

    const data = await res.json();
    if (data.status !== 'ok') return [];

    return (data.items || []).map((item: { title: string; description: string; link: string; pubDate: string }) => ({
      title: stripHtml(item.title || ''),
      description: stripHtml(item.description || '').slice(0, 200),
      link: item.link?.startsWith('http') ? item.link : '',
      pubDate: item.pubDate || '',
      source: source.source,
    }));
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const sourceName = req.nextUrl.searchParams.get('source');

  const sources = sourceName
    ? RSS_SOURCES.filter((s) => s.source === sourceName)
    : RSS_SOURCES;

  const cacheKey = `news:${sourceName ?? 'all'}`;
  const cached = cacheGet<RSSItem[]>(cacheKey);
  if (cached) {
    return NextResponse.json({ articles: cached });
  }

  const results = await Promise.all(sources.map(fetchRSS));
  const articles = results
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 30);

  cacheSet(cacheKey, articles, TTL_MS);
  return NextResponse.json({ articles }, {
    headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800' },
  });
}
