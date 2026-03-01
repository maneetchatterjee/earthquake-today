export interface USGSFeature {
  type: 'Feature';
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number | null;
    dmin: number | null;
    rms: number | null;
    gap: number | null;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
  id: string;
}

export interface USGSResponse {
  type: 'FeatureCollection';
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: USGSFeature[];
}

export type TimePeriod = 'hour' | 'day' | 'week' | 'month';

export interface EarthquakeStats {
  total: number;
  hourly: number;
  weekly: number;
  monthly: number;
  largestToday: USGSFeature | null;
  mostRecent: USGSFeature | null;
  tsunamiAlertsToday: number;
  avgMagnitudeToday: number;
}

// Weather types
export interface City {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

export interface WeatherData {
  city: City;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  precipitation: number;
  rain: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressure: number;
  loading: boolean;
  error: string | null;
}

// Air Quality types
export interface AirQualityData {
  city: City;
  usAqi: number;
  europeanAqi: number;
  pm25: number;
  pm10: number;
  ozone: number;
  no2: number;
  so2: number;
  co: number;
  loading: boolean;
  error: string | null;
}

// Wildfire types
export interface WildfirePoint {
  lat: number;
  lng: number;
  brightness: number;
  scan: number;
  track: number;
  acqDate: string;
  acqTime: string;
  satellite: string;
  confidence: string;
  brightT31: number;
  frp: number;
}

// Tide types
export interface TideStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface TidePrediction {
  t: string; // time
  v: string; // value
  type: string; // H or L
}

// Marine types
export interface MarinePoint {
  name: string;
  lat: number;
  lng: number;
  waveHeight: number;
  waveDirection: number;
  wavePeriod: number;
  swellHeight: number;
  windWaveHeight: number;
  loading: boolean;
  error: string | null;
}

// News types
export interface NewsArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: 'NASA' | 'UN' | 'Guardian' | 'ReliefWeb';
}
