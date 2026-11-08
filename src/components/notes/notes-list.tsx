import React, { useState, useMemo } from 'react';
import { Search, Plus, StickyNote } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { NoteCard } from './note-card';
import { NoteDialog } from './note-dialog';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { NOTE_CATEGORY_OPTIONS } from '../../constants/wedding.constants';
import type { NoteCategory, NoteItem } from '../../types/wedding.types';

export const NotesList: React.FC = () => {
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

  return (
    <div data-testid="notes-list-section" className="flex flex-col gap-4 animate-fade-in">
      {/* Search & Action Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#A89B95] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            data-testid="input-search-notes"
            type="text"
            placeholder="Cari catatan (cth: konsumsi, konsep)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-secondary shadow-xs"
          />
        </div>
        <button
          type="button"
          data-testid="button-open-add-note"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors shadow-sm cursor-pointer shrink-0"
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
          className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer shrink-0 border ${
            selectedCategory === 'ALL'
              ? 'bg-secondary text-white border-secondary shadow-sm font-medium'
              : 'bg-white text-[#73635C] border-[#ECE5DE] hover:border-secondary/40'
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
            className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer shrink-0 border ${
              selectedCategory === cat.id
                ? 'bg-secondary text-white border-secondary shadow-sm font-medium'
                : 'bg-white text-[#73635C] border-[#ECE5DE] hover:border-secondary/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notes List / Empty State */}
      <div className="flex flex-col gap-3">
        {filteredNotes.length === 0 ? (
          <div
            data-testid="notes-empty-state"
            className="py-12 bg-white rounded-2xl border border-[#ECE5DE] shadow-ambient text-center flex flex-col items-center justify-center p-6"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF5E8] flex items-center justify-center text-[#9A702C] mb-3">
              <StickyNote className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <h4 className="font-serif text-base font-semibold text-[#3A302C]">
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Tidak Ada Catatan yang Cocok'
                : 'Belum Ada Catatan & Memo'}
            </h4>
            <p className="text-xs text-[#73635C] mt-1 max-w-[280px] leading-relaxed">
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Coba ganti kata kunci pencarian atau pilih kategori lain.'
                : 'Simpan daftar menu konsumsi, susunan foto keluarga, atau rincian konsep pernikahan Anda di sini.'}
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
        description="Catatan ini akan dihapus secara permanen dari daftar persiapan Anda."
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
  );
};

