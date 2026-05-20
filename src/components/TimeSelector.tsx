import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface TimeSelectorProps {
  value: string;
  onChange: (v: string) => void;
  label: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export function TimeSelector({ value, onChange, label }: TimeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [h, m] = value ? value.split(':') : ['22', '00'];

  function select(hour: string, min: string) {
    onChange(`${hour}:${min}`);
    setOpen(false);
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.value}>{value || '22:00'}</Text>
        <Text style={styles.icon}>🕙</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <View style={styles.columns}>
              <ScrollView style={styles.col} showsVerticalScrollIndicator={false}>
                {HOURS.map(hr => (
                  <TouchableOpacity key={hr} style={[styles.cell, hr === h && styles.cellActive]} onPress={() => select(hr, m)}>
                    <Text style={[styles.cellText, hr === h && styles.cellTextActive]}>{hr}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.colon}>:</Text>
              <ScrollView style={styles.col} showsVerticalScrollIndicator={false}>
                {MINUTES.map(mn => (
                  <TouchableOpacity key={mn} style={[styles.cell, mn === m && styles.cellActive]} onPress={() => select(h, mn)}>
                    <Text style={[styles.cellText, mn === m && styles.cellTextActive]}>{mn}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  icon: { fontSize: 18 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.bgSurface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg },
  sheetTitle: { ...typography.heading3, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.md },
  columns: { flexDirection: 'row', alignItems: 'center', maxHeight: 220 },
  col: { flex: 1 },
  colon: { ...typography.heading2, color: colors.textSecondary, paddingHorizontal: spacing.sm },
  cell: { paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.sm },
  cellActive: { backgroundColor: colors.primaryFaded },
  cellText: { ...typography.body, color: colors.textSecondary },
  cellTextActive: { color: colors.primary, fontWeight: '700' },
});
