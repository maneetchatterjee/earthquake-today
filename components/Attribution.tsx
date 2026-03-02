interface AttributionProps {
  source: string;
  url: string;
  license?: string;
}

export default function Attribution({ source, url, license }: AttributionProps) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-400 hover:text-orange-300 underline"
      >
        {source}
        <span className="ml-0.5" aria-hidden>↗</span>
      </a>
      {license && <span className="text-gray-500">· {license}</span>}
    </span>
  );
}
