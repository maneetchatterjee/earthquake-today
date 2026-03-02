'use client';

import { useState } from 'react';
import { usePreferences, DEFAULT_PREFERENCES } from '@/lib/preferences';

interface PreferencesPanelProps {
  onClose?: () => void;
}

export default function PreferencesPanel({ onClose }: PreferencesPanelProps) {
  const [open, setOpen] = useState(false);
  const [prefs, updatePrefs, resetPrefs] = usePreferences();

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm transition-colors border border-gray-600"
        aria-label="Open preferences"
      >
        ⚙️ Settings
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Preferences"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h2 className="text-white font-bold text-lg">⚙️ Preferences</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
                aria-label="Close preferences"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Units */}
              <section>
                <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-3">Units</h3>
                <div className="flex gap-2">
                  {(['metric', 'imperial'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => updatePrefs({ units: u })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        prefs.units === u
                          ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      {u.charAt(0).toUpperCase() + u.slice(1)}
                    </button>
                  ))}
                </div>
              </section>

              {/* Refresh interval */}
              <section>
                <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-3">Refresh Interval</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={15}
                    max={300}
                    step={15}
                    value={prefs.refreshInterval}
                    onChange={(e) => updatePrefs({ refreshInterval: Number(e.target.value) })}
                    className="flex-1 accent-orange-500"
                  />
                  <span className="text-white text-sm w-16 text-right">{prefs.refreshInterval}s</span>
                </div>
              </section>

              {/* Alert thresholds */}
              <section>
                <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-3">Alert Thresholds</h3>
                <div className="space-y-3">
                  {[
                    { key: 'earthquakeMag', label: '🌍 Earthquake Magnitude', min: 4, max: 9, step: 0.1 },
                    { key: 'aqi', label: '💨 AQI', min: 50, max: 300, step: 10 },
                    { key: 'uv', label: '☀️ UV Index', min: 3, max: 11, step: 1 },
                    { key: 'wildfires', label: '🔥 Wildfire Count', min: 10, max: 200, step: 10 },
                  ].map(({ key, label, min, max, step }) => (
                    <div key={key} className="flex items-center gap-3">
                      <label className="text-gray-400 text-sm w-44 shrink-0">{label}</label>
                      <input
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        value={prefs.alertThresholds[key as keyof typeof prefs.alertThresholds]}
                        onChange={(e) =>
                          updatePrefs({
                            alertThresholds: {
                              ...prefs.alertThresholds,
                              [key]: Number(e.target.value),
                            },
                          })
                        }
                        className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Default location */}
              <section>
                <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-3">Default Location</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'defaultLat', label: 'Latitude', min: -90, max: 90 },
                    { key: 'defaultLng', label: 'Longitude', min: -180, max: 180 },
                  ].map(({ key, label, min, max }) => (
                    <div key={key}>
                      <label className="text-gray-400 text-xs block mb-1">{label}</label>
                      <input
                        type="number"
                        min={min}
                        max={max}
                        step={0.0001}
                        value={prefs[key as 'defaultLat' | 'defaultLng']}
                        onChange={(e) => updatePrefs({ [key]: Number(e.target.value) })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Reset */}
              <div className="border-t border-gray-700 pt-4">
                <button
                  onClick={() => {
                    resetPrefs();
                  }}
                  className="text-gray-500 hover:text-red-400 text-sm transition-colors"
                >
                  Reset to defaults
                </button>
                <span className="text-gray-600 text-xs ml-3">
                  Default: {DEFAULT_PREFERENCES.units}, {DEFAULT_PREFERENCES.refreshInterval}s refresh
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
