import { z } from 'zod';

// 1. Task Form Schema
export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Nama tugas persiapan wajib diisi'),
  phase: z.enum(['H_12_6_MONTHS', 'H_3_MONTHS', 'H_1_MONTH', 'H_7_DAYS', 'WEDDING_DAY']),
  notes: z.string().optional(),
});
export type TaskFormValues = z.infer<typeof taskFormSchema>;

// 2. Expense Form Schema
export const expenseFormSchema = z.object({
  title: z.string().trim().min(1, 'Nama pos pengeluaran wajib diisi'),
  category: z.enum([
    'VENUE_CATERING',
    'MUA_ATTIRE',
    'DECORATION',
    'DOCUMENTATION',
    'INVITATION_SOUVENIR',
    'OTHER',
  ]),
  estimatedCost: z.number().min(0, 'Estimasi biaya tidak boleh bernilai negatif'),
  actualPaid: z.number().min(0, 'Realisasi bayar tidak boleh bernilai negatif'),
  notes: z.string().optional(),
});
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// 3. Guest Form Schema
export const guestFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama tamu undangan wajib diisi'),
  side: z.enum(['BRIDE', 'GROOM', 'BOTH']),
  category: z.enum(['VIP', 'FAMILY', 'FRIEND', 'COLLEAGUE', 'OTHER']),
  paxCount: z
    .number()
    .int('Jumlah pax harus bilangan bulat')
    .min(1, 'Jumlah pax minimal 1 orang'),
  contactInfo: z.string().optional(),
  notes: z.string().optional(),
});
export type GuestFormValues = z.infer<typeof guestFormSchema>;

// 4. Vendor Form Schema
export const vendorFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama vendor wajib diisi'),
  category: z.enum([
    'VENUE',
    'CATERING',
    'MUA',
    'ATTIRE',
    'DECORATION',
    'DOCUMENTATION',
    'ENTERTAINMENT',
    'OTHER',
  ]),
  cost: z.number().min(0, 'Biaya vendor tidak boleh bernilai negatif'),
  status: z.enum(['CONTACTED', 'DP', 'PAID', 'COMPLETED']),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  notes: z.string().optional(),
});
export type VendorFormValues = z.infer<typeof vendorFormSchema>;

// 5. Rundown Form Schema
export const rundownFormSchema = z.object({
  time: z.string().trim().min(1, 'Waktu acara wajib diisi'),
  activity: z.string().trim().min(1, 'Nama aktivitas / susunan acara wajib diisi'),
  pic: z.string().trim().min(1, 'Penanggung jawab (PIC) wajib diisi'),
  location: z.string().optional(),
  notes: z.string().optional(),
});
export type RundownFormValues = z.infer<typeof rundownFormSchema>;

// 6. Journal Form Schema
export const journalFormSchema = z.object({
  title: z.string().trim().min(1, 'Judul momen cerita wajib diisi'),
  content: z.string().trim().min(1, 'Isi cerita momen wajib diisi'),
  category: z.enum(['MILESTONE', 'VENDOR_MEETING', 'REFLECTION', 'MEMORABLE']),
  date: z.string().trim().min(1, 'Tanggal momen wajib dipilih'),
});
export type JournalFormValues = z.infer<typeof journalFormSchema>;

// 7. Onboarding Form Schema
export const onboardingFormSchema = z.object({
  brideName: z.string().trim().min(1, 'Nama panggilan mempelai wanita wajib diisi'),
  groomName: z.string().trim().min(1, 'Nama panggilan mempelai pria wajib diisi'),
  weddingDate: z.string().trim().min(1, 'Tanggal pernikahan wajib ditentukan'),
  targetBudget: z.number().min(0, 'Target budget tidak boleh negatif'),
  guestCountTarget: z.number().int().min(0, 'Target tamu tidak boleh negatif'),
});
export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
