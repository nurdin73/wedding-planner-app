import React, { useState } from 'react';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { NoteItem } from '../../types/wedding.types';
import { NOTE_CATEGORY_OPTIONS } from '../../constants/wedding.constants';

interface NoteCardProps {
  note: NoteItem;
  onEdit: (note: NoteItem) => void;
  onDelete: (note: NoteItem) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryLabel =
    NOTE_CATEGORY_OPTIONS.find((c) => c.id === note.category)?.label || note.category;

  const lines = note.content.split('\n');
  const isLong = lines.length > 4 || note.content.length > 180;

  return (
    <div
      data-testid={`note-card-${note.id}`}
      className="p-4 rounded-xl bg-white border border-[#ECE5DE] shadow-ambient hover:border-secondary/40 transition-all flex flex-col gap-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div>
            <span
              data-testid={`badge-note-category-${note.id}`}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF5E8] text-[#9A702C] border border-[#ECE5DE]"
            >
              {categoryLabel}
            </span>
          </div>

          <h4
            data-testid={`note-title-${note.id}`}
            className="font-serif text-base font-semibold text-[#3A302C] leading-snug break-words"
          >
            {note.title}
          </h4>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            data-testid={`button-edit-note-${note.id}`}
            onClick={() => onEdit(note)}
            className="p-1 rounded-md text-[#A89B95] hover:text-primary transition-colors cursor-pointer"
            aria-label="Edit catatan"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            data-testid={`button-delete-note-${note.id}`}
            onClick={() => onDelete(note)}
            className="p-1 rounded-md text-[#A89B95] hover:text-rose-600 transition-colors cursor-pointer"
            aria-label="Hapus catatan"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div
        data-testid={`note-content-${note.id}`}
        className={`text-xs text-[#73635C] whitespace-pre-wrap leading-relaxed font-sans ${
          !isExpanded && isLong ? 'line-clamp-4' : ''
        }`}
      >
        {note.content}
      </div>

      {isLong && (
        <button
          type="button"
          data-testid={`button-toggle-expand-note-${note.id}`}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="self-start flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-secondary/80 cursor-pointer pt-0.5"
        >
          <span>{isExpanded ? 'Tampilkan lebih sedikit' : 'Lihat selengkapnya'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3 h-3" strokeWidth={2} />
          ) : (
            <ChevronDown className="w-3 h-3" strokeWidth={2} />
          )}
        </button>
      )}
    </div>
  );
};

