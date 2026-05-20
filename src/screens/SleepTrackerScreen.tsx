import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { TimeSelector } from '../components/TimeSelector';
import { ScaleSelector } from '../components/ScaleSelector';
import { InsightCard } from '../components/InsightCard';
import { Button } from '../components/Button';
import { useSleepData } from '../hooks/useSleepData';
import { generateDailyInsight } from '../services/claudeService';
import { useTranslation } from '../i18n';
import { trackScreen, trackSleepRecorded } from '../services/analyticsService';
import { DailyInsight } from '../types';

const QUALITY_OPTS = [
  { emoji: '😫', label: '1' },
  { emoji: '🙁', label: '2' },
  { emoji: '😐', label: '3' },
  { emoji: '🙂', label: '4' },
  { emoji: '😄', label: '5' },
];

export function SleepTrackerScreen() {
  const { t } = useTranslation();
  const { saveRecord } = useSleepData();
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [wakeups, setWakeups] = useState(0);
  const [quality, setQuality] = useState(0);
  const [hadAlcohol, setHadAlcohol] = useState(false);
  const [hadCaffeine, setHadCaffeine] = useState(false);
  const [notes, setNotes] = useState('');
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => { trackScreen('SleepTracker'); }, []);

  function showToast() {
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }

  async function handleSave() {
    if (!quality) return;
    setIsSaving(true);
    const record = await saveRecord({ bedtime, wakeTime, wakeups, quality, hadAlcohol, hadCaffeine, notes });
    trackSleepRecorded(record.score, record.durationMinutes);
    showToast();
    try {
      const ai = await generateDailyInsight(record);
      setInsight(ai);
      setShowModal(true);
    } catch {
      // insight is non-critical
    }
    setIsSaving(false);
  }

  const isValid = quality > 0;

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('sleepTracker.title')}</Text>
        <TimeSelector value={bedtime} onChange={setBedtime} label={t('sleepTracker.bedtime')} />
        <TimeSelector value={wakeTime} onChange={setWakeTime} label={t('sleepTracker.wakeTime')} />
        <View>
          <Text style={styles.label}>{t('sleepTracker.wakeups')}</Text>
          <View style={styles.counter}>
            <TouchableOpacity style={styles.counterBtn} onPress={() => setWakeups(Math.max(0, wakeups - 1))}><Text style={styles.counterBtnText}>−</Text></TouchableOpacity>
            <Text style={styles.counterVal}>{wakeups}</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={() => setWakeups(wakeups + 1)}><Text style={styles.counterBtnText}>+</Text></TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={styles.label}>{t('sleepTracker.quality')}</Text>
          <ScaleSelector value={quality} onChange={setQuality} options={QUALITY_OPTS} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>{t('sleepTracker.alcohol')}</Text>
          <View style={styles.toggleBtns}>
            <TouchableOpacity style={[styles.toggleBtn, hadAlcohol && styles.toggleBtnActive]} onPress={() => setHadAlcohol(true)}><Text style={styles.toggleLabel}>{t('common.yes')}</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, !hadAlcohol && styles.toggleBtnActive]} onPress={() => setHadAlcohol(false)}><Text style={styles.toggleLabel}>{t('common.no')}</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>{t('sleepTracker.caffeine')}</Text>
          <View style={styles.toggleBtns}>
            <TouchableOpacity style={[styles.toggleBtn, hadCaffeine && styles.toggleBtnActive]} onPress={() => setHadCaffeine(true)}><Text style={styles.toggleLabel}>{t('common.yes')}</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, !hadCaffeine && styles.toggleBtnActive]} onPress={() => setHadCaffeine(false)}><Text style={styles.toggleLabel}>{t('common.no')}</Text></TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={styles.label}>{t('sleepTracker.notes')}</Text>
          <TextInput
            style={styles.textInput}
            multiline
            maxLength={200}
            placeholder={t('sleepTracker.notesPlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
          />
          <Text style={styles.charCount}>{notes.length}/200</Text>
        </View>
        <Button label={t('sleepTracker.saveCta')} onPress={handleSave} disabled={!isValid} loading={isSaving} />
      </ScrollView>
      <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
        <Text style={styles.toastText}>✅ {t('sleepTracker.saved')}</Text>
      </Animated.View>
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('sleepTracker.insightTitle')}</Text>
            {insight && <InsightCard insight={insight.insight} tip={insight.tip} />}
            <Button label={t('common.done')} onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.heading2, color: colors.textPrimary },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  counter: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  counterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  counterBtnText: { ...typography.heading3, color: colors.textPrimary },
  counterVal: { ...typography.heading2, color: colors.textPrimary, minWidth: 32, textAlign: 'center' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleBtns: { flexDirection: 'row', gap: spacing.xs },
  toggleBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  toggleBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryFaded },
  toggleLabel: { ...typography.bodySmall, color: colors.textSecondary },
  textInput: { backgroundColor: colors.bgInput, borderRadius: radius.md, padding: spacing.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, minHeight: 80, ...typography.body },
  charCount: { ...typography.label, color: colors.textMuted, alignSelf: 'flex-end', marginTop: spacing.xs },
  toast: { position: 'absolute', bottom: spacing.xl, left: spacing.lg, right: spacing.lg, backgroundColor: colors.teal, borderRadius: radius.full, padding: spacing.sm, alignItems: 'center' },
  toastText: { ...typography.bodySmall, color: colors.bg, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.bgSurface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  modalTitle: { ...typography.heading3, color: colors.textPrimary },
});
