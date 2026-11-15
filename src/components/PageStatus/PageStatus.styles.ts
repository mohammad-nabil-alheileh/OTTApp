import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

const BADGE_SIZE = scaleSize(104);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  panel: {
    alignItems: 'center',
    maxWidth: scaleSize(900),
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scaleSize(3),
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  badgeError: {
    borderColor: 'rgba(229, 9, 20, 0.7)',
    backgroundColor: 'rgba(229, 9, 20, 0.16)',
  },
  badgeMark: {
    ...typography.heading,
    fontSize: scaleSize(56),
    lineHeight: scaleSize(70),
    color: colors.text,
  },
  badgeMarkError: {
    color: colors.primary,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  retry: {
    minWidth: scaleSize(220),
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  retryFocused: {
    borderColor: colors.focus,
    backgroundColor: colors.primary,
    transform: [{ scale: 1.08 }],
  },
  retryText: {
    ...typography.subheading,
    color: colors.text,
  },
});
