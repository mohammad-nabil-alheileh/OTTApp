import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

const ARTWORK_SIZE = scaleSize(440);
const EPISODE_CARD_WIDTH = scaleSize(340);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
    marginLeft: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  author: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  metaText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  // Cancel the first button's margin so the row lines up with the text.
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -spacing.xs,
  },
  // Runs to the screen edge so cards scroll off it instead of being cut at
  // the info column's padding.
  episodes: {
    marginTop: spacing.lg,
    marginRight: -spacing.xxl,
  },
  episodesHeading: {
    ...typography.subheading,
    color: colors.text,
  },
  // Room for the focused card's border and scale-up.
  episodesListContent: {
    paddingVertical: spacing.sm,
    paddingLeft: spacing.xs,
    paddingRight: spacing.xxl,
  },
  episodeCard: {
    width: EPISODE_CARD_WIDTH,
    height: scaleSize(190),
    marginRight: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  episodeCardFocused: {
    borderColor: colors.focus,
    transform: [{ scale: 1.08 }],
  },
  episodeDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  episodeTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginTop: scaleSize(4),
  },
  // Pinned to the bottom so cards line up whatever the title length.
  episodeMeta: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    ...typography.caption,
    color: colors.textSecondary,
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
});
