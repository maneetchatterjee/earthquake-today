'use client';

import { useState, useEffect } from 'react';

const DISMISSED_KEY = 'em-disclaimer-dismissed';

export default function Disclaimer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISSED_KEY);
      if (!dismissed) {
        // Defer to next tick to avoid synchronous setState-in-effect warning
        const id = setTimeout(() => setVisible(true), 0);
        return () => clearTimeout(id);
      }
    } catch {
      setTimeout(() => setVisible(true), 0);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(DISMISSED_KEY, '1'); } catch { /* ignore */ }
  }

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="w-full bg-yellow-900/80 border-b border-yellow-700 text-yellow-100 text-sm px-4 py-3 flex items-center gap-3"
    >
      <span className="flex-1">
        ⚠️ This dashboard is for informational purposes only. Do not use for emergency decision-making.
        Always follow official government warnings and evacuation orders.
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss disclaimer"
        className="flex-shrink-0 text-yellow-300 hover:text-white font-bold text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
