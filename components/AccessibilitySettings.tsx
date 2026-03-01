'use client';

import { useState, useEffect } from 'react';

interface A11ySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
}

export default function AccessibilitySettings() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('a11y-settings');
      if (stored) {
        const parsed = JSON.parse(stored) as A11ySettings;
        setSettings(parsed);
        applySettings(parsed);
      }
    } catch (e) {
      console.warn('Could not read accessibility settings from localStorage:', e);
    }
  }, []);

  const applySettings = (s: A11ySettings) => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', s.highContrast);
    root.classList.toggle('reduce-motion', s.reducedMotion);
    root.classList.toggle('large-text', s.largeText);
  };

  const toggle = (key: keyof A11ySettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    applySettings(next);
    try {
      localStorage.setItem('a11y-settings', JSON.stringify(next));
    } catch (e) {
      console.warn('Could not save accessibility settings to localStorage:', e);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white transition-colors"
        aria-label="Accessibility settings"
      >
        ♿
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 backdrop-blur-xl bg-[#0A0E1A]/95 border border-white/10 rounded-xl shadow-xl z-50 p-3">
          <div className="text-slate-400 text-xs mb-3 font-medium">Accessibility</div>
          {[
            { key: 'highContrast' as const, label: 'High Contrast', icon: '🔲' },
            { key: 'reducedMotion' as const, label: 'Reduce Motion', icon: '🎬' },
            { key: 'largeText' as const, label: 'Large Text', icon: '🔠' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => toggle(opt.key)}
              className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm text-white">
                <span>{opt.icon}</span>
                {opt.label}
              </span>
              <div className={`w-8 h-4 rounded-full transition-colors ${settings[opt.key] ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                <div className={`w-3 h-3 rounded-full bg-white m-0.5 transition-transform ${settings[opt.key] ? 'translate-x-4' : ''}`} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
