import React from 'react';
import { AppHeader } from './app-header';
import { BottomNav } from './bottom-nav';

interface AppLayoutProps {
  children: React.ReactNode;
  onOpenStory?: () => void;
  onOpenInvite?: () => void;
  onOpenReschedule?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  onOpenInvite,
  onOpenReschedule,
}) => {
  return (
    <div
      data-testid="app-layout"
      className="min-h-screen bg-[#FAF8F5] text-[#3A302C] flex flex-col justify-between selection:bg-[#FDF0EE] selection:text-[#B86B70]"
    >
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#FAF8F5] flex flex-col relative border-x border-[#ECE5DE]/60 shadow-ambient pb-24">
        <AppHeader onOpenInvite={onOpenInvite} onOpenReschedule={onOpenReschedule} />
        <main className="flex-1 px-4 py-5 flex flex-col gap-6">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
};
