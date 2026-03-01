export interface MoonPhase {
  phase: number; // 0-1
  illumination: number; // 0-100
  phaseName: string;
  emoji: string;
  nextFullMoon: Date;
  nextNewMoon: Date;
}

// Known new moon reference: Jan 11, 2024 11:57 UTC
const KNOWN_NEW_MOON = new Date('2024-01-11T11:57:00Z').getTime();
const LUNAR_CYCLE_MS = 29.530588853 * 24 * 60 * 60 * 1000;

export function getMoonPhase(date: Date = new Date()): MoonPhase {
  const elapsed = date.getTime() - KNOWN_NEW_MOON;
  const cycles = elapsed / LUNAR_CYCLE_MS;
  const phase = cycles - Math.floor(cycles); // 0-1

  const illumination = Math.round((1 - Math.cos(2 * Math.PI * phase)) * 50);

  let phaseName: string;
  let emoji: string;
  if (phase < 0.025 || phase >= 0.975) { phaseName = 'New Moon'; emoji = '🌑'; }
  else if (phase < 0.25) { phaseName = 'Waxing Crescent'; emoji = '🌒'; }
  else if (phase < 0.275) { phaseName = 'First Quarter'; emoji = '🌓'; }
  else if (phase < 0.5) { phaseName = 'Waxing Gibbous'; emoji = '🌔'; }
  else if (phase < 0.525) { phaseName = 'Full Moon'; emoji = '🌕'; }
  else if (phase < 0.75) { phaseName = 'Waning Gibbous'; emoji = '🌖'; }
  else if (phase < 0.775) { phaseName = 'Last Quarter'; emoji = '🌗'; }
  else { phaseName = 'Waning Crescent'; emoji = '🌘'; }

  // Next full moon: phase 0.5
  const fullMoonFraction = 0.5;
  const fullMoonOffset = phase < fullMoonFraction
    ? (fullMoonFraction - phase) * LUNAR_CYCLE_MS
    : (1 + fullMoonFraction - phase) * LUNAR_CYCLE_MS;
  const nextFullMoon = new Date(date.getTime() + fullMoonOffset);

  // Next new moon: phase 0
  const newMoonOffset = (1 - phase) * LUNAR_CYCLE_MS;
  const nextNewMoon = new Date(date.getTime() + newMoonOffset);

  return { phase, illumination, phaseName, emoji, nextFullMoon, nextNewMoon };
}
