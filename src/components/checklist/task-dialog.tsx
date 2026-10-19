import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { TimePhase, ChecklistItem } from '../../types/wedding.types';
import { taskFormSchema } from '../../schemas/wedding-forms.schema';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, phase: Exclude<TimePhase, 'ALL'>, notes?: string) => void;
  onUpdate?: (id: string, updates: Partial<Omit<ChecklistItem, 'id' | 'createdAt'>>) => void;
  taskToEdit?: ChecklistItem | null;
  initialPhase?: TimePhase;
}

const PHASE_OPTIONS: { id: Exclude<TimePhase, 'ALL'>; label: string }[] = [
  { id: 'H_12_6_MONTHS', label: 'H-12 s/d H-6 Bulan' },
  { id: 'H_3_MONTHS', label: 'H-3 Bulan' },
  { id: 'H_1_MONTH', label: 'H-1 Bulan' },
  { id: 'H_7_DAYS', label: 'H-7 Hari' },
  { id: 'WEDDING_DAY', label: 'Hari-H' },
];

const TaskDialogForm: React.FC<TaskDialogProps> = ({
  onClose,
  onAdd,
  onUpdate,
  taskToEdit,
  initialPhase = 'H_12_6_MONTHS',
}) => {
  const defaultPhase = initialPhase === 'ALL' ? 'H_12_6_MONTHS' : initialPhase;
  const [title, setTitle] = useState(taskToEdit?.title ?? '');
  const [phase, setPhase] = useState<Exclude<TimePhase, 'ALL'>>(taskToEdit?.phase ?? defaultPhase);
  const [notes, setNotes] = useState(taskToEdit?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = taskFormSchema.safeParse({ title, phase, notes });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    if (taskToEdit && onUpdate) {
      onUpdate(taskToEdit.id, {
        title: result.data.title,
        phase: result.data.phase,
        notes: result.data.notes?.trim() || undefined,
      });
    } else {
      onAdd(result.data.title, result.data.phase, result.data.notes?.trim() || undefined);
    }
    onClose();
  };

  return (
    <div
      data-testid="task-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            {taskToEdit ? 'Edit Tugas Persiapan' : 'Tambah Tugas Persiapan'}
          </h3>
          <button
            type="button"
            data-testid="button-close-add-task"
            onClick={onClose}
            className="text-[#A89B95] hover:text-[#3A302C] p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Nama Tugas
            </label>
            <input
              data-testid="input-task-title"
              type="text"
              placeholder="cth: Booking venue & tentukan tanggal"
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
              <p data-testid="error-task-title" className="text-[11px] text-rose-600 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Fase Waktu
            </label>
            <select
              data-testid="select-task-phase"
              value={phase}
              onChange={(e) => setPhase(e.target.value as Exclude<TimePhase, 'ALL'>)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-secondary"
            >
              {PHASE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Catatan Singkat (opsional)
            </label>
            <input
              data-testid="input-task-notes"
              type="text"
              placeholder="cth: Kontak marketing Ibu Rini"
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
              data-testid="button-submit-task"
              type="submit"
              className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-hover text-xs font-medium text-white transition-colors cursor-pointer shadow-sm"
            >
              {taskToEdit ? 'Simpan Perubahan' : 'Simpan Tugas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const TaskDialog: React.FC<TaskDialogProps> = (props) => {
  if (!props.isOpen) return null;
  return <TaskDialogForm key={props.taskToEdit?.id ?? 'create'} {...props} />;
};

export const AddTaskDialog = TaskDialog;

