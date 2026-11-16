import { StyleSheet } from 'react-native';
import { RailLayout } from '../../focus/railReveal';
import { borderRadius, colors, scaleSize, spacing, typography } from '../../styles/theme';

export const railLayout: RailLayout = {
  cardWidth: scaleSize(320),
  cardGap: spacing.md,
  gutter: spacing.xl,
};

export const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.xl,
  },
  listContent: {
    paddingHorizontal: railLayout.gutter,
    paddingVertical: spacing.md,
  },
  loadingContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    width: railLayout.cardWidth,
    marginRight: railLayout.cardGap,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  cardFocused: {
    borderColor: colors.focus,
    transform: [{ scale: 1.08 }],
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.border,
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: scaleSize(2),
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  badgeText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  cardBody: {
    paddingHorizontal: spacing.xs,
    paddingVertical: scaleSize(6),
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
