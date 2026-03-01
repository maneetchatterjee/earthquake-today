export const BASE_POPULATION = 8_100_000_000;
export const POPULATION_REFERENCE_DATE = new Date('2026-01-01T00:00:00Z');
export const BIRTH_RATE_PER_SECOND = 4.4;
export const DEATH_RATE_PER_SECOND = 2.1;

export function getCurrentPopulation(referenceDate: Date = POPULATION_REFERENCE_DATE): number {
  const elapsedSeconds = (Date.now() - referenceDate.getTime()) / 1000;
  const netGrowth = elapsedSeconds * (BIRTH_RATE_PER_SECOND - DEATH_RATE_PER_SECOND);
  return Math.round(BASE_POPULATION + netGrowth);
}

export function getBirthsToday(referenceDate: Date = POPULATION_REFERENCE_DATE): number {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const secondsToday = (now.getTime() - startOfDay.getTime()) / 1000;
  return Math.round(secondsToday * BIRTH_RATE_PER_SECOND);
}

export function getDeathsToday(): number {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const secondsToday = (now.getTime() - startOfDay.getTime()) / 1000;
  return Math.round(secondsToday * DEATH_RATE_PER_SECOND);
}
