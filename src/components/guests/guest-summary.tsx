import { Users, MailCheck, Globe, Link as LinkIcon } from 'lucide-react';
import type { GuestItem } from '../../types/wedding.types';
import { calculatePercentage } from '../../utils/currency.utils';

interface GuestSummaryProps {
  guests: GuestItem[];
  invitationUrl?: string;
  onOpenLinkDialog?: () => void;
}

export const GuestSummary: React.FC<GuestSummaryProps> = ({
  guests,
  invitationUrl,
  onOpenLinkDialog,
}) => {
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Users className="w-4 h-4 text-[#DFB15B] shrink-0" strokeWidth={1.75} />
          <h3 className="font-serif text-sm sm:text-base font-semibold text-[#3A302C] truncate">
            Alokasi Tamu & Katering
          </h3>
        </div>
        <span
          data-testid="guest-sent-status"
          title={`Undangan Terkirim: ${sentPercent}%`}
          className="text-[11px] font-medium text-primary tabular-nums flex items-center gap-1 shrink-0 bg-primary-light px-2 py-0.5 rounded-full whitespace-nowrap"
        >
          <MailCheck className="w-3 h-3 shrink-0" strokeWidth={1.75} />
          <span>{sentCount}/{totalInvitations} Terkirim</span>
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
            className="block text-xl font-bold text-secondary tabular-nums mt-0.5"
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
              className="bg-secondary h-full transition-all duration-500"
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

      {/* Online Invitation Link Banner */}
      {onOpenLinkDialog && (
        <div
          data-testid="guest-invitation-link-bar"
          className="pt-2.5 border-t border-[#ECE5DE]/60 flex items-center justify-between gap-2 text-xs"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Globe className="w-3.5 h-3.5" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#A89B95] uppercase font-semibold tracking-wider">
                Tautan Undangan Web
              </span>
              {invitationUrl ? (
                <span
                  title={invitationUrl}
                  className="text-[11px] text-[#3A302C] font-medium truncate max-w-[200px] sm:max-w-[280px]"
                >
                  {invitationUrl}
                </span>
              ) : (
                <span className="text-[11px] text-[#A89B95] italic">
                  Belum ditautkan (klik untuk atur)
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            data-testid="button-open-invitation-link-dialog"
            onClick={onOpenLinkDialog}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-[11px] font-medium text-[#3A302C] transition-colors shrink-0 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3 text-[#73635C]" />
            <span>{invitationUrl ? 'Ubah' : 'Tautkan Web'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
