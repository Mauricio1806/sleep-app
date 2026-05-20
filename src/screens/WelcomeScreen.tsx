import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, sharedStyles } from '../../theme';
import { Button } from '../components/Button';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';

type Props = { navigation: NativeStackNavigationProp<Record<string, undefined>> };

export function WelcomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const moonScale = useRef(new Animated.Value(0.8)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    trackScreen('Welcome');
    Animated.spring(moonScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }),
      Animated.timing(contentTranslate, { toValue: 0, duration: 400, delay: 300, useNativeDriver: true }),
    ]).start();
  }, [moonScale, contentOpacity, contentTranslate]);

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <View style={styles.container}>
        <View style={styles.glowBg} />
        <Animated.View style={[styles.moonContainer, { transform: [{ scale: moonScale }] }]}>
          <View style={styles.moonOuter}>
            <View style={styles.moonInner} />
          </View>
        </Animated.View>
        <Animated.View style={[styles.content, { opacity: contentOpacity, transform: [{ translateY: contentTranslate }] }]}>
          <Text style={styles.title}>{t('welcome.title')}</Text>
          <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
          <Button label={t('welcome.cta')} onPress={() => navigation.navigate('SleepProfile')} />
          <Text style={styles.disclaimer}>{t('welcome.disclaimer')}</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  glowBg: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary,
    opacity: 0.08,
    top: '15%',
  },
  moonContainer: { marginBottom: spacing.xxl },
  moonOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  moonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.bg,
    position: 'absolute',
    top: -10,
    left: 20,
  },
  content: { width: '100%', alignItems: 'center', gap: spacing.md },
  title: { ...typography.heading1, color: colors.textPrimary, textAlign: 'center', lineHeight: 36 },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  disclaimer: { ...typography.label, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
