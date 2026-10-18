import type {
  BudgetCategoryOption,
  TimePhaseOption,
  GuestCategory,
  GuestSide,
  VendorCategory,
  VendorStatus,
  JournalCategory,
} from '../types/wedding.types';

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

export const GUEST_CATEGORY_OPTIONS: { id: GuestCategory; label: string }[] = [
  { id: 'VIP', label: 'VIP' },
  { id: 'FAMILY', label: 'Keluarga' },
  { id: 'FRIEND', label: 'Sahabat' },
  { id: 'COLLEAGUE', label: 'Rekan Kerja' },
  { id: 'OTHER', label: 'Lainnya' },
];

export const GUEST_SIDE_OPTIONS: { id: GuestSide; label: string }[] = [
  { id: 'BRIDE', label: 'Pihak Wanita' },
  { id: 'GROOM', label: 'Pihak Pria' },
  { id: 'BOTH', label: 'Kedua Pihak' },
];

export const VENDOR_CATEGORY_OPTIONS: { id: VendorCategory; label: string }[] = [
  { id: 'VENUE', label: 'Gedung / Tempat' },
  { id: 'CATERING', label: 'Katering' },
  { id: 'MUA', label: 'MUA & Hairdo' },
  { id: 'ATTIRE', label: 'Busana Pengantin' },
  { id: 'DECORATION', label: 'Dekorasi' },
  { id: 'DOCUMENTATION', label: 'Foto & Video' },
  { id: 'ENTERTAINMENT', label: 'Musik & MC' },
  { id: 'OTHER', label: 'Vendor Lainnya' },
];

export const VENDOR_STATUS_OPTIONS: { id: VendorStatus; label: string }[] = [
  { id: 'CONTACTED', label: 'Dihubungi' },
  { id: 'DP', label: 'Sudah DP' },
  { id: 'PAID', label: 'Lunas' },
  { id: 'COMPLETED', label: 'Selesai' },
];

export const JOURNAL_CATEGORY_OPTIONS: { id: JournalCategory; label: string }[] = [
  { id: 'MILESTONE', label: 'Capaian (Milestone)' },
  { id: 'VENDOR_MEETING', label: 'Temu Vendor' },
  { id: 'REFLECTION', label: 'Refleksi Rasa Syukur' },
  { id: 'MEMORABLE', label: 'Momen Berkesan' },
];
