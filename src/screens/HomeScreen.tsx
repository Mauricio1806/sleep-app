import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { SleepScoreCircle } from '../components/SleepScoreCircle';
import { ProfileContext } from '../context/ProfileContext';
import { useSleepData } from '../hooks/useSleepData';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';
import { getRelativeDay } from '../utils/dateHelpers';

export function HomeScreen() {
  const { t } = useTranslation();
  const { plan } = useContext(ProfileContext);
  const { records, weeklySummary } = useSleepData();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('home.greetingMorning') : hour < 18 ? t('home.greetingAfternoon') : t('home.greetingNight');
  const lastRecord = records[0] ?? null;
  const today = new Date();
  const daysSinceStart = plan ? Math.ceil((today.getTime() - new Date(plan.generatedAt).getTime()) / 86400000) : 1;
  const currentDay = plan?.days[Math.min(daysSinceStart - 1, plan.days.length - 1)];

  useEffect(() => {
    trackScreen('Home');
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            {weeklySummary.totalRecords > 0 && (
              <Text style={styles.streak}>🔥 {weeklySummary.totalRecords} {t('home.streakLabel')}</Text>
            )}
          </View>
        </View>
        <View style={styles.scoreSection}>
          <SleepScoreCircle score={lastRecord?.score ?? 0} size={150} />
          <View>
            <Text style={styles.scoreLabel}>{t('home.lastNight')}</Text>
            <Text style={styles.scoreDate}>{lastRecord ? getRelativeDay(lastRecord.date) : t('home.noRecord')}</Text>
          </View>
        </View>
        {currentDay && (
          <View style={sharedStyles.card}>
            <Text style={styles.routineTitle}>
              {t('home.todayRoutine')} — {t('home.dayLabel')} {daysSinceStart}
            </Text>
            <Text style={styles.routineFocus}>{currentDay.focus}</Text>
            {currentDay.routine.map((step, i) => (
              <View key={i} style={styles.step}>
                <Text style={styles.stepNum}>{i + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.tealFaded, borderColor: colors.teal }]}>
            <Text style={styles.actionEmoji}>🎵</Text>
            <Text style={[styles.actionLabel, { color: colors.teal }]}>{t('home.quickActionSound')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.primaryFaded, borderColor: colors.primary }]}>
            <Text style={styles.actionEmoji}>🧘</Text>
            <Text style={[styles.actionLabel, { color: colors.primaryLight }]}>{t('home.quickActionTechnique')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
            <Text style={styles.actionEmoji}>📖</Text>
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{t('home.quickActionDiary')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
      <View style={styles.fab}>
        <TouchableOpacity style={styles.fabBtn} activeOpacity={0.85}>
          <Text style={styles.fabText}>🌙 {t('home.startRoutine')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { ...typography.heading2, color: colors.textPrimary },
  streak: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  scoreSection: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  scoreLabel: { ...typography.label, color: colors.textMuted },
  scoreDate: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  routineTitle: { ...typography.label, color: colors.textMuted, marginBottom: spacing.xs },
  routineFocus: { ...typography.bodySmall, color: colors.primaryLight, fontWeight: '600', marginBottom: spacing.sm },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.xs },
  stepNum: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primaryFaded, textAlign: 'center', ...typography.label, color: colors.primary, lineHeight: 20 },
  stepText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionCard: { flex: 1, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.xs, borderWidth: 1 },
  actionEmoji: { fontSize: 22 },
  actionLabel: { ...typography.label, textAlign: 'center' },
  fab: { position: 'absolute', bottom: spacing.lg, left: spacing.lg, right: spacing.lg },
  fabBtn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center' },
  fabText: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
});
