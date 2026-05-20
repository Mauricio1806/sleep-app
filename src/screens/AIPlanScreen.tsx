import React, { useEffect, useRef, useContext, useState } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { ProgressDots } from '../components/ProgressDots';
import { LoadingDots } from '../components/LoadingDots';
import { InsightCard } from '../components/InsightCard';
import { Button } from '../components/Button';
import { ProfileContext } from '../context/ProfileContext';
import { useAIPlan } from '../hooks/useAIPlan';
import { useTranslation } from '../i18n';
import { trackScreen, trackOnboardingStep } from '../services/analyticsService';
import { ptBR } from '../i18n/locales/pt-BR';

type Props = { navigation: NativeStackNavigationProp<Record<string, undefined>> };

export function AIPlanScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { profile, setPlan } = useContext(ProfileContext);
  const { plan, isLoading, error, generatePlan, retryGeneration } = useAIPlan();
  const [msgIndex, setMsgIndex] = useState(0);
  const msgOpacity = useRef(new Animated.Value(1)).current;
  const planOpacity = useRef(new Animated.Value(0)).current;

  // Access translated messages as array — fallback to pt-BR keys
  const messages = ptBR.aiPlan.loadingMessages;

  useEffect(() => {
    trackScreen('AIPlan');
    trackOnboardingStep(3);
    if (profile) {
      generatePlan(profile);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      Animated.timing(msgOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setMsgIndex(i => (i + 1) % messages.length);
        Animated.timing(msgOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading, msgOpacity, messages.length]);

  useEffect(() => {
    if (plan) {
      setPlan(plan);
      Animated.timing(planOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [plan, setPlan, planOpacity]);

  if (isLoading) {
    return (
      <SafeAreaView style={sharedStyles.screen}>
        <ProgressDots current={3} total={4} />
        <View style={styles.centered}>
          <Text style={styles.moonEmoji}>🌙</Text>
          <LoadingDots />
          <Animated.Text style={[styles.loadingMsg, { opacity: msgOpacity }]}>
            {messages[msgIndex]}
          </Animated.Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !plan) {
    return (
      <SafeAreaView style={sharedStyles.screen}>
        <ProgressDots current={3} total={4} />
        <View style={styles.centered}>
          <Text style={styles.moonEmoji}>😔</Text>
          <Text style={styles.errorTitle}>{t('aiPlan.errorTitle')}</Text>
          <Text style={styles.errorSubtitle}>{t('aiPlan.errorSubtitle')}</Text>
          <Button label={t('aiPlan.retryBtn')} onPress={() => profile && retryGeneration(profile)} />
        </View>
      </SafeAreaView>
    );
  }

  const freeDays = plan.days.slice(0, 3);

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <Animated.ScrollView
        style={{ opacity: planOpacity }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <ProgressDots current={4} total={4} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{t('aiPlan.planReady')}</Text>
        </View>
        <View style={sharedStyles.card}>
          <Text style={styles.sectionLabel}>🤖 {t('aiPlan.summaryLabel')}</Text>
          <Text style={styles.summary}>{plan.summary}</Text>
        </View>
        <View style={[sharedStyles.card, styles.soundCard]}>
          <Text style={styles.sectionLabel}>🎵 {t('aiPlan.soundLabel')}</Text>
          <Text style={styles.soundName}>{plan.recommendedSound}</Text>
        </View>
        <Text style={styles.sectionTitle}>Seus primeiros 3 dias</Text>
        {freeDays.map(day => (
          <View key={day.day} style={sharedStyles.card}>
            <Text style={styles.dayTitle}>
              {t('aiPlan.dayLabel')} {day.day} — {day.focus}
            </Text>
            {day.routine.map((step, i) => (
              <Text key={i} style={styles.step}>• {step}</Text>
            ))}
            <View style={styles.techBadge}>
              <Text style={styles.techText}>✨ {day.technique}</Text>
            </View>
          </View>
        ))}
        <View style={styles.lockedCard}>
          <Text style={styles.lockedText}>🔒 {t('aiPlan.lockedDays')}</Text>
        </View>
        {plan.tips.length >= 2 && (
          <InsightCard insight={plan.tips[0]} tip={plan.tips[1]} />
        )}
        <Button
          label={t('aiPlan.startCta')}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        />
        <Button label={t('aiPlan.premiumCta')} onPress={() => {}} variant="ghost" />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.xl },
  moonEmoji: { fontSize: 64 },
  loadingMsg: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  errorTitle: { ...typography.heading3, color: colors.textPrimary, textAlign: 'center' },
  errorSubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  badge: { backgroundColor: colors.tealFaded, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, alignSelf: 'center' },
  badgeText: { ...typography.label, color: colors.teal, fontWeight: '700' },
  sectionLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  summary: { ...typography.body, color: colors.textPrimary, lineHeight: 22 },
  soundCard: { borderColor: colors.teal },
  soundName: { ...typography.heading3, color: colors.teal },
  sectionTitle: { ...typography.heading3, color: colors.textPrimary, marginTop: spacing.sm },
  dayTitle: { ...typography.bodySmall, color: colors.primaryLight, fontWeight: '700', marginBottom: spacing.xs },
  step: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  techBadge: { marginTop: spacing.sm, backgroundColor: colors.primaryFaded, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, alignSelf: 'flex-start' },
  techText: { ...typography.label, color: colors.primaryLight },
  lockedCard: { borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radius.lg, padding: spacing.md, alignItems: 'center' },
  lockedText: { ...typography.body, color: colors.textMuted },
});
