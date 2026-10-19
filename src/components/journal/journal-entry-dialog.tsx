import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { JournalCategory } from '../../types/wedding.types';
import { JOURNAL_CATEGORY_OPTIONS } from '../../constants/wedding.constants';
import { journalFormSchema } from '../../schemas/wedding-forms.schema';

interface JournalEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, content: string, category: JournalCategory, date?: string) => void;
}

export const JournalEntryDialog: React.FC<JournalEntryDialogProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JournalCategory>('MILESTONE');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = journalFormSchema.safeParse({ title, content, category, date });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onAdd(result.data.title, result.data.content, result.data.category, result.data.date);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div
      data-testid="add-journal-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            Catat Momen Persiapan
          </h3>
          <button
            type="button"
            data-testid="button-close-add-journal"
            onClick={onClose}
            className="text-[#A89B95] hover:text-[#3A302C] p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Judul Momen / Pengalaman
            </label>
            <input
              data-testid="input-journal-title"
              type="text"
              placeholder="cth: Fitting Gaun & Kebaya Pertama Kali"
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
              <p data-testid="error-journal-title" className="text-[11px] text-rose-600 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Kategori
              </label>
              <select
                data-testid="select-journal-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as JournalCategory)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-secondary"
              >
                {JOURNAL_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Tanggal Momen
              </label>
              <input
                data-testid="input-journal-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                }}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] focus:outline-none ${
                  errors.date ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-secondary'
                }`}
              />
              {errors.date && (
                <p data-testid="error-journal-date" className="text-[10px] text-rose-600 mt-1">
                  {errors.date}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Cerita & Kesan yang Dirasakan
            </label>
            <textarea
              data-testid="textarea-journal-content"
              rows={4}
              placeholder="Ceritakan rasa syukur, debar bahagia, atau tips yang dirasakan saat momen ini berlangsung..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none resize-none leading-relaxed ${
                errors.content ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-secondary'
              }`}
            />
            {errors.content && (
              <p data-testid="error-journal-content" className="text-[11px] text-rose-600 mt-1">
                {errors.content}
              </p>
            )}
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
              data-testid="button-submit-journal"
              type="submit"
              className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-hover text-xs font-medium text-white transition-colors cursor-pointer shadow-sm"
            >
              Simpan Cerita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
