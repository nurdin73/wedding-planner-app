import { createContext } from 'react';
import type { WeddingPlannerContextType } from '../types/wedding.types';

export const WeddingPlannerContext = createContext<WeddingPlannerContextType | undefined>(undefined);
