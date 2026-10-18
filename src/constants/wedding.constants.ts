import type { BudgetCategoryOption, TimePhaseOption } from '../types/wedding.types';

export const CATEGORY_OPTIONS: BudgetCategoryOption[] = [
  { id: 'VENUE_CATERING', label: 'Venue & Katering' },
  { id: 'MUA_ATTIRE', label: 'MUA & Busana' },
  { id: 'DECORATION', label: 'Dekorasi' },
  { id: 'DOCUMENTATION', label: 'Dokumentasi' },
  { id: 'INVITATION_SOUVENIR', label: 'Undangan & Souvenir' },
  { id: 'OTHER', label: 'Lainnya' },
];

export const TIME_PHASES: TimePhaseOption[] = [
  { id: 'ALL', label: 'Semua' },
  { id: 'H_12_6_MONTHS', label: 'H-12 s/d H-6 Bln' },
  { id: 'H_3_MONTHS', label: 'H-3 Bln' },
  { id: 'H_1_MONTH', label: 'H-1 Bln' },
  { id: 'H_7_DAYS', label: 'H-7 Hari' },
  { id: 'WEDDING_DAY', label: 'Hari-H' },
];
