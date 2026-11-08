import React from 'react';
import { StickyNote } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { UserAuthButton } from '../auth/user-auth-button';

interface AppHeaderProps {
  onOpenInvite?: () => void;
  onOpenReschedule?: () => void;
  onOpenNotes?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenInvite,
  onOpenReschedule,
  onOpenNotes,
}) => {
  const { state } = useWeddingPlanner();
  const { profile, notes = [] } = state;

  const hasCoupleNames = Boolean(profile.brideName && profile.groomName);
  const coupleTitle = hasCoupleNames
    ? `${profile.brideName} & ${profile.groomName}`
    : 'Janji Suci';
  const subtitle = hasCoupleNames ? 'Janji Suci Planner' : 'Wedding Planner';

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#FAF8F5]/85 border-b border-[#ECE5DE] transition-colors"
    >
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Couple Names */}
        <div className="flex items-center gap-2.5">
          <img
            data-testid="header-app-logo"
            src="/icon-192.png"
            alt="Janji Suci"
            className="w-8 h-8 rounded-full object-cover border border-[#ECE5DE] shadow-xs"
          />
          <div>
            <span
              data-testid="header-couple-title"
              className="font-serif text-lg font-semibold tracking-wide text-[#3A302C] block leading-tight"
            >
              {coupleTitle}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#A89B95] block -mt-0.5">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Right side: Clean Unified Account & Workspace Menu */}
        <div className="flex items-center gap-1.5">
          {onOpenNotes && (
            <button
              type="button"
              data-testid="header-button-notes"
              onClick={onOpenNotes}
              className="p-2 rounded-xl text-[#73635C] hover:text-[#3A302C] hover:bg-[#F5EFEB] border border-[#ECE5DE]/70 transition-colors cursor-pointer relative bg-white/70"
              aria-label="Catatan & Memo Perencanaan"
              title="Catatan & Memo Perencanaan"
            >
              <StickyNote className="w-4 h-4" strokeWidth={1.75} />
              {notes.length > 0 && (
                <span
                  data-testid="header-notes-badge"
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary"
                />
              )}
            </button>
          )}
          <UserAuthButton onOpenInvite={onOpenInvite} onOpenReschedule={onOpenReschedule} />
        </div>
      </div>
    </header>
  );
};
