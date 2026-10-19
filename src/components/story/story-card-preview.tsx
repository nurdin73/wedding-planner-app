import { forwardRef } from 'react';
import { CalendarHeart, CheckCircle2, WalletCards, Users } from 'lucide-react';
import type { CoupleProfile, ChecklistItem, BudgetItem, GuestItem } from '../../types/wedding.types';
import { calculateTimeRemaining, formatIndonesianDate } from '../../utils/date.utils';
import { calculatePercentage } from '../../utils/currency.utils';

interface StoryCardPreviewProps {
  profile: CoupleProfile;
  checklist: ChecklistItem[];
  expenses: BudgetItem[];
  guests: GuestItem[];
}

export const StoryCardPreview = forwardRef<HTMLDivElement, StoryCardPreviewProps>(
  ({ profile, checklist, expenses, guests }, ref) => {
    const remaining = calculateTimeRemaining(profile.weddingDate);
    const formattedDate = formatIndonesianDate(profile.weddingDate);

    const totalTasks = checklist.length;
    const completedTasks = checklist.filter((t) => t.isCompleted).length;
    const checklistPercent = calculatePercentage(completedTasks, totalTasks);

    const totalSpent = expenses.reduce((sum, item) => sum + item.actualPaid, 0);
    const budgetPercent = calculatePercentage(totalSpent, profile.targetBudget);

    const totalPax = guests.reduce((sum, g) => sum + g.paxCount, 0);

    return (
      <div
        ref={ref}
        data-testid="story-card-canvas"
        className="w-full max-w-[340px] aspect-[9/16] bg-[#FAF8F5] text-[#3A302C] p-6 rounded-3xl border-2 border-[#ECE5DE] shadow-2xl flex flex-col justify-between relative overflow-hidden select-none"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        {/* Subtle decorative inner border */}
        <div className="absolute inset-2.5 rounded-2xl border border-[#F2DFDC]/80 pointer-events-none" />

        {/* Top Brand Logo - Clean Centered */}
        <div className="flex justify-center pt-3 pb-1 relative z-10">
          <img
            src="/icon-192.png"
            alt="Janji Suci"
            className="w-14 h-14 rounded-full object-cover shadow-xs border border-[#ECE5DE]/60"
          />
        </div>

        {/* Couple & Date Section */}
        <div className="text-center py-2 relative z-10">
          <span className="text-[11px] uppercase tracking-widest text-[#73635C] block mb-1">
            Menghitung Hari Bahagia
          </span>
          <h2
            className="font-serif text-3xl font-bold text-[#3A302C] tracking-wide leading-tight px-2"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {profile.brideName} & {profile.groomName}
          </h2>
          <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-white/80 border border-[#ECE5DE] text-xs text-[#73635C] font-medium">
            {formattedDate || 'Segera Tiba'}
          </div>

          {/* Big Countdown Days */}
          <div className="mt-4 flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-white border border-[#F2DFDC] shadow-sm flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[#B86B70] tabular-nums leading-none">
                {remaining.days}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#A89B95] mt-1">
                Hari Lagi
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Stats Barometer */}
        <div className="relative z-10 bg-white/95 p-3.5 rounded-2xl border border-[#ECE5DE] shadow-sm">
          <span className="block text-[10px] uppercase tracking-wider text-[#A89B95] text-center mb-2">
            Kesiapan Langkah Kami
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-1.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#58755E] mx-auto mb-0.5" strokeWidth={1.75} />
              <span className="block text-xs font-bold text-[#3A302C] tabular-nums">
                {checklistPercent}%
              </span>
              <span className="text-[9px] text-[#A89B95]">Tugas</span>
            </div>

            <div className="p-1.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/60">
              <WalletCards className="w-3.5 h-3.5 text-[#B86B70] mx-auto mb-0.5" strokeWidth={1.75} />
              <span className="block text-xs font-bold text-[#3A302C] tabular-nums">
                {budgetPercent}%
              </span>
              <span className="text-[9px] text-[#A89B95]">Anggaran</span>
            </div>

            <div className="p-1.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/60">
              <Users className="w-3.5 h-3.5 text-[#DFB15B] mx-auto mb-0.5" strokeWidth={1.75} />
              <span className="block text-xs font-bold text-[#3A302C] tabular-nums">
                {totalPax}
              </span>
              <span className="text-[9px] text-[#A89B95]">Pax Tamu</span>
            </div>
          </div>
        </div>

        {/* Editorial Love Quote & Footer */}
        <div className="text-center pb-2 relative z-10 mt-3">
          <p
            className="font-serif italic text-xs text-[#73635C] leading-relaxed px-3"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            &ldquo;Dua jiwa dengan satu keteguhan, merajut cinta menuju keabadian.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-1 mt-2 text-[9px] text-[#A89B95] uppercase tracking-widest">
            <CalendarHeart className="w-3 h-3 text-[#B86B70]" strokeWidth={1.75} />
            <span>Janji Suci Planner</span>
          </div>
        </div>
      </div>
    );
  }
);

StoryCardPreview.displayName = 'StoryCardPreview';
