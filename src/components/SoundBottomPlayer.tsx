import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../../theme';
import { useTranslation } from '../i18n';
import { SoundOption } from '../types';

const VOLUME_STEPS = [0.25, 0.5, 0.75, 1.0];
const VOLUME_ICONS = ['🔈', '🔉', '🔊', '🎵'];

const TIMER_OPTIONS = [
  { labelKey: 'soundPlayer.timerOff', value: 0 },
  { labelKey: 'soundPlayer.timer15', value: 15 },
  { labelKey: 'soundPlayer.timer30', value: 30 },
  { labelKey: 'soundPlayer.timer45', value: 45 },
  { labelKey: 'soundPlayer.timer60', value: 60 },
];

interface Props {
  sound: SoundOption | null;
  isPlaying: boolean;
  volumeIndex: number;
  timer: number;
  onPlayPause: () => void;
  onVolumeStep: () => void;
  onTimerChange: (value: number) => void;
}

export function SoundBottomPlayer({
  sound,
  isPlaying,
  volumeIndex,
  timer,
  onPlayPause,
  onVolumeStep,
  onTimerChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <Text style={styles.emoji}>{sound?.emoji ?? '🎵'}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {sound ? t(sound.nameKey) : t('soundPlayer.tapToPlay')}
        </Text>
        <TouchableOpacity onPress={onVolumeStep} style={styles.volBtn} accessibilityLabel={t('soundPlayer.volume')}>
          <Text style={styles.volIcon}>{VOLUME_ICONS[volumeIndex]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={sound ? onPlayPause : undefined}
          style={[styles.playBtn, !sound && styles.playBtnDisabled]}
          accessibilityLabel={isPlaying ? 'Pausar' : 'Tocar'}
        >
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.timerRow}>
        {TIMER_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.timerChip, timer === opt.value && styles.timerChipActive]}
            onPress={() => onTimerChange(opt.value)}
          >
            <Text style={[styles.timerLabel, timer === opt.value && styles.timerLabelActive]}>
              {t(opt.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  emoji: { fontSize: 22 },
  name: { ...typography.body, color: colors.textPrimary, flex: 1 },
  volBtn: { padding: spacing.xs },
  volIcon: { fontSize: 20 },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnDisabled: { backgroundColor: colors.border },
  playIcon: { fontSize: 18, color: colors.textPrimary },
  timerRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  timerChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryFaded },
  timerLabel: { ...typography.label, color: colors.textMuted },
  timerLabelActive: { color: colors.primaryLight },
});

export { VOLUME_STEPS };
