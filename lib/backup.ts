const BACKUP_KEY = 'earthmonitor_backup_v1';
const INDIVIDUAL_KEYS = ['earth-monitor-preferences', 'earth-monitor-history', 'sidebar-collapsed'];

export function backupState(): void {
  try {
    const snapshot: Record<string, string | null> = {};
    for (const key of INDIVIDUAL_KEYS) {
      snapshot[key] = localStorage.getItem(key);
    }
    localStorage.setItem(BACKUP_KEY, JSON.stringify({ ts: Date.now(), data: snapshot }));
  } catch (e) {
    console.warn('backupState failed:', e);
  }
}

export function restoreState(): boolean {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { data: Record<string, string | null> };
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== null) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    }
    return true;
  } catch (e) {
    console.warn('restoreState failed:', e);
    return false;
  }
}

export function startAutoBackup(): () => void {
  const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
  const id = setInterval(backupState, INTERVAL_MS);
  // Run once immediately
  backupState();
  return () => clearInterval(id);
}
