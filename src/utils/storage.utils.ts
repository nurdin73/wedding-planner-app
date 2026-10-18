import type { WeddingPlannerState } from '../types/wedding.types';

const GUEST_STORAGE_KEY = 'janji_suci_planner_guest';
const LEGACY_STORAGE_KEY = 'janji_suci_planner_state_v1';

export function getStorageKey(uid?: string | null): string {
  return uid ? `janji_suci_planner_cache_${uid}` : GUEST_STORAGE_KEY;
}

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
  guests: [],
  vendors: [],
  rundown: [],
  journal: [],
  activeTab: 'home',
};

export function loadPlannerState(uid?: string | null): WeddingPlannerState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const key = getStorageKey(uid);
    let raw = localStorage.getItem(key);

    // If no data found in scoped key and we are guest, check legacy key
    if (!raw && !uid) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(GUEST_STORAGE_KEY, raw);
      }
    }

    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<WeddingPlannerState>;

    return {
      profile: {
        ...INITIAL_STATE.profile,
        ...(parsed.profile || {}),
      },
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      guests: Array.isArray(parsed.guests) ? parsed.guests : [],
      vendors: Array.isArray(parsed.vendors) ? parsed.vendors : [],
      rundown: Array.isArray(parsed.rundown) ? parsed.rundown : [],
      journal: Array.isArray(parsed.journal) ? parsed.journal : [],
      activeTab: parsed.activeTab || 'home',
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return INITIAL_STATE;
  }
}

export function savePlannerState(state: WeddingPlannerState, uid?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getStorageKey(uid);
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function clearPlannerState(uid?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getStorageKey(uid);
    localStorage.removeItem(key);
    if (!uid) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear state from localStorage:', error);
  }
}
