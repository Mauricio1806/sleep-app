import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Sound from 'react-native-sound';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { SoundCard } from '../components/SoundCard';
import { SoundBottomPlayer, VOLUME_STEPS } from '../components/SoundBottomPlayer';
import { SoundOption } from '../types';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';

Sound.setCategory('Playback', true);

const S3_FREE    = 'https://sona-app-audios.s3.us-east-1.amazonaws.com/sons-sleep-app';
const S3_PREMIUM = 'https://sona-app-audios.s3.us-east-1.amazonaws.com';

interface SoundCategory {
  id: string;
  nameKey: string;
  sounds: SoundOption[];
}

const CATEGORIES: SoundCategory[] = [
  {
    id: 'nature', nameKey: 'soundCategories.nature',
    sounds: [
      { id: 'rain',     nameKey: 'soundNames.rainSoft',       url: `${S3_FREE}/chuva-suave.mp3.mp3`,        isPremium: false, emoji: '🌧️', categoryId: 'nature' },
      { id: 'forest',   nameKey: 'soundNames.forestNight',    url: `${S3_FREE}/floresta-noite.mp3.mp3`,     isPremium: false, emoji: '🌲', categoryId: 'nature' },
      { id: 'ocean',    nameKey: 'soundNames.oceanWaves',     url: `${S3_FREE}/ondas-mar.mp3.mp3`,          isPremium: false, emoji: '🌊', categoryId: 'nature' },
      { id: 'thunder',  nameKey: 'soundNames.distantThunder', url: `${S3_PREMIUM}/trovao.mp3.mp3`,          isPremium: true,  emoji: '⛈️', categoryId: 'nature' },
      { id: 'river',    nameKey: 'soundNames.mountainRiver',  url: `${S3_PREMIUM}/rio-montanha.mp3.mp3`,    isPremium: true,  emoji: '⛰️', categoryId: 'nature' },
      { id: 'tropical', nameKey: 'soundNames.tropicalForest', url: `${S3_PREMIUM}/floresta-tropical.mp3.mp3`, isPremium: true, emoji: '🌴', categoryId: 'nature' },
    ],
  },
  {
    id: 'white', nameKey: 'soundCategories.white',
    sounds: [
      { id: 'white_noise', nameKey: 'soundNames.whiteNoise',  url: `${S3_FREE}/ruido-branco.mp3.mp3`,      isPremium: false, emoji: '⬜', categoryId: 'white' },
      { id: 'wind',        nameKey: 'soundNames.gentleWind',  url: `${S3_FREE}/vento-suave.mp3.mp3`,       isPremium: false, emoji: '💨', categoryId: 'white' },
      { id: 'fan',         nameKey: 'soundNames.ceilingFan',  url: `${S3_PREMIUM}/ventilador.mp3.mp3`,     isPremium: true,  emoji: '🌀', categoryId: 'white' },
      { id: 'shower',      nameKey: 'soundNames.shower',      url: `${S3_PREMIUM}/chuveiro.mp3.mp3`,       isPremium: true,  emoji: '🚿', categoryId: 'white' },
    ],
  },
  {
    id: 'asmr', nameKey: 'soundCategories.asmr',
    sounds: [
      { id: 'fireplace',   nameKey: 'soundNames.fireplace',       url: `${S3_FREE}/lareira.mp3.mp3`,           isPremium: false, emoji: '🔥', categoryId: 'asmr' },
      { id: 'rain_window', nameKey: 'soundNames.rainWindow',      url: `${S3_FREE}/chuva-janela.mp3.mp3`,      isPremium: false, emoji: '🪟', categoryId: 'asmr' },
      { id: 'whispers',    nameKey: 'soundNames.gentleWhispers',  url: `${S3_PREMIUM}/sussurros.mp3.mp3`,      isPremium: true,  emoji: '🤫', categoryId: 'asmr' },
      { id: 'book_pages',  nameKey: 'soundNames.bookPages',       url: `${S3_PREMIUM}/paginas-livro.mp3.mp3`,  isPremium: true,  emoji: '📖', categoryId: 'asmr' },
      { id: 'handwriting', nameKey: 'soundNames.handwriting',     url: `${S3_PREMIUM}/escrita-mao.mp3.mp3`,    isPremium: true,  emoji: '✏️', categoryId: 'asmr' },
      { id: 'tapping',     nameKey: 'soundNames.gentleTapping',   url: `${S3_PREMIUM}/tapping.mp3.mp3`,        isPremium: true,  emoji: '🫧', categoryId: 'asmr' },
    ],
  },
  {
    id: 'ambient', nameKey: 'soundCategories.ambient',
    sounds: [
      { id: 'cafe',     nameKey: 'soundNames.parisCafe',      url: `${S3_FREE}/cafe-parisiense.mp3.mp3`,   isPremium: false, emoji: '☕', categoryId: 'ambient' },
      { id: 'library',  nameKey: 'soundNames.quietLibrary',   url: `${S3_FREE}/biblioteca.mp3.mp3`,        isPremium: false, emoji: '📚', categoryId: 'ambient' },
      { id: 'train',    nameKey: 'soundNames.nightTrain',     url: `${S3_PREMIUM}/trem-noturno.mp3.mp3`,   isPremium: true,  emoji: '🚂', categoryId: 'ambient' },
      { id: 'aquarium', nameKey: 'soundNames.aquarium',       url: `${S3_PREMIUM}/aquario.mp3.mp3`,        isPremium: true,  emoji: '🐠', categoryId: 'ambient' },
      { id: 'spa',      nameKey: 'soundNames.spaRelax',       url: `${S3_PREMIUM}/spa.mp3.mp3`,            isPremium: true,  emoji: '🧖', categoryId: 'ambient' },
      { id: 'garden',   nameKey: 'soundNames.japaneseGarden', url: `${S3_PREMIUM}/jardim-japones.mp3.mp3`, isPremium: true,  emoji: '🎋', categoryId: 'ambient' },
    ],
  },
  {
    id: 'body', nameKey: 'soundCategories.body',
    sounds: [
      { id: 'heartbeat',  nameKey: 'soundNames.heartbeat',       url: `${S3_FREE}/batimentos.mp3.mp3`,           isPremium: false, emoji: '❤️', categoryId: 'body' },
      { id: 'breathing',  nameKey: 'soundNames.guidedBreathing', url: `${S3_PREMIUM}/respiracao-guiada.mp3.mp3`, isPremium: true,  emoji: '🫁', categoryId: 'body' },
      { id: 'whale',      nameKey: 'soundNames.humpbackWhale',   url: `${S3_PREMIUM}/baleia.mp3.mp3`,            isPremium: true,  emoji: '🐋', categoryId: 'body' },
      { id: 'birds_dawn', nameKey: 'soundNames.dawnBirds',       url: `${S3_PREMIUM}/passaros-manha.mp3.mp3`,    isPremium: true,  emoji: '🐦', categoryId: 'body' },
    ],
  },
  {
    id: 'special', nameKey: 'soundCategories.special',
    sounds: [
      { id: 'hz432',    nameKey: 'soundNames.hz432',         url: `${S3_PREMIUM}/432hz.mp3.mp3`,             isPremium: true, emoji: '🎵', categoryId: 'special' },
      { id: 'binaural', nameKey: 'soundNames.binauralDelta', url: `${S3_PREMIUM}/binaural-delta.mp3.mp3`,    isPremium: true, emoji: '🌊', categoryId: 'special' },
      { id: 'tibetan',  nameKey: 'soundNames.tibetanBowls',  url: `${S3_PREMIUM}/tibetan-bowls.mp3.mp3`,     isPremium: true, emoji: '🔔', categoryId: 'special' },
      { id: 'amazon',   nameKey: 'soundNames.amazonBirds',   url: `${S3_PREMIUM}/passaros-amazonia.mp3.mp3`, isPremium: true, emoji: '🦜', categoryId: 'special' },
    ],
  },
];

