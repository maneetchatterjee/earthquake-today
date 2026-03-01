# 🌍 Earthquakes Today

A real-time global earthquake monitoring dashboard built with **Next.js 16+**, **Tailwind CSS**, **Leaflet**, and **Recharts**. Inspired by Worldometer, this dashboard shows live seismic activity from the **USGS Earthquake Hazards Program**.

## Features

- 🔴 **Live counters** — animated Worldometer-style cards for today, this hour, this week, this month
- 🗺️ **Interactive world map** — earthquake positions with depth-coded colors and magnitude-sized circles
- 📊 **Charts & analytics** — magnitude distribution, hourly activity, depth distribution, magnitude vs depth scatter
- 📋 **Live earthquake table** — sortable, filterable, paginated table of all recent events
- 📈 **Magnitude breakdown** — bar chart + counter rows for all magnitude ranges
- 📋 **Statistics summary** — deepest, shallowest, average depth, regions affected, total seismic energy
- ♻️ **Auto-refresh every 60 seconds**
- 🌙 **Dark seismic theme**

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
