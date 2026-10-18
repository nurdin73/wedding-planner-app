export type TimePhase =
  | 'ALL'
  | 'H_12_6_MONTHS'
  | 'H_3_MONTHS'
  | 'H_1_MONTH'
  | 'H_7_DAYS'
  | 'WEDDING_DAY';

export interface TimePhaseOption {
  readonly id: TimePhase;
  readonly label: string;
}

export type BudgetCategory =
  | 'VENUE_CATERING'
  | 'MUA_ATTIRE'
  | 'DECORATION'
  | 'DOCUMENTATION'
  | 'INVITATION_SOUVENIR'
  | 'OTHER';

export interface BudgetCategoryOption {
  readonly id: BudgetCategory;
  readonly label: string;
}

export interface CoupleProfile {
  brideName: string;
  groomName: string;
  weddingDate: string; // YYYY-MM-DD
  targetBudget: number;
  guestCountTarget: number;
  isInitialized: boolean;
}

export interface ChecklistItem {
  id: string;
  title: string;
  phase: Exclude<TimePhase, 'ALL'>;
  isCompleted: boolean;
  notes?: string;
  createdAt: string;
}

export interface BudgetItem {
  id: string;
  title: string;
  category: BudgetCategory;
  estimatedCost: number;
  actualPaid: number;
  notes?: string;
  createdAt: string;
}

export type ActiveTab = 'home' | 'checklist' | 'budget' | 'guest' | 'vendor';

export interface WeddingPlannerState {
  profile: CoupleProfile;
  checklist: ChecklistItem[];
  expenses: BudgetItem[];
  activeTab: ActiveTab;
}

export interface WeddingPlannerContextType {
  state: WeddingPlannerState;
  updateProfile: (profile: Partial<CoupleProfile>) => void;
  initializePlanner: (profile: Omit<CoupleProfile, 'isInitialized'>) => void;
  setActiveTab: (tab: ActiveTab) => void;
  addTask: (title: string, phase: Exclude<TimePhase, 'ALL'>, notes?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addExpense: (
    title: string,
    category: BudgetCategory,
    estimatedCost: number,
    actualPaid: number,
    notes?: string
  ) => void;
  updateExpense: (id: string, updates: Partial<Omit<BudgetItem, 'id' | 'createdAt'>>) => void;
  deleteExpense: (id: string) => void;
  resetAllData: () => void;
}
