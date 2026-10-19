import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { BudgetCategory, BudgetItem } from '../../types/wedding.types';
import { CATEGORY_OPTIONS } from '../../constants/wedding.constants';
import { expenseFormSchema } from '../../schemas/wedding-forms.schema';
import { MaskedCurrencyInput } from '../ui/masked-currency-input';
import { unmaskCurrency, maskCurrency } from '../../utils/mask.utils';

interface ExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    category: BudgetCategory,
    estimatedCost: number,
    actualPaid: number,
    notes?: string
  ) => void;
  onUpdate?: (id: string, updates: Partial<Omit<BudgetItem, 'id' | 'createdAt'>>) => void;
  expenseToEdit?: BudgetItem | null;
}

const ExpenseDialogForm: React.FC<ExpenseDialogProps> = ({
  onClose,
  onAdd,
  onUpdate,
  expenseToEdit,
}) => {
  const [title, setTitle] = useState(expenseToEdit?.title ?? '');
  const [category, setCategory] = useState<BudgetCategory>(expenseToEdit?.category ?? 'VENUE_CATERING');
  const [estimatedStr, setEstimatedStr] = useState(
    expenseToEdit && expenseToEdit.estimatedCost > 0 ? maskCurrency(expenseToEdit.estimatedCost) : ''
  );
  const [paidStr, setPaidStr] = useState(
    expenseToEdit && expenseToEdit.actualPaid > 0 ? maskCurrency(expenseToEdit.actualPaid) : ''
  );
  const [notes, setNotes] = useState(expenseToEdit?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const estimated = unmaskCurrency(estimatedStr);
    const paid = unmaskCurrency(paidStr);

    const result = expenseFormSchema.safeParse({
      title,
      category,
      estimatedCost: estimated,
      actualPaid: paid,
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
    if (expenseToEdit && onUpdate) {
      onUpdate(expenseToEdit.id, {
        title: result.data.title,
        category: result.data.category,
        estimatedCost: result.data.estimatedCost,
        actualPaid: result.data.actualPaid,
        notes: result.data.notes?.trim() || undefined,
      });
    } else {
      onAdd(
        result.data.title,
        result.data.category,
        result.data.estimatedCost,
        result.data.actualPaid,
        result.data.notes?.trim() || undefined
      );
    }
    onClose();
  };

  return (
    <div
      data-testid="expense-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            {expenseToEdit ? 'Edit Pos Pengeluaran' : 'Catat Pos Pengeluaran'}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Nama Pos Biaya
            </label>
            <input
              data-testid="input-expense-title"
              type="text"
              placeholder="cth: DP Gedung Pernikahan"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none ${
                errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-secondary'
              }`}
              autoFocus
            />
            {errors.title && (
              <p data-testid="error-expense-title" className="text-[11px] text-rose-600 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Kategori
            </label>
            <select
              data-testid="select-expense-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BudgetCategory)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-secondary"
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
                Estimasi Total
              </label>
              <MaskedCurrencyInput
                dataTestId="input-expense-estimated"
                placeholder="cth: 30.000.000"
                value={estimatedStr}
                onChange={(masked) => setEstimatedStr(masked)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Realisasi Terbayar
              </label>
              <MaskedCurrencyInput
                dataTestId="input-expense-paid"
                placeholder="cth: 10.000.000"
                value={paidStr}
                onChange={(masked) => setPaidStr(masked)}
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
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-secondary"
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
              className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-hover text-xs font-medium text-white transition-colors cursor-pointer shadow-sm"
            >
              {expenseToEdit ? 'Simpan Perubahan' : 'Simpan Pos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ExpenseDialog: React.FC<ExpenseDialogProps> = (props) => {
  if (!props.isOpen) return null;
  return <ExpenseDialogForm key={props.expenseToEdit?.id ?? 'create'} {...props} />;
};

export const AddExpenseDialog = ExpenseDialog;

