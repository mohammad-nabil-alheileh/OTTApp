import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

const BADGE_SIZE = scaleSize(56);

export const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  // A rail-shaped card: the row keeps its title above and the rest of the page
  // stays untouched, so a failed row reads as one broken shelf, not an outage.
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: scaleSize(980),
    minHeight: scaleSize(168),
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: scaleSize(3),
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  cardError: {
    borderColor: 'rgba(229, 9, 20, 0.55)',
  },
  cardFocused: {
    borderColor: colors.focus,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ scale: 1.01 }],
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scaleSize(2),
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  badgeError: {
    borderColor: 'rgba(229, 9, 20, 0.7)',
    backgroundColor: 'rgba(229, 9, 20, 0.16)',
  },
  badgeMark: {
    ...typography.subheading,
    fontSize: scaleSize(32),
    lineHeight: scaleSize(40),
    color: colors.text,
  },
  badgeMarkError: {
    color: colors.primary,
  },
  textBlock: {
    flexShrink: 1,
    flexGrow: 1,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: scaleSize(4),
  },
  retry: {
    marginLeft: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(2),
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  retryText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
});
