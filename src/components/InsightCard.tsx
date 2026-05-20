import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface InsightCardProps {
  insight: string;
  tip: string;
}

export function InsightCard({ insight, tip }: InsightCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.insight}>💡 {insight}</Text>
      <View style={styles.divider} />
      <Text style={styles.tip}>🎯 {tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryFaded,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.sm,
  },
  insight: { ...typography.body, color: colors.textPrimary, lineHeight: 22 },
  divider: { height: 1, backgroundColor: colors.border },
  tip: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
});
