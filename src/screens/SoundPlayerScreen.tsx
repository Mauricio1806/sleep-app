import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Sound from 'react-native-sound';
import { colors, spacing, typography, sharedStyles } from '../../theme';
import { SoundCard } from '../components/SoundCard';
import { SoundBottomPlayer, VOLUME_STEPS } from '../components/SoundBottomPlayer';
import { SoundOption } from '../types';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';

Sound.setCategory('Playback', true);

// TODO-AWS: Replace PLACEHOLDER-S3 with real S3 bucket URL after upload
const S3 = 'https://PLACEHOLDER-S3/sons';

const SOUNDS: SoundOption[] = [
  { id: 'rain', name: 'Chuva Suave', url: `${S3}/chuva-suave.mp3`, isPremium: false, emoji: '🌧️' },
  { id: 'white', name: 'Ruído Branco', url: `${S3}/ruido-branco.mp3`, isPremium: false, emoji: '⬜' },
  { id: 'forest', name: 'Floresta à Noite', url: `${S3}/floresta-noite.mp3`, isPremium: false, emoji: '🌲' },
  { id: 'ocean', name: 'Ondas do Mar', url: `${S3}/ondas-mar.mp3`, isPremium: false, emoji: '🌊' },
  { id: 'wind', name: 'Vento Suave', url: `${S3}/vento-suave.mp3`, isPremium: false, emoji: '💨' },
  { id: 'river', name: 'Rio da Montanha', url: `${S3}/rio-montanha.mp3`, isPremium: false, emoji: '🏔️' },
  { id: 'thunder', name: 'Trovão', url: `${S3}/trovao.mp3`, isPremium: true, emoji: '⛈️' },
  { id: 'fireplace', name: 'Lareira', url: `${S3}/lareira.mp3`, isPremium: true, emoji: '🔥' },
  { id: 'cafe', name: 'Café Parisiense', url: `${S3}/cafe-parisiense.mp3`, isPremium: true, emoji: '☕' },
  { id: 'heartbeat', name: 'Batimentos Cardíacos', url: `${S3}/batimentos.mp3`, isPremium: true, emoji: '❤️' },
  { id: 'window_rain', name: 'Chuva na Janela', url: `${S3}/chuva-janela.mp3`, isPremium: true, emoji: '🪟' },
  { id: 'tropical', name: 'Floresta Tropical', url: `${S3}/floresta-tropical.mp3`, isPremium: true, emoji: '🌴' },
  { id: 'whale', name: 'Baleia Humpback', url: `${S3}/baleia-humpback.mp3`, isPremium: true, emoji: '🐋' },
  { id: 'train', name: 'Trem Noturno', url: `${S3}/trem-noturno.mp3`, isPremium: true, emoji: '🚂' },
  { id: 'fan', name: 'Ventilador', url: `${S3}/ventilador.mp3`, isPremium: true, emoji: '🌀' },
  { id: 'birds', name: 'Pássaros', url: `${S3}/passaros.mp3`, isPremium: true, emoji: '🐦' },
];

export function SoundPlayerScreen() {
  const { t } = useTranslation();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [volumeIndex, setVolumeIndex] = useState(3);
  const soundRef = useRef<Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    trackScreen('SoundPlayer');
    return () => { stopCurrent(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopCurrent() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (soundRef.current) { soundRef.current.stop(); soundRef.current.release(); soundRef.current = null; }
    setIsPlaying(false);
    setCurrentId(null);
  }

  function handlePress(sound: SoundOption) {
    if (sound.isPremium) return;
    if (currentId === sound.id && isPlaying) { stopCurrent(); return; }
    stopCurrent();
    const s = new Sound(sound.url, '', (error) => {
      if (error) { setCurrentId(sound.id); setIsPlaying(false); return; }
      s.setNumberOfLoops(-1);
      s.setVolume(VOLUME_STEPS[volumeIndex]);
      s.play((success) => { if (!success) { setIsPlaying(false); setCurrentId(null); } });
      soundRef.current = s;
      setCurrentId(sound.id);
      setIsPlaying(true);
      if (timer > 0) { timerRef.current = setTimeout(stopCurrent, timer * 60 * 1000); }
    });
  }

  function handleVolumeStep() {
    const next = (volumeIndex + 1) % VOLUME_STEPS.length;
    setVolumeIndex(next);
    soundRef.current?.setVolume(VOLUME_STEPS[next]);
  }

  function handleTimerChange(value: number) {
    setTimer(value);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (value > 0 && isPlaying) { timerRef.current = setTimeout(stopCurrent, value * 60 * 1000); }
  }

  const pairs: [SoundOption, SoundOption | undefined][] = [];
  for (let i = 0; i < SOUNDS.length; i += 2) { pairs.push([SOUNDS[i], SOUNDS[i + 1]]); }

  const currentSound = SOUNDS.find(s => s.id === currentId) ?? null;

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('soundPlayer.title')}</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
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
        </ScrollView>
        <SoundBottomPlayer
          sound={currentSound}
          isPlaying={isPlaying}
          volumeIndex={volumeIndex}
          timer={timer}
          onPlayPause={() => currentId && handlePress(currentSound ?? SOUNDS[0])}
          onVolumeStep={handleVolumeStep}
          onTimerChange={handleTimerChange}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { ...typography.heading2, color: colors.textPrimary, paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.sm },
  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
});
