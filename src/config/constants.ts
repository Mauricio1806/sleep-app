export const EC2_BASE_URL = 'http://13.220.143.229';
export const EC2_ENDPOINTS = {
  SLEEP_PLAN: '/api/v1/sleep/plan',
  SLEEP_INSIGHT: '/api/v1/sleep/insight',
} as const;

export const API_TIMEOUT_MS = 60000;

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
  MEMORY_INTENTIONS: '@sleepapp:memory_intentions',
} as const;
