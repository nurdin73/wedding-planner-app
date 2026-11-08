import React, { useState, useMemo } from 'react';
import { X, StickyNote, Plus, Search } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { NoteCard } from './note-card';
import { NoteDialog } from './note-dialog';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { NOTE_CATEGORY_OPTIONS } from '../../constants/wedding.constants';
import type { NoteCategory, NoteItem } from '../../types/wedding.types';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose }) => {
  const { state, addNote, updateNote, deleteNote } = useWeddingPlanner();
  const { notes = [] } = state;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteItem | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<NoteItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'ALL'>('ALL');

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchCategory = selectedCategory === 'ALL' || n.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [notes, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="notes-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#3A302C]/60 backdrop-blur-md overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE5DE]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF5E8] flex items-center justify-center text-[#9A702C]">
              <StickyNote className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
                Catatan & Memo Perencanaan
              </h3>
              <span className="text-[10px] text-[#A89B95] block -mt-0.5">
                Rincian konsumsi, daftar foto, ide konsep & memo penting
              </span>
            </div>
          </div>

          <button
            type="button"
            data-testid="button-close-notes-modal"
            onClick={onClose}
            className="p-1 rounded-md text-[#A89B95] hover:text-[#3A302C] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="flex flex-col gap-2.5 py-3 border-b border-[#ECE5DE]/40">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#A89B95] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                data-testid="input-search-notes"
                type="text"
                placeholder="Cari catatan (cth: konsumsi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-secondary"
              />
            </div>
            <button
              type="button"
              data-testid="button-open-add-note"
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors shadow-sm cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Tambah Catatan</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              data-testid="filter-note-category-all"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-[#3A302C] text-white'
                  : 'bg-[#FAF8F5] text-[#73635C] border border-[#ECE5DE] hover:bg-[#F5EFEB]'
              }`}
            >
              Semua ({notes.length})
            </button>
            {NOTE_CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                data-testid={`filter-note-category-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#3A302C] text-white'
                    : 'bg-[#FAF8F5] text-[#73635C] border border-[#ECE5DE] hover:bg-[#F5EFEB]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes List / Empty State */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 flex flex-col gap-3 min-h-[220px]">
          {filteredNotes.length === 0 ? (
            <div
              data-testid="notes-empty-state"
              className="py-12 text-center flex flex-col items-center justify-center my-auto"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF5E8] flex items-center justify-center text-[#9A702C] mb-3">
                <StickyNote className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h4 className="font-serif text-base font-semibold text-[#3A302C]">
                {searchQuery || selectedCategory !== 'ALL'
                  ? 'Tidak Ada Catatan yang Cocok'
                  : 'Belum Ada Catatan & Memo'}
              </h4>
              <p className="text-xs text-[#73635C] mt-1 max-w-[260px] leading-relaxed">
                {searchQuery || selectedCategory !== 'ALL'
                  ? 'Coba ganti kata kunci pencarian atau pilih kategori lain.'
                  : 'Tuliskan daftar menu konsumsi, susunan foto keluarga, atau rincian konsep pernikahan Anda.'}
              </p>
              {!searchQuery && selectedCategory === 'ALL' && (
                <button
                  type="button"
                  data-testid="button-empty-add-note"
                  onClick={() => setIsAddOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors cursor-pointer shadow-sm"
                >
                  + Tulis Catatan Pertama
                </button>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={(n) => setNoteToEdit(n)}
                onDelete={(n) => setNoteToDelete(n)}
              />
            ))
          )}
        </div>

        {/* Note Dialogs */}
        <NoteDialog
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={addNote}
        />

        <NoteDialog
          isOpen={Boolean(noteToEdit)}
          onClose={() => setNoteToEdit(null)}
          onAdd={addNote}
          onUpdate={updateNote}
          noteToEdit={noteToEdit}
        />

        <ConfirmDialog
          isOpen={Boolean(noteToDelete)}
          title="Hapus Catatan Ini?"
          description="Catatan ini akan dihapus secara permanen dari daftar perencanaan Anda."
          itemName={noteToDelete?.title}
          confirmLabel="Hapus Catatan"
          variant="danger"
          testIdPrefix="confirm-delete-note"
          onClose={() => setNoteToDelete(null)}
          onConfirm={() => {
            if (noteToDelete) {
              deleteNote(noteToDelete.id);
              setNoteToDelete(null);
            }
          }}
        />
      </div>
    </div>
  );
};

