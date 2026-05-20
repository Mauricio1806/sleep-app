import AsyncStorage from '@react-native-async-storage/async-storage';
import { SleepProfile, SleepPlan, SleepRecord, UserSettings, WeeklySummary } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import { calculateSleepScore, calculateSleepDuration, getWeeklyAverage } from '../utils/sleepCalculations';

// TODO-AWS: Substituir cada função por chamadas ao Supabase após migração

export async function saveProfile(profile: SleepProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export async function getProfile(): Promise<SleepProfile | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!raw) return null;
  return JSON.parse(raw) as SleepProfile;
}

export async function saveSleepPlan(plan: SleepPlan): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
}

export async function getSleepPlan(): Promise<SleepPlan | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PLAN);
  if (!raw) return null;
  return JSON.parse(raw) as SleepPlan;
}

export async function saveSleepRecord(record: SleepRecord): Promise<void> {
  const existing = await getSleepRecords();
  const updated = [record, ...existing].slice(0, 90);
  await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated));
}

export async function getSleepRecords(days?: number): Promise<SleepRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
  if (!raw) return [];
  const records = JSON.parse(raw) as SleepRecord[];
  if (!days) return records;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return records.filter(r => new Date(r.date) >= cutoff);
}

export async function getWeeklySummary(): Promise<WeeklySummary> {
  const records = await getSleepRecords(7);
  const scores = records.map(r => {
    const score = r.score || calculateSleepScore(r);
    const duration = r.durationMinutes || calculateSleepDuration(r.bedtime, r.wakeTime);
    return { score, duration };
  });
  return {
    records,
    averageScore: getWeeklyAverage(records),
    averageDuration: scores.length ? scores.reduce((a, b) => a + b.duration, 0) / scores.length : 0,
    totalRecords: records.length,
  };
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function getSettings(): Promise<UserSettings | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!raw) return null;
  return JSON.parse(raw) as UserSettings;
}

export async function clearAll(): Promise<void> {
  const keys = Object.values(STORAGE_KEYS) as string[];
  await Promise.all(keys.map(k => AsyncStorage.removeItem(k)));
}
