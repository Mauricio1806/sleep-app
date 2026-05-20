import React, { useContext, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { ProfileContext } from '../context/ProfileContext';
import { LocaleContext } from '../context/LocaleContext';
import { PaywallBanner } from '../components/PaywallBanner';
import { Button } from '../components/Button';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';
import { UserSettings } from '../types';

const LANGUAGES: { value: UserSettings['language']; label: string; flag: string }[] = [
  { value: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
  { value: 'es-MX', label: 'Español (México)', flag: '🇲🇽' },
  { value: 'es-AR', label: 'Español (Argentina)', flag: '🇦🇷' },
  { value: 'es-CO', label: 'Español (Colombia)', flag: '🇨🇴' },
];

export function ProfileScreen() {
  const { t } = useTranslation();
  const { profile, settings, updateSettings, resetAll } = useContext(ProfileContext);
  const { locale, setLocale } = useContext(LocaleContext);

  useEffect(() => { trackScreen('Profile'); }, []);

  function confirmReset() {
    Alert.alert(
      t('profile.resetConfirmTitle'),
      t('profile.resetConfirmMsg'),
      [
        { text: t('profile.resetConfirmNo'), style: 'cancel' },
        { text: t('profile.resetConfirmYes'), style: 'destructive', onPress: () => resetAll() },
      ],
    );
  }

  const goalLabels: Record<string, string> = {
    fall_faster: '⚡ Adormecer rápido',
    less_wakeups: '🌙 Menos acordadas',
    feel_rested: '☀️ Acordar descansado',
    reduce_stress: '🧘 Menos ansiedade',
    fix_schedule: '📅 Regularizar horários',
    more_deep_sleep: '💤 Sono profundo',
  };

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('profile.title')}</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        {profile && (
          <View style={sharedStyles.card}>
            <Text style={styles.sectionLabel}>{t('profile.sleepSchedule')}</Text>
            <Text style={styles.info}>🕙 {profile.bedtime} → {profile.wakeTime}</Text>
            <Text style={[styles.sectionLabel, { marginTop: spacing.sm }]}>{t('profile.sleepGoals')}</Text>
            <View style={styles.goalsRow}>
              {profile.goals.map(g => (
                <View key={g} style={styles.goalBadge}>
                  <Text style={styles.goalBadgeText}>{goalLabels[g] ?? g}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={sharedStyles.card}>
          <Text style={styles.sectionLabel}>{t('profile.languageLabel')}</Text>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.value}
              style={[styles.langRow, locale === lang.value && styles.langRowActive]}
              onPress={() => setLocale(lang.value)}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.langLabel, locale === lang.value && styles.langLabelActive]}>{lang.label}</Text>
              {locale === lang.value && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <View style={[sharedStyles.card, styles.row]}>
          <Text style={styles.sectionLabel}>{t('profile.notificationsLabel')}</Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={v => updateSettings({ notificationsEnabled: v })}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>
        {!settings.isPremium && (
          <PaywallBanner source="profile" onUpgrade={() => {}} />
        )}
        <View style={styles.links}>
          <TouchableOpacity><Text style={styles.link}>{t('profile.privacy')}</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.link}>{t('profile.terms')}</Text></TouchableOpacity>
        </View>
        <Text style={styles.version}>{t('profile.version')} 1.0.0</Text>
        <Button label={t('profile.reset')} onPress={confirmReset} variant="destructive" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.heading2, color: colors.textPrimary },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.bgSurface, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 2, borderColor: colors.primary },
  avatarText: { fontSize: 36 },
  sectionLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.xs },
  info: { ...typography.body, color: colors.textSecondary },
  goalsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  goalBadge: { backgroundColor: colors.primaryFaded, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  goalBadgeText: { ...typography.label, color: colors.primaryLight },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm, borderRadius: radius.sm },
  langRowActive: { backgroundColor: colors.primaryFaded },
  langFlag: { fontSize: 20 },
  langLabel: { ...typography.body, color: colors.textSecondary, flex: 1 },
  langLabelActive: { color: colors.primaryLight, fontWeight: '600' },
  checkmark: { ...typography.body, color: colors.primary, fontWeight: '700' },
  links: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg },
  link: { ...typography.bodySmall, color: colors.textMuted, textDecorationLine: 'underline' },
  version: { ...typography.label, color: colors.textMuted, textAlign: 'center' },
});
