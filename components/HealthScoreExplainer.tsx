'use client';

import { useState } from 'react';
import { HealthScoreInput, calculateHealthScore } from '@/lib/healthScore';

interface HealthScoreExplainerProps {
  input?: HealthScoreInput;
}

interface Factor {
  label: string;
  icon: string;
  maxDeduction: number;
  currentDeduction: number;
  detail: string;
}

function computeFactors(input: HealthScoreInput): Factor[] {
  const eqCount = input.earthquakeCount ?? 0;
  const maxMag = input.maxMagnitude ?? 0;
  const eqDeduction = Math.min(20, eqCount * 0.05) + (maxMag > 5 ? Math.min(10, (maxMag - 5) * 3) : 0);

  let aqiDeduction = 0;
  const aqi = input.avgAqi;
  if (aqi !== undefined) {
    if (aqi > 150) aqiDeduction = 20;
    else if (aqi > 100) aqiDeduction = 10;
    else if (aqi > 50) aqiDeduction = 5;
  }

  const temp = input.avgTemp;
  const tempDeduction = temp !== undefined ? Math.min(10, Math.abs(temp - 15) * 0.3) : 0;

  const fireCount = input.fireCount ?? 0;
  const fireDeduction = Math.min(15, fireCount * 0.001);

  const kp = input.kpIndex ?? 0;
  const geoDeduction = kp > 5 ? Math.min(10, (kp - 5) * 2) : 0;

  const carbon = input.carbonIntensity;
  let carbonDeduction = 0;
  if (carbon !== undefined) {
    if (carbon > 200) carbonDeduction = 10;
    else if (carbon > 100) carbonDeduction = 5;
  }

  return [
    {
      label: 'Earthquake Activity',
      icon: '🌍',
      maxDeduction: 30,
      currentDeduction: Math.round(eqDeduction * 10) / 10,
      detail: `${eqCount} events, max M${maxMag.toFixed(1)}`,
    },
    {
      label: 'Air Quality (AQI)',
      icon: '💨',
      maxDeduction: 20,
      currentDeduction: aqiDeduction,
      detail: aqi !== undefined ? `AQI ${aqi}` : 'No data',
    },
    {
      label: 'Temperature Anomaly',
      icon: '🌡️',
      maxDeduction: 10,
      currentDeduction: Math.round(tempDeduction * 10) / 10,
      detail: temp !== undefined ? `${temp.toFixed(1)}°C (baseline 15°C)` : 'No data',
    },
    {
      label: 'Wildfire Activity',
      icon: '🔥',
      maxDeduction: 15,
      currentDeduction: Math.round(fireDeduction * 10) / 10,
      detail: `${fireCount} active fires`,
    },
    {
      label: 'Geomagnetic Storm',
      icon: '🧲',
      maxDeduction: 10,
      currentDeduction: geoDeduction,
      detail: `Kp index: ${kp.toFixed(1)}`,
    },
    {
      label: 'Carbon Intensity',
      icon: '🏭',
      maxDeduction: 10,
      currentDeduction: carbonDeduction,
      detail: carbon !== undefined ? `${carbon} gCO₂/kWh` : 'No data',
    },
  ];
}

export default function HealthScoreExplainer({ input = {} }: HealthScoreExplainerProps) {
  const [open, setOpen] = useState(false);
  const score = calculateHealthScore(input);
  const factors = computeFactors(input);
  const totalDeduction = factors.reduce((acc, f) => acc + f.currentDeduction, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs font-bold border border-gray-600 transition-colors"
        aria-label="How is the Earth Health Score calculated?"
        title="How is this score calculated?"
      >
        i
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Earth Health Score Explainer"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <div>
                <h2 className="text-white font-bold text-lg">🌍 Earth Health Score</h2>
                <p className="text-gray-400 text-sm mt-0.5">How the score is calculated</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Current score */}
              <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div>
                  <div className="text-gray-400 text-sm">Current Score</div>
                  <div className="text-4xl font-bold text-white mt-1">{score}<span className="text-gray-500 text-lg">/100</span></div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">Total Deductions</div>
                  <div className="text-2xl font-bold text-red-400 mt-1">−{Math.round(totalDeduction * 10) / 10}</div>
                </div>
              </div>

              {/* Factors */}
              <div className="space-y-3">
                <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Factors</h3>
                {factors.map((factor) => {
                  const pct = factor.maxDeduction > 0 ? (factor.currentDeduction / factor.maxDeduction) * 100 : 0;
                  return (
                    <div key={factor.label} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span>{factor.icon}</span>
                          <span className="text-white text-sm font-medium">{factor.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-red-400 text-sm font-semibold">−{factor.currentDeduction}</span>
                          <span className="text-gray-500 text-xs"> / max {factor.maxDeduction}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1.5">
                        <div
                          className="bg-red-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <div className="text-gray-500 text-xs">{factor.detail}</div>
                    </div>
                  );
                })}
              </div>

              <p className="text-gray-500 text-xs border-t border-gray-700 pt-3">
                Score starts at 100 and deductions are applied based on current environmental conditions. Minimum score is 0.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
