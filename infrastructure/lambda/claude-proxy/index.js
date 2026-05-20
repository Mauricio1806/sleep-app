const https = require('https');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = 'claude-sonnet-4-5';
const MAX_TOKENS = 4096;
const TIMEOUT_MS = 30000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function callAnthropic(body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: TIMEOUT_MS,
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Parse error')); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(payload);
    req.end();
  });
}

async function callWithRetry(body, attempt = 1) {
  try {
    return await callAnthropic(body);
  } catch (err) {
    if (attempt === 1) return callWithRetry(body, 2);
    throw err;
  }
}

exports.handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { action, data } = parsed;

  if (!['generatePlan', 'generateDailyInsight', 'adjustWeeklyPlan'].includes(action)) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Unknown action' }) };
  }

  const prompts = {
    generatePlan: {
      system: `Você é um especialista acolhedor em higiene do sono. Responda apenas com JSON válido.`,
      user: `Crie um plano de sono de 14 dias para: ${JSON.stringify(data)}. JSON: {"summary":string,"recommendedSound":string,"tips":string[],"days":[{"day":number,"focus":string,"routine":string[],"technique":string}]}`,
    },
    generateDailyInsight: {
      system: `Você é um coach de sono empático. Responda apenas com JSON válido.`,
      user: `Analise este registro de sono: ${JSON.stringify(data)}. JSON: {"insight":string,"tip":string}`,
    },
    adjustWeeklyPlan: {
      system: `Você é um especialista em sono. Responda apenas com JSON válido.`,
      user: `Analise esta semana de sono e sugira ajustes: ${JSON.stringify(data)}. JSON: {"tips":string[]}`,
    },
  };

  const prompt = prompts[action];

  try {
    const result = await callWithRetry({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: prompt.system,
      messages: [{ role: 'user', content: prompt.user }],
    });

    const text = result.content?.[0]?.text ?? '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const responseData = JSON.parse(cleaned);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(responseData),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: message }),
    };
  }
};
