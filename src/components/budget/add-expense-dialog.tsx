import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { BudgetCategory } from '../../types/wedding.types';
import { CATEGORY_OPTIONS } from '../../constants/wedding.constants';

interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    category: BudgetCategory,
    estimatedCost: number,
    actualPaid: number,
    notes?: string
  ) => void;
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BudgetCategory>('VENUE_CATERING');
  const [estimatedStr, setEstimatedStr] = useState('');
  const [paidStr, setPaidStr] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const estimated = parseInt(estimatedStr.replace(/\D/g, ''), 10) || 0;
    const paid = parseInt(paidStr.replace(/\D/g, ''), 10) || 0;

    onAdd(title.trim(), category, estimated, paid, notes.trim() || undefined);
    setTitle('');
    setEstimatedStr('');
    setPaidStr('');
    setNotes('');
    onClose();
  };

  return (
    <div
      data-testid="add-expense-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            Catat Pos Pengeluaran
          </h3>
          <button
            type="button"
            data-testid="button-close-add-expense"
            onClick={onClose}
            className="text-[#A89B95] hover:text-[#3A302C] p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Nama Pos Biaya
            </label>
            <input
              data-testid="input-expense-title"
              type="text"
              placeholder="cth: DP Gedung Pernikahan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70]"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Kategori
            </label>
            <select
              data-testid="select-expense-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BudgetCategory)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-[#B86B70]"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Estimasi Total (Rp)
              </label>
              <input
                data-testid="input-expense-estimated"
                type="text"
                placeholder="cth: 30000000"
                value={estimatedStr}
                onChange={(e) => setEstimatedStr(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Realisasi Terbayar (Rp)
              </label>
              <input
                data-testid="input-expense-paid"
                type="text"
                placeholder="cth: 10000000"
                value={paidStr}
                onChange={(e) => setPaidStr(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Catatan / Vendor (opsional)
            </label>
            <input
              data-testid="input-expense-notes"
              type="text"
              placeholder="cth: Pelunasan H-14 di transfer via BCA"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70]"
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
              data-testid="button-submit-expense"
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#B86B70] hover:bg-[#a65d62] text-xs font-medium text-white transition-colors cursor-pointer shadow-sm"
            >
              Simpan Pos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
