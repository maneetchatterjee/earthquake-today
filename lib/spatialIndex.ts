export interface Point {
  lat: number;
  lng: number;
  [key: string]: unknown;
}

export interface Cluster {
  lat: number;
  lng: number;
  count: number;
  points: Point[];
}

export function clusterPoints(points: Point[], gridSize = 5): Cluster[] {
  const cells = new Map<string, Point[]>();

  for (const point of points) {
    const cellLat = Math.floor(point.lat / gridSize) * gridSize;
    const cellLng = Math.floor(point.lng / gridSize) * gridSize;
    const key = `${cellLat}:${cellLng}`;
    const existing = cells.get(key);
    if (existing) {
      existing.push(point);
    } else {
      cells.set(key, [point]);
    }
  }

  const clusters: Cluster[] = [];
  for (const cellPoints of cells.values()) {
    const lat = cellPoints.reduce((s, p) => s + p.lat, 0) / cellPoints.length;
    const lng = cellPoints.reduce((s, p) => s + p.lng, 0) / cellPoints.length;
    clusters.push({ lat, lng, count: cellPoints.length, points: cellPoints });
  }

  return clusters;
}
