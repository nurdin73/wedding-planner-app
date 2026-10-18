import React, { useState } from 'react';
import { HeartHandshake, Calendar, Wallet } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';

export const OnboardingModal: React.FC = () => {
  const { state, initializePlanner } = useWeddingPlanner();
  const { profile } = state;

  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [budgetStr, setBudgetStr] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (profile.isInitialized) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim()) {
      setError('Mohon masukkan nama kedua calon mempelai.');
      return;
    }
    if (!weddingDate) {
      setError('Mohon tentukan tanggal pernikahan Anda.');
      return;
    }

    const numericBudget = parseInt(budgetStr.replace(/\D/g, ''), 10) || 0;

    initializePlanner({
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      weddingDate,
      targetBudget: numericBudget,
      guestCountTarget: 0,
    });
  };

  return (
    <div
      data-testid="onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-[#ECE5DE] shadow-ambient">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#FDF0EE] flex items-center justify-center border border-[#F2DFDC] mb-3">
            <HeartHandshake className="w-6 h-6 text-[#B86B70]" strokeWidth={1.75} />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#3A302C] tracking-tight">
            Janji Suci
          </h2>
          <p className="text-xs text-[#73635C] mt-1 max-w-[240px] leading-relaxed">
            Mulailah merangkai hari bahagia Anda dalam ruang digital yang tenang dan teratur.
          </p>
        </div>

        {error && (
          <div
            data-testid="onboarding-error"
            className="mb-4 px-3 py-2 rounded-lg bg-[#FDF0EE] border border-[#F2DFDC] text-xs text-[#B86B70]"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Mempelai Wanita
              </label>
              <input
                data-testid="input-bride-name"
                type="text"
                placeholder="cth: Sarah"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Mempelai Pria
              </label>
              <input
                data-testid="input-groom-name"
                type="text"
                placeholder="cth: Dimas"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Tanggal Pernikahan
            </label>
            <div className="relative">
              <input
                data-testid="input-wedding-date"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-[#B86B70]"
                required
              />
              <Calendar className="w-4 h-4 text-[#A89B95] absolute right-3 top-2.5 pointer-events-none" strokeWidth={1.75} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Target Pagu Anggaran (Rp) <span className="text-[#A89B95]">(opsional)</span>
            </label>
            <div className="relative">
              <input
                data-testid="input-target-budget"
                type="text"
                placeholder="cth: 150000000"
                value={budgetStr}
                onChange={(e) => setBudgetStr(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70]"
              />
              <Wallet className="w-4 h-4 text-[#A89B95] absolute right-3 top-2.5 pointer-events-none" strokeWidth={1.75} />
            </div>
          </div>

          <button
            data-testid="button-start-planner"
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#B86B70] hover:bg-[#a65d62] text-white text-sm font-medium tracking-wide shadow-sm transition-colors cursor-pointer"
          >
            Mulai Merencanakan
          </button>
        </form>
      </div>
    </div>
  );
};
