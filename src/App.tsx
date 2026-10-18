import React from 'react';
import { WeddingPlannerProvider } from './context/wedding-context';
import { useWeddingPlanner } from './hooks/use-wedding-planner';
import { AppLayout } from './components/layout/app-layout';
import { OnboardingModal } from './components/onboarding/onboarding-modal';
import { HomeView } from './components/home/home-view';
import { ChecklistView } from './components/checklist/checklist-view';
import { BudgetView } from './components/budget/budget-view';

const AppContent: React.FC = () => {
  const { state } = useWeddingPlanner();
  const { activeTab } = state;

  return (
    <AppLayout>
      <OnboardingModal />
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'checklist' && <ChecklistView />}
      {activeTab === 'budget' && <BudgetView />}
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <WeddingPlannerProvider>
      <AppContent />
    </WeddingPlannerProvider>
  );
};

export default App;
