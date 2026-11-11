import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

const POSTER_WIDTH = scaleSize(400);
const RELATED_CARD_WIDTH = scaleSize(260);

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
    flexWrap: 'wrap',
    marginLeft: -spacing.xs,
  },
  // Runs to the screen edge so cards scroll off it instead of being cut at
  // the info column's padding.
  related: {
    marginTop: spacing.lg,
    marginRight: -spacing.xxl,
  },
  relatedHeading: {
    ...typography.subheading,
    color: colors.text,
  },
  // Room for the focused card's border and scale-up.
  relatedListContent: {
    paddingVertical: spacing.sm,
    paddingLeft: spacing.xs,
    paddingRight: spacing.xxl,
  },
  relatedItem: {
    width: RELATED_CARD_WIDTH,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  relatedItemFocused: {
    borderColor: colors.focus,
    transform: [{ scale: 1.08 }],
  },
  relatedThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.border,
  },
  relatedOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xs,
    paddingVertical: scaleSize(4),
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  relatedTitle: {
    ...typography.caption,
    color: colors.text,
  },
});
