// TODO-AWS: Trocar CLAUDE_API_URL pela Lambda Function URL após deploy
export const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
export const CLAUDE_MODEL = 'claude-sonnet-4-5';
export const MAX_TOKENS = 4096;
export const API_TIMEOUT_MS = 30000;

export const FREE_SOUNDS_COUNT = 3;
export const FREE_PLAN_DAYS = 3;
export const TOTAL_PLAN_DAYS = 14;

export const STORAGE_KEYS = {
  PROFILE: '@sleepapp:profile',
  PLAN: '@sleepapp:plan',
  RECORDS: '@sleepapp:records',
  SETTINGS: '@sleepapp:settings',
  DAILY_INSIGHT: '@sleepapp:daily_insight',
  USER_ID: '@sleepapp:user_id',
} as const;
