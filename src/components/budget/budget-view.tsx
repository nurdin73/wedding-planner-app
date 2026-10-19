import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Coins, Receipt, Pencil } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { BudgetSummary } from './budget-summary';
import { ExpenseDialog } from './expense-dialog';
import { CATEGORY_OPTIONS } from '../../constants/wedding.constants';
import type { BudgetCategory, BudgetItem } from '../../types/wedding.types';
import { formatRupiah } from '../../utils/currency.utils';

export const BudgetView: React.FC = () => {
  const { state, addExpense, updateExpense, deleteExpense } = useWeddingPlanner();
  const { expenses, profile } = state;

  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | 'ALL'>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<BudgetItem | null>(null);

  const totalEstimated = useMemo(
    () => expenses.reduce((sum, item) => sum + item.estimatedCost, 0),
    [expenses]
  );
  const totalPaid = useMemo(
    () => expenses.reduce((sum, item) => sum + item.actualPaid, 0),
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === 'ALL') return expenses;
    return expenses.filter((item) => item.category === selectedCategory);
  }, [expenses, selectedCategory]);

  const filteredEstimated = useMemo(
    () => filteredExpenses.reduce((sum, item) => sum + item.estimatedCost, 0),
    [filteredExpenses]
  );
  const filteredPaid = useMemo(
    () => filteredExpenses.reduce((sum, item) => sum + item.actualPaid, 0),
    [filteredExpenses]
  );

  const getCategoryLabel = (cat: BudgetCategory): string => {
    return CATEGORY_OPTIONS.find((c) => c.id === cat)?.label || cat;
  };

  const handleOpenAdd = () => {
    setExpenseToEdit(null);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (item: BudgetItem) => {
    setExpenseToEdit(item);
    setIsAddOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddOpen(false);
    setExpenseToEdit(null);
  };

  return (
    <div data-testid="budget-view" className="flex flex-col gap-4 animate-fade-in">
      <BudgetSummary
        targetBudget={profile.targetBudget}
        totalEstimated={totalEstimated}
        totalPaid={totalPaid}
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          data-testid="filter-cat-ALL"
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer border ${
            selectedCategory === 'ALL'
              ? 'bg-[#B86B70] text-white border-[#B86B70] shadow-sm font-medium'
              : 'bg-white text-[#73635C] border-[#ECE5DE] hover:border-[#B86B70]/40'
          }`}
        >
          Semua
        </button>
        {CATEGORY_OPTIONS.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              data-testid={`filter-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#B86B70] text-white border-[#B86B70] shadow-sm font-medium'
                  : 'bg-white text-[#73635C] border-[#ECE5DE] hover:border-[#B86B70]/40'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Action Header */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-[#73635C] font-medium">
            Daftar Pos Pengeluaran ({filteredExpenses.length})
          </span>
          {filteredExpenses.length > 0 && (
            <span
              data-testid="budget-filtered-subtotal"
              className="text-[10px] text-[#A89B95] tabular-nums mt-0.5"
            >
              Est: <strong className="text-[#3A302C] font-semibold">{formatRupiah(filteredEstimated)}</strong> • Bayar:{' '}
              <strong className="text-[#58755E] font-semibold">{formatRupiah(filteredPaid)}</strong>
            </span>
          )}
        </div>
        <button
          type="button"
          data-testid="button-open-add-expense"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B86B70] hover:bg-[#a65d62] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Tambah Pos</span>
        </button>
      </div>

      {/* Expenses List or Empty State */}
      {filteredExpenses.length === 0 ? (
        <div
          data-testid="budget-empty-state"
          className="bg-white rounded-2xl p-8 border border-[#ECE5DE] text-center flex flex-col items-center justify-center shadow-ambient"
        >
          <div className="w-12 h-12 rounded-full bg-[#FDF0EE] flex items-center justify-center text-[#B86B70] mb-3">
            <Coins className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h4 className="font-serif text-base font-semibold text-[#3A302C]">
            Belum Ada Pos Pengeluaran
          </h4>
          <p className="text-xs text-[#73635C] mt-1 max-w-[220px] leading-relaxed">
            Catat rincian alokasi biaya pernikahan agar arus keuangan tetap terkontrol.
          </p>
          <button
            type="button"
            data-testid="button-empty-add-expense"
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-xs font-medium text-[#3A302C] transition-colors cursor-pointer"
          >
            + Catat Pos Pertama
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredExpenses.map((item) => (
            <div
              key={item.id}
              data-testid={`expense-item-${item.id}`}
              className="bg-white p-3.5 rounded-xl border border-[#ECE5DE] shadow-ambient flex items-start justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] flex items-center justify-center text-[#73635C] mt-0.5">
                  <Receipt className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#3A302C]">
                      {item.title}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5EFEB] text-[#73635C] border border-[#ECE5DE]">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-[11px] tabular-nums">
                    <span className="text-[#58755E] font-medium">
                      Terbayar: {formatRupiah(item.actualPaid)}
                    </span>
                    {item.estimatedCost > 0 && (
                      <span className="text-[#A89B95]">
                        Est: {formatRupiah(item.estimatedCost)}
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <span className="block text-[10px] text-[#A89B95] mt-1">
                      {item.notes}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  data-testid={`button-edit-expense-${item.id}`}
                  onClick={() => handleOpenEdit(item)}
                  className="opacity-40 hover:opacity-100 hover:text-[#58755E] text-[#A89B95] p-1 rounded-md transition-opacity cursor-pointer"
                  aria-label="Edit pos"
                >
                  <Pencil className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  data-testid={`button-delete-expense-${item.id}`}
                  onClick={() => deleteExpense(item.id)}
                  className="opacity-40 hover:opacity-100 hover:text-[#B86B70] text-[#A89B95] p-1 rounded-md transition-opacity cursor-pointer"
                  aria-label="Hapus pos"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Expense Dialog */}
      <ExpenseDialog
        isOpen={isAddOpen}
        onClose={handleCloseDialog}
        onAdd={addExpense}
        onUpdate={updateExpense}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
};
