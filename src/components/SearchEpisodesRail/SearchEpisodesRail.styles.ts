import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';
import { KEYBOARD_WIDTH } from '../SearchKeyboard/SearchKeyboard.styles';

// Four episode cards fill the search column, so they read as a step below
// the three result cards above them.
const CARD_WIDTH = Math.floor((KEYBOARD_WIDTH - spacing.sm * 4) / 4);

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    flexShrink: 1,
  },
  count: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  listContent: {
    paddingVertical: spacing.xs,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
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
  code: {
    ...typography.caption,
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    color: colors.text,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
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
  body: {
    paddingHorizontal: spacing.xs,
    paddingVertical: scaleSize(4),
  },
  episodeTitle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
