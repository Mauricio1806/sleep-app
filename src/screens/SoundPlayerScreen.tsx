import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Sound from 'react-native-sound';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { SoundCard } from '../components/SoundCard';
import { SoundBottomPlayer, VOLUME_STEPS } from '../components/SoundBottomPlayer';
import { SoundOption } from '../types';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';

Sound.setCategory('Playback', true);

// TODO-AWS: Replace PLACEHOLDER-S3 with real S3 bucket URL after upload-sounds.ps1
const S3 = 'https://PLACEHOLDER-S3/sons';

interface SoundCategory {
  id: string;
  nameKey: string;
  sounds: SoundOption[];
}

const CATEGORIES: SoundCategory[] = [
  {
    id: 'nature', nameKey: 'soundCategories.nature',
    sounds: [
      { id: 'rain', nameKey: 'soundNames.rainSoft', url: `${S3}/chuva-suave.mp3`, isPremium: false, emoji: '🌧️', categoryId: 'nature' },
      { id: 'forest', nameKey: 'soundNames.forestNight', url: `${S3}/floresta-noite.mp3`, isPremium: false, emoji: '🌲', categoryId: 'nature' },
      { id: 'ocean', nameKey: 'soundNames.oceanWaves', url: `${S3}/ondas-mar.mp3`, isPremium: false, emoji: '🌊', categoryId: 'nature' },
      { id: 'thunder', nameKey: 'soundNames.distantThunder', url: `${S3}/trovao.mp3`, isPremium: true, emoji: '⛈️', categoryId: 'nature' },
      { id: 'river', nameKey: 'soundNames.mountainRiver', url: `${S3}/rio-montanha.mp3`, isPremium: true, emoji: '🏔️', categoryId: 'nature' },
      { id: 'tropical', nameKey: 'soundNames.tropicalForest', url: `${S3}/floresta-tropical.mp3`, isPremium: true, emoji: '🌴', categoryId: 'nature' },
    ],
  },
  {
    id: 'white', nameKey: 'soundCategories.white',
    sounds: [
      { id: 'white_noise', nameKey: 'soundNames.whiteNoise', url: `${S3}/ruido-branco.mp3`, isPremium: false, emoji: '⬜', categoryId: 'white' },
      { id: 'wind', nameKey: 'soundNames.gentleWind', url: `${S3}/vento-suave.mp3`, isPremium: false, emoji: '💨', categoryId: 'white' },
      { id: 'fan', nameKey: 'soundNames.ceilingFan', url: `${S3}/ventilador.mp3`, isPremium: true, emoji: '🌀', categoryId: 'white' },
      { id: 'shower', nameKey: 'soundNames.shower', url: `${S3}/chuveiro.mp3`, isPremium: true, emoji: '🚿', categoryId: 'white' },
    ],
  },
  {
    id: 'asmr', nameKey: 'soundCategories.asmr',
    sounds: [
      { id: 'fireplace', nameKey: 'soundNames.fireplace', url: `${S3}/lareira.mp3`, isPremium: false, emoji: '🔥', categoryId: 'asmr' },
      { id: 'rain_window', nameKey: 'soundNames.rainWindow', url: `${S3}/chuva-janela.mp3`, isPremium: false, emoji: '🪟', categoryId: 'asmr' },
      { id: 'whispers', nameKey: 'soundNames.gentleWhispers', url: `${S3}/sussurros.mp3`, isPremium: true, emoji: '🤫', categoryId: 'asmr' },
      { id: 'book_pages', nameKey: 'soundNames.bookPages', url: `${S3}/paginas-livro.mp3`, isPremium: true, emoji: '📖', categoryId: 'asmr' },
      { id: 'handwriting', nameKey: 'soundNames.handwriting', url: `${S3}/escrita-mao.mp3`, isPremium: true, emoji: '✍️', categoryId: 'asmr' },
      { id: 'tapping', nameKey: 'soundNames.gentleTapping', url: `${S3}/tapping.mp3`, isPremium: true, emoji: '🫧', categoryId: 'asmr' },
    ],
  },
  {
    id: 'ambient', nameKey: 'soundCategories.ambient',
    sounds: [
      { id: 'cafe', nameKey: 'soundNames.parisCafe', url: `${S3}/cafe-parisiense.mp3`, isPremium: false, emoji: '☕', categoryId: 'ambient' },
      { id: 'library', nameKey: 'soundNames.quietLibrary', url: `${S3}/biblioteca.mp3`, isPremium: false, emoji: '📚', categoryId: 'ambient' },
      { id: 'train', nameKey: 'soundNames.nightTrain', url: `${S3}/trem-noturno.mp3`, isPremium: true, emoji: '🚂', categoryId: 'ambient' },
      { id: 'aquarium', nameKey: 'soundNames.aquarium', url: `${S3}/aquario.mp3`, isPremium: true, emoji: '🐠', categoryId: 'ambient' },
      { id: 'spa', nameKey: 'soundNames.spaRelax', url: `${S3}/spa.mp3`, isPremium: true, emoji: '🧖', categoryId: 'ambient' },
      { id: 'garden', nameKey: 'soundNames.japaneseGarden', url: `${S3}/jardim-japones.mp3`, isPremium: true, emoji: '🎋', categoryId: 'ambient' },
    ],
  },
  {
    id: 'body', nameKey: 'soundCategories.body',
    sounds: [
      { id: 'heartbeat', nameKey: 'soundNames.heartbeat', url: `${S3}/batimentos.mp3`, isPremium: false, emoji: '❤️', categoryId: 'body' },
      { id: 'breathing', nameKey: 'soundNames.guidedBreathing', url: `${S3}/respiracao-guiada.mp3`, isPremium: true, emoji: '🫁', categoryId: 'body' },
      { id: 'whale', nameKey: 'soundNames.humpbackWhale', url: `${S3}/baleia.mp3`, isPremium: true, emoji: '🐋', categoryId: 'body' },
      { id: 'birds_dawn', nameKey: 'soundNames.dawnBirds', url: `${S3}/passaros-manha.mp3`, isPremium: true, emoji: '🐦', categoryId: 'body' },
    ],
  },
  {
    id: 'special', nameKey: 'soundCategories.special',
    sounds: [
      { id: 'hz432', nameKey: 'soundNames.hz432', url: `${S3}/432hz.mp3`, isPremium: true, emoji: '🎵', categoryId: 'special' },
      { id: 'binaural', nameKey: 'soundNames.binauralDelta', url: `${S3}/binaural-delta.mp3`, isPremium: true, emoji: '🌊', categoryId: 'special' },
      { id: 'tibetan', nameKey: 'soundNames.tibetanBowls', url: `${S3}/tibetan-bowls.mp3`, isPremium: true, emoji: '🔔', categoryId: 'special' },
      { id: 'amazon', nameKey: 'soundNames.amazonBirds', url: `${S3}/passaros-amazonia.mp3`, isPremium: true, emoji: '🦜', categoryId: 'special' },
    ],
  },
];

