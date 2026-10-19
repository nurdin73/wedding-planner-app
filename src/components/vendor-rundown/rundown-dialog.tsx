import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { RundownItem } from '../../types/wedding.types';
import { rundownFormSchema } from '../../schemas/wedding-forms.schema';

interface RundownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (time: string, activity: string, pic: string, location?: string, notes?: string) => void;
  onUpdate?: (id: string, updates: Partial<Omit<RundownItem, 'id' | 'createdAt'>>) => void;
  rundownToEdit?: RundownItem | null;
}

const RundownDialogForm: React.FC<RundownDialogProps> = ({
  onClose,
  onAdd,
  onUpdate,
  rundownToEdit,
}) => {
  const [time, setTime] = useState(rundownToEdit?.time ?? '');
  const [activity, setActivity] = useState(rundownToEdit?.activity ?? '');
  const [pic, setPic] = useState(rundownToEdit?.pic ?? '');
  const [location, setLocation] = useState(rundownToEdit?.location ?? '');
  const [notes, setNotes] = useState(rundownToEdit?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = rundownFormSchema.safeParse({ time, activity, pic, location, notes });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    if (rundownToEdit && onUpdate) {
      onUpdate(rundownToEdit.id, {
        time: result.data.time,
        activity: result.data.activity,
        pic: result.data.pic,
        location: result.data.location?.trim() || undefined,
        notes: result.data.notes?.trim() || undefined,
      });
    } else {
      onAdd(
        result.data.time,
        result.data.activity,
        result.data.pic,
        result.data.location?.trim() || undefined,
        result.data.notes?.trim() || undefined
      );
    }

    setTime('');
    setActivity('');
    setPic('');
    setLocation('');
    setNotes('');
    onClose();
  };

  return (
    <div
      data-testid="rundown-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            {rundownToEdit ? 'Edit Sesi Acara Hari-H' : 'Tambah Sesi Acara Hari-H'}
          </h3>
          <button
            type="button"
            data-testid="button-close-add-rundown"
            onClick={onClose}
            className="text-[#A89B95] hover:text-[#3A302C] p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Waktu Pelaksanaan
              </label>
              <input
                data-testid="input-rundown-time"
                type="text"
                placeholder="cth: 08:00 - 09:30"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (errors.time) setErrors((prev) => ({ ...prev, time: '' }));
                }}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none tabular-nums ${
                  errors.time ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-secondary'
                }`}
                autoFocus
              />
              {errors.time && (
                <p data-testid="error-rundown-time" className="text-[10px] text-rose-600 mt-1">
                  {errors.time}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                PIC / Penanggung Jawab
              </label>
              <input
                data-testid="input-rundown-pic"
                type="text"
                placeholder="cth: Dimas / KUA"
                value={pic}
                onChange={(e) => {
                  setPic(e.target.value);
                  if (errors.pic) setErrors((prev) => ({ ...prev, pic: '' }));
                }}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none ${
                  errors.pic ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-secondary'
                }`}
              />
              {errors.pic && (
                <p data-testid="error-rundown-pic" className="text-[10px] text-rose-600 mt-1">
                  {errors.pic}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Nama Aktivitas / Sesi Acara
            </label>
            <input
              data-testid="input-rundown-activity"
              type="text"
              placeholder="cth: Prosesi Akad Nikah & Ijab Kabul"
              value={activity}
              onChange={(e) => {
                setActivity(e.target.value);
                if (errors.activity) setErrors((prev) => ({ ...prev, activity: '' }));
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none ${
                errors.activity ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-secondary'
              }`}
            />
            {errors.activity && (
              <p data-testid="error-rundown-activity" className="text-[11px] text-rose-600 mt-1">
                {errors.activity}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Lokasi Ruangan (opsional)
            </label>
            <input
              data-testid="input-rundown-location"
              type="text"
              placeholder="cth: Masjid Agung / Pelaminan Utama"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Catatan Teknis (opsional)
            </label>
            <input
              data-testid="input-rundown-notes"
              type="text"
              placeholder="cth: Pastikan mahar, cincin, dan mic sudah siap"
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
              data-testid="button-submit-rundown"
              type="submit"
              className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-hover text-xs font-medium text-white transition-colors cursor-pointer shadow-sm"
            >
              {rundownToEdit ? 'Simpan Perubahan' : 'Simpan Sesi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const RundownDialog: React.FC<RundownDialogProps> = (props) => {
  if (!props.isOpen) return null;
  return <RundownDialogForm key={props.rundownToEdit?.id ?? 'create'} {...props} />;
};

export const AddRundownDialog = RundownDialog;


