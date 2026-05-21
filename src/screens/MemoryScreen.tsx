import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';
import * as storageService from '../services/storageService';
import { MemoryIntention } from '../types';

const TIPS = [
  'Escrever sua intenção antes de dormir aumenta em 42% a chance de se lembrar dela ao acordar.',
  'A consolidação da memória ocorre principalmente durante o sono profundo (fase N3).',
  'Revisar intenções de sono por 5 dias seguidos melhora a qualidade percebida do sono.',
  'O sono REM fortalece conexões neurais relacionadas à aprendizagem e formação de hábitos.',
  'Pessoas que definem uma intenção de sono adormecem em média 9 minutos mais rápido.',
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function calcStreak(intentions: MemoryIntention[]): number {
  if (!intentions.length) return 0;
  const sorted = [...intentions].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let expected = today;
  for (const r of sorted) {
    if (r.date === expected) {
      streak++;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().split('T')[0];
    } else { break; }
  }
  return streak;
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function MemoryScreen() {
  const { t } = useTranslation();
  const [intention, setIntention] = useState('');
  const [todayIntention, setTodayIntention] = useState<MemoryIntention | null>(null);
  const [yesterdayIntention, setYesterdayIntention] = useState<MemoryIntention | null>(null);
  const [history, setHistory] = useState<MemoryIntention[]>([]);
  const [streak, setStreak] = useState(0);
  const [saving, setSaving] = useState(false);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

  useEffect(() => { trackScreen('Memory'); }, []);

  useFocusEffect(useCallback(() => {
    storageService.getMemoryIntentions(30).then(items => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = getYesterday();
      setTodayIntention(items.find(i => i.date === today) ?? null);
      setYesterdayIntention(items.find(i => i.date === yesterday) ?? null);
      setHistory(items);
      setStreak(calcStreak(items));
    });
  }, []));

  async function handleSave() {
    if (!intention.trim() || saving) return;
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const item: MemoryIntention = {
      id: `${today}-${Date.now()}`,
      date: today,
      intention: intention.trim(),
      result: null,
    };
    await storageService.saveMemoryIntention(item);
    setTodayIntention(item);
    setIntention('');
    setSaving(false);
    storageService.getMemoryIntentions(30).then(items => {
      setHistory(items);
      setStreak(calcStreak(items));
    });
  }

  async function handleResult(result: 'remembered' | 'forgot') {
    if (!yesterdayIntention) return;
    await storageService.updateMemoryResult(yesterdayIntention.id, result);
    const updated = { ...yesterdayIntention, result };
    setYesterdayIntention(updated);
    storageService.getMemoryIntentions(30).then(setHistory);
  }

  const last7 = getLast7Days();

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('memory.title')}</Text>

        {/* Intenção Noturna */}
        <View style={sharedStyles.card}>
          <Text style={styles.sectionLabel}>{t('memory.intentionTitle')}</Text>
          {todayIntention ? (
            <View style={styles.savedBox}>
              <Text style={styles.savedText}>✓  {todayIntention.intention}</Text>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.input}
                value={intention}
                onChangeText={setIntention}
                placeholder={t('memory.intentionPlaceholder')}
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={[styles.saveBtn, (!intention.trim() || saving) && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!intention.trim() || saving}
              >
                <Text style={styles.saveBtnText}>{t('memory.saveBtn')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Revisão Matinal */}
        {yesterdayIntention && (
          <View style={sharedStyles.card}>
            <Text style={styles.sectionLabel}>{t('memory.morningTitle')}</Text>
            <Text style={styles.yesterdayText}>{yesterdayIntention.intention}</Text>
            {yesterdayIntention.result ? (
              <Text style={styles.resultDone}>
                {yesterdayIntention.result === 'remembered'
                  ? `✓  ${t('memory.rememberedBtn')}`
                  : `○  ${t('memory.forgotBtn')}`}
              </Text>
            ) : (
              <View style={styles.resultRow}>
                <TouchableOpacity style={[styles.resultBtn, styles.resultBtnGreen]} onPress={() => handleResult('remembered')}>
                  <Text style={styles.resultBtnText}>{t('memory.rememberedBtn')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.resultBtn, styles.resultBtnGray]} onPress={() => handleResult('forgot')}>
                  <Text style={styles.resultBtnTextGray}>{t('memory.forgotBtn')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Dica científica */}
        <View style={[sharedStyles.card, styles.tipCard]}>
          <Text style={styles.tipLabel}>{t('memory.tipLabel')}</Text>
          <Text style={styles.tipText}>{TIPS[tipIndex]}</Text>
        </View>

        {/* Sequência + Histórico 7 dias */}
        <View style={sharedStyles.card}>
          <View style={styles.streakRow}>
            <Text style={styles.streakValue}>{streak}</Text>
            <Text style={styles.streakLabel}> {t('memory.streakLabel')}</Text>
          </View>
          <Text style={[styles.sectionLabel, styles.historyLabel]}>{t('memory.historyTitle')}</Text>
          <View style={styles.weekRow}>
            {last7.map(date => {
              const item = history.find(i => i.date === date);
              const dayIndex = new Date(`${date}T12:00:00`).getDay();
              return (
                <View key={date} style={styles.dayCell}>
                  <Text style={styles.dayNameLabel}>{WEEK_DAYS[dayIndex]}</Text>
                  <View style={[
                    styles.dayDot,
                    item != null && styles.dayDotFilled,
                    item?.result === 'remembered' && styles.dayDotSuccess,
                    item?.result === 'forgot' && styles.dayDotFaded,
                  ]} />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.heading2, color: colors.textPrimary },
  sectionLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    color: colors.textPrimary,
    ...typography.body,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: colors.border },
  saveBtnText: { ...typography.label, color: colors.textPrimary, fontWeight: '600' },
  savedBox: { padding: spacing.sm, backgroundColor: colors.primaryFaded, borderRadius: radius.sm },
  savedText: { ...typography.body, color: colors.primaryLight },
  yesterdayText: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  resultRow: { flexDirection: 'row', gap: spacing.sm },
  resultBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.sm, alignItems: 'center' },
  resultBtnGreen: { backgroundColor: colors.primary },
  resultBtnGray: { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border },
  resultBtnText: { ...typography.label, color: colors.textPrimary, fontWeight: '600' },
  resultBtnTextGray: { ...typography.label, color: colors.textSecondary, fontWeight: '600' },
  resultDone: { ...typography.body, color: colors.textMuted },
  tipCard: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  tipLabel: { ...typography.label, color: colors.primary, marginBottom: spacing.xs },
  tipText: { ...typography.body, color: colors.textSecondary },
  streakRow: { flexDirection: 'row', alignItems: 'baseline' },
  streakValue: { ...typography.heading2, color: colors.primary },
  streakLabel: { ...typography.body, color: colors.textMuted },
  historyLabel: { marginTop: spacing.sm },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCell: { alignItems: 'center', gap: 4 },
  dayNameLabel: { ...typography.label, color: colors.textMuted, fontSize: 10 },
  dayDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border },
  dayDotFilled: { backgroundColor: colors.primaryFaded, borderColor: colors.primary },
  dayDotSuccess: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayDotFaded: { backgroundColor: colors.border, borderColor: colors.border },
});
