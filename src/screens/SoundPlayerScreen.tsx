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
const FREE_SOUNDS = ALL_SOUNDS.filter(s => !s.isPremium);

export function SoundPlayerScreen() {
  const { t } = useTranslation();
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [volumeIndex, setVolumeIndex] = useState(3);
  const cacheRef = useRef<Map<string, Sound>>(new Map());
  const activeIdRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const catScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    trackScreen('SoundPlayer');
    // Pre-carrega todos os sons gratuitos em background
    FREE_SOUNDS.forEach(sound => {
      const s = new Sound(sound.url, '', (error) => {
        if (!error) {
          s.setNumberOfLoops(-1);
          cacheRef.current.set(sound.id, s);
        }
      });
    });
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // Para o som ativo e libera todos do cache
      const active = activeIdRef.current ? cacheRef.current.get(activeIdRef.current) : null;
      active?.stop();
      cacheRef.current.forEach(s => s.release());
      cacheRef.current.clear();
    };
  }, []);

  // Ao sair da tela: NÃO para o som (continua em background)
  // Ao voltar: sincroniza o estado visual com o que está tocando
  useFocusEffect(useCallback(() => {
    catScrollRef.current?.scrollTo({ x: 0, animated: false });
    // Sincroniza estado visual ao voltar para a tela
    if (activeIdRef.current) {
      const active = cacheRef.current.get(activeIdRef.current);
      if (active) {
        setCurrentId(activeIdRef.current);
        setIsPlaying(active.isPlaying());
      }
    }
    return () => {};
  }, []));

  function handlePress(sound: SoundOption) {
    if (sound.isPremium) return;

    // Pausar/retomar o mesmo som
    if (activeIdRef.current === sound.id) {
      const active = cacheRef.current.get(sound.id);
      if (!active) return;
      if (isPlaying) {
        active.pause();
        setIsPlaying(false);
      } else {
        active.play((success) => { if (!success) { setIsPlaying(false); } });
        setIsPlaying(true);
        if (timer > 0) { timerRef.current = setTimeout(() => { active.stop(); setIsPlaying(false); setCurrentId(null); activeIdRef.current = null; }, timer * 60 * 1000); }
      }
      return;
    }

    // Para o som atual sem release (fica no cache)
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (activeIdRef.current) {
      cacheRef.current.get(activeIdRef.current)?.stop();
    }

    const cached = cacheRef.current.get(sound.id);
    if (cached) {
      // Som já no cache — toca imediatamente
      cached.setVolume(VOLUME_STEPS[volumeIndex]);
      cached.play((success) => { if (!success) { setIsPlaying(false); setCurrentId(null); activeIdRef.current = null; } });
      activeIdRef.current = sound.id;
      setCurrentId(sound.id);
      setIsPlaying(true);
      if (timer > 0) { timerRef.current = setTimeout(() => { cached.stop(); setIsPlaying(false); setCurrentId(null); activeIdRef.current = null; }, timer * 60 * 1000); }
    } else {
      // Som ainda carregando do S3 — mostra selecionado e aguarda
      setCurrentId(sound.id);
      activeIdRef.current = sound.id;
      setIsPlaying(false);
      const tryPlay = (attempts: number) => {
        const s = cacheRef.current.get(sound.id);
        if (s) {
          s.setVolume(VOLUME_STEPS[volumeIndex]);
          s.play((success) => { if (!success) { setIsPlaying(false); setCurrentId(null); activeIdRef.current = null; } });
          setIsPlaying(true);
          if (timer > 0) { timerRef.current = setTimeout(() => { s.stop(); setIsPlaying(false); setCurrentId(null); activeIdRef.current = null; }, timer * 60 * 1000); }
        } else if (attempts > 0) {
          setTimeout(() => tryPlay(attempts - 1), 500);
        }
      };
      setTimeout(() => tryPlay(10), 300);
    }
  }

  function handlePlayPause() {
    if (!activeIdRef.current) return;
    const active = cacheRef.current.get(activeIdRef.current);
    if (!active) return;
    if (isPlaying) {
      active.pause();
      setIsPlaying(false);
    } else {
      active.play((success) => { if (!success) setIsPlaying(false); });
      setIsPlaying(true);
    }
  }

  function handleVolumeStep() {
    const next = (volumeIndex + 1) % VOLUME_STEPS.length;
    setVolumeIndex(next);
    if (activeIdRef.current) {
      cacheRef.current.get(activeIdRef.current)?.setVolume(VOLUME_STEPS[next]);
    }
  }

  function handleTimerChange(value: number) {
    setTimer(value);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (value > 0 && isPlaying && activeIdRef.current) {
      const id = activeIdRef.current;
      timerRef.current = setTimeout(() => {
        cacheRef.current.get(id)?.stop();
        setIsPlaying(false);
        setCurrentId(null);
        activeIdRef.current = null;
      }, value * 60 * 1000);
    }
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
          onPlayPause={handlePlayPause}
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
  flex1: { flex: 1 },
});
