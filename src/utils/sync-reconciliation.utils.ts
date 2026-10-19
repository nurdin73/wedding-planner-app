import type {
  WeddingPlannerState,
  ChecklistItem,
  BudgetItem,
  GuestItem,
  VendorItem,
  RundownItem,
  JournalEntry,
} from '../types/wedding.types';

interface Identifiable {
  id: string;
  createdAt?: string;
}

/**
 * Reconciles two arrays of identifiable items by deduplicating IDs.
 * Preserves local items added offline while ensuring remote items from partner are integrated.
 */
function reconcileItemArrays<T extends Identifiable>(localItems: T[], remoteItems: T[]): T[] {
  const itemMap = new Map<string, T>();

  // 1. Seed with remote items from cloud
  for (const item of remoteItems) {
    itemMap.set(item.id, item);
  }

  // 2. Overlay local items (offline creations and edits take precedence locally)
  for (const item of localItems) {
    itemMap.set(item.id, item);
  }

  return Array.from(itemMap.values());
}

/**
 * Reconciles local planner state with remote Firestore state.
 * Useful when device comes back online to avoid blowing away offline edits
 * or partner's concurrent contributions.
 */
export function reconcilePlannerStates(
  localState: WeddingPlannerState,
  remoteState: WeddingPlannerState
): WeddingPlannerState {
  const checklist = reconcileItemArrays<ChecklistItem>(
    localState.checklist || [],
    remoteState.checklist || []
  );

  const expenses = reconcileItemArrays<BudgetItem>(
    localState.expenses || [],
    remoteState.expenses || []
  );

  const guests = reconcileItemArrays<GuestItem>(
    localState.guests || [],
    remoteState.guests || []
  );

  const vendors = reconcileItemArrays<VendorItem>(
    localState.vendors || [],
    remoteState.vendors || []
  );

  const rundown = reconcileItemArrays<RundownItem>(
    localState.rundown || [],
    remoteState.rundown || []
  );

  const journal = reconcileItemArrays<JournalEntry>(
    localState.journal || [],
    remoteState.journal || []
  );

  // Profile resolution: prefer whichever has isInitialized true, with local updates
  const profile = {
    ...remoteState.profile,
    ...localState.profile,
    isInitialized: remoteState.profile.isInitialized || localState.profile.isInitialized,
  };

  return {
    profile,
    checklist,
    expenses,
    guests,
    vendors,
    rundown,
    journal,
    activeTab: localState.activeTab,
  };
}
