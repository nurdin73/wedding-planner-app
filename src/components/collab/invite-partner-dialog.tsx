import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Heart, Share2 } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { useAuth } from '../../hooks/use-auth';

interface InvitePartnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenJoin: () => void;
}

export const InvitePartnerDialog: React.FC<InvitePartnerDialogProps> = ({
  isOpen,
  onClose,
  onOpenJoin,
}) => {
  const { user } = useAuth();
  const { inviteCode, isPaired } = useWeddingPlanner();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteUrl = inviteCode ? `${window.location.origin}/?invite=${inviteCode}` : '';

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy invite url', err);
    }
  };

  const handleWhatsAppShare = () => {
    if (!inviteCode) return;
    const message = `Halo sayang! 💕 Yuk kelola dan rencanakan pernikahan impian kita bersama di Janji Suci. Buka tautan ini untuk langsung terhubung: ${inviteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div
      data-testid="collab-invite-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-testid="collab-invite-dialog"
        className="relative w-full max-w-md bg-stone-50 rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-800">
                {isPaired ? 'Ruang Pasangan Terhubung' : 'Ajak Pasangan Kolaborasi'}
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                {isPaired
                  ? 'Kalian sudah terhubung dalam satu rencana'
                  : 'Rencanakan pesta pernikahan impian berdua secara realtime'}
              </p>
            </div>
          </div>
          <button
            data-testid="collab-invite-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!user ? (
            <div
              data-testid="collab-invite-unauthenticated"
              className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm"
            >
              <p className="font-medium mb-1">Masuk dengan Akun Google</p>
              <p className="text-xs text-amber-700">
                Silakan masuk dengan akun Google terlebih dahulu (melalui tombol di pojok kanan atas) agar ruang pernikahan dapat disimpan dan dibagikan dengan pasanganmu.
              </p>
            </div>
          ) : (
            <>
              {/* Kode Undangan Box */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Kode Pasangan Anda
                </label>
                <div className="flex items-center justify-between p-3.5 bg-white border-2 border-dashed border-rose-200 rounded-xl">
                  <span
                    data-testid="collab-invite-code-display"
                    className="font-mono text-xl font-bold tracking-widest text-rose-800"
                  >
                    {inviteCode || 'Memuat...'}
                  </span>
                  <button
                    data-testid="collab-invite-copy-code-btn"
                    onClick={handleCopy}
                    disabled={!inviteCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin' : 'Salin Tautan'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  data-testid="collab-invite-whatsapp-btn"
                  onClick={handleWhatsAppShare}
                  disabled={!inviteCode}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  Kirim Undangan lewat WhatsApp
                </button>

                <button
                  data-testid="collab-invite-copy-link-btn"
                  onClick={handleCopy}
                  disabled={!inviteCode}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-medium text-sm transition-all border border-stone-300 active:scale-[0.99] disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4 text-stone-500" />
                  {copied ? 'Tautan Berhasil Disalin!' : 'Salin Tautan Gabung'}
                </button>
              </div>

              {/* Punya Kode dari Pasangan? */}
              <div className="pt-3 border-t border-stone-200 text-center">
                <p className="text-xs text-stone-500 mb-2">
                  Sudah punya kode undangan dari pasanganmu?
                </p>
                <button
                  data-testid="collab-open-join-btn"
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenJoin();
                  }}
                  className="text-xs font-medium text-rose-700 hover:text-rose-800 underline underline-offset-4"
                >
                  Masukkan Kode Undangan Pasangan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
