import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

// Slightly narrower than a result card so the message and rail fit in the
// space the results rail leaves behind, with a margin below the cards.
const CARD_WIDTH = scaleSize(260);

export const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  listContent: {
    paddingVertical: spacing.xs,
  },
  cardShell: {
    width: CARD_WIDTH,
    marginRight: spacing.md,
  },
  card: {
    width: '100%',
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
  overlay: {
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
});
