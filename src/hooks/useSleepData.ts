import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SleepRecord, WeeklySummary } from '../types';
import * as storageService from '../services/storageService';
import { calculateSleepScore, calculateSleepDuration } from '../utils/sleepCalculations';
import { getTodayString, generateId } from '../utils/dateHelpers';

interface UseSleepDataResult {
  records: SleepRecord[];
  weeklySummary: WeeklySummary;
  isLoading: boolean;
  saveRecord: (partial: Omit<SleepRecord, 'id' | 'date' | 'score' | 'durationMinutes'>) => Promise<SleepRecord>;
  refreshData: () => Promise<void>;
}

export function useSleepData(): UseSleepDataResult {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary>({
    records: [],
    averageScore: 0,
    averageDuration: 0,
    totalRecords: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    const [recs, summary] = await Promise.all([
      storageService.getSleepRecords(30),
      storageService.getWeeklySummary(),
    ]);
    setRecords(recs);
    setWeeklySummary(summary);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData]),
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const saveRecord = useCallback(
    async (partial: Omit<SleepRecord, 'id' | 'date' | 'score' | 'durationMinutes'>): Promise<SleepRecord> => {
      const durationMinutes = calculateSleepDuration(partial.bedtime, partial.wakeTime);
      const draft: SleepRecord = {
        ...partial,
        id: generateId(),
        date: getTodayString(),
        durationMinutes,
        score: 0,
      };
      draft.score = calculateSleepScore(draft);
      await storageService.saveSleepRecord(draft);
      await refreshData();
      return draft;
    },
    [refreshData],
  );

  return { records, weeklySummary, isLoading, saveRecord, refreshData };
}
