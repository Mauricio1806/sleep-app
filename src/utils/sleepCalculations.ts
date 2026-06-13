import { SleepRecord, ScoreLabel } from '../types';

export function calculateSleepDuration(bedtime: string, wakeTime: string): number {
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let bedMinutes = bh * 60 + bm;
  const wakeMinutes = wh * 60 + wm;
  if (wakeMinutes <= bedMinutes) {
    bedMinutes -= 24 * 60;
  }
  return wakeMinutes - bedMinutes;
}

export function calculateSleepScore(record: SleepRecord): number {
  const duration = record.durationMinutes || calculateSleepDuration(record.bedtime, record.wakeTime);

  // Cada fator vira uma nota de 0-100, depois média ponderada.
  // Assim TODO fator move o score de verdade.

  // 1. Duração (peso 30%)
  const idealMin = 420; // 7h
  const idealMax = 540; // 9h
  let durationScore: number;
  if (duration >= idealMin && duration <= idealMax) {
    durationScore = 100;
  } else if (duration < idealMin) {
    durationScore = Math.max(0, (duration / idealMin) * 100);
  } else {
    durationScore = Math.max(50, 100 - ((duration - idealMax) / 60) * 15);
  }

  // 2. Despertares (peso 30%) — 0=100, 1=80, 2=55, 3=30, 4+=10
  const wakeupScore = record.wakeups === 0 ? 100 : record.wakeups === 1 ? 80 : record.wakeups === 2 ? 55 : record.wakeups === 3 ? 30 : Math.max(0, 10 - (record.wakeups - 4) * 5);

  // 3. Qualidade subjetiva (peso 25%) — escala 1-5 vira 20-100
  const qualityScore = (record.quality / 5) * 100;

  // 4. Hábitos (peso 15%) — começa em 100, cada vício derruba
  let habitsScore = 100;
  if (record.hadAlcohol) habitsScore -= 50;
  if (record.hadCaffeine) habitsScore -= 40;
  habitsScore = Math.max(0, habitsScore);

  const raw =
    durationScore * 0.30 +
    wakeupScore * 0.30 +
    qualityScore * 0.25 +
    habitsScore * 0.15;

  return Math.min(100, Math.max(0, Math.round(raw)));
}

export function getScoreLabel(score: number): ScoreLabel {
  if (score >= 85) return 'Excelente';
  if (score >= 70) return 'Bom';
  if (score >= 50) return 'Regular';
  return 'Ruim';
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#4DB8A4';
  if (score >= 70) return '#7C6FF7';
  if (score >= 50) return '#F0C070';
  return '#F07070';
}

export function getWeeklyAverage(records: SleepRecord[]): number {
  if (!records.length) return 0;
  const sum = records.reduce((acc, r) => acc + (r.score || calculateSleepScore(r)), 0);
  return Math.round(sum / records.length);
}

export function detectSleepPatterns(records: SleepRecord[]): string[] {
  if (records.length < 3) return [];
  const insights: string[] = [];

  const avgWakeups = records.reduce((a, r) => a + r.wakeups, 0) / records.length;
  if (avgWakeups > 2) {
    insights.push('Você acorda bastante durante a noite. Tente evitar líquidos 2h antes de dormir.');
  }

  const caffeineNights = records.filter(r => r.hadCaffeine).length;
  if (caffeineNights > records.length * 0.5) {
    insights.push('A cafeína após 14h pode estar afetando sua qualidade de sono.');
  }

  const alcoholNights = records.filter(r => r.hadAlcohol).length;
  if (alcoholNights > 2) {
    insights.push('O álcool fragmenta o sono. Tente reduzir nas noites de semana.');
  }

  const avgScore = getWeeklyAverage(records);
  if (avgScore >= 80) {
    insights.push('Parabéns! Seu sono está excelente esta semana. Continue assim!');
  }

  return insights;
}
