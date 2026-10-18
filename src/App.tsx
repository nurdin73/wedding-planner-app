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

const AppContent: React.FC = () => {
  const { state } = useWeddingPlanner();
  const { activeTab } = state;

  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  return (
    <AppLayout onOpenStory={() => setIsStoryOpen(true)}>
      <OnboardingModal />

      {activeTab === 'home' && (
        <HomeView
          onOpenStory={() => setIsStoryOpen(true)}
          onOpenJournal={() => setIsJournalOpen(true)}
        />
      )}
      {activeTab === 'checklist' && <ChecklistView />}
      {activeTab === 'budget' && <BudgetView />}
      {activeTab === 'guest' && <GuestView />}
      {activeTab === 'vendor' && <VendorRundownView />}

      <StoryModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
      <JournalModal isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} />
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
