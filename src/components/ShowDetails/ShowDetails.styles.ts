import { StyleSheet } from 'react-native';
import { borderRadius, colors, scaleSize, spacing, typography } from '../../styles/theme';

const POSTER_WIDTH = scaleSize(400);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  poster: {
    width: POSTER_WIDTH,
    aspectRatio: 2 / 3,
    borderRadius: borderRadius.md,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
    marginLeft: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metaText: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  rating: {
    ...typography.body,
    color: colors.gold,
    marginRight: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  // Cancel the first button's margin so the row lines up with the text.
  buttons: {
    flexDirection: 'row',
    marginLeft: -spacing.xs,
  },
});
