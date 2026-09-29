export type ThemeMode = 'light' | 'dark' | 'crimson';
export type ViewMode = 'desktop' | 'mobile_sim';
export type NavTab = 'akis' | 'plan' | 'merkez' | 'pricing' | 'profile';

export type EnergyLevel = 'low' | 'balanced' | 'high';
export type MoodType = 'calm' | 'cheerful' | 'inspired' | 'tired' | 'anxious';
export type FocusLevel = 'scattered' | 'balanced' | 'deep';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  subscriptionTier: 'free' | 'starter' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'past_due' | 'cancelled';
  subscriptionPeriod?: 'monthly' | 'yearly';
  trialEndsAt?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  hobbies?: string[];
  lifeMission?: string;
  cardLast4?: string;
  cardBrand?: string;
  membershipId?: string;
  renewalDate?: string;
  createdAt: string;
  onboardingCompleted?: boolean;
}

export interface AutonomousLog {
  id: string;
  time: string;
  title: string;
  detail: string;
  category: 'calendar' | 'commute' | 'email' | 'balance' | 'research';
  status: 'completed';
}

export interface ProactiveInsight {
  id: string;
  type: 'research' | 'location' | 'hobby' | 'psychology';
  title: string;
  snippet: string;
  fullContent: string;
  actionPrompt: string;
  badge: string;
  icon: string;
}

export interface MoodCheckin {
  energy: EnergyLevel;
  mood: MoodType;
  focus: FocusLevel;
  note: string;
  aiAdvice?: string;
  updatedAt: string;
}

export interface WorkLifeBalance {
  score: number;
  status: 'Dengeli' | 'Riskli' | 'Korumada';
  smartGuardActive: boolean;
  cutOffTime: string;
  connectedCount: number;
}

export interface CoachGoal {
  id: string;
  title: string;
  category: string;
  timeline: string;
  subtext: string;
  progress: number;
  progressDelta: string;
  quote: string;
  microStep: string;
}

export interface RoutineSummary {
  workHours: string;
  completedCount: number;
  remainingCount: number;
  eveningFreeMinutes: number;
}

export interface BiologicalRhythm {
  phase: string;
  day: number;
  physicalAdvice: string;
  mentalAdvice: string;
  nextExpectedDate: string;
}

export interface DilemmaItem {
  id: string;
  title: string;
  alignmentScore: number;
  category: 'Kariyer' | 'Finans' | 'Yaşam';
  tag: string;
  pros: string[];
  cons: string[];
  recommendation: string;
  verdict?: string;
}

export interface ProactiveAlert {
  id: string;
  title: string;
  time: string;
  content: string;
  actionLabel: string;
  dismissLabel: string;
  active: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'is' | 'kisisel' | 'finans' | 'alisveris' | 'aile';
  time: string;
  date?: string; // YYYY-MM-DD
  highlight: string;
  isCompleted: boolean;
  details?: string;
  badgeText?: string;
  actionType?: 'view_list' | 'pay_bill' | 'draft_message' | 'default';
}

export interface ConnectedService {
  id: string;
  name: string;
  account: string;
  status: 'Aktif' | 'Bağlı Değil';
  icon: 'teams' | 'gmail' | 'meet' | 'zoom' | 'calendar' | 'whatsapp' | 'health' | 'banking' | 'notion' | 'slack';
  items: string[];
  unreadCount: number;
  toggleable?: boolean;
  isActive: boolean;
  category?: 'comm' | 'work' | 'health' | 'finance';
  syncType?: 'webhook' | 'oauth' | 'rest' | 'healthkit';
  lastSyncedAt?: string;
}

export interface VisionPillar {
  id: string;
  title: string;
  tagline: string;
  category: 'Otonom' | 'Bilişsel' | 'Biyo-Ritim' | 'İlişkiler' | 'Finans' | 'Zihin Sağlığı';
  badge: string;
  problemSolved: string;
  howAyzekSolves: string;
  impactMetrics: string;
  interactiveActionLabel: string;
  actionQuery?: string;
}

export interface AppAction {
  type: 'ADD_TASK' | 'COMPLETE_TASK' | 'UPDATE_MOOD' | 'ADD_DILEMMA' | 'UPDATE_BALANCE' | 'UPDATE_GOAL' | 'DISMISS_ALERT';
  payload: any;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionsApplied?: string[];
}
