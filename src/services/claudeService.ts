import Config from 'react-native-config';
import { SleepProfile, SleepPlan, SleepRecord, DailyInsight, WeeklySummary } from '../types';
import { CLAUDE_API_URL, CLAUDE_MODEL, MAX_TOKENS, API_TIMEOUT_MS } from '../config/constants';

// TODO-AWS: Trocar CLAUDE_API_URL pela Lambda Function URL e remover Authorization header
const API_KEY = Config.ANTHROPIC_API_KEY ?? '';

async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  attempt = 1,
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json() as { content: Array<{ text: string }> };
    return data.content[0]?.text ?? '';
  } catch (err) {
    clearTimeout(timeoutId);
    if (attempt === 1) {
      return callClaude(systemPrompt, userPrompt, 2);
    }
    throw err;
  }
}

function parseJsonFromText(text: string): unknown {
  const cleaned = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  return JSON.parse(cleaned);
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

// TODO-AWS-EC2: substituir por http://EC2_IP/api/v1/sleep/plan
export async function generateSleepPlan(profile: SleepProfile): Promise<SleepPlan> {
  const systemPrompt = `Você é um especialista acolhedor em higiene do sono e bem-estar.
Crie planos personalizados de melhora do sono em português brasileiro, com linguagem simples e encorajadora.
Nunca use jargão médico. Seja prático, empático e motivador.
Sempre responda com JSON válido, sem texto adicional.`;

  const userPrompt = `Crie um plano de sono personalizado de 14 dias para esta pessoa:
- Horário de dormir: ${profile.bedtime}
- Horário de acordar: ${profile.wakeTime}
- Cansaço ao acordar (1-5): ${profile.tiredness}
- Nível de estresse (1-5): ${profile.stressLevel}
- Consome cafeína após 14h: ${profile.caffeine ? 'Sim' : 'Não'}
- Tempo de tela antes de dormir: ${profile.screenTime}
- Objetivos: ${profile.goals.join(', ')}

Responda APENAS com este JSON:
{
  "summary": "resumo personalizado de 2-3 frases sobre o perfil e o plano",
  "recommendedSound": "nome do som mais indicado para este perfil",
  "tips": ["dica 1", "dica 2", "dica 3", "dica 4"],
  "days": [
    {
      "day": 1,
      "focus": "tema do dia em uma frase curta",
      "routine": ["passo 1", "passo 2", "passo 3"],
      "technique": "nome da técnica principal"
    }
  ]
}
Inclua todos os 14 dias no array days.`;

  const text = await callClaude(systemPrompt, userPrompt);
  const parsed = parseJsonFromText(text);
  return validateSleepPlan(parsed);
}

// TODO-AWS-EC2: substituir por http://EC2_IP/api/v1/sleep/insight
export async function generateDailyInsight(record: SleepRecord): Promise<DailyInsight> {
  const systemPrompt = `Você é um coach de sono empático. Analise registros de sono e forneça insights motivadores em português brasileiro.
Seja específico, prático e encorajador. Nunca seja crítico ou alarmista.
Responda apenas com JSON válido.`;

  const userPrompt = `Analise este registro de sono e gere um insight personalizado:
- Duração: ${record.durationMinutes} minutos
- Acordadas: ${record.wakeups}
- Qualidade percebida: ${record.quality}/5
- Álcool: ${record.hadAlcohol ? 'Sim' : 'Não'}
- Cafeína: ${record.hadCaffeine ? 'Sim' : 'Não'}
- Score calculado: ${record.score}/100
- Notas: ${record.notes || 'Nenhuma'}

Responda APENAS com:
{"insight": "observação personalizada de 1-2 frases", "tip": "dica prática para a próxima noite"}`;

  const text = await callClaude(systemPrompt, userPrompt);
  const parsed = parseJsonFromText(text) as Partial<DailyInsight>;
  return {
    insight: parsed.insight ?? 'Continue registrando seu sono para receber insights personalizados.',
    tip: parsed.tip ?? 'Tente manter um horário consistente de dormir e acordar.',
    generatedAt: new Date().toISOString(),
  };
}

// TODO-AWS-EC2: substituir por http://EC2_IP/api/v1/sleep/adjust
export async function adjustWeeklyPlan(summary: WeeklySummary): Promise<Partial<SleepPlan>> {
  // TODO: Fase 2 — análise semanal completa com ajuste de plano
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
