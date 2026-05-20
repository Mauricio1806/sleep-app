import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GoalOption } from '../types';
import { colors, spacing, radius, typography } from '../../theme';

interface GoalCardProps {
  goal: GoalOption;
  selected: boolean;
  onPress: () => void;
  delay: number;
}

export function GoalCard({ goal, selected, onPress, delay }: GoalCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, delay, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, delay]);

  function handlePress() {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onPress();
  }

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }], flex: 1 }}>
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Text style={styles.emoji}>{goal.emoji}</Text>
        <Text style={[styles.title, selected && styles.titleSelected]}>{goal.title}</Text>
        <Text style={styles.desc}>{goal.description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryFaded },
  emoji: { fontSize: 24, marginBottom: spacing.xs },
  title: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600', marginBottom: spacing.xs },
  titleSelected: { color: colors.primaryLight },
  desc: { ...typography.label, color: colors.textMuted, lineHeight: 16 },
});
