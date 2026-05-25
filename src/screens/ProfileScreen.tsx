import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { ProfileContext } from '../context/ProfileContext';
import { LocaleContext } from '../context/LocaleContext';
import { PaywallBanner } from '../components/PaywallBanner';
import { Button } from '../components/Button';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';
import * as storageService from '../services/storageService';
import { SleepRecord, UserSettings } from '../types';

const LANGUAGES: { value: UserSettings['language']; label: string; flag: string; price: string }[] = [
  { value: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷', price: 'R$19,90/mês' },
  { value: 'es-MX', label: 'Español (México)', flag: '🇲🇽', price: '$99 MXN/mês' },
  { value: 'es-AR', label: 'Español (Argentina)', flag: '🇦🇷', price: '$2.500 ARS/mês' },
  { value: 'es-CO', label: 'Español (Colombia)', flag: '🇨🇴', price: '$15.000 COP/mês' },
  { value: 'es-CL', label: 'Español (Chile)', flag: '🇨🇱', price: '$2.500 CLP/mês' },
  { value: 'es-PE', label: 'Español (Perú)', flag: '🇵🇪', price: 'S/19,90/mês' },
  { value: 'es-EC', label: 'Español (Ecuador)', flag: '🇪🇨', price: '$4,99/mês' },
  { value: 'es-VE', label: 'Español (Venezuela)', flag: '🇻🇪', price: '$3,99/mês' },
  { value: 'es-UY', label: 'Español (Uruguay)', flag: '🇺🇾', price: '$199 UYU/mês' },
  { value: 'es-PA', label: 'Español (Panamá)', flag: '🇵🇦', price: '$3,99/mês' },
];

function calcStreak(records: SleepRecord[]): number {
  if (!records.length) return 0;
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
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

export function ProfileScreen() {
  const { t } = useTranslation();
  const { profile, settings, updateSettings, resetAll } = useContext(ProfileContext);
  const { locale, setLocale } = useContext(LocaleContext);
  const [avgScore, setAvgScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalNights, setTotalNights] = useState(0);

  useEffect(() => { trackScreen('Profile'); }, []);

  useFocusEffect(useCallback(() => {
    storageService.getWeeklySummary().then(s => setAvgScore(Math.round(s.averageScore)));
    storageService.getSleepRecords().then(r => {
      setTotalNights(r.length);
      setStreak(calcStreak(r));
    });
  }, []));

  const currentLang = LANGUAGES.find(l => l.value === locale);

  function confirmReset() {
    Alert.alert(t('profile.resetConfirmTitle'), t('profile.resetConfirmMsg'), [
      { text: t('profile.resetConfirmNo'), style: 'cancel' },
      { text: t('profile.resetConfirmYes'), style: 'destructive', onPress: () => resetAll() },
    ]);
  }

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('profile.title')}</Text>
        <View style={styles.avatar}><Text style={styles.avatarText}>👤</Text></View>

        {/* Mini Dashboard */}
        <View style={sharedStyles.card}>
          <Text style={styles.sectionLabel}>{t('profile.dashboardTitle')}</Text>
          <View style={styles.dashRow}>
            <View style={styles.dashStat}>
              <Text style={styles.dashValue}>{avgScore}</Text>
              <Text style={styles.dashKey}>{t('profile.avgScore')}</Text>
            </View>
            <View style={styles.dashDivider} />
            <View style={styles.dashStat}>
              <Text style={styles.dashValue}>{streak}</Text>
              <Text style={styles.dashKey}>{t('profile.streak')} ({t('profile.days')})</Text>
            </View>
            <View style={styles.dashDivider} />
            <View style={styles.dashStat}>
              <Text style={styles.dashValue}>{totalNights}</Text>
              <Text style={styles.dashKey}>{t('profile.totalNights')}</Text>
            </View>
          </View>
        </View>

        {/* Sleep Schedule + Goals */}
        {profile && (
          <View style={sharedStyles.card}>
            <Text style={styles.sectionLabel}>{t('profile.sleepSchedule')}</Text>
            <Text style={styles.info}>🕙 {profile.bedtime} → {profile.wakeTime}</Text>
          </View>
        )}

        {/* Language / Country */}
        <View style={sharedStyles.card}>
          <Text style={styles.sectionLabel}>{t('profile.languageLabel')}</Text>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.value}
              style={[styles.langRow, locale === lang.value && styles.langRowActive]}
              onPress={() => setLocale(lang.value)}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <View style={styles.flex1}>
                <Text style={[styles.langLabel, locale === lang.value && styles.langLabelActive]}>{lang.label}</Text>
                {locale === lang.value && (
                  <Text style={styles.langPrice}>{lang.price}</Text>
                )}
              </View>
              {locale === lang.value && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Preferences */}
        <View style={[sharedStyles.card, styles.row]}>
          <Text style={styles.sectionLabel}>{t('profile.notificationsLabel')}</Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={v => updateSettings({ notificationsEnabled: v })}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>

        {/* Premium card */}
        {!settings.isPremium && (
          <View style={[sharedStyles.card, styles.premiumCard]}>
            <Text style={styles.premiumTitle}>{t('profile.premiumTitle')}</Text>
            <Text style={styles.premiumPrice}>{currentLang?.price ?? 'R$19,90/mês'}</Text>
            <Text style={styles.premiumBenefits}>{t('profile.premiumBenefits')}</Text>
            <PaywallBanner source="profile" onUpgrade={() => {}} />
          </View>
        )}

        {/* Conta */}
        <View style={sharedStyles.card}>
          <Text style={styles.sectionLabel}>{t('profile.accountTitle')}</Text>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.link}>{t('profile.exportLabel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.link}>{t('profile.privacy')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.link}>{t('profile.terms')}</Text>
          </TouchableOpacity>
          <Text style={styles.version}>{t('profile.version')} 1.0.0</Text>
        </View>

        <Button label={t('profile.reset')} onPress={confirmReset} variant="destructive" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.heading2, color: colors.textPrimary },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.bgSurface, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 2, borderColor: colors.primary },
  avatarText: { fontSize: 32 },
  sectionLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.xs },
  info: { ...typography.body, color: colors.textSecondary },
  dashRow: { flexDirection: 'row', alignItems: 'center' },
  dashStat: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs },
  dashValue: { ...typography.heading2, color: colors.primary },
  dashKey: { ...typography.label, color: colors.textMuted, textAlign: 'center' },
  dashDivider: { width: 1, height: 40, backgroundColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm, borderRadius: radius.sm, paddingHorizontal: spacing.xs },
  langRowActive: { backgroundColor: colors.primaryFaded },
  langFlag: { fontSize: 20 },
  langLabel: { ...typography.body, color: colors.textSecondary },
  langLabelActive: { color: colors.primaryLight, fontWeight: '600' },
  langPrice: { ...typography.label, color: colors.teal },
  checkmark: { ...typography.body, color: colors.primary, fontWeight: '700' },
  premiumCard: { borderColor: colors.primary, borderWidth: 1 },
  premiumTitle: { ...typography.heading3, color: colors.primaryLight },
  premiumPrice: { ...typography.heading2, color: colors.primary, marginVertical: spacing.xs },
  premiumBenefits: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.sm },
  linkRow: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  link: { ...typography.body, color: colors.textSecondary },
  version: { ...typography.label, color: colors.textMuted, marginTop: spacing.sm },
  flex1: { flex: 1 },
});
