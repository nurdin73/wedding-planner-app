import React, { useState } from 'react';
import {
  Crown,
  Heart,
  Users,
  MailCheck,
  Trash2,
  Pencil,
  MessageCircle,
  Copy,
  Check,
  Link as LinkIcon,
  MoreHorizontal,
} from 'lucide-react';
import type { GuestItem as GuestItemType } from '../../types/wedding.types';
import {
  getPersonalizedInvitationUrl,
  generateWhatsAppInvitationMessage,
  generateWhatsAppLink,
} from '../../utils/invitation.utils';

interface GuestItemProps {
  guest: GuestItemType;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (guest: GuestItemType) => void;
  baseInvitationUrl?: string;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
}

export const GuestItem: React.FC<GuestItemProps> = ({
  guest,
  onToggleStatus,
  onDelete,
  onEdit,
  baseInvitationUrl,
  brideName = '',
  groomName = '',
  weddingDate,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isSent = guest.invitationStatus === 'SENT';

  const personalizedUrl = getPersonalizedInvitationUrl(
    baseInvitationUrl,
    guest.customInvitationUrl,
    guest.name
  );

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppInvitationMessage({
      brideName,
      groomName,
      weddingDate,
      guestName: guest.name,
      invitationUrl: personalizedUrl,
    });

    if (guest.contactInfo) {
      const waUrl = generateWhatsAppLink(guest.contactInfo, message);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!isSent) {
        onToggleStatus(guest.id);
      }
    } else {
      // Fallback: Salin pesan ke clipboard jika nomor belum diisi
      if (navigator.clipboard) {
        navigator.clipboard.writeText(message);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  const handleCopyLink = () => {
    if (!personalizedUrl) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(personalizedUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        setIsMenuOpen(false);
      }, 1200);
    }
  };

  return (
    <div
      data-testid={`guest-item-${guest.id}`}
      className="bg-white p-3.5 rounded-xl border border-[#ECE5DE] shadow-ambient flex items-center justify-between gap-3"
    >
      {/* Kolom Informasi Tamu (Kiri) */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#ECE5DE] flex items-center justify-center shrink-0">
          {guest.category === 'VIP' ? (
            <Crown className="w-4 h-4 text-[#DFB15B]" strokeWidth={1.75} />
          ) : guest.side === 'BRIDE' ? (
            <Heart className="w-4 h-4 text-secondary" strokeWidth={1.75} />
          ) : (
            <Users className="w-4 h-4 text-[#73635C]" strokeWidth={1.75} />
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[#3A302C] truncate">
              {guest.name}
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FAF8F5] text-secondary border border-secondary-border font-semibold tabular-nums shrink-0">
              {guest.paxCount} Pax
            </span>
            {guest.category === 'VIP' && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FAF5E8] text-[#DFB15B] border border-[#DFB15B]/30 font-semibold shrink-0">
                VIP
              </span>
            )}
            {guest.customInvitationUrl && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200/60 font-medium shrink-0 flex items-center gap-0.5">
                <LinkIcon className="w-2.5 h-2.5" />
                <span>Link Khusus</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#A89B95] min-w-0 flex-wrap">
            <span className="shrink-0">
              {guest.side === 'BRIDE' ? 'Pihak Wanita' : guest.side === 'GROOM' ? 'Pihak Pria' : 'Kedua Pihak'}
            </span>
            {guest.contactInfo && <span className="truncate">• {guest.contactInfo}</span>}
            {guest.notes && <span className="italic truncate">• &ldquo;{guest.notes}&rdquo;</span>}
          </div>
        </div>
      </div>

      {/* Kolom Aksi Ringkas & Lapang (Kanan) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Tombol Status / Aksi Utama Terpadu */}
        {isSent ? (
          <button
            type="button"
            data-testid={`button-toggle-status-${guest.id}`}
            onClick={() => onToggleStatus(guest.id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-primary-light text-primary border border-primary/30 hover:border-primary/60 transition-all cursor-pointer"
            title="Undangan telah terkirim. Klik untuk ubah status jika diperlukan."
          >
            <MailCheck className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
            <span>Terkirim</span>
          </button>
        ) : (
          <button
            type="button"
            data-testid={`button-send-whatsapp-${guest.id}`}
            onClick={handleSendWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all cursor-pointer shadow-xs"
            title={guest.contactInfo ? 'Kirim via WhatsApp' : 'Salin draf undangan WA'}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
            <span>Kirim WA</span>
          </button>
        )}

        {/* Menu Opsi Lainnya (Dropdown) */}
        <div className="relative">
          <button
            type="button"
            data-testid={`button-more-options-${guest.id}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-1 rounded-lg text-[#A89B95] hover:text-[#3A302C] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            aria-label="Menu opsi tamu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <>
              {/* Invisible Backdrop untuk Close on Tap */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsMenuOpen(false)}
              />

              <div
                data-testid={`menu-guest-options-${guest.id}`}
                className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-[#ECE5DE] py-1.5 z-40 animate-fadeIn"
              >
                {personalizedUrl && (
                  <button
                    type="button"
                    data-testid={`button-menu-copy-link-${guest.id}`}
                    onClick={handleCopyLink}
                    className="w-full px-3 py-2 text-left text-xs text-[#3A302C] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">Tautan Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#73635C]" />
                        <span>Salin Tautan Undangan</span>
                      </>
                    )}
                  </button>
                )}

                {isSent && (
                  <button
                    type="button"
                    data-testid={`button-menu-resend-wa-${guest.id}`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSendWhatsApp();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-[#3A302C] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kirim Ulang via WA</span>
                  </button>
                )}

                {onEdit && (
                  <button
                    type="button"
                    data-testid={`button-menu-edit-${guest.id}`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit(guest);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-[#3A302C] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#73635C]" />
                    <span>Edit Data Tamu</span>
                  </button>
                )}

                <div className="my-1 border-t border-[#ECE5DE]/60" />

                <button
                  type="button"
                  data-testid={`button-menu-delete-${guest.id}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete(guest.id);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Hapus Tamu</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
