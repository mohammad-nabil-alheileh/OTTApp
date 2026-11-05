import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, scaleSize } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  button: {
    minWidth: scaleSize(160),
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonFocused: {
    borderColor: colors.focus,
    backgroundColor: colors.primary,
    transform: [{ scale: 1.1 }],
  },
  buttonText: {
    ...typography.subheading,
    color: colors.text,
  },
});
