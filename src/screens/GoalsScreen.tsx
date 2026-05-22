import React, { useEffect, useRef, useContext, useState } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, sharedStyles } from '../../theme';
import { ProgressDots } from '../components/ProgressDots';
import { GoalCard } from '../components/GoalCard';
import { Button } from '../components/Button';
import { ProfileContext } from '../context/ProfileContext';
import { useTranslation } from '../i18n';
import { trackScreen, trackOnboardingStep } from '../services/analyticsService';
import * as storageService from '../services/storageService';
import { GoalOption } from '../types';

type Props = { navigation: NativeStackNavigationProp<Record<string, undefined>> };

export function GoalsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { profile, setProfile } = useContext(ProfileContext);
  const [selected, setSelected] = useState<string[]>([]);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-20)).current;

  const goals: GoalOption[] = [
    { id: 'fall_faster', emoji: '⚡', title: t('goals.goalTitles.fall_faster'), description: t('goals.goalDescs.fall_faster') },
    { id: 'less_wakeups', emoji: '🌙', title: t('goals.goalTitles.less_wakeups'), description: t('goals.goalDescs.less_wakeups') },
    { id: 'feel_rested', emoji: '☀️', title: t('goals.goalTitles.feel_rested'), description: t('goals.goalDescs.feel_rested') },
    { id: 'reduce_stress', emoji: '🧘', title: t('goals.goalTitles.reduce_stress'), description: t('goals.goalDescs.reduce_stress') },
    { id: 'fix_schedule', emoji: '📅', title: t('goals.goalTitles.fix_schedule'), description: t('goals.goalDescs.fix_schedule') },
    { id: 'more_deep_sleep', emoji: '💤', title: t('goals.goalTitles.more_deep_sleep'), description: t('goals.goalDescs.more_deep_sleep') },
  ];

  useEffect(() => {
    trackScreen('Goals');
    trackOnboardingStep(2);
    storageService.getOnboardingDraft().then(draft => {
      if (draft?.goals?.length) setSelected(draft.goals);
    });
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(headerTranslate, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [headerOpacity, headerTranslate]);

  useEffect(() => {
    void storageService.saveOnboardingDraft({ goals: selected });
  }, [selected]);

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  }

  async function handleNext() {
    if (!profile) return;
    await setProfile({ ...profile, goals: selected });
    navigation.navigate('AIPlan');
  }

  const pairs: [GoalOption, GoalOption | undefined][] = [];
  for (let i = 0; i < goals.length; i += 2) {
    pairs.push([goals[i], goals[i + 1]]);
  }

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProgressDots current={2} total={4} />
        <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslate }] }}>
          <Text style={styles.title}>{t('goals.title')}</Text>
          <Text style={styles.subtitle}>{t('goals.subtitle')}</Text>
        </Animated.View>
        <View style={styles.grid}>
          {pairs.map(([a, b], idx) => (
            <View key={idx} style={styles.row}>
              <GoalCard goal={a} selected={selected.includes(a.id)} onPress={() => toggle(a.id)} delay={idx * 80} />
              {b ? <GoalCard goal={b} selected={selected.includes(b.id)} onPress={() => toggle(b.id)} delay={idx * 80 + 40} /> : <View style={{ flex: 1 }} />}
            </View>
          ))}
        </View>
        <Button label={selected.length > 0 ? t('goals.cta') : t('goals.subtitle')} onPress={handleNext} disabled={selected.length === 0} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.heading2, color: colors.textPrimary, lineHeight: 30, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary },
  grid: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
});
