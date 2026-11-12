import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  screen,
  spacing,
  typography,
} from '../../styles/theme';

const CONTENT_WIDTH = Math.min(scaleSize(1000), screen.width - spacing.xl * 2);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(3),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButtonFocused: {
    borderColor: colors.focus,
    backgroundColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },
  backChevron: {
    ...typography.subheading,
    lineHeight: scaleSize(30),
    color: colors.text,
    marginRight: spacing.xs,
  },
  backText: {
    ...typography.body,
    color: colors.text,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text,
    marginLeft: spacing.md,
  },
  body: {
    width: CONTENT_WIDTH,
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    backgroundColor: colors.cardBackground,
  },
  settingRowFocused: {
    borderColor: colors.focus,
    backgroundColor: '#2a2a2a',
    transform: [{ scale: 1.02 }],
  },
  settingInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  settingTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  settingDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: scaleSize(4),
  },
  badge: {
    minWidth: scaleSize(96),
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: scaleSize(6),
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(2),
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  badgeOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  badgeText: {
    ...typography.body,
    color: colors.text,
  },
  footnote: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
});
