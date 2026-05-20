import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { trackPremiumShown } from '../services/analyticsService';

interface PaywallBannerProps {
  source: string;
  onUpgrade: () => void;
}

export function PaywallBanner({ source, onUpgrade }: PaywallBannerProps) {
  React.useEffect(() => {
    trackPremiumShown(source);
  }, [source]);

  return (
    <View style={styles.banner}>
      <Text style={styles.crown}>👑</Text>
      <Text style={styles.title}>Desbloqueie o Premium</Text>
      <Text style={styles.subtitle}>Plano completo 14 dias · Sons exclusivos · Insights semanais</Text>
      <TouchableOpacity style={styles.btn} onPress={onUpgrade} activeOpacity={0.85}>
        <Text style={styles.btnText}>Ver planos — R$ 19,90/mês</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    gap: spacing.sm,
  },
  crown: { fontSize: 32 },
  title: { ...typography.heading3, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  btn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm + 4, marginTop: spacing.xs },
  btnText: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
});
