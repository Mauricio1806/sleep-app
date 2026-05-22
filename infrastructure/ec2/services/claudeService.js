const axios = require('axios');

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-5';
const TIMEOUT_MS = 60000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const stats = { totalCalls: 0, cacheHits: 0, startTime: Date.now() };
const planCache = new Map();

function profileCacheKey(profile) {
  return JSON.stringify({
    bedtime: profile.bedtime,
    wakeTime: profile.wakeTime,
    tiredness: profile.tiredness,
    stressLevel: profile.stressLevel,
    caffeine: profile.caffeine,
    screenTime: profile.screenTime,
    goals: [...(profile.goals ?? [])].sort(),
  });
}

function getStats() {
  return {
    totalCalls: stats.totalCalls,
    cacheHits: stats.cacheHits,
    tokensSaved: stats.cacheHits * 2000,
    uptime: Math.floor((Date.now() - stats.startTime) / 1000),
  };
}

async function callClaude(systemPrompt, userPrompt, maxTokens = 2000, attempt = 1) {
  stats.totalCalls++;
  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        stream: false,
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
      return callClaude(systemPrompt, userPrompt, maxTokens, 2);
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
  const key = profileCacheKey(profile);
  const cached = planCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    stats.cacheHits++;
    console.log('[cache] hit — economizando tokens');
    return cached.plan;
  }

  const system = 'Especialista em higiene do sono. Plano 14 dias PT-BR, linguagem simples. Apenas JSON válido.';
  const user = `Plano 14 dias para:\nDormir: ${profile.bedtime} | Acordar: ${profile.wakeTime} | Cansaço: ${profile.tiredness}/5 | Estresse: ${profile.stressLevel}/5 | Cafeína 14h+: ${profile.caffeine ? 'sim' : 'não'} | Tela: ${profile.screenTime} | Objetivos: ${(profile.goals ?? []).join(', ')}\n\nJSON exato:\n{"summary":"2-3 frases","recommendedSound":"nome do som","tips":["dica1","dica2","dica3","dica4"],"days":[{"day":1,"focus":"tema curto","routine":["passo1","passo2","passo3"],"technique":"nome"}]}\nInclua 14 dias.`;

  const text = await callClaude(system, user, 2000);
  const plan = parseJson(text);
  planCache.set(key, { plan, timestamp: Date.now() });
  return plan;
}

async function generateDailyInsight(record) {
  const system = 'Coach de sono PT-BR. Insights motivadores. Apenas JSON válido.';
  const user = `Sono: ${record.durationMinutes}min | ${record.wakeups} acordadas | qualidade ${record.quality}/5 | score ${record.score}/100 | álcool:${record.hadAlcohol ? 's' : 'n'} cafeína:${record.hadCaffeine ? 's' : 'n'}\nJSON: {"insight":"1-2 frases motivadoras","tip":"dica prática"}`;

  const text = await callClaude(system, user, 300);
  return parseJson(text);
}

async function adjustWeeklyPlan(summary) {
  const system = 'Especialista em sono PT-BR. Apenas JSON válido.';
  const user = `Semana: score ${summary.averageScore}/100 | ${summary.averageDuration}min/noite | ${summary.totalRecords} registros\nJSON: {"tips":["ajuste1","ajuste2"]}`;

  const text = await callClaude(system, user, 400);
  return parseJson(text);
}

async function generateMemoryConsolidationTip(sleepDuration, sleepScore) {
  const system = 'Neurocientista sono/memória PT-BR. Apenas JSON válido.';
  const user = `Sono: ${sleepDuration}min, score ${sleepScore}/100\nJSON: {"tip":"1-2 frases sobre memória e este sono","science":"fato científico breve"}`;

  const text = await callClaude(system, user, 200);
  return parseJson(text);
}

module.exports = {
  generateSleepPlan,
  generateDailyInsight,
  adjustWeeklyPlan,
  generateMemoryConsolidationTip,
  getStats,
};
