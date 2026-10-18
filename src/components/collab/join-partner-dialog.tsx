import React, { useState } from 'react';
import { X, HeartHandshake, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { useAuth } from '../../hooks/use-auth';
import { joinCodeSchema } from '../../schemas/wedding-forms.schema';

interface JoinPartnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInvite: () => void;
}

export const JoinPartnerDialog: React.FC<JoinPartnerDialogProps> = ({
  isOpen,
  onClose,
  onOpenInvite,
}) => {
  const { user } = useAuth();
  const { joinWedding } = useWeddingPlanner();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Zod Validation (Zero HTML required)
    const result = joinCodeSchema.safeParse({ code });
    if (!result.success) {
      setErrorMsg(result.error.issues[0]?.message || 'Format kode tidak valid');
      return;
    }

    setIsSubmitting(true);
    try {
      await joinWedding(result.data.code);
      setSuccessMsg('Berhasil terhubung dengan ruang pernikahan pasanganmu!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : 'Gagal menghubungkan kode undangan.';
      setErrorMsg(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="collab-join-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-testid="collab-join-dialog"
        className="relative w-full max-w-md bg-stone-50 rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-800">
                Gabung Ruang Pasangan
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Masukkan kode undangan dari pasanganmu
              </p>
            </div>
          </div>
          <button
            data-testid="collab-join-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!user ? (
            <div
              data-testid="collab-join-unauthenticated"
              className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm"
            >
              <p className="font-medium mb-1">Masuk Terlebih Dahulu</p>
              <p className="text-xs text-amber-700">
                Silakan masuk dengan akun Google terlebih dahulu untuk menghubungkan rencana pernikahan dengan pasanganmu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="joinCodeInput"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5"
                >
                  Kode Undangan (Contoh: SUCI-7X9K)
                </label>
                <input
                  id="joinCodeInput"
                  data-testid="collab-join-input"
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setErrorMsg(null);
                  }}
                  placeholder="SUCI-XXXX"
                  maxLength={12}
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl font-mono text-center text-lg tracking-widest text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 uppercase transition-all"
                />
              </div>

              {errorMsg && (
                <div
                  data-testid="collab-join-error"
                  className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div
                  data-testid="collab-join-success"
                  className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs"
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                data-testid="collab-join-submit-btn"
                type="submit"
                disabled={isSubmitting || !code.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghubungkan...
                  </>
                ) : (
                  'Hubungkan Sekarang'
                )}
              </button>

              <div className="pt-3 border-t border-stone-200 text-center">
                <p className="text-xs text-stone-500 mb-1.5">
                  Belum punya kode? Mau bagikan kode Anda sendiri?
                </p>
                <button
                  data-testid="collab-open-invite-btn"
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenInvite();
                  }}
                  className="text-xs font-medium text-rose-700 hover:text-rose-800 underline underline-offset-4"
                >
                  Lihat Kode Pasangan Saya
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
