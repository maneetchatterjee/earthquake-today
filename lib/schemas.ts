import { z } from 'zod';

// ── USGS GeoJSON Earthquake ────────────────────────────────────────────────
const EarthquakeFeatureSchema = z.object({
  type: z.literal('Feature'),
  id: z.string(),
  properties: z.object({
    mag: z.number().nullable(),
    place: z.string().nullable(),
    time: z.number().nullable(),
    updated: z.number().nullable().optional(),
    tsunami: z.number().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    net: z.string().optional(),
    code: z.string().optional(),
    url: z.string().optional(),
    detail: z.string().optional(),
  }),
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number(), z.number()]),
  }).nullable(),
});

export const EarthquakeSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(EarthquakeFeatureSchema),
  metadata: z.object({
    count: z.number().optional(),
    title: z.string().optional(),
    generated: z.number().optional(),
  }).optional(),
});

// ── Open-Meteo Weather ─────────────────────────────────────────────────────
export const WeatherSchema = z.object({
  current: z.object({
    temperature_2m: z.number().optional(),
    relative_humidity_2m: z.number().optional(),
    wind_speed_10m: z.number().optional(),
    weather_code: z.number().optional(),
    apparent_temperature: z.number().optional(),
    precipitation: z.number().optional(),
  }),
  current_units: z.record(z.string(), z.string()).optional(),
  hourly: z.record(z.string(), z.unknown()).optional(),
  daily: z.record(z.string(), z.unknown()).optional(),
});

// ── Air Quality ────────────────────────────────────────────────────────────
export const AirQualitySchema = z.object({
  current: z.object({
    us_aqi: z.number().nullable().optional(),
    pm10: z.number().nullable().optional(),
    pm2_5: z.number().nullable().optional(),
    carbon_monoxide: z.number().nullable().optional(),
    nitrogen_dioxide: z.number().nullable().optional(),
    ozone: z.number().nullable().optional(),
  }).optional(),
  hourly: z.record(z.string(), z.unknown()).optional(),
});

// ── Wildfire (NASA FIRMS) ──────────────────────────────────────────────────
export const WildfireSchema = z.object({
  type: z.literal('FeatureCollection').optional(),
  features: z.array(
    z.object({
      type: z.string().optional(),
      properties: z.object({
        acq_date: z.string().optional(),
        brightness: z.number().optional(),
        frp: z.number().optional(),
        confidence: z.union([z.string(), z.number()]).optional(),
      }).passthrough(),
      geometry: z.object({
        type: z.string(),
        coordinates: z.array(z.number()),
      }).optional(),
    })
  ).optional(),
}).passthrough();

// ── Tides ──────────────────────────────────────────────────────────────────
export const TideSchema = z.object({
  predictions: z.array(
    z.object({
      t: z.string(),
      v: z.string(),
    })
  ).optional(),
  extremes: z.array(
    z.object({
      t: z.string(),
      v: z.string(),
      type: z.string(),
    })
  ).optional(),
}).passthrough();

// ── Energy ─────────────────────────────────────────────────────────────────
export const EnergySchema = z.object({
  response: z.object({
    data: z.array(z.record(z.string(), z.unknown())).optional(),
  }).optional(),
}).passthrough();

// ── Solar ──────────────────────────────────────────────────────────────────
export const SolarSchema = z.object({
  properties: z.object({
    parameter: z.record(z.string(), z.unknown()),
  }).optional(),
  features: z.array(z.unknown()).optional(),
}).passthrough();

// ── News ───────────────────────────────────────────────────────────────────
export const NewsSchema = z.object({
  articles: z.array(
    z.object({
      title: z.string(),
      url: z.string().optional(),
      publishedAt: z.string().optional(),
      description: z.string().nullable().optional(),
      source: z.object({ name: z.string() }).optional(),
    })
  ).optional(),
  status: z.string().optional(),
  totalResults: z.number().optional(),
}).passthrough();

// ── Marine ─────────────────────────────────────────────────────────────────
export const MarineSchema = z.object({
  current: z.object({
    wave_height: z.number().optional(),
    wave_direction: z.number().optional(),
    wave_period: z.number().optional(),
    wind_wave_height: z.number().optional(),
  }).optional(),
  hourly: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

// ── ISS ────────────────────────────────────────────────────────────────────
export const ISSSchema = z.object({
  iss_position: z.object({
    latitude: z.string(),
    longitude: z.string(),
  }).optional(),
  timestamp: z.number().optional(),
  message: z.string().optional(),
}).passthrough();

// ── Flight ─────────────────────────────────────────────────────────────────
export const FlightSchema = z.object({
  states: z.array(z.array(z.unknown())).nullable().optional(),
  time: z.number().optional(),
}).passthrough();
