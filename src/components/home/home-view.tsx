import React from 'react';
import { PlusCircle, ReceiptText, RotateCcw, Share2, BookOpen, Heart } from 'lucide-react';
import { CountdownCard } from './countdown-card';
import { UrgentTasksCard } from './urgent-tasks-card';
import { PillarBarometer } from './pillar-barometer';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';

interface HomeViewProps {
  onOpenStory?: () => void;
  onOpenJournal?: () => void;
  onOpenInvite?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenStory,
  onOpenJournal,
  onOpenInvite,
}) => {
  const { setActiveTab, resetAllData, isPaired } = useWeddingPlanner();

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

      {/* Partner Collaboration Card */}
      {onOpenInvite && (
        <div
          data-testid="home-collab-card"
          className="bg-white rounded-2xl p-4 border border-[#ECE5DE] shadow-ambient flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <Heart className={`w-4 h-4 ${isPaired ? 'fill-rose-500 text-rose-500' : 'text-rose-600'}`} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-[#3A302C]">
                {isPaired ? 'Ruang Pasangan Terhubung' : 'Kolaborasi Bersama Pasangan'}
              </h4>
              <p className="text-[11px] text-[#A89B95]">
                {isPaired
                  ? 'Kalian merencanakan pernikahan ini bersama secara realtime'
                  : 'Kelola checklist, anggaran & tamu berdua secara realtime'}
              </p>
            </div>
          </div>
          <button
            type="button"
            data-testid="button-home-collab"
            onClick={onOpenInvite}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
              isPaired
                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                : 'bg-[#3A302C] hover:bg-[#2A221F] text-white border-transparent shadow-sm'
            }`}
          >
            {isPaired ? 'Kelola' : 'Hubungkan'}
          </button>
        </div>
      )}

      {/* Urgent H-7 Tasks Card */}
      <UrgentTasksCard />

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
