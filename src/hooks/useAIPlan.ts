import { useState, useCallback } from 'react';
import { SleepPlan, SleepProfile } from '../types';
import { generateSleepPlan, SleepApiError, ApiErrorType } from '../services/claudeService';
import * as storageService from '../services/storageService';

interface UseAIPlanResult {
  plan: SleepPlan | null;
  isLoading: boolean;
  error: string | null;
  errorType: ApiErrorType | null;
  generatePlan: (profile: SleepProfile) => Promise<void>;
  retryGeneration: (profile: SleepProfile) => Promise<void>;
}

export function useAIPlan(): UseAIPlanResult {
  const [plan, setPlan] = useState<SleepPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ApiErrorType | null>(null);

  const generatePlan = useCallback(async (profile: SleepProfile) => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    try {
      const generated = await generateSleepPlan(profile);
      setPlan(generated);
      await storageService.saveSleepPlan(generated);
    } catch (err) {
      if (err instanceof SleepApiError) {
        setErrorType(err.type);
        setError(err.message);
      } else {
        setErrorType('network');
        setError(err instanceof Error ? err.message : 'Erro ao gerar plano');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryGeneration = useCallback(
    async (profile: SleepProfile) => {
      await generatePlan(profile);
    },
    [generatePlan],
  );

  return { plan, isLoading, error, errorType, generatePlan, retryGeneration };
}
