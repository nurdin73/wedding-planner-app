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

export type GuestSide = 'BRIDE' | 'GROOM' | 'BOTH';
export type GuestCategory = 'VIP' | 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'OTHER';
export type InvitationStatus = 'NOT_SENT' | 'SENT';

export interface GuestItem {
  id: string;
  name: string;
  side: GuestSide;
  category: GuestCategory;
  paxCount: number;
  invitationStatus: InvitationStatus;
  contactInfo?: string;
  notes?: string;
  createdAt: string;
}

export type VendorCategory =
  | 'VENUE'
  | 'CATERING'
  | 'MUA'
  | 'ATTIRE'
  | 'DECORATION'
  | 'DOCUMENTATION'
  | 'ENTERTAINMENT'
  | 'OTHER';

export type VendorStatus = 'CONTACTED' | 'DP' | 'PAID' | 'COMPLETED';

export interface VendorItem {
  id: string;
  name: string;
  category: VendorCategory;
  cost: number;
  status: VendorStatus;
  whatsapp?: string;
  instagram?: string;
  notes?: string;
  createdAt: string;
}

export interface RundownItem {
  id: string;
  time: string;
  activity: string;
  pic: string;
  location?: string;
  notes?: string;
  order: number;
  createdAt: string;
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

export type JournalCategory = 'MILESTONE' | 'VENDOR_MEETING' | 'REFLECTION' | 'MEMORABLE';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  category: JournalCategory;
  createdAt: string;
}

export type ActiveTab = 'home' | 'checklist' | 'budget' | 'guest' | 'vendor';

export interface WeddingPlannerState {
  profile: CoupleProfile;
  checklist: ChecklistItem[];
  expenses: BudgetItem[];
  guests: GuestItem[];
  vendors: VendorItem[];
  rundown: RundownItem[];
  journal: JournalEntry[];
  activeTab: ActiveTab;
}

export interface WorkspaceMemberInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  joinedAt?: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error';

export interface WeddingPlannerContextType {
  state: WeddingPlannerState;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  weddingId: string | null;
  inviteCode: string | null;
  isPaired: boolean;
  membersInfo?: WorkspaceMemberInfo[];
  joinWedding: (code: string) => Promise<void>;
  updateProfile: (profile: Partial<CoupleProfile>) => void;
  initializePlanner: (profile: Omit<CoupleProfile, 'isInitialized'>) => void;
  setActiveTab: (tab: ActiveTab) => void;
  addTask: (title: string, phase: Exclude<TimePhase, 'ALL'>, notes?: string) => void;
  updateTask: (id: string, updates: Partial<Omit<ChecklistItem, 'id' | 'createdAt'>>) => void;
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
  addGuest: (
    name: string,
    side: GuestSide,
    category: GuestCategory,
    paxCount: number,
    contactInfo?: string,
    notes?: string
  ) => void;
  updateGuest: (id: string, updates: Partial<Omit<GuestItem, 'id' | 'createdAt'>>) => void;
  toggleInvitationStatus: (id: string) => void;
  deleteGuest: (id: string) => void;
  addVendor: (
    name: string,
    category: VendorCategory,
    cost: number,
    status: VendorStatus,
    whatsapp?: string,
    instagram?: string,
    notes?: string
  ) => void;
  updateVendor: (id: string, updates: Partial<Omit<VendorItem, 'id' | 'createdAt'>>) => void;
  updateVendorStatus: (id: string, status: VendorStatus) => void;
  deleteVendor: (id: string) => void;
  addRundownItem: (
    time: string,
    activity: string,
    pic: string,
    location?: string,
    notes?: string
  ) => void;
  updateRundownItem: (id: string, updates: Partial<Omit<RundownItem, 'id' | 'createdAt'>>) => void;
  deleteRundownItem: (id: string) => void;
  addJournalEntry: (
    title: string,
    content: string,
    category: JournalCategory,
    date?: string
  ) => void;
  deleteJournalEntry: (id: string) => void;
  resetAllData: () => void;
}
