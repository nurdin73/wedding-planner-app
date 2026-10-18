import React, { useState } from 'react';
import { AuthProvider } from './context/auth-context';
import { WeddingPlannerProvider } from './context/wedding-context';
import { useWeddingPlanner } from './hooks/use-wedding-planner';
import { AppLayout } from './components/layout/app-layout';
import { OnboardingModal } from './components/onboarding/onboarding-modal';
import { HomeView } from './components/home/home-view';
import { ChecklistView } from './components/checklist/checklist-view';
import { BudgetView } from './components/budget/budget-view';
import { GuestView } from './components/guests/guest-view';
import { VendorRundownView } from './components/vendor-rundown/vendor-rundown-view';
import { StoryModal } from './components/story/story-modal';
import { JournalModal } from './components/journal/journal-modal';
import { InvitePartnerDialog } from './components/collab/invite-partner-dialog';
import { JoinPartnerDialog } from './components/collab/join-partner-dialog';
import { AcceptInviteDialog } from './components/collab/accept-invite-dialog';

const AppContent: React.FC = () => {
  const { state } = useWeddingPlanner();
  const { activeTab } = state;

  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // Detect ?invite=SUCI-XXXX query param from URL
  const [pendingInviteCode, setPendingInviteCode] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('invite');
    }
    return null;
  });

  const handleClosePendingInvite = () => {
    setPendingInviteCode(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('invite');
      window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ''));
    }
  };

  return (
    <AppLayout onOpenInvite={() => setIsInviteOpen(true)}>
      <OnboardingModal />

      {activeTab === 'home' && (
        <HomeView
          onOpenStory={() => setIsStoryOpen(true)}
          onOpenJournal={() => setIsJournalOpen(true)}
          onOpenInvite={() => setIsInviteOpen(true)}
        />
      )}
      {activeTab === 'checklist' && <ChecklistView />}
      {activeTab === 'budget' && <BudgetView />}
      {activeTab === 'guest' && <GuestView />}
      {activeTab === 'vendor' && <VendorRundownView />}

      <StoryModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
      <JournalModal isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} />
      <InvitePartnerDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onOpenJoin={() => setIsJoinOpen(true)}
      />
      <JoinPartnerDialog
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onOpenInvite={() => setIsInviteOpen(true)}
      />
      {pendingInviteCode && (
        <AcceptInviteDialog
          inviteCode={pendingInviteCode}
          onClose={handleClosePendingInvite}
        />
      )}
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <WeddingPlannerProvider>
        <AppContent />
      </WeddingPlannerProvider>
    </AuthProvider>
  );
};

export default App;
