import type { WeddingPlannerState } from '../types/wedding.types';

const STORAGE_KEY = 'janji_suci_planner_state_v1';

export const INITIAL_STATE: WeddingPlannerState = {
  profile: {
    brideName: '',
    groomName: '',
    weddingDate: '',
    targetBudget: 0,
    guestCountTarget: 0,
    isInitialized: false,
  },
  checklist: [],
  expenses: [],
  activeTab: 'home',
};

export function loadPlannerState(): WeddingPlannerState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<WeddingPlannerState>;

    return {
      profile: {
        ...INITIAL_STATE.profile,
        ...(parsed.profile || {}),
      },
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      activeTab: parsed.activeTab || 'home',
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return INITIAL_STATE;
  }
}

export function savePlannerState(state: WeddingPlannerState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function clearPlannerState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear state from localStorage:', error);
  }
}
