import React, { useState, useEffect, useCallback } from 'react';
import type {
  WeddingPlannerState,
  CoupleProfile,
  TimePhase,
  BudgetCategory,
  BudgetItem,
  ActiveTab,
  WeddingPlannerContextType,
} from '../types/wedding.types';
import { loadPlannerState, savePlannerState, clearPlannerState, INITIAL_STATE } from '../utils/storage.utils';
import { triggerPastelConfetti } from '../utils/confetti.utils';
import { WeddingPlannerContext } from './wedding-context-base';

export const WeddingPlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WeddingPlannerState>(() => loadPlannerState());

  useEffect(() => {
    savePlannerState(state);
  }, [state]);

  const updateProfile = useCallback((profileUpdates: Partial<CoupleProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileUpdates,
      },
    }));
  }, []);

  const initializePlanner = useCallback((profileData: Omit<CoupleProfile, 'isInitialized'>) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...profileData,
        isInitialized: true,
      },
    }));
  }, []);

  const setActiveTab = useCallback((tab: ActiveTab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const addTask = useCallback((title: string, phase: Exclude<TimePhase, 'ALL'>, notes?: string) => {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: title.trim(),
      phase,
      isCompleted: false,
      notes: notes?.trim(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      checklist: [newTask, ...prev.checklist],
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

      if (justCompleted) {
        triggerPastelConfetti();
      }

      return {
        ...prev,
        checklist: updatedChecklist,
      };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((task) => task.id !== id),
    }));
  }, []);

  const addExpense = useCallback(
    (
      title: string,
      category: BudgetCategory,
      estimatedCost: number,
      actualPaid: number,
      notes?: string
    ) => {
      const newExpense: BudgetItem = {
        id: `expense_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim(),
        category,
        estimatedCost: Math.max(0, estimatedCost),
        actualPaid: Math.max(0, actualPaid),
        notes: notes?.trim(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        expenses: [newExpense, ...prev.expenses],
      }));
    },
    []
  );

  const updateExpense = useCallback(
    (id: string, updates: Partial<Omit<BudgetItem, 'id' | 'createdAt'>>) => {
      setState((prev) => ({
        ...prev,
        expenses: prev.expenses.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }));
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((item) => item.id !== id),
    }));
  }, []);

  const resetAllData = useCallback(() => {
    clearPlannerState();
    setState(INITIAL_STATE);
  }, []);

  const value: WeddingPlannerContextType = {
    state,
    updateProfile,
    initializePlanner,
    setActiveTab,
    addTask,
    toggleTask,
    deleteTask,
    addExpense,
    updateExpense,
    deleteExpense,
    resetAllData,
  };

  return (
    <WeddingPlannerContext.Provider value={value}>
      {children}
    </WeddingPlannerContext.Provider>
  );
};
