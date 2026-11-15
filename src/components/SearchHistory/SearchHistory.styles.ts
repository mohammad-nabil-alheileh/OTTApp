import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

export const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  clearButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: scaleSize(4),
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(2),
    borderColor: 'transparent',
  },
  clearButtonFocused: {
    borderColor: colors.focus,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  clearText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  clearTextFocused: {
    color: colors.text,
  },
  listContent: {
    paddingVertical: scaleSize(6),
    paddingRight: spacing.md,
  },
  chip: {
    height: scaleSize(54),
    justifyContent: 'center',
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: scaleSize(27),
    borderWidth: scaleSize(3),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipFocused: {
    borderColor: colors.focus,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    transform: [{ scale: 1.05 }],
  },
  chipText: {
    ...typography.body,
    color: colors.text,
  },
});
