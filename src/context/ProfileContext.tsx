import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SleepProfile, SleepPlan, UserSettings } from '../types';
import * as storageService from '../services/storageService';

interface ProfileContextType {
  profile: SleepProfile | null;
  plan: SleepPlan | null;
  settings: UserSettings;
  isLoading: boolean;
  setProfile: (profile: SleepProfile) => Promise<void>;
  setPlan: (plan: SleepPlan) => Promise<void>;
  updateSettings: (partial: Partial<UserSettings>) => Promise<void>;
  resetAll: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  language: 'pt-BR',
  notificationsEnabled: true,
  isPremium: false,
  onboardingCompleted: false,
};

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  plan: null,
  settings: defaultSettings,
  isLoading: true,
  setProfile: async () => {},
  setPlan: async () => {},
  updateSettings: async () => {},
  resetAll: async () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<SleepProfile | null>(null);
  const [plan, setPlanState] = useState<SleepPlan | null>(null);
  const [settings, setSettingsState] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      storageService.getProfile(),
      storageService.getSettings(),
    ]).then(async ([p, s]) => {
      if (p) setProfileState(p);
      if (s) setSettingsState(s);
      const pl = p ? await storageService.getSleepPlanOrRenew(p) : await storageService.getSleepPlan();
      if (pl) setPlanState(pl);
      setIsLoading(false);
    });
  }, []);

  const setProfile = useCallback(async (p: SleepProfile) => {
    setProfileState(p);
    await storageService.saveProfile(p);
  }, []);

  const setPlan = useCallback(async (p: SleepPlan) => {
    setPlanState(p);
    await storageService.saveSleepPlan(p);
  }, []);

  const updateSettings = useCallback(async (partial: Partial<UserSettings>) => {
    setSettingsState(prev => {
      const updated = { ...prev, ...partial };
      storageService.saveSettings(updated);
      return updated;
    });
  }, []);

  const resetAll = useCallback(async () => {
    await storageService.clearAll();
    setProfileState(null);
    setPlanState(null);
    setSettingsState(defaultSettings);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, plan, settings, isLoading, setProfile, setPlan, updateSettings, resetAll }}>
      {children}
    </ProfileContext.Provider>
  );
}
