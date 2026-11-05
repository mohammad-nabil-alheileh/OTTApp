import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, screen } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingRight: spacing.md,
  },
  vodItem: {
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    width: Math.round(200 * screen.scale),
  },
  thumbnail: {
    width: Math.round(200 * screen.scale),
    height: Math.round(112 * screen.scale),
    backgroundColor: colors.border,
  },
  vodInfo: {
    padding: spacing.sm,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  rating: {
    ...typography.caption,
    color: colors.gold,
    marginBottom: 2,
  },
  duration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  loadingContainer: {
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
