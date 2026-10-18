import React from 'react';
import { PlusCircle, ReceiptText, RotateCcw, Share2, BookOpen } from 'lucide-react';
import { CountdownCard } from './countdown-card';
import { PillarBarometer } from './pillar-barometer';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';

interface HomeViewProps {
  onOpenStory?: () => void;
  onOpenJournal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenStory, onOpenJournal }) => {
  const { setActiveTab, resetAllData } = useWeddingPlanner();

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh data perencanaan pernikahan ini?')) {
      resetAllData();
    }
  };

  return (
    <div data-testid="home-view" className="flex flex-col gap-5 animate-fade-in">
      <CountdownCard />

      {/* Romantic Editorial Quote */}
      <div className="text-center px-4 py-2">
        <p className="font-serif italic text-sm text-[#73635C] leading-relaxed">
          &ldquo;Dua jiwa dengan satu keteguhan, merajut langkah menuju satu ikatan suci yang abadi.&rdquo;
        </p>
        <span className="block text-[10px] uppercase tracking-widest text-[#A89B95] mt-1">
          — EverAfter Journal
        </span>
      </div>

      {/* Barometer */}
      <PillarBarometer />

      {/* Social & Experience Banner Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE5DE] shadow-ambient">
        <h4 className="font-serif text-sm font-semibold text-[#3A302C] mb-3">
          Momen & Berbagi
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            data-testid="button-home-story"
            onClick={onOpenStory}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-left transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#FDF0EE] flex items-center justify-center text-[#B86B70]">
              <Share2 className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-[#3A302C]">Story 9:16</span>
              <span className="block text-[10px] text-[#A89B95]">Bagikan capaian</span>
            </div>
          </button>

          <button
            type="button"
            data-testid="button-home-journal"
            onClick={onOpenJournal}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-left transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#FAF5E8] flex items-center justify-center text-[#DFB15B]">
              <BookOpen className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-[#3A302C]">Jurnal Kisah</span>
              <span className="block text-[10px] text-[#A89B95]">Catat kenangan</span>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE5DE] shadow-ambient">
        <h4 className="font-serif text-sm font-semibold text-[#3A302C] mb-3">
          Aksi Cepat
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            data-testid="home-shortcut-checklist"
            onClick={() => setActiveTab('checklist')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-left transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#E8F0EA] flex items-center justify-center text-[#58755E]">
              <PlusCircle className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <span className="block text-xs font-medium text-[#3A302C]">Daftar Tugas</span>
              <span className="block text-[10px] text-[#A89B95]">Kelola checklist</span>
            </div>
          </button>

          <button
            data-testid="home-shortcut-budget"
            onClick={() => setActiveTab('budget')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-left transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#FDF0EE] flex items-center justify-center text-[#B86B70]">
              <ReceiptText className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <span className="block text-xs font-medium text-[#3A302C]">Pos Biaya</span>
              <span className="block text-[10px] text-[#A89B95]">Catat anggaran</span>
            </div>
          </button>
        </div>
      </div>

      {/* Settings / Reset Option */}
      <div className="flex justify-center pt-2">
        <button
          data-testid="button-reset-planner"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[11px] text-[#A89B95] hover:text-[#B86B70] transition-colors py-1 px-3 rounded-full hover:bg-white border border-transparent hover:border-[#ECE5DE]"
        >
          <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
          <span>Atur Ulang Perencanaan</span>
        </button>
      </div>
    </div>
  );
};
