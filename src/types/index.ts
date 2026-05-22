export interface SleepProfile {
  bedtime: string;
  wakeTime: string;
  tiredness: number;
  stressLevel: number;
  caffeine: boolean;
  screenTime: 'less30' | '30to60' | 'more60';
  goals: string[];
  createdAt: string;
}

export interface PlanDay {
  day: number;
  focus: string;
  routine: string[];
  technique: string;
}

export interface SleepPlan {
  summary: string;
  recommendedSound: string;
  tips: string[];
  days: PlanDay[];
  generatedAt: string;
}

export interface SleepRecord {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  wakeups: number;
  quality: number;
  hadAlcohol: boolean;
  hadCaffeine: boolean;
  notes: string;
  score: number;
  durationMinutes: number;
}

export interface DailyInsight {
  insight: string;
  tip: string;
  generatedAt: string;
}

export interface WeeklySummary {
  records: SleepRecord[];
  averageScore: number;
  averageDuration: number;
  totalRecords: number;
}

export interface UserSettings {
  language: 'pt-BR' | 'es-MX' | 'es-AR' | 'es-CO' | 'es-CL' | 'es-PE' | 'es-EC' | 'es-VE' | 'es-UY' | 'es-PA';
  notificationsEnabled: boolean;
  isPremium: boolean;
  onboardingCompleted: boolean;
}

export type GoalId =
  | 'fall_faster'
  | 'less_wakeups'
  | 'feel_rested'
  | 'reduce_stress'
  | 'fix_schedule'
  | 'more_deep_sleep';

export type ScoreLabel = 'Excelente' | 'Bom' | 'Regular' | 'Ruim';

export type Region = 'BR' | 'MX' | 'AR' | 'CO' | 'CL' | 'PE' | 'EC' | 'VE' | 'UY' | 'PA';

export interface GoalOption {
  id: GoalId;
  title: string;
  description: string;
  emoji: string;
}

export interface SoundOption {
  id: string;
  nameKey: string;
  url: string;
  isPremium: boolean;
  emoji: string;
  categoryId: string;
}

export interface MemoryIntention {
  id: string;
  date: string;
  intention: string;
  result: 'remembered' | 'forgot' | null;
}
