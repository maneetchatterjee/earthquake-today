# 🌍 Earth Monitor

A real-time global **Environmental Monitoring Suite** built with **Next.js 16+**, **Tailwind CSS**, **Leaflet**, and **Recharts**. Tracks earthquakes, weather, air quality, wildfires, ocean conditions, UV index, environmental counters, and environmental news.

## Features

### 🌋 Earthquake Monitoring (original)
- 🔴 **Live counters** — animated Worldometer-style cards for today, this hour, this week, this month
- 🗺️ **Interactive world map** — earthquake positions with depth-coded colors and magnitude-sized circles
- 📊 **Charts & analytics** — magnitude distribution, hourly activity, depth distribution, magnitude vs depth scatter
- 📋 **Live earthquake table** — sortable, filterable, paginated table of all recent events
- 🌊 **Tsunami Warning Panel**, 🌋 **Volcano Alerts**, 🌐 **3D Globe View**, 🤖 **AI Summary**

### 🌡️ Weather Dashboard
- Live weather for 20 major cities via **Open-Meteo**
- Temperature (°C/°F toggle), humidity, wind speed/direction, precipitation, cloud cover, pressure
- Summary cards: hottest, coldest, rainiest, windiest city
- ⚠️ **Severe Weather Alerts** — thunderstorms, high winds, extreme heat/cold, heavy rain/snow

### 💨 Air Quality
- US AQI and European AQI for all 20 cities
- Sortable table with AQI color bars
- Category breakdown counter grid
- Best/worst city highlighted

### 🔥 Wildfire Tracker
- NASA FIRMS VIIRS satellite fire detection data
- Fire detection table with brightness, FRP, confidence

### 🌊 Oceans & Tides
- **NOAA CO-OPS tide predictions** for 10 US stations with Recharts LineChart
- **Marine conditions** (wave height, swell, direction, period) for 10 ocean regions

### ☀️ UV Index
- Current UV index for all 20 cities with color-coded safety recommendations

### 🌍 Environmental Counters
- Real-time Worldometer-style counters: CO₂ emitted, forest lost, land desertified, water used, waste dumped today

### 📰 Environmental News
- RSS feeds from NASA Earth Observatory, ReliefWeb, UN Climate Change, The Guardian
- Filter by source, breaking news ticker

## Environment Variables

```env
NEXT_PUBLIC_FIRMS_MAP_KEY=your_nasa_firms_api_key  # optional, enables wildfire data
```

Get a free NASA FIRMS API key at: https://firms.modaps.eosdis.nasa.gov/api/area/

## Setup

```bash
npm install
cp .env.local.example .env.local  # add NEXT_PUBLIC_FIRMS_MAP_KEY if desired
npm run dev
```

## API Attributions

- **USGS** — Earthquake data (https://earthquake.usgs.gov)
- **Open-Meteo** — Weather, Air Quality, Marine, UV index (https://open-meteo.com)
- **NASA FIRMS** — Wildfire detection (https://firms.modaps.eosdis.nasa.gov)
- **NOAA CO-OPS** — Tide predictions (https://tidesandcurrents.noaa.gov)
- **RSS2JSON** — RSS feed proxy (https://rss2json.com)

## Tech Stack

- Next.js 16, TypeScript, Tailwind CSS v4
- Recharts (charts), React-Leaflet (maps), Globe.gl (3D globe)

## License

MIT

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet](https://leafletjs.com/) / [react-leaflet](https://react-leaflet.js.org/)
- [Recharts](https://recharts.org/)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data Source

All earthquake data is provided by the **[USGS Earthquake Hazards Program](https://earthquake.usgs.gov/)** via their free GeoJSON feeds:

- Past Hour: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`
- Past Day: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
- Past 7 Days: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`
- Past 30 Days: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`

## License

MIT
