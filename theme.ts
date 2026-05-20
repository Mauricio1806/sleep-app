import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#0F0E17',
  bgCard: '#1A1928',
  bgSurface: '#22213A',
  bgInput: '#2C2B45',
  primary: '#7C6FF7',
  primaryLight: '#A499F9',
  primaryFaded: 'rgba(124,111,247,0.12)',
  teal: '#4DB8A4',
  tealFaded: 'rgba(77,184,164,0.12)',
  textPrimary: '#F0EFF8',
  textSecondary: '#9896B0',
  textMuted: '#5C5A78',
  border: '#2C2B45',
  error: '#F07070',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
};

export const typography = {
  heading1: { fontSize: 28, fontWeight: '700' as const },
  heading2: { fontSize: 22, fontWeight: '600' as const },
  heading3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '500' as const },
};

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  dotsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
