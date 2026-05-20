import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface ScaleOption {
  label: string;
  emoji: string;
}

interface ScaleSelectorProps {
  value: number;
  onChange: (v: number) => void;
  options: ScaleOption[];
}

export function ScaleSelector({ value, onChange, options }: ScaleSelectorProps) {
  return (
    <View style={styles.row}>
      {options.map((opt, i) => {
        const idx = i + 1;
        const selected = value === idx;
        return (
          <TouchableOpacity
            key={idx}
            style={[styles.item, selected && styles.itemSelected]}
            onPress={() => onChange(idx)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{opt.emoji}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgInput,
  },
  itemSelected: { borderColor: colors.primary, backgroundColor: colors.primaryFaded },
  emoji: { fontSize: 20, marginBottom: 2 },
  label: { ...typography.label, color: colors.textMuted },
  labelSelected: { color: colors.primaryLight },
});
