import { useContext } from 'react';
import { WeddingPlannerContext } from '../context/wedding-context-base';
import type { WeddingPlannerContextType } from '../types/wedding.types';

export const useWeddingPlanner = (): WeddingPlannerContextType => {
  const context = useContext(WeddingPlannerContext);
  if (!context) {
    throw new Error('useWeddingPlanner must be used within a WeddingPlannerProvider');
  }
  return context;
};