const ALL_SOUNDS = CATEGORIES.flatMap(c => c.sounds);

export function SoundPlayerScreen() {
  const { t } = useTranslation();
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [volumeIndex, setVolumeIndex] = useState(3);
  const soundRef = useRef<Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const catScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    trackScreen('SoundPlayer');
    return () => { stopCurrent(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(useCallback(() => {
    setActiveCat(CATEGORIES[0].id);
    catScrollRef.current?.scrollTo({ x: 0, animated: false });
  }, []));

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

  const category = CATEGORIES.find(c => c.id === activeCat) ?? CATEGORIES[0];
  const pairs: [SoundOption, SoundOption | undefined][] = [];
  for (let i = 0; i < category.sounds.length; i += 2) {
    pairs.push([category.sounds[i], category.sounds[i + 1]]);
  }
  const currentSound = ALL_SOUNDS.find(s => s.id === currentId) ?? null;

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('soundPlayer.title')}</Text>
        <ScrollView
          ref={catScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catBar}
          contentContainerStyle={styles.catBarContent}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, activeCat === cat.id && styles.catChipActive]}
              onPress={() => setActiveCat(cat.id)}
            >
              <Text style={[styles.catLabel, activeCat === cat.id && styles.catLabelActive]}>
                {t(cat.nameKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
          {pairs.map(([a, b], i) => (
            <View key={i} style={styles.row}>
              <SoundCard
                sound={a}
                isLocked={a.isPremium}
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
          onPlayPause={() => currentId && handlePress(currentSound ?? ALL_SOUNDS[0])}
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
  catBar: { flexGrow: 0 },
  catBarContent: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  catChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard },
  catChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryFaded },
  catLabel: { ...typography.label, color: colors.textMuted },
  catLabelActive: { color: colors.primaryLight, fontWeight: '600' },
  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
});
