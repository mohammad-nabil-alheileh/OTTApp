import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, scaleSize } from '../../styles/theme';

const CARD_WIDTH = scaleSize(320);
const ICON_SIZE = scaleSize(48);

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
    paddingVertical: spacing.md,
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
    aspectRatio: 4 / 3,
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
    fontSize: scaleSize(14),
    fontWeight: 'bold',
    color: colors.text,
  },
  icon: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.border,
  },
  cardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
  },
  channelName: {
    fontSize: scaleSize(18),
    fontWeight: '600',
    lineHeight: scaleSize(24),
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleSize(4),
  },
  category: {
    fontSize: scaleSize(14),
    fontWeight: '400',
    lineHeight: scaleSize(18),
    color: colors.textSecondary,
  },
  loadingContainer: {
    height: scaleSize(240),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
