import React, { useState } from 'react';
import { X, BookOpen, Plus, Trash2, CalendarHeart } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { JournalEntryDialog } from './journal-entry-dialog';
import { formatIndonesianDate } from '../../utils/date.utils';
import { JOURNAL_CATEGORY_OPTIONS } from '../../constants/wedding.constants';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose }) => {
  const { state, addJournalEntry, deleteJournalEntry } = useWeddingPlanner();
  const { journal } = state;

  const [isAddOpen, setIsAddOpen] = useState(false);

  if (!isOpen) return null;

  const getCategoryLabel = (cat: string) => {
    return JOURNAL_CATEGORY_OPTIONS.find((c) => c.id === cat)?.label || cat;
  };

  return (
    <div
      data-testid="journal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#3A302C]/60 backdrop-blur-md overflow-y-auto"
    >
      <div className="w-full max-w-md bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE5DE]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FAF5E8] flex items-center justify-center text-[#DFB15B]">
              <BookOpen className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
                Jurnal & Catatan Kenangan
              </h3>
              <span className="text-[10px] text-[#A89B95] block -mt-0.5">
                Mengabadikan debar rasa di tiap langkah persiapan
              </span>
            </div>
          </div>

          <button
            type="button"
            data-testid="button-close-journal-modal"
            onClick={onClose}
            className="p-1 rounded-md text-[#A89B95] hover:text-[#3A302C] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center py-3">
          <span className="text-xs text-[#73635C] font-medium">
            {journal.length} Catatan Momen
          </span>
          <button
            type="button"
            data-testid="button-open-add-journal"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#58755E] hover:bg-[#4b6350] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Tulis Cerita</span>
          </button>
        </div>

        {/* Content Entries / Empty State */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
          {journal.length === 0 ? (
            <div
              data-testid="journal-empty-state"
              className="py-10 text-center flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#FDF0EE] flex items-center justify-center text-[#B86B70] mb-3">
                <CalendarHeart className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h4 className="font-serif text-base font-semibold text-[#3A302C]">
                Belum Ada Catatan Momen
              </h4>
              <p className="text-xs text-[#73635C] mt-1 max-w-[240px] leading-relaxed">
                Tuliskan kisah haru, suka cita, dan pengalaman indah saat menyiapkan hari bahagia Anda.
              </p>
              <button
                type="button"
                data-testid="button-empty-add-journal"
                onClick={() => setIsAddOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-xs font-medium text-[#3A302C] transition-colors cursor-pointer"
              >
                + Mulai Tulis Cerita
              </button>
            </div>
          ) : (
            journal.map((item) => (
              <div
                key={item.id}
                data-testid={`journal-entry-${item.id}`}
                className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#ECE5DE] flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#A89B95] block">
                      {formatIndonesianDate(item.date)}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-[#3A302C] mt-0.5">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white text-[#B86B70] border border-[#F2DFDC] font-medium">
                      {getCategoryLabel(item.category)}
                    </span>
                    <button
                      type="button"
                      data-testid={`button-delete-journal-${item.id}`}
                      onClick={() => deleteJournalEntry(item.id)}
                      className="opacity-40 hover:opacity-100 hover:text-[#B86B70] text-[#A89B95] p-1 rounded-md transition-opacity cursor-pointer"
                      aria-label="Hapus catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#73635C] leading-relaxed mt-1 whitespace-pre-wrap">
                  {item.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <JournalEntryDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addJournalEntry}
      />
    </div>
  );
};
