# 🌍 Earthquakes Today

A real-time global earthquake monitoring dashboard built with **Next.js 16+**, **Tailwind CSS**, **Leaflet**, and **Recharts**. Inspired by Worldometer, this dashboard shows live seismic activity from the **USGS Earthquake Hazards Program**.

## Features

### Core Features
- 🔴 **Live counters** — animated Worldometer-style cards for today, this hour, this week, this month
- 🗺️ **Interactive world map** — earthquake positions with depth-coded colors and magnitude-sized circles
- 📊 **Charts & analytics** — magnitude distribution, hourly activity, depth distribution, magnitude vs depth scatter
- 📋 **Live earthquake table** — sortable, filterable, paginated table of all recent events
- 📈 **Magnitude breakdown** — bar chart + counter rows for all magnitude ranges
- 📋 **Statistics summary** — deepest, shallowest, average depth, regions affected, total seismic energy
- ♻️ **Auto-refresh every 60 seconds**
- 🌙 **Dark seismic theme**

### New Features
- 🌍 **Tectonic Plate Boundaries** — toggleable GeoJSON overlay on the map showing major plate boundaries with orange polylines
- 🔔 **EEW Banner** — real-time Early Earthquake Warning alerts from Wolfx Open API (JMA), shown as an animated red banner when M4+ warnings are detected
- 📜 **Historical Earthquake Search** — search the USGS FDSN Event API by date range and magnitude; results shown in the earthquake table
- 🌊 **Tsunami Warning Panel** — dedicated section showing tsunami-flagged earthquakes with severity color coding; green "all clear" when none active
- 📊 **Earthquake Impact Score** — composite score (0–100) based on magnitude, depth, and USGS significance rating; color-coded Low/Moderate/High/Critical badges
- 🔥 **Heatmap View** — toggle between Markers, Heatmap, and Both views on the map using `leaflet.heat`
- 📈 **Trend Analysis** — compares today's activity vs. the 30-day daily average with ↑↓→ indicators and a 24h area chart
- 🗺️ **Region Dashboard** — dropdown selector for 10 major seismic zones (Japan, Alaska, California, Chile, Indonesia, Mediterranean, etc.); filters map and table
- 🌙 **Light/Dark Theme** — sun/moon toggle in the header; persisted in `localStorage`; inline script prevents flash of unstyled content
- 🌐 **3D Globe View** — `globe.gl`-powered interactive 3D globe with magnitude altitude, depth-colored points, auto-rotation, and pause on hover
- 🤖 **AI-Powered Summary** — template-based daily natural language summary of seismic activity with copy-to-clipboard button
- 🌋 **Volcano Proximity Alerts** — 98 active volcanoes dataset; alerts when M4+ earthquakes occur within 100km of a volcano; HIGH ALERT badge for M5+/50km

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
