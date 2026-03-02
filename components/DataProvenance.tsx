'use client';

interface DataProvenanceProps {
  source: string;
  fetchedAt: Date;
  url?: string;
}

function getFreshness(fetchedAt: Date): { label: string; color: string } {
  const ageMs = Date.now() - fetchedAt.getTime();
  const ageMin = ageMs / 60_000;

  if (ageMin < 5)  return { label: 'Fresh',   color: 'bg-green-400/10 border-green-400/30 text-green-400' };
  if (ageMin < 30) return { label: 'Recent',  color: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' };
  return              { label: 'Stale',    color: 'bg-red-400/10 border-red-400/30 text-red-400' };
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function DataProvenance({ source, fetchedAt, url }: DataProvenanceProps) {
  const { label, color } = getFreshness(fetchedAt);

  const badge = (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}>
      <span className="text-gray-400">Source:</span>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
          {source}
        </a>
      ) : (
        <span>{source}</span>
      )}
      <span className="mx-0.5 text-gray-600">·</span>
      <span className="text-gray-400">{formatTime(fetchedAt)}</span>
      <span className="mx-0.5 text-gray-600">·</span>
      <span>{label}</span>
    </span>
  );

  return badge;
}
