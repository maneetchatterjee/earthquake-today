'use client';

import { useState, useCallback, useMemo } from 'react';
import { evaluateAlerts, Alert, AlertData } from '@/lib/alertEngine';

export function useAlertEngine(data: AlertData) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const allAlerts = useMemo(() => evaluateAlerts(data), [data]);

  const alerts = useMemo(
    () => allAlerts.filter((a) => !dismissed.has(a.id)),
    [allAlerts, dismissed]
  );

  const dismissAlert = useCallback((id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  }, []);

  const clearAlerts = useCallback(() => {
    setDismissed(new Set(allAlerts.map((a) => a.id)));
  }, [allAlerts]);

  return { alerts, dismissAlert, clearAlerts };
}

export type { Alert, AlertData };
