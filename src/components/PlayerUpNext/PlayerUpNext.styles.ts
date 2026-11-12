import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

const OVERLAY_CARD_WIDTH = scaleSize(300);
const BOTTOM_CARD_WIDTH = scaleSize(240);

export const styles = StyleSheet.create({
  // Covers the finished frame and the controls underneath, so only the rail
  // is reachable when playback has ended.
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
  },
  // Sits beneath the transport controls while paused: a compact shelf that
  // leaves the rest of the frame visible.
  bottom: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  bottomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  accent: {
    width: scaleSize(6),
    height: scaleSize(28),
    borderRadius: scaleSize(3),
    marginRight: spacing.sm,
    backgroundColor: colors.primary,
  },
  bottomTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  list: {
    // Hug the cards so the heading and rail centre as one block; a FlatList
    // otherwise grows to the full height of the player.
    flexGrow: 0,
  },
  listContent: {
    // The inset lives inside the scroll view so the focus scale has room to
    // grow; padding on the wrapper would clip the scaled card at the edge.
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs,
  },
  card: {
    // Hug the thumbnail instead of stretching to the rail's full height.
    alignSelf: 'flex-start',
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  overlayCard: {
    width: OVERLAY_CARD_WIDTH,
  },
  bottomCard: {
    width: BOTTOM_CARD_WIDTH,
  },
  cardFocused: {
    borderColor: colors.focus,
    transform: [{ scale: 1.06 }],
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.border,
  },
  cardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  cardTitle: {
    ...typography.body,
    lineHeight: scaleSize(28),
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    lineHeight: scaleSize(24),
    color: colors.textSecondary,
  },
  star: {
    color: colors.gold,
  },
});
