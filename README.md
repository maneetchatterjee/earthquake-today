# 🌍 Earth Monitor

A real-time global Earth monitoring platform built with Next.js 16, React 19, and Tailwind CSS v4.

## Features

- 🌋 **Earthquakes** — Live USGS data, interactive maps, 3D globe, charts, tsunami alerts
- 🌡️ **Weather** — Real-time weather for major cities via Open-Meteo, severe weather alerts
- 💨 **Air Quality** — Global AQI monitoring using Open-Meteo Air Quality API
- 🔥 **Wildfires** — NASA FIRMS active fire data (VIIRS/SNPP)
- 🌊 **Oceans & Tides** — NOAA tide predictions, marine conditions, ocean temperatures
- 🌌 **Space** — Solar activity (NOAA SWPC), ISS tracker, asteroid monitor, moon phase
- ⚡ **Energy & Emissions** — UK carbon intensity, renewable %, CO₂ ticking counters
- 🧲 **Atmosphere & Science** — Geomagnetic activity, aurora probability, atmospheric composition
- 🛩️ **Human Activity** — World population counter, live flight count, internet stats
- 📰 **News** — Environmental news feed
- 📍 **My Location** — Personalized local weather, AQI, and nearby earthquakes
- 🏆 **Records & Score** — Earth Health Score, daily and all-time records

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS v4
- **Maps**: Leaflet + react-leaflet, globe.gl
- **Charts**: Recharts
- **Gauges**: react-gauge-component
- **Animations**: framer-motion
- **Fonts**: Space Grotesk, JetBrains Mono (@fontsource)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional API Keys

Set in `.env.local`:

```env
NEXT_PUBLIC_FIRMS_MAP_KEY=your_nasa_firms_key
NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key
```

## Data Sources

| Source | Data |
|--------|------|
| USGS Earthquake Hazards Program | Seismic events |
| Open-Meteo | Weather & air quality |
| NASA FIRMS | Active wildfires |
| NOAA CO-OPS | Tide predictions |
| NOAA SWPC | Solar activity, Kp index |
| Open Notify | ISS position & crew |
| NASA NeoWs | Near-Earth asteroids |
| Carbon Intensity API (UK) | Energy & carbon |
| OpenSky Network | Live flights |
| Nominatim (OSM) | Reverse geocoding |

## License

MIT
