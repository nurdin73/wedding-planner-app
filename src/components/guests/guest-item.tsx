import React from 'react';
import { Crown, Heart, Users, Send, MailCheck, Trash2 } from 'lucide-react';
import type { GuestItem as GuestItemType } from '../../types/wedding.types';

interface GuestItemProps {
  guest: GuestItemType;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const GuestItem: React.FC<GuestItemProps> = ({ guest, onToggleStatus, onDelete }) => {
  const isSent = guest.invitationStatus === 'SENT';

  return (
    <div
      data-testid={`guest-item-${guest.id}`}
      className="bg-white p-3.5 rounded-xl border border-[#ECE5DE] shadow-ambient flex items-center justify-between gap-2"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#ECE5DE] flex items-center justify-center shrink-0">
          {guest.category === 'VIP' ? (
            <Crown className="w-4 h-4 text-[#DFB15B]" strokeWidth={1.75} />
          ) : guest.side === 'BRIDE' ? (
            <Heart className="w-4 h-4 text-[#B86B70]" strokeWidth={1.75} />
          ) : (
            <Users className="w-4 h-4 text-[#73635C]" strokeWidth={1.75} />
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[#3A302C] truncate">
              {guest.name}
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[#B86B70] border border-[#F2DFDC] font-semibold tabular-nums">
              {guest.paxCount} Pax
            </span>
            {guest.category === 'VIP' && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FAF5E8] text-[#DFB15B] border border-[#DFB15B]/30 font-semibold">
                VIP
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#A89B95]">
            <span>{guest.side === 'BRIDE' ? 'Pihak Wanita' : guest.side === 'GROOM' ? 'Pihak Pria' : 'Kedua Pihak'}</span>
            {guest.contactInfo && <span>• {guest.contactInfo}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          data-testid={`button-toggle-sent-${guest.id}`}
          onClick={() => onToggleStatus(guest.id)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer border ${
            isSent
              ? 'bg-[#E8F0EA] text-[#58755E] border-[#58755E]/40'
              : 'bg-[#FAF8F5] text-[#A89B95] border-[#ECE5DE] hover:border-[#B86B70]/40'
          }`}
          title={isSent ? 'Tandai belum dikirim' : 'Tandai sudah dikirim'}
        >
          {isSent ? (
            <>
              <MailCheck className="w-3 h-3 text-[#58755E]" strokeWidth={2} />
              <span>Terkirim</span>
            </>
          ) : (
            <>
              <Send className="w-3 h-3 text-[#A89B95]" strokeWidth={1.75} />
              <span>Kirim</span>
            </>
          )}
        </button>

        <button
          type="button"
          data-testid={`button-delete-guest-${guest.id}`}
          onClick={() => onDelete(guest.id)}
          className="opacity-40 hover:opacity-100 hover:text-[#B86B70] text-[#A89B95] p-1 rounded-md transition-opacity cursor-pointer"
          aria-label="Hapus tamu"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};
