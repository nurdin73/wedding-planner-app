import React from 'react';
import { Users, MailCheck } from 'lucide-react';
import type { GuestItem } from '../../types/wedding.types';
import { calculatePercentage } from '../../utils/currency.utils';

interface GuestSummaryProps {
  guests: GuestItem[];
}

export const GuestSummary: React.FC<GuestSummaryProps> = ({ guests }) => {
  const totalInvitations = guests.length;
  const totalPax = guests.reduce((sum, g) => sum + g.paxCount, 0);

  const sentCount = guests.filter((g) => g.invitationStatus === 'SENT').length;
  const sentPercent = calculatePercentage(sentCount, totalInvitations);

  const bridePax = guests
    .filter((g) => g.side === 'BRIDE' || g.side === 'BOTH')
    .reduce((sum, g) => sum + g.paxCount, 0);
  const groomPax = guests
    .filter((g) => g.side === 'GROOM' || g.side === 'BOTH')
    .reduce((sum, g) => sum + g.paxCount, 0);

  const brideRatio = calculatePercentage(bridePax, totalPax || 1);

  return (
    <div
      data-testid="guest-summary-card"
      className="bg-white rounded-2xl p-4 border border-[#ECE5DE] shadow-ambient flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#DFB15B]" strokeWidth={1.75} />
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            Alokasi Tamu & Pax Katering
          </h3>
        </div>
        <span
          data-testid="guest-sent-status"
          className="text-xs font-semibold text-[#58755E] tabular-nums flex items-center gap-1"
        >
          <MailCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
          {sentCount}/{totalInvitations} Terkirim ({sentPercent}%)
        </span>
      </div>

      {/* Grid Figures */}
      <div className="grid grid-cols-2 gap-2.5 text-center">
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/50">
          <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider">
            Total Undangan
          </span>
          <span
            data-testid="guest-total-invitations"
            className="block text-xl font-bold text-[#3A302C] tabular-nums mt-0.5"
          >
            {totalInvitations}
          </span>
          <span className="text-[10px] text-[#73635C]">Keluarga / Kerabat</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/50">
          <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider">
            Estimasi Pax Katering
          </span>
          <span
            data-testid="guest-total-pax"
            className="block text-xl font-bold text-[#B86B70] tabular-nums mt-0.5"
          >
            {totalPax}
          </span>
          <span className="text-[10px] text-[#73635C]">Porsi Konsumsi</span>
        </div>
      </div>

      {/* Ratio Bar Pihak Wanita vs Pria */}
      {totalPax > 0 && (
        <div className="pt-2 border-t border-[#ECE5DE]/60">
          <div className="flex justify-between text-[11px] text-[#73635C] mb-1 tabular-nums">
            <span>Wanita: {bridePax} Pax ({brideRatio}%)</span>
            <span>Pria: {groomPax} Pax ({100 - brideRatio}%)</span>
          </div>
          <div className="w-full bg-[#E5E4E7] h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-[#B86B70] h-full transition-all duration-500"
              style={{ width: `${brideRatio}%` }}
              title={`Pihak Wanita: ${brideRatio}%`}
            />
            <div
              className="bg-[#73635C] h-full transition-all duration-500"
              style={{ width: `${100 - brideRatio}%` }}
              title={`Pihak Pria: ${100 - brideRatio}%`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
