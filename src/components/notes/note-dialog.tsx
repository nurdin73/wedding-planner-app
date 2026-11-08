import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { NoteCategory, NoteItem } from '../../types/wedding.types';
import { NOTE_CATEGORY_OPTIONS } from '../../constants/wedding.constants';
import { noteFormSchema } from '../../schemas/wedding-forms.schema';

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, content: string, category: NoteCategory) => void;
  onUpdate?: (id: string, updates: Partial<Omit<NoteItem, 'id' | 'createdAt'>>) => void;
  noteToEdit?: NoteItem | null;
}

const NoteDialogForm: React.FC<NoteDialogProps> = ({
  onClose,
  onAdd,
  onUpdate,
  noteToEdit,
}) => {
  const [title, setTitle] = useState(noteToEdit?.title ?? '');
  const [category, setCategory] = useState<NoteCategory>(noteToEdit?.category ?? 'GENERAL');
  const [content, setContent] = useState(noteToEdit?.content ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = noteFormSchema.safeParse({ title, content, category });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    if (noteToEdit && onUpdate) {
      onUpdate(noteToEdit.id, {
        title: result.data.title,
        content: result.data.content,
        category: result.data.category,
      });
    } else {
      onAdd(result.data.title, result.data.content, result.data.category);
    }
    onClose();
  };

  return (
    <div
      data-testid="note-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-md bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 data-testid="note-dialog-title" className="font-serif text-lg font-semibold text-[#3A302C]">
              {noteToEdit ? 'Edit Catatan' : 'Tambah Catatan Baru'}
            </h3>
            <p className="text-[10px] text-[#A89B95] -mt-0.5">
              Simpan daftar menu konsumsi, konsep, atau catatan penting lainnya
            </p>
          </div>
          <button
            type="button"
            data-testid="button-close-note-dialog"
            onClick={onClose}
            className="text-[#A89B95] hover:text-[#3A302C] p-1 rounded-md cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Judul Catatan
            </label>
            <input
              data-testid="input-note-title"
              type="text"
              placeholder="cth: Konsumsi Resepsi, Susunan Foto, dll."
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
              <p data-testid="error-note-title" className="text-[11px] text-rose-600 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Kategori
            </label>
            <select
              data-testid="select-note-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-secondary"
            >
              {NOTE_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Isi Catatan / Daftar Rincian
            </label>
            <textarea
              data-testid="textarea-note-content"
              rows={6}
              placeholder={'Tulis rincian atau daftar informasi di sini...\ncth:\n- Nasi Liwet Komplit (500 porsi)\n- Es Podeng (300 cup)\n- Kontak Catering Ibu Tina (0812-xxx)'}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none resize-none leading-relaxed font-sans ${
                errors.content ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-secondary'
              }`}
            />
            {errors.content && (
              <p data-testid="error-note-content" className="text-[11px] text-rose-600 mt-1">
                {errors.content}
              </p>
            )}
          </div>

          <div className="flex gap-2.5 mt-2">
            <button
              type="button"
              data-testid="button-cancel-note"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-[#ECE5DE] text-xs font-medium text-[#73635C] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              data-testid="button-submit-note"
              type="submit"
              className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-hover text-xs font-medium text-white transition-colors cursor-pointer shadow-sm"
            >
              {noteToEdit ? 'Simpan Perubahan' : 'Simpan Catatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const NoteDialog: React.FC<NoteDialogProps> = (props) => {
  if (!props.isOpen) return null;
  return <NoteDialogForm key={props.noteToEdit?.id ?? 'create'} {...props} />;
};

