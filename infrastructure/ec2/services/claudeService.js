const axios = require('axios');

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-5';
const MAX_TOKENS = 4096;
const TIMEOUT_MS = 60000;

async function callClaude(systemPrompt, userPrompt, attempt = 1) {
  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        timeout: TIMEOUT_MS,
      },
    );
    return response.data.content[0]?.text ?? '';
  } catch (err) {
    const status = err.response?.status ?? 0;
    if (attempt === 1 && status >= 500) {
      return callClaude(systemPrompt, userPrompt, 2);
    }
    const error = new Error(err.response?.data?.error?.message ?? err.message);
    error.status = status >= 400 ? status : 502;
    throw error;
  }
}

function parseJson(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

async function generateSleepPlan(profile) {
  const system = `Você é um especialista acolhedor em higiene do sono e bem-estar.
Crie planos personalizados de melhora do sono em português brasileiro, com linguagem simples e encorajadora.
Nunca use jargão médico. Seja prático, empático e motivador.
Sempre responda com JSON válido, sem texto adicional.`;

  const user = `Crie um plano de sono personalizado de 14 dias para esta pessoa:
- Horário de dormir: ${profile.bedtime}
- Horário de acordar: ${profile.wakeTime}
- Cansaço ao acordar (1-5): ${profile.tiredness}
- Nível de estresse (1-5): ${profile.stressLevel}
- Consome cafeína após 14h: ${profile.caffeine ? 'Sim' : 'Não'}
- Tempo de tela antes de dormir: ${profile.screenTime}
- Objetivos: ${profile.goals.join(', ')}

Responda APENAS com este JSON:
{
  "summary": "resumo personalizado de 2-3 frases",
  "recommendedSound": "nome do som mais indicado",
  "tips": ["dica 1", "dica 2", "dica 3", "dica 4"],
  "days": [{"day": 1, "focus": "tema", "routine": ["passo 1", "passo 2", "passo 3"], "technique": "técnica"}]
}
Inclua todos os 14 dias no array days.`;

  const text = await callClaude(system, user);
  return parseJson(text);
}

async function generateDailyInsight(record) {
  const system = `Você é um coach de sono empático. Analise registros de sono e forneça insights motivadores em português brasileiro.
Seja específico, prático e encorajador. Nunca seja crítico ou alarmista.
Responda apenas com JSON válido.`;

  const user = `Analise este registro de sono:
- Duração: ${record.durationMinutes} minutos
- Acordadas: ${record.wakeups}
- Qualidade percebida: ${record.quality}/5
- Álcool: ${record.hadAlcohol ? 'Sim' : 'Não'}
- Cafeína: ${record.hadCaffeine ? 'Sim' : 'Não'}
- Score calculado: ${record.score}/100

Responda APENAS com: {"insight": "observação de 1-2 frases", "tip": "dica prática para amanhã"}`;

  const text = await callClaude(system, user);
  return parseJson(text);
}

async function adjustWeeklyPlan(summary) {
  const system = `Você é um especialista em sono. Analise semanas de dados e sugira ajustes ao plano de sono em português.
Responda apenas com JSON válido.`;

  const user = `Análise semanal de sono:
- Score médio: ${summary.averageScore}/100
- Duração média: ${summary.averageDuration} minutos
- Total de registros: ${summary.totalRecords}

Responda APENAS com: {"tips": ["ajuste 1", "ajuste 2"]}`;

  const text = await callClaude(system, user);
  return parseJson(text);
}

async function generateMemoryConsolidationTip(sleepDuration, sleepScore) {
  const system = `Você é um neurocientista especializado em sono e memória. Forneça dicas científicas em português brasileiro.
Responda apenas com JSON válido.`;

  const user = `Dados de sono desta noite:
- Duração: ${sleepDuration} minutos
- Score: ${sleepScore}/100

Responda APENAS com: {"tip": "dica prática de 1-2 frases sobre memória e este sono", "science": "fato científico breve"}`;

  const text = await callClaude(system, user);
  return parseJson(text);
}

module.exports = {
  generateSleepPlan,
  generateDailyInsight,
  adjustWeeklyPlan,
  generateMemoryConsolidationTip,
};