const ALL_SOUNDS = CATEGORIES.flatMap(c => c.sounds);

export function SoundPlayerScreen() {
  const { t } = useTranslation();
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const [timer, setTimer] = useState(0);
  const [volumeIndex, setVolumeIndex] = useState(3);
  const soundRef = useRef<Sound | null>(null);
  const isLoadingRef = useRef(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const catScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    trackScreen('SoundPlayer');
    return () => { stopCurrent(); };
  }, []);

  useFocusEffect(useCallback(() => {
    setActiveCat(CATEGORIES[0].id);
    catScrollRef.current?.scrollTo({ x: 0, animated: false });
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, []));

  function pauseCurrent() {
    if (soundRef.current) { soundRef.current.pause(); }
    setIsPlaying(false);
  }

  function clearLoadingState() {
    isLoadingRef.current = false;
    setIsLoadingSound(false);
    if (loadingTimeoutRef.current) { clearTimeout(loadingTimeoutRef.current); loadingTimeoutRef.current = null; }
  }

  function stopCurrent(callback?: () => void) {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
        callback?.();
      });
    } else {
      callback?.();
    }
    setIsPlaying(false);
    setCurrentId(null);
  }

  function handlePress(sound: SoundOption) {
    if (sound.isPremium) return;
    if (isLoadingRef.current) return;

    if (currentId === sound.id) {
      if (isPlaying) {
        pauseCurrent();
      } else {
        soundRef.current?.play((success) => { if (!success) { setIsPlaying(false); setCurrentId(null); } });
        setIsPlaying(true);
        if (timer > 0) { timerRef.current = setTimeout(stopCurrent, timer * 60 * 1000); }
      }
      return;
    }

    isLoadingRef.current = true;
    setIsLoadingSound(true);
    setCurrentId(sound.id);

    // fallback: libera o lock após 5s no pior caso
    loadingTimeoutRef.current = setTimeout(() => { clearLoadingState(); }, 5000);

    stopCurrent(() => {
      const s = new Sound(sound.url, '', (error) => {
        clearLoadingState();
        if (error) { setIsPlaying(false); setCurrentId(null); return; }
        s.setNumberOfLoops(-1);
        s.setVolume(VOLUME_STEPS[volumeIndex]);
        s.play((success) => { if (!success) { setIsPlaying(false); setCurrentId(null); } });
        soundRef.current = s;
        setIsPlaying(true);
        if (timer > 0) { timerRef.current = setTimeout(stopCurrent, timer * 60 * 1000); }
      });
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
        {isLoadingSound && (
          <ActivityIndicator size="small" color={colors.teal} style={styles.loader} />
        )}
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
                <View style={styles.flex1} />
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
  loader: { position: 'absolute', top: spacing.md, right: spacing.lg, zIndex: 10 },
  catBar: { flexGrow: 0 },
  catBarContent: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  catChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard },
  catChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryFaded },
  catLabel: { ...typography.label, color: colors.textMuted },
  catLabelActive: { color: colors.primaryLight, fontWeight: '600' },
  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex1: { flex: 1 },
});
