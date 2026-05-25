import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { getScoreColor, getScoreLabel } from '../utils/sleepCalculations';
import { colors, typography } from '../../theme';

interface SleepScoreCircleProps {
  score: number;
  size?: number;
}

export function SleepScoreCircle({ score, size = 140 }: SleepScoreCircleProps) {
  const animScore = useRef(new Animated.Value(0)).current;
  const radius = (size - 16) / 2;
  const scoreColor = getScoreColor(score);
  const label = getScoreLabel(score);

  useEffect(() => {
    Animated.spring(animScore, {
      toValue: score,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [score, animScore]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={8}
          stroke={colors.bgSurface}
          fill="none"
        />
      </Svg>
      <View style={[styles.center, { width: size, height: size }]}>
        <Text style={[styles.score, { color: scoreColor }]}>{score}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  score: { ...typography.heading1, fontWeight: '700' },
  label: { ...typography.label, color: colors.textSecondary, marginTop: 2 },
});
