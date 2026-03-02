export const ALLOWED_DOMAINS = [
  'earthquake.usgs.gov',
  'api.open-meteo.com',
  'air-quality-api.open-meteo.com',
  'marine-api.open-meteo.com',
  'services.swpc.noaa.gov',
  'api.nasa.gov',
  'firms.modaps.eosdis.nasa.gov',
  'api.carbonintensity.org.uk',
  'opensky-network.org',
  'api.tidesandcurrents.noaa.gov',
  'api.wolfx.jp',
  'nominatim.openstreetmap.org',
  'api.open-notify.org',
  'api.rss2json.com',
];

export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    return ALLOWED_DOMAINS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&;`\\]/g, '');
}

/** Strip all HTML tags and dangerous content from a string */
export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/<[^>]* on\w+[\s\S]*?>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}
