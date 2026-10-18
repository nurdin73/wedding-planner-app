import React, { useState, useMemo } from 'react';
import { Plus, ListTodo, CheckCircle2 } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { ChecklistItem } from './checklist-item';
import { AddTaskDialog } from './add-task-dialog';
import type { TimePhase } from '../../types/wedding.types';
import { TIME_PHASES } from '../../constants/wedding.constants';
import { calculatePercentage } from '../../utils/currency.utils';

export const ChecklistView: React.FC = () => {
  const { state, addTask, toggleTask, deleteTask } = useWeddingPlanner();
  const { checklist } = state;

  const [selectedPhase, setSelectedPhase] = useState<TimePhase>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    if (selectedPhase === 'ALL') return checklist;
    return checklist.filter((item) => item.phase === selectedPhase);
  }, [checklist, selectedPhase]);

  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((t) => t.isCompleted).length;
  const progressPercent = calculatePercentage(completedTasks, totalTasks);

  return (
    <div data-testid="checklist-view" className="flex flex-col gap-4 animate-fade-in">
      {/* Header & Progress Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE5DE] shadow-ambient">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-[#58755E]" strokeWidth={1.75} />
            <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
              Linimasa & Checklist
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#58755E] tabular-nums">
            {completedTasks}/{totalTasks} Selesai ({progressPercent}%)
          </span>
        </div>

        <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden border border-[#ECE5DE]/60">
          <div
            className="bg-[#58755E] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {TIME_PHASES.map((phase) => {
          const isActive = selectedPhase === phase.id;
          return (
            <button
              key={phase.id}
              data-testid={`filter-phase-${phase.id}`}
              onClick={() => setSelectedPhase(phase.id)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#B86B70] text-white border-[#B86B70] shadow-sm font-medium'
                  : 'bg-white text-[#73635C] border-[#ECE5DE] hover:border-[#B86B70]/40'
              }`}
            >
              {phase.label}
            </button>
          );
        })}
      </div>

      {/* Action Add Button */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#73635C] font-medium">
          Daftar Persiapan ({filteredTasks.length})
        </span>
        <button
          type="button"
          data-testid="button-open-add-task"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#58755E] hover:bg-[#4b6350] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Tambah Tugas</span>
        </button>
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length === 0 ? (
        <div
          data-testid="checklist-empty-state"
          className="bg-white rounded-2xl p-8 border border-[#ECE5DE] text-center flex flex-col items-center justify-center shadow-ambient"
        >
          <div className="w-12 h-12 rounded-full bg-[#E8F0EA] flex items-center justify-center text-[#58755E] mb-3">
            <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h4 className="font-serif text-base font-semibold text-[#3A302C]">
            Belum Ada Tugas di Fase Ini
          </h4>
          <p className="text-xs text-[#73635C] mt-1 max-w-[220px] leading-relaxed">
            Mulai susun langkah-langkah persiapan pernikahan Anda dengan rapi dan terencana.
          </p>
          <button
            type="button"
            data-testid="button-empty-add-task"
            onClick={() => setIsAddOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-xs font-medium text-[#3A302C] transition-colors cursor-pointer"
          >
            + Buat Tugas Pertama
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredTasks.map((task) => (
            <ChecklistItem
              key={task.id}
              item={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addTask}
        initialPhase={selectedPhase}
      />
    </div>
  );
};
