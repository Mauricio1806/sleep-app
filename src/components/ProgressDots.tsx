import React from 'react';
import { View } from 'react-native';
import { sharedStyles } from '../../theme';

interface ProgressDotsProps {
  current: number;
  total: number;
}

export function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <View style={sharedStyles.dotsRow}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={i + 1 === current ? sharedStyles.dotActive : sharedStyles.dot} />
      ))}
    </View>
  );
}

