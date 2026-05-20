import React, { useEffect, useRef, useContext, useState } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, sharedStyles } from '../../theme';
import { ProgressDots } from '../components/ProgressDots';
import { TimeSelector } from '../components/TimeSelector';
import { ScaleSelector } from '../components/ScaleSelector';
import { PillSelector } from '../components/PillSelector';
import { Button } from '../components/Button';
import { ProfileContext } from '../context/ProfileContext';
import { useTranslation } from '../i18n';
import { trackScreen, trackOnboardingStep } from '../services/analyticsService';
import { SleepProfile } from '../types';
import { getTodayString } from '../utils/dateHelpers';

type Props = { navigation: NativeStackNavigationProp<Record<string, undefined>> };

const TIREDNESS_OPTS = [
  { emoji: '😴', label: '1' },
  { emoji: '🥱', label: '2' },
  { emoji: '😐', label: '3' },
  { emoji: '🙂', label: '4' },
  { emoji: '⚡', label: '5' },
];
const STRESS_OPTS = [
  { emoji: '🧘', label: '1' },
  { emoji: '😌', label: '2' },
  { emoji: '😐', label: '3' },
  { emoji: '😰', label: '4' },
  { emoji: '🔥', label: '5' },
];

export function SleepProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { setProfile } = useContext(ProfileContext);
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [tiredness, setTiredness] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [caffeine, setCaffeine] = useState<boolean | null>(null);
  const [screenTime, setScreenTime] = useState('');

  const op0 = useRef(new Animated.Value(0)).current;
  const op1 = useRef(new Animated.Value(0)).current;
  const op2 = useRef(new Animated.Value(0)).current;
  const op3 = useRef(new Animated.Value(0)).current;
  const op4 = useRef(new Animated.Value(0)).current;
  const op5 = useRef(new Animated.Value(0)).current;
  const ty0 = useRef(new Animated.Value(20)).current;
  const ty1 = useRef(new Animated.Value(20)).current;
  const ty2 = useRef(new Animated.Value(20)).current;
  const ty3 = useRef(new Animated.Value(20)).current;
  const ty4 = useRef(new Animated.Value(20)).current;
  const ty5 = useRef(new Animated.Value(20)).current;

  const opacities = [op0, op1, op2, op3, op4, op5];
  const translates = [ty0, ty1, ty2, ty3, ty4, ty5];

  useEffect(() => {
    trackScreen('SleepProfile');
    trackOnboardingStep(1);
    opacities.forEach((op, i) => {
      Animated.parallel([
        Animated.timing(op, { toValue: 1, duration: 300, delay: i * 100, useNativeDriver: true }),
        Animated.timing(translates[i], { toValue: 0, duration: 300, delay: i * 100, useNativeDriver: true }),
      ]).start();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValid = tiredness > 0 && stressLevel > 0 && caffeine !== null && screenTime !== '';

  async function handleNext() {
    const profile: SleepProfile = {
      bedtime,
      wakeTime,
      tiredness,
      stressLevel,
      caffeine: caffeine as boolean,
      screenTime: screenTime as SleepProfile['screenTime'],
      goals: [],
      createdAt: getTodayString(),
    };
    await setProfile(profile);
    navigation.navigate('Goals');
  }

  const screenTimeOpts = [
    { value: 'less30', label: t('sleepProfile.screenLess30') },
    { value: '30to60', label: t('sleepProfile.screen30to60') },
    { value: 'more60', label: t('sleepProfile.screenMore60') },
  ];
  const caffeineOpts = [
    { value: 'yes', label: t('sleepProfile.caffeineYes') },
    { value: 'no', label: t('sleepProfile.caffeineNo') },
  ];

  function anim(i: number) {
    return { opacity: opacities[i], transform: [{ translateY: translates[i] }] };
  }

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProgressDots current={1} total={4} />
        <Animated.View style={anim(0)}>
          <Text style={styles.title}>{t('sleepProfile.title')}</Text>
        </Animated.View>
        <Animated.View style={[styles.block, anim(1)]}>
          <TimeSelector value={bedtime} onChange={setBedtime} label={t('sleepProfile.bedtime')} />
          <TimeSelector value={wakeTime} onChange={setWakeTime} label={t('sleepProfile.wakeTime')} />
        </Animated.View>
        <Animated.View style={[styles.block, anim(2)]}>
          <Text style={styles.label}>{t('sleepProfile.tiredness')}</Text>
          <ScaleSelector value={tiredness} onChange={setTiredness} options={TIREDNESS_OPTS} />
        </Animated.View>
        <Animated.View style={[styles.block, anim(3)]}>
          <Text style={styles.label}>{t('sleepProfile.stress')}</Text>
          <ScaleSelector value={stressLevel} onChange={setStressLevel} options={STRESS_OPTS} />
        </Animated.View>
        <Animated.View style={[styles.block, anim(4)]}>
          <Text style={styles.label}>{t('sleepProfile.caffeine')}</Text>
          <PillSelector
            options={caffeineOpts}
            value={caffeine === null ? '' : caffeine ? 'yes' : 'no'}
            onChange={v => setCaffeine(v === 'yes')}
          />
        </Animated.View>
        <Animated.View style={[styles.block, anim(5)]}>
          <Text style={styles.label}>{t('sleepProfile.screenTime')}</Text>
          <PillSelector options={screenTimeOpts} value={screenTime} onChange={setScreenTime} />
        </Animated.View>
        <Button label={t('sleepProfile.next')} onPress={handleNext} disabled={!isValid} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.heading2, color: colors.textPrimary, lineHeight: 30 },
  label: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.xs },
  block: { gap: spacing.sm },
});
