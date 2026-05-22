import { SleepProfile, SleepPlan, SleepRecord, DailyInsight, WeeklySummary } from '../types';
import { EC2_BASE_URL, EC2_ENDPOINTS, API_TIMEOUT_MS } from '../config/constants';

export type ApiErrorType = 'network' | 'api' | 'parse' | 'timeout';

export class SleepApiError extends Error {
  constructor(public readonly type: ApiErrorType, message: string) {
    super(message);
    this.name = 'SleepApiError';
  }
}

async function postToEC2<T>(endpoint: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${EC2_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new SleepApiError('api', `HTTP ${response.status}`);
    }

    try {
      return await response.json() as T;
    } catch {
      throw new SleepApiError('parse', 'Resposta inválida do servidor');
    }
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof SleepApiError) throw err;
    if (err instanceof Error) {
      if (err.name === 'AbortError') throw new SleepApiError('timeout', 'Tempo limite excedido');
      throw new SleepApiError('network', err.message);
    }
    throw new SleepApiError('network', 'Erro de rede desconhecido');
  }
}

function validateSleepPlan(obj: unknown): SleepPlan {
  const plan = obj as Partial<SleepPlan>;
  if (
    typeof plan.summary !== 'string' ||
    typeof plan.recommendedSound !== 'string' ||
    !Array.isArray(plan.tips) ||
    !Array.isArray(plan.days)
  ) {
    throw new Error('Schema inválido: campos obrigatórios ausentes no plano');
  }
  return {
    summary: plan.summary,
    recommendedSound: plan.recommendedSound,
    tips: plan.tips,
    days: plan.days,
    generatedAt: plan.generatedAt ?? new Date().toISOString(),
  };
}

export async function generateSleepPlan(profile: SleepProfile): Promise<SleepPlan> {
  const data = await postToEC2<{ plan: unknown }>(EC2_ENDPOINTS.SLEEP_PLAN, { profile });
  return validateSleepPlan(data.plan);
}

export async function generateDailyInsight(record: SleepRecord): Promise<DailyInsight> {
  const data = await postToEC2<{ insight: string; tip: string }>(
    EC2_ENDPOINTS.SLEEP_INSIGHT,
    { record },
  );
  return {
    insight: data.insight ?? 'Continue registrando seu sono para receber insights personalizados.',
    tip: data.tip ?? 'Tente manter um horário consistente de dormir e acordar.',
    generatedAt: new Date().toISOString(),
  };
}

export async function adjustWeeklyPlan(summary: WeeklySummary): Promise<Partial<SleepPlan>> {
  // Fase 2 — análise semanal completa com ajuste de plano via EC2
  const avgScore = summary.averageScore;
  return {
    tips: [
      avgScore >= 80
        ? 'Excelente semana! Mantenha sua rotina atual.'
        : avgScore >= 60
        ? 'Boa semana. Foque em manter consistência nos horários.'
        : 'Semana desafiadora. Vamos ajustar algumas estratégias.',
    ],
  };
}
