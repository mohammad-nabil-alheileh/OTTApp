import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  badgeLabel: {
    ...typography.subheading,
    color: colors.gold,
  },
  badgeText: {
    ...typography.subheading,
    color: colors.text,
  },
  // Ad info on the left, Skip on the right.
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  infoColumn: {
    maxWidth: '60%',
    alignItems: 'flex-start',
  },
  // Same look as the Skip button, mirrored on the left.
  infoButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 0,
  },
  infoPanel: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  infoCaption: {
    ...typography.caption,
    color: colors.gold,
  },
  infoPanelText: {
    ...typography.body,
    color: colors.text,
    marginTop: scaleSize(4),
  },
  skipButton: {
    minWidth: scaleSize(240),
    marginHorizontal: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  skipText: {
    color: colors.textSecondary,
  },
});
