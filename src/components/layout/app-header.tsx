import React from 'react';
import { Sparkles, UserCheck } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';

export const AppHeader: React.FC = () => {
  const { state } = useWeddingPlanner();
  const { profile } = state;

  const coupleTitle =
    profile.brideName && profile.groomName
      ? `${profile.brideName} & ${profile.groomName}`
      : 'Janji Suci';

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#FAF8F5]/85 border-b border-[#ECE5DE] transition-colors"
    >
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FDF0EE] flex items-center justify-center border border-[#F2DFDC]">
            <Sparkles className="w-4 h-4 text-[#B86B70]" strokeWidth={1.75} />
          </div>
          <div>
            <span
              data-testid="header-couple-title"
              className="font-serif text-lg font-semibold tracking-wide text-[#3A302C] block leading-tight"
            >
              {coupleTitle}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#A89B95] block -mt-0.5">
              EverAfter Planner
            </span>
          </div>
        </div>

        <div
          data-testid="header-mode-badge"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#ECE5DE] text-[11px] font-medium text-[#73635C]"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#58755E]" strokeWidth={1.75} />
          <span>Tamu</span>
        </div>
      </div>
    </header>
  );
};
