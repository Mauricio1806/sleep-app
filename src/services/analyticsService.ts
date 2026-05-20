// TODO-AWS: Plugar Firebase Analytics após configuração do projeto

function emit(_name: string, _props?: Record<string, unknown>): void {
  // Implementação plugada via Firebase/Amplitude em produção
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  emit(name, props);
}

export function trackScreen(screenName: string): void {
  emit('screen_view', { screen_name: screenName });
}

export function trackOnboardingStep(step: number): void {
  emit('onboarding_step', { step });
}

export function trackSleepRecorded(score: number, duration: number): void {
  emit('sleep_recorded', { score, duration_minutes: duration });
}

export function trackPremiumShown(source: string): void {
  emit('premium_shown', { source });
}

export function trackPremiumConverted(plan: string): void {
  emit('premium_converted', { plan });
}
