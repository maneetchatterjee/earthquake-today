export const CO2_RATE_TONS_PER_SECOND = 1268;
export const CO2_PPM = 425.3;
export const EMISSIONS_REFERENCE_DATE = new Date('2026-01-01T00:00:00Z');

export interface EmissionSector {
  name: string;
  percent: number;
  color: string;
  emoji: string;
}

export const EMISSIONS_BY_SECTOR: EmissionSector[] = [
  { name: 'Energy', percent: 34, color: '#FF3366', emoji: '⚡' },
  { name: 'Transport', percent: 16, color: '#FFB800', emoji: '🚗' },
  { name: 'Industry', percent: 24, color: '#A855F7', emoji: '🏭' },
  { name: 'Agriculture', percent: 11, color: '#00FF88', emoji: '🌾' },
  { name: 'Buildings', percent: 6, color: '#3B82F6', emoji: '🏢' },
  { name: 'Waste', percent: 3, color: '#94A3B8', emoji: '🗑️' },
  { name: 'Land Use', percent: 6, color: '#00FFFF', emoji: '🌳' },
];

export function getElapsedCO2(referenceDate: Date = EMISSIONS_REFERENCE_DATE): number {
  const elapsedSeconds = (Date.now() - referenceDate.getTime()) / 1000;
  return Math.max(0, elapsedSeconds * CO2_RATE_TONS_PER_SECOND);
}
