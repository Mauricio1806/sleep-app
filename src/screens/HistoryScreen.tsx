import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { colors, spacing, typography, sharedStyles, radius } from '../../theme';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { useSleepData } from '../hooks/useSleepData';
import { useTranslation } from '../i18n';
import { trackScreen } from '../services/analyticsService';
import { getScoreColor } from '../utils/sleepCalculations';
import { minutesToHoursString, getRelativeDay, getDayOfWeek } from '../utils/dateHelpers';

const DAYS_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const CHART_W = 320;
const CHART_H = 120;
const BAR_W = 32;
const NUM_BARS = 7;

export function HistoryScreen() {
  const { t } = useTranslation();
  const { records, weeklySummary, isLoading } = useSleepData();

  useEffect(() => { trackScreen('History'); }, []);

  if (!isLoading && records.length === 0) {
    return (
      <SafeAreaView style={sharedStyles.screen}>
        <EmptyState icon="📊" title={t('history.emptyTitle')} subtitle={t('history.emptySubtitle')} cta={t('history.emptyCta')} />
      </SafeAreaView>
    );
  }

  const last7 = records.slice(0, NUM_BARS).reverse();
  const barGap = (CHART_W - BAR_W * NUM_BARS) / (NUM_BARS + 1);

  return (
    <SafeAreaView style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('history.title')}</Text>
        <View style={styles.avgCard}>
          <Text style={styles.avgLabel}>{t('history.weekAvg')}</Text>
          <Text style={[styles.avgScore, { color: getScoreColor(weeklySummary.averageScore) }]}>
            {weeklySummary.averageScore}
          </Text>
        </View>
        {last7.length >= 2 && (
          <View style={styles.chartContainer}>
            <Svg width={CHART_W} height={CHART_H + 30}>
              {last7.map((r, i) => {
                const x = barGap + i * (BAR_W + barGap);
                const barH = Math.max(4, (r.score / 100) * CHART_H);
                const y = CHART_H - barH;
                const d = new Date(r.date + 'T00:00:00');
                return (
                  <React.Fragment key={r.id}>
                    <Rect x={x} y={y} width={BAR_W} height={barH} rx={6} fill={getScoreColor(r.score)} opacity={0.85} />
                    <SvgText x={x + BAR_W / 2} y={CHART_H + 20} fill={colors.textMuted} fontSize={10} textAnchor="middle">
                      {DAYS_ABBR[d.getDay()]}
                    </SvgText>
                  </React.Fragment>
                );
              })}
              <Line x1={0} y1={CHART_H} x2={CHART_W} y2={CHART_H} stroke={colors.border} strokeWidth={1} />
            </Svg>
          </View>
        )}
        {records.map(record => (
          <View key={record.id} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordDate}>{getRelativeDay(record.date)} — {getDayOfWeek(record.date)}</Text>
              <Text style={[styles.recordScore, { color: getScoreColor(record.score) }]}>{record.score}</Text>
            </View>
            <View style={styles.recordDetails}>
              <Text style={styles.detail}>🕙 {record.bedtime} → {record.wakeTime}</Text>
              <Text style={styles.detail}>⏱ {minutesToHoursString(record.durationMinutes)}</Text>
              {record.wakeups > 0 && <Text style={styles.detail}>😴 {record.wakeups}x acordou</Text>}
            </View>
          </View>
        ))}
        <Button label={t('history.exportCta')} onPress={() => {}} variant="ghost" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.heading2, color: colors.textPrimary },
  avgCard: { backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  avgLabel: { ...typography.label, color: colors.textMuted },
  avgScore: { fontSize: 56, fontWeight: '700', lineHeight: 64 },
  chartContainer: { alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  recordCard: { backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.xs },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recordDate: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  recordScore: { ...typography.heading3, fontWeight: '700' },
  recordDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  detail: { ...typography.label, color: colors.textMuted },
});
