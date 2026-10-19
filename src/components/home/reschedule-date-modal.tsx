import React, { useState, useEffect } from 'react';
import { X, CalendarHeart, Calendar, Check, Sparkles } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { formatIndonesianDate } from '../../utils/date.utils';

interface RescheduleDateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RescheduleDateModal: React.FC<RescheduleDateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, updateProfile } = useWeddingPlanner();
  const currentWeddingDate = state.profile.weddingDate;

  const [date, setDate] = useState(currentWeddingDate || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDate(currentWeddingDate || '');
      setSaved(false);
    }
  }, [isOpen, currentWeddingDate]);

  if (!isOpen) return null;

  const formattedPreview = date
    ? formatIndonesianDate(date, { showWeekday: true, monthFormat: 'long' })
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    updateProfile({ weddingDate: date });
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div
      data-testid="modal-reschedule-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-testid="modal-reschedule-date"
        className="relative w-full max-w-sm bg-stone-50 rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <CalendarHeart className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="font-serif text-base font-medium text-stone-800">
                Sesuaikan Hari Bahagia
              </h3>
              <p className="text-[11px] text-stone-500 font-sans">
                Setiap kisah cinta memiliki ritmenya sendiri
              </p>
            </div>
          </div>
          <button
            data-testid="button-close-reschedule"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Aesthetic Reassurance Banner */}
          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100/90 text-rose-900">
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-800/90 leading-relaxed font-sans">
                Rencana perjalanan cintamu tetap terjaga utuh. Hanya hitungan waktu menuju hari bahagia yang diselaraskan.
              </p>
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Tanggal Pernikahan Baru
            </label>
            <div className="relative">
              <input
                data-testid="input-reschedule-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-stone-300 text-stone-800 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all font-sans cursor-pointer"
                required
              />
              <Calendar className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Formatted Date Preview */}
          {formattedPreview && (
            <div
              data-testid="preview-reschedule-date"
              className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200/60 text-center"
            >
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                Hari Bahagia Terpilih
              </span>
              <span className="font-serif text-sm font-semibold text-stone-800 mt-0.5 block">
                {formattedPreview}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              data-testid="button-cancel-reschedule"
              onClick={onClose}
              className="w-1/3 py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-600 font-medium text-xs border border-stone-300 transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="submit"
              data-testid="button-save-reschedule"
              disabled={!date || saved}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tersimpan</span>
                </>
              ) : (
                <span>Simpan Tanggal Bahagia</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
