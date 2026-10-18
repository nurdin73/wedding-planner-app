import React, { useEffect, useState } from 'react';
import { X, Heart, HeartHandshake, Loader2, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { peekInviteDetails, type InviteDetails } from '../../services/partner-collab.service';
import { triggerPastelConfetti } from '../../utils/confetti.utils';

interface AcceptInviteDialogProps {
  inviteCode: string;
  onClose: () => void;
}

export const AcceptInviteDialog: React.FC<AcceptInviteDialogProps> = ({
  inviteCode,
  onClose,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const { joinWedding, inviteCode: ownInviteCode } = useWeddingPlanner();

  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<InviteDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isOwnCode = ownInviteCode && ownInviteCode.toUpperCase() === inviteCode.toUpperCase();

  useEffect(() => {
    let isMounted = true;
    async function loadPreview() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const info = await peekInviteDetails(inviteCode);
        if (isMounted) setDetails(info);
      } catch (err) {
        console.warn('Failed to peek invite code', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPreview();
    return () => {
      isMounted = false;
    };
  }, [inviteCode]);

  const handleAccept = async () => {
    if (!user) {
      await signInWithGoogle();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await joinWedding(inviteCode);
      triggerPastelConfetti();
      setSuccessMsg('Selamat! Kalian berdua kini telah terhubung 💕');
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : 'Gagal menghubungkan ke ruang pernikahan.';
      setErrorMsg(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="collab-accept-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-testid="collab-accept-dialog"
        className="relative w-full max-w-md bg-stone-50 rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-800">
                Undangan Kolaborasi Pernikahan
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Rencanakan pernikahan impian berdua secara realtime
              </p>
            </div>
          </div>
          <button
            data-testid="collab-accept-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div
              data-testid="collab-accept-loading"
              className="py-8 flex flex-col items-center justify-center text-stone-500 gap-2 text-xs"
            >
              <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
              <span>Memeriksa kode undangan...</span>
            </div>
          ) : isOwnCode ? (
            <div
              data-testid="collab-accept-own-code"
              className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-2 text-center"
            >
              <p className="font-semibold text-sm">Ini Adalah Kode Milik Anda</p>
              <p className="leading-relaxed">
                Tautan ini memuat kode undangan ruang pernikahan Anda sendiri (<strong>{inviteCode}</strong>). Silakan kirimkan tautan ini kepada pasangan Anda agar kalian dapat terhubung!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-xl bg-amber-600 text-white font-medium text-xs hover:bg-amber-700 transition-colors"
              >
                Mengerti
              </button>
            </div>
          ) : (
            <>
              {/* Couple Info Card */}
              <div
                data-testid="collab-accept-preview-card"
                className="p-4 rounded-xl bg-white border border-rose-200/80 shadow-ambient text-center space-y-2"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-600 mb-1">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-stone-800">
                  {details?.coupleNames || 'Undangan Pasangan'}
                </h4>
                <p className="text-xs text-stone-500 font-sans">
                  Mengajak Anda untuk bersama-sama mengelola rencana pernikahan di Janji Suci.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FAF8F5] border border-stone-200 font-mono text-xs font-semibold text-rose-700 tracking-wider">
                    {inviteCode}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div
                  data-testid="collab-accept-error"
                  className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div
                  data-testid="collab-accept-success"
                  className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs"
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Action Buttons based on Auth status */}
              {!user ? (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] text-stone-500 text-center">
                    Masuk dengan akun Google untuk menerima undangan ini:
                  </p>
                  <button
                    data-testid="collab-accept-login-btn"
                    type="button"
                    onClick={handleAccept}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99]"
                  >
                    <LogIn className="w-4 h-4" />
                    Masuk dengan Google & Terima
                  </button>
                  <button
                    data-testid="collab-accept-cancel-btn"
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <button
                    data-testid="collab-accept-confirm-btn"
                    type="button"
                    onClick={handleAccept}
                    disabled={isSubmitting || !!successMsg}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menghubungkan...
                      </>
                    ) : (
                      'Terima & Hubungkan Sekarang'
                    )}
                  </button>
                  <button
                    data-testid="collab-accept-cancel-btn"
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full py-2 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
