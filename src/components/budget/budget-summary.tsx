import React from 'react';
import { WalletCards, AlertCircle } from 'lucide-react';
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
  const isOverEstimated = targetBudget > 0 && totalEstimated > targetBudget;
  const overEstimatedAmount = totalEstimated - targetBudget;

  return (
    <div
      data-testid="budget-summary-card"
      className="bg-white rounded-2xl p-4 border border-[#ECE5DE] shadow-ambient"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <WalletCards className="w-4 h-4 text-secondary" strokeWidth={1.75} />
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            Ringkasan Anggaran
          </h3>
        </div>
        <span
          data-testid="budget-percent-used"
          className="text-xs font-semibold text-secondary tabular-nums"
        >
          {percentUsed}% Terpakai
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden mb-4 border border-[#ECE5DE]/60">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOverBudget ? 'bg-red-500' : 'bg-secondary'
          }`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {/* Figures Grid 2x2 */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#ECE5DE]/60">
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/60">
          <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider font-medium">
            Pagu Target
          </span>
          <span
            data-testid="budget-figure-target"
            className="block text-xs sm:text-sm font-bold text-[#3A302C] tabular-nums mt-0.5 truncate"
            title={formatRupiah(targetBudget)}
          >
            {formatRupiah(targetBudget)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/60">
          <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider font-medium">
            Estimasi Total
          </span>
          <span
            data-testid="budget-figure-estimated"
            className={`block text-xs sm:text-sm font-bold tabular-nums mt-0.5 truncate ${
              isOverEstimated ? 'text-amber-700' : 'text-[#3A302C]'
            }`}
            title={formatRupiah(totalEstimated)}
          >
            {formatRupiah(totalEstimated)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/60">
          <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider font-medium">
            Terbayar
          </span>
          <span
            data-testid="budget-figure-paid"
            className="block text-xs sm:text-sm font-bold text-primary tabular-nums mt-0.5 truncate"
            title={formatRupiah(totalPaid)}
          >
            {formatRupiah(totalPaid)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/60">
          <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider font-medium">
            Sisa Pagu
          </span>
          <span
            data-testid="budget-figure-remaining"
            className={`block text-xs sm:text-sm font-bold tabular-nums mt-0.5 truncate ${
              isOverBudget ? 'text-rose-600' : 'text-[#3A302C]'
            }`}
            title={formatRupiah(remaining)}
          >
            {formatRupiah(remaining)}
          </span>
        </div>
      </div>

      {/* Warning if total estimated exceeds target budget */}
      {isOverEstimated && (
        <div
          data-testid="budget-warning-overcommit"
          className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2 text-amber-800 text-[11px]"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>
            Total estimasi melebihi pagu target sebesar{' '}
            <strong className="font-semibold tabular-nums">{formatRupiah(overEstimatedAmount)}</strong>.
          </span>
        </div>
      )}
    </div>
  );
};

