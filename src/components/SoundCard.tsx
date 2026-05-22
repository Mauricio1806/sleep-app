import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { SoundOption } from '../types';
import { colors, spacing, radius, typography } from '../../theme';
import { useTranslation } from '../i18n';

interface SoundCardProps {
  sound: SoundOption;
  isLocked: boolean;
  isPlaying: boolean;
  onPress: () => void;
}

export function SoundCard({ sound, isLocked, isPlaying, onPress }: SoundCardProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[styles.card, isPlaying && styles.cardActive, isLocked && styles.cardLocked]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLocked}
    >
      <Text style={styles.emoji}>{sound.emoji}</Text>
      <Text style={[styles.name, isLocked && styles.nameLocked]}>{t(sound.nameKey)}</Text>
      {isLocked ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🔒 {t('soundPlayer.premiumLabel')}</Text>
        </View>
      ) : isPlaying ? (
        <View style={[styles.badge, styles.badgePlaying]}>
          <Text style={styles.badgeText}>▶ {t('soundPlayer.nowPlaying')}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    flex: 1,
    minHeight: 110,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  cardActive: { borderColor: colors.teal, backgroundColor: colors.tealFaded },
  cardLocked: { opacity: 0.6 },
  emoji: { fontSize: 28 },
  name: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  nameLocked: { color: colors.textMuted },
  badge: { backgroundColor: colors.bgSurface, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  badgePlaying: { backgroundColor: colors.tealFaded },
  badgeText: { ...typography.label, color: colors.textSecondary },
});
