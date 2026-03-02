export interface Snapshot {
  date: string;
  earthquakeCount: number;
  maxMagnitude: number;
  avgAqi: number;
  wildfireCount: number;
  timestamp: number;
}

const STORAGE_KEY = 'earth-monitor-history';
const MAX_DAYS = 30;

export function getHistory(): Snapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Snapshot[];
  } catch {
    return [];
  }
}

export function addSnapshot(snap: Snapshot): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    const existing = history.findIndex((s) => s.date === snap.date);
    if (existing >= 0) {
      history[existing] = snap;
    } else {
      history.push(snap);
    }
    // Keep only last MAX_DAYS
    const trimmed = history
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_DAYS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
