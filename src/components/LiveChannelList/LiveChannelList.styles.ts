import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, scaleSize } from '../../styles/theme';

const CARD_WIDTH = scaleSize(400);
const ICON_SIZE = scaleSize(64);

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
  channelCard: {
    width: CARD_WIDTH,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  channelCardFocused: {
    borderColor: colors.focus,
    transform: [{ scale: 1.08 }],
  },
  banner: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.border,
  },
  liveBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: scaleSize(4),
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
  liveText: {
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.text,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.border,
  },
  textInfo: {
    flex: 1,
  },
  channelName: {
    ...typography.subheading,
    color: colors.text,
  },
  category: {
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
