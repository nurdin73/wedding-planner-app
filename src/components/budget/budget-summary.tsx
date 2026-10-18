import React from 'react';
import { WalletCards } from 'lucide-react';
import { formatRupiah, calculatePercentage } from '../../utils/currency.utils';

interface BudgetSummaryProps {
  targetBudget: number;
  totalEstimated: number;
  totalPaid: number;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  targetBudget,
  totalEstimated,
  totalPaid,
}) => {
  const remaining = targetBudget - totalPaid;
  const percentUsed = calculatePercentage(totalPaid, targetBudget);
  const isOverBudget = remaining < 0;

  return (
    <div
      data-testid="budget-summary-card"
      className="bg-white rounded-2xl p-4 border border-[#ECE5DE] shadow-ambient"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <WalletCards className="w-4 h-4 text-[#B86B70]" strokeWidth={1.75} />
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            Ringkasan Anggaran
          </h3>
        </div>
        <span
          data-testid="budget-percent-used"
          className="text-xs font-semibold text-[#B86B70] tabular-nums"
        >
          {percentUsed}% Terpakai
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden mb-4 border border-[#ECE5DE]/60">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOverBudget ? 'bg-red-500' : 'bg-[#B86B70]'
          }`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {/* Figures Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#ECE5DE]/60 text-center">
        <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/40">
          <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider">
            Pagu Target
          </span>
          <span
            data-testid="budget-figure-target"
            className="block text-xs font-bold text-[#3A302C] tabular-nums mt-0.5 truncate"
            title={formatRupiah(targetBudget)}
          >
            {formatRupiah(targetBudget)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/40">
          <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider">
            Terbayar
          </span>
          <span
            data-testid="budget-figure-paid"
            className="block text-xs font-bold text-[#58755E] tabular-nums mt-0.5 truncate"
            title={formatRupiah(totalPaid)}
          >
            {formatRupiah(totalPaid)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/40">
          <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider">
            Sisa Dana
          </span>
          <span
            data-testid="budget-figure-remaining"
            className={`block text-xs font-bold tabular-nums mt-0.5 truncate ${
              isOverBudget ? 'text-red-500' : 'text-[#3A302C]'
            }`}
            title={formatRupiah(remaining)}
          >
            {formatRupiah(remaining)}
          </span>
        </div>
      </div>

      {totalEstimated > 0 && (
        <div className="mt-3 text-center">
          <span className="text-[11px] text-[#73635C]">
            Total Proyeksi Komitmen: <strong className="tabular-nums font-semibold">{formatRupiah(totalEstimated)}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
