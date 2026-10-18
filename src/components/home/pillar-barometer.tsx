import React from 'react';
import { CheckCircle2, WalletCards, Users } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { calculatePercentage, formatCompactRupiah } from '../../utils/currency.utils';

export const PillarBarometer: React.FC = () => {
  const { state } = useWeddingPlanner();
  const { checklist, expenses, profile } = state;

  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((t) => t.isCompleted).length;
  const checklistPercent = calculatePercentage(completedTasks, totalTasks);

  const totalSpent = expenses.reduce((sum, item) => sum + item.actualPaid, 0);
  const budgetPercent = calculatePercentage(totalSpent, profile.targetBudget);

  return (
    <div data-testid="pillar-barometer" className="w-full grid grid-cols-3 gap-2.5">
      {/* Checklist Pillar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#ECE5DE] shadow-ambient flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#58755E]">
          <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#73635C]">
            Tugas
          </span>
        </div>
        <div className="my-2">
          <span
            data-testid="barometer-task-percent"
            className="font-sans text-xl font-bold text-[#3A302C] tabular-nums"
          >
            {checklistPercent}%
          </span>
          <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden mt-1.5 border border-[#ECE5DE]/60">
            <div
              className="bg-[#58755E] h-full rounded-full transition-all duration-500"
              style={{ width: `${checklistPercent}%` }}
            />
          </div>
        </div>
        <span className="text-[10px] text-[#A89B95] tabular-nums">
          {completedTasks}/{totalTasks} Selesai
        </span>
      </div>

      {/* Budget Pillar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#ECE5DE] shadow-ambient flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#B86B70]">
          <WalletCards className="w-4 h-4" strokeWidth={1.75} />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#73635C]">
            Biaya
          </span>
        </div>
        <div className="my-2">
          <span
            data-testid="barometer-budget-percent"
            className="font-sans text-xl font-bold text-[#3A302C] tabular-nums"
          >
            {budgetPercent}%
          </span>
          <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden mt-1.5 border border-[#ECE5DE]/60">
            <div
              className="bg-[#B86B70] h-full rounded-full transition-all duration-500"
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
        </div>
        <span className="text-[10px] text-[#A89B95] tabular-nums truncate" title={formatCompactRupiah(totalSpent)}>
          {formatCompactRupiah(totalSpent)}
        </span>
      </div>

      {/* Guest/Pax Pillar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#ECE5DE] shadow-ambient flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#DFB15B]">
          <Users className="w-4 h-4" strokeWidth={1.75} />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#73635C]">
            Tamu
          </span>
        </div>
        <div className="my-2">
          <span
            data-testid="barometer-guest-pax"
            className="font-sans text-xl font-bold text-[#3A302C] tabular-nums"
          >
            {profile.guestCountTarget || '—'}
          </span>
          <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden mt-1.5 border border-[#ECE5DE]/60">
            <div className="bg-[#DFB15B] h-full rounded-full w-0" />
          </div>
        </div>
        <span className="text-[10px] text-[#A89B95]">
          Fase 2
        </span>
      </div>
    </div>
  );
};
