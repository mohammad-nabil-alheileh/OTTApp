import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, scaleSize } from '../../styles/theme';

// Sized so the three home rails fit one 1080p screen without scrolling.
const CARD_WIDTH = scaleSize(300);

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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  vodItem: {
    width: CARD_WIDTH,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  vodItemFocused: {
    borderColor: colors.focus,
    transform: [{ scale: 1.08 }],
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.border,
  },
  // Title sits on the artwork, so cards need no text row underneath.
  cardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  title: {
    ...typography.subheading,
    lineHeight: scaleSize(32),
    color: colors.text,
    flexShrink: 1,
  },
  rating: {
    ...typography.caption,
    lineHeight: scaleSize(24),
    color: colors.gold,
    marginLeft: spacing.xs,
  },
  duration: {
    ...typography.caption,
    lineHeight: scaleSize(24),
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  loadingContainer: {
    height: scaleSize(300),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
