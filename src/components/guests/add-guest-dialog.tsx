import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { GuestSide, GuestCategory } from '../../types/wedding.types';
import { GUEST_SIDE_OPTIONS, GUEST_CATEGORY_OPTIONS } from '../../constants/wedding.constants';
import { guestFormSchema } from '../../schemas/wedding-forms.schema';
import { maskPhoneNumber } from '../../utils/mask.utils';

interface AddGuestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    name: string,
    side: GuestSide,
    category: GuestCategory,
    paxCount: number,
    contactInfo?: string,
    notes?: string
  ) => void;
}

export const AddGuestDialog: React.FC<AddGuestDialogProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [side, setSide] = useState<GuestSide>('BRIDE');
  const [category, setCategory] = useState<GuestCategory>('FAMILY');
  const [paxCount, setPaxCount] = useState<number>(2);
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = guestFormSchema.safeParse({
      name,
      side,
      category,
      paxCount,
      contactInfo,
      notes,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onAdd(
      result.data.name,
      result.data.side,
      result.data.category,
      result.data.paxCount,
      result.data.contactInfo?.trim() || undefined,
      result.data.notes?.trim() || undefined
    );

    setName('');
    setPaxCount(2);
    setContactInfo('');
    setNotes('');
    onClose();
  };

  return (
    <div
      data-testid="add-guest-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            Tambah Tamu Undangan
          </h3>
          <button
            type="button"
            data-testid="button-close-add-guest"
            onClick={onClose}
            className="text-[#A89B95] hover:text-[#3A302C] p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Nama Tamu / Keluarga
            </label>
            <input
              data-testid="input-guest-name"
              type="text"
              placeholder="cth: Keluarga Bpk. Surya / Sarah & Dimas"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none ${
                errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-[#B86B70]'
              }`}
              autoFocus
            />
            {errors.name && (
              <p data-testid="error-guest-name" className="text-[11px] text-rose-600 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Pihak Pengundang
              </label>
              <select
                data-testid="select-guest-side"
                value={side}
                onChange={(e) => setSide(e.target.value as GuestSide)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-[#B86B70]"
              >
                {GUEST_SIDE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Kategori
              </label>
              <select
                data-testid="select-guest-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as GuestCategory)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-[#B86B70]"
              >
                {GUEST_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Estimasi Porsi Katering (Pax)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  data-testid={`pax-option-${num}`}
                  onClick={() => setPaxCount(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold tabular-nums border transition-all cursor-pointer ${
                    paxCount === num
                      ? 'bg-[#B86B70] text-white border-[#B86B70]'
                      : 'bg-[#FAF8F5] text-[#73635C] border-[#ECE5DE] hover:border-[#B86B70]/40'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              No. WhatsApp / Kontak (opsional)
            </label>
            <input
              data-testid="input-guest-contact"
              type="text"
              placeholder="cth: 0812-3456-7890"
              value={contactInfo}
              onChange={(e) => setContactInfo(maskPhoneNumber(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70] tabular-nums"
            />
          </div>

          <div className="flex gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-[#ECE5DE] text-xs font-medium text-[#73635C] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              data-testid="button-submit-guest"
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#B86B70] hover:bg-[#a65d62] text-xs font-medium text-white transition-colors cursor-pointer shadow-sm"
            >
              Simpan Tamu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
