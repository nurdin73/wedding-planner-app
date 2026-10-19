import React, { useState, useEffect, useCallback } from 'react';
import type {
  WeddingPlannerState,
  CoupleProfile,
  TimePhase,
  ChecklistItem,
  BudgetCategory,
  BudgetItem,
  GuestCategory,
  GuestSide,
  GuestItem,
  VendorCategory,
  VendorStatus,
  VendorItem,
  RundownItem,
  JournalCategory,
  ActiveTab,
  WeddingPlannerContextType,
} from '../types/wedding.types';
import { loadPlannerState, savePlannerState, clearPlannerState, INITIAL_STATE } from '../utils/storage.utils';
import { triggerPastelConfetti } from '../utils/confetti.utils';
import { WeddingPlannerContext } from './wedding-context-base';
import { useAuth } from '../hooks/use-auth';
import { usePlannerSync } from '../hooks/use-planner-sync';

export const WeddingPlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<WeddingPlannerState>(() => loadPlannerState());
  const { syncStatus, lastSyncedAt, weddingId, inviteCode, isPaired, membersInfo, joinWedding } = usePlannerSync({
    user,
    state,
    setState,
  });

  useEffect(() => {
    savePlannerState(state, user?.uid);
  }, [state, user?.uid]);

  const updateProfile = useCallback((profileUpdates: Partial<CoupleProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdates },
    }));
  }, []);

  const initializePlanner = useCallback((profileData: Omit<CoupleProfile, 'isInitialized'>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...profileData, isInitialized: true },
    }));
  }, []);

  const setActiveTab = useCallback((tab: ActiveTab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  // Task operations
  const addTask = useCallback((title: string, phase: Exclude<TimePhase, 'ALL'>, notes?: string) => {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: title.trim(),
      phase,
      isCompleted: false,
      notes: notes?.trim(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, checklist: [newTask, ...prev.checklist] }));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<ChecklistItem, 'id' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      checklist: prev.checklist.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((prev) => {
      let justCompleted = false;
      const updatedChecklist = prev.checklist.map((task) => {
        if (task.id === id) {
          const nextState = !task.isCompleted;
          if (nextState) justCompleted = true;
          return { ...task, isCompleted: nextState };
        }
        return task;
      });

      if (justCompleted) triggerPastelConfetti();
      return { ...prev, checklist: updatedChecklist };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((prev) => ({ ...prev, checklist: prev.checklist.filter((task) => task.id !== id) }));
  }, []);

  // Expense operations
  const addExpense = useCallback(
    (title: string, category: BudgetCategory, estimatedCost: number, actualPaid: number, notes?: string) => {
      const newExpense: BudgetItem = {
        id: `expense_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim(),
        category,
        estimatedCost: Math.max(0, estimatedCost),
        actualPaid: Math.max(0, actualPaid),
        notes: notes?.trim(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, expenses: [newExpense, ...prev.expenses] }));
    },
    []
  );

  const updateExpense = useCallback((id: string, updates: Partial<Omit<BudgetItem, 'id' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setState((prev) => ({ ...prev, expenses: prev.expenses.filter((item) => item.id !== id) }));
  }, []);

  // Guest operations
  const addGuest = useCallback(
    (name: string, side: GuestSide, category: GuestCategory, paxCount: number, contactInfo?: string, notes?: string) => {
      const newGuest: GuestItem = {
        id: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        side,
        category,
        paxCount: Math.max(1, Math.min(10, paxCount)),
        invitationStatus: 'NOT_SENT',
        contactInfo: contactInfo?.trim(),
        notes: notes?.trim(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, guests: [newGuest, ...prev.guests] }));
    },
    []
  );

  const updateGuest = useCallback((id: string, updates: Partial<Omit<GuestItem, 'id' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  }, []);

  const toggleInvitationStatus = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === id ? { ...g, invitationStatus: g.invitationStatus === 'SENT' ? 'NOT_SENT' : 'SENT' } : g
      ),
    }));
  }, []);

  const deleteGuest = useCallback((id: string) => {
    setState((prev) => ({ ...prev, guests: prev.guests.filter((g) => g.id !== id) }));
  }, []);

  // Vendor operations
  const addVendor = useCallback(
    (
      name: string,
      category: VendorCategory,
      cost: number,
      status: VendorStatus,
      whatsapp?: string,
      instagram?: string,
      notes?: string
    ) => {
      const newVendor: VendorItem = {
        id: `vendor_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        category,
        cost: Math.max(0, cost),
        status,
        whatsapp: whatsapp?.trim(),
        instagram: instagram?.trim(),
        notes: notes?.trim(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, vendors: [newVendor, ...prev.vendors] }));
    },
    []
  );

  const updateVendor = useCallback((id: string, updates: Partial<Omit<VendorItem, 'id' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  }, []);

  const updateVendorStatus = useCallback((id: string, status: VendorStatus) => {
    setState((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === id ? { ...v, status } : v)),
    }));
  }, []);

  const deleteVendor = useCallback((id: string) => {
    setState((prev) => ({ ...prev, vendors: prev.vendors.filter((v) => v.id !== id) }));
  }, []);

  // Rundown operations
  const addRundownItem = useCallback(
    (time: string, activity: string, pic: string, location?: string, notes?: string) => {
      const newItem: RundownItem = {
        id: `rundown_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        time: time.trim(),
        activity: activity.trim(),
        pic: pic.trim(),
        location: location?.trim(),
        notes: notes?.trim(),
        order: state.rundown.length + 1,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, rundown: [...prev.rundown, newItem] }));
    },
    [state.rundown.length]
  );

  const updateRundownItem = useCallback((id: string, updates: Partial<Omit<RundownItem, 'id' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      rundown: prev.rundown.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, []);

  const deleteRundownItem = useCallback((id: string) => {
    setState((prev) => ({ ...prev, rundown: prev.rundown.filter((r) => r.id !== id) }));
  }, []);

  // Journal operations
  const addJournalEntry = useCallback(
    (title: string, content: string, category: JournalCategory, date?: string) => {
      const newEntry = {
        id: `journal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        date: date || new Date().toISOString().split('T')[0],
        title: title.trim(),
        content: content.trim(),
        category,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, journal: [newEntry, ...prev.journal] }));
    },
    []
  );

  const deleteJournalEntry = useCallback((id: string) => {
    setState((prev) => ({ ...prev, journal: prev.journal.filter((j) => j.id !== id) }));
  }, []);

  const resetAllData = useCallback(() => {
    clearPlannerState(user?.uid);
    setState(INITIAL_STATE);
  }, [user?.uid]);

  const value: WeddingPlannerContextType = {
    state,
    syncStatus,
    lastSyncedAt,
    weddingId,
    inviteCode,
    isPaired,
    membersInfo,
    joinWedding,
    updateProfile,
    initializePlanner,
    setActiveTab,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    addExpense,
    updateExpense,
    deleteExpense,
    addGuest,
    updateGuest,
    toggleInvitationStatus,
    deleteGuest,
    addVendor,
    updateVendor,
    updateVendorStatus,
    deleteVendor,
    addRundownItem,
    updateRundownItem,
    deleteRundownItem,
    addJournalEntry,
    deleteJournalEntry,
    resetAllData,
  };

  return <WeddingPlannerContext.Provider value={value}>{children}</WeddingPlannerContext.Provider>;
};
