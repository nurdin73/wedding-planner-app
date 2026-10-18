import React from 'react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { UserAuthButton } from '../auth/user-auth-button';

interface AppHeaderProps {
  onOpenInvite?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenInvite }) => {
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
              EverAfter Planner
            </span>
          </div>
        </div>

        {/* Right side: Clean Unified Account & Workspace Menu */}
        <div className="flex items-center gap-2">
          <UserAuthButton onOpenInvite={onOpenInvite} />
        </div>
      </div>
    </header>
  );
};
