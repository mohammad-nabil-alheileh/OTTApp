import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, scaleSize } from '../../styles/theme';

export const styles = StyleSheet.create({
  // The menu is positioned relative to this wrapper.
  container: {
    position: 'relative',
  },
  menu: {
    position: 'absolute',
    bottom: '100%',
    left: spacing.xs,
    right: spacing.xs,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginHorizontal: spacing.xs,
    // Items must not touch: the web arrow-key polyfill ignores a neighbour
    // whose edge is not strictly above/below the focused item.
    marginVertical: scaleSize(4),
    borderRadius: borderRadius.sm,
  },
  optionFocused: {
    backgroundColor: colors.primary,
  },
  check: {
    ...typography.subheading,
    width: scaleSize(40),
    color: colors.text,
  },
  optionText: {
    ...typography.subheading,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.text,
  },
});
