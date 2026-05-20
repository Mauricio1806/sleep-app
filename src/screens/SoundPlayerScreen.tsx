import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import TrackPlayer, { usePlaybackState, State } from 'react-native-track-player';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { SoundCard } from '../components/SoundCard';
import { SoundOption } from '../types';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';

// TODO-AWS: Substituir URLs placeholder pelos links reais do S3 após upload
const SOUNDS: SoundOption[] = [
  { id: 'rain', name: 'Chuva Suave', url: 'https://PLACEHOLDER-S3-URL/sons/chuva.mp3', isPremium: false, emoji: '🌧️' },
  { id: 'white', name: 'Ruído Branco', url: 'https://PLACEHOLDER-S3-URL/sons/ruido-branco.mp3', isPremium: false, emoji: '⬜' },
  { id: 'forest', name: 'Floresta à Noite', url: 'https://PLACEHOLDER-S3-URL/sons/floresta.mp3', isPremium: false, emoji: '🌲' },
  { id: 'ocean', name: 'Ondas do Mar', url: 'https://PLACEHOLDER-S3-URL/sons/oceano.mp3', isPremium: true, emoji: '🌊' },
  { id: 'thunder', name: 'Trovão', url: 'https://PLACEHOLDER-S3-URL/sons/trovao.mp3', isPremium: true, emoji: '⛈️' },
  { id: 'cafe', name: 'Café Parisiense', url: 'https://PLACEHOLDER-S3-URL/sons/cafe.mp3', isPremium: true, emoji: '☕' },
  { id: 'fireplace', name: 'Lareira', url: 'https://PLACEHOLDER-S3-URL/sons/lareira.mp3', isPremium: true, emoji: '🔥' },
  { id: 'heartbeat', name: 'Batimentos Cardíacos', url: 'https://PLACEHOLDER-S3-URL/sons/batimentos.mp3', isPremium: true, emoji: '💗' },
];

const TIMER_OPTIONS = [
  { label: 'Sem timer', value: 0 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

let playerReady = false;

async function setupPlayer() {
  if (playerReady) return;
  await TrackPlayer.setupPlayer();
  playerReady = true;
}

export function SoundPlayerScreen() {
  const { t } = useTranslation();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playbackState = usePlaybackState();

  const isPlaying = playbackState.state === State.Playing;

  useEffect(() => {
    trackScreen('SoundPlayer');
    setupPlayer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handlePress(sound: SoundOption) {
    if (sound.isPremium) return;
    if (currentId === sound.id && isPlaying) {
      await TrackPlayer.pause();
      setCurrentId(null);
      return;
    }
    await TrackPlayer.reset();
    await TrackPlayer.add({ id: sound.id, url: sound.url, title: sound.name, artist: 'SleepApp' });
    await TrackPlayer.play();
    setCurrentId(sound.id);
    if (timer > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        await TrackPlayer.stop();
        setCurrentId(null);
      }, timer * 60 * 1000);
    }
  }

  const pairs: [SoundOption, SoundOption | undefined][] = [];
  for (let i = 0; i < SOUNDS.length; i += 2) {
    pairs.push([SOUNDS[i], SOUNDS[i + 1]]);
  }

  const currentSound = SOUNDS.find(s => s.id === currentId);

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('soundPlayer.title')}</Text>
        {currentId && currentSound && (
          <View style={styles.nowPlaying}>
            <Text style={styles.nowPlayingText}>
              ▶ {t('soundPlayer.nowPlaying')}: {currentSound.name}
            </Text>
          </View>
        )}
        <View style={styles.timerRow}>
          {TIMER_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.timerBtn, timer === opt.value && styles.timerBtnActive]}
              onPress={() => setTimer(opt.value)}
            >
              <Text style={[styles.timerLabel, timer === opt.value && styles.timerLabelActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.grid}>
          {pairs.map(([a, b], i) => (
            <View key={i} style={styles.row}>
              <SoundCard
                sound={a}
                isLocked={false}
                isPlaying={currentId === a.id && isPlaying}
                onPress={() => handlePress(a)}
              />
              {b ? (
                <SoundCard
                  sound={b}
                  isLocked={b.isPremium}
                  isPlaying={currentId === b.id && isPlaying}
                  onPress={() => handlePress(b)}
                />
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  title: { ...typography.heading2, color: colors.textPrimary, marginBottom: spacing.md },
  nowPlaying: { backgroundColor: colors.tealFaded, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginBottom: spacing.sm, alignSelf: 'flex-start' },
  nowPlayingText: { ...typography.label, color: colors.teal },
  timerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  timerBtn: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  timerBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryFaded },
  timerLabel: { ...typography.label, color: colors.textMuted },
  timerLabelActive: { color: colors.primaryLight },
  grid: { gap: spacing.sm, flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
});
