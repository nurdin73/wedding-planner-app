import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight, Plus } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { calculatePercentage } from '../../utils/currency.utils';

export const UrgentTasksCard: React.FC = () => {
  const { state, toggleTask, setActiveTab } = useWeddingPlanner();
  const { checklist } = state;

  const h7Tasks = checklist.filter((item) => item.phase === 'H_7_DAYS');
  const completedCount = h7Tasks.filter((item) => item.isCompleted).length;
  const progressPercent = calculatePercentage(completedCount, h7Tasks.length);

  return (
    <div
      data-testid="home-h7-tasks-card"
      className="bg-white rounded-2xl p-4 border border-[#ECE5DE] shadow-ambient flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FAF5E8] border border-[#DFB15B]/20 flex items-center justify-center text-[#DFB15B] shrink-0">
            <Clock className="w-4 h-4" strokeWidth={2} />
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-[#3A302C]">
              Persiapan Menuju Hari-H (H-7)
            </h4>
            <p className="text-[11px] text-[#A89B95]">
              Sentuhan akhir penyempurna momen sakral Anda berdua
            </p>
          </div>
        </div>

        {h7Tasks.length > 0 && (
          <span className="text-xs font-semibold text-primary tabular-nums shrink-0">
            {completedCount}/{h7Tasks.length}
          </span>
        )}
      </div>

      {/* Progress Bar (when tasks exist) */}
      {h7Tasks.length > 0 && (
        <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden border border-[#ECE5DE]/60">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Tasks List */}
      {h7Tasks.length > 0 ? (
        <div className="flex flex-col gap-1.5 pt-1">
          {h7Tasks.map((task) => (
            <div
              key={task.id}
              data-testid={`h7-task-item-${task.id}`}
              onClick={() => toggleTask(task.id)}
              className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors cursor-pointer border ${
                task.isCompleted
                  ? 'bg-[#FAF8F5]/60 border-transparent text-[#A89B95]'
                  : 'bg-[#FAF8F5] border-[#ECE5DE]/70 text-[#3A302C] hover:border-secondary/40'
              }`}
            >
              <button
                type="button"
                data-testid={`h7-task-checkbox-${task.id}`}
                className="mt-0.5 shrink-0 transition-transform active:scale-90"
              >
                {task.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-primary fill-primary-light" />
                ) : (
                  <Circle className="w-4 h-4 text-[#ECE5DE] hover:text-secondary" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span
                  className={`block text-xs leading-snug line-clamp-2 break-words [overflow-wrap:anywhere] ${
                    task.isCompleted ? 'line-through text-[#A89B95]' : 'font-medium text-[#3A302C]'
                  }`}
                >
                  {task.title}
                </span>
                {task.notes && (
                  <span className="block text-[10px] text-[#A89B95] mt-0.5 line-clamp-2 break-words [overflow-wrap:anywhere]">
                    {task.notes}
                  </span>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            data-testid="button-view-all-checklist"
            onClick={() => setActiveTab('checklist')}
            className="flex items-center justify-center gap-1.5 text-xs text-[#73635C] hover:text-secondary font-medium pt-2 transition-colors cursor-pointer"
          >
            <span>Lihat Seluruh Linimasa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Empty State with Action to Checklist */
        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-dashed border-[#ECE5DE] flex flex-col items-center text-center gap-2">
          <p className="text-xs text-[#73635C] leading-relaxed">
            Belum ada agenda persiapan untuk pekan H-7.
          </p>
          <button
            type="button"
            data-testid="button-add-h7-task"
            onClick={() => setActiveTab('checklist')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-secondary hover:bg-secondary-light transition-colors cursor-pointer border border-secondary/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Agenda di Linimasa</span>
          </button>
        </div>
      )}
    </div>
  );
};
