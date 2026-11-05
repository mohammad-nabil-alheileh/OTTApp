import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, scaleSize } from '../../styles/theme';

const CARD_WIDTH = scaleSize(400);

export const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
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
  vodInfo: {
    padding: spacing.sm,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  rating: {
    ...typography.caption,
    color: colors.gold,
  },
  duration: {
    ...typography.caption,
    color: colors.textSecondary,
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
