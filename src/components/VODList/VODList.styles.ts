import { StyleSheet } from 'react-native';
import { RailLayout } from '../../focus/railReveal';
import { colors, spacing, borderRadius, typography, scaleSize } from '../../styles/theme';

const CARD_WIDTH = scaleSize(320);

export const railLayout: RailLayout = {
  cardWidth: CARD_WIDTH,
  cardGap: spacing.md,
  gutter: spacing.xl,
};

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
    paddingHorizontal: railLayout.gutter,
    paddingVertical: spacing.md,
  },
  vodItem: {
    width: railLayout.cardWidth,
    marginRight: railLayout.cardGap,
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
    aspectRatio: 4 / 3,
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
  title: {
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
  rating: {
    fontSize: scaleSize(14),
    fontWeight: '400',
    lineHeight: scaleSize(18),
    color: colors.gold,
    marginRight: spacing.sm,
  },
  duration: {
    fontSize: scaleSize(14),
    fontWeight: '400',
    lineHeight: scaleSize(18),
    color: colors.textSecondary,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
