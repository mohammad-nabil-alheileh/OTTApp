import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

export const EPISODE_CARD_WIDTH = scaleSize(300);
export const FOCUSED_SCALE = 1.08;

export const styles = StyleSheet.create({
  // Runs to the screen edge so cards scroll off it instead of being cut at
  // the info column's padding.
  container: {
    marginTop: spacing.lg,
    marginRight: -spacing.xxl,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -spacing.xs,
    marginBottom: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: scaleSize(3),
    borderColor: colors.border,
  },
  tabSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  tabFocused: {
    borderColor: colors.focus,
    transform: [{ scale: FOCUSED_SCALE }],
  },
  tabText: {
    ...typography.body,
    color: colors.text,
  },
  tabTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },
  heading: {
    ...typography.subheading,
    color: colors.text,
  },
  // The list clips its children, so the left padding must cover the focused
  // card's scale-up; the negative margin keeps the first card in place.
  list: {
    marginLeft: spacing.xs - spacing.md,
  },
  listContent: {
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.xxl,
  },
  card: {
    width: EPISODE_CARD_WIDTH,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  cardFocused: {
    borderColor: colors.focus,
    transform: [{ scale: FOCUSED_SCALE }],
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.border,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaleSize(6),
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  cardBody: {
    paddingHorizontal: spacing.xs,
    paddingVertical: scaleSize(6),
  },
  cardTitle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  cardMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
