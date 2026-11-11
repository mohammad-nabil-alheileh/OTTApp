import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, scaleSize, screen } from '../../styles/theme';

const KEY_SIZE = scaleSize(72);
const KEY_GAP = scaleSize(8);

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    zIndex: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: screen.width * 0.6,
    marginBottom: spacing.lg,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: scaleSize(2),
    borderColor: colors.border,
  },
  searchIcon: {
    ...typography.heading,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  searchText: {
    ...typography.subheading,
    color: colors.text,
    flex: 1,
  },
  cursor: {
    ...typography.subheading,
    color: colors.primary,
  },
  placeholder: {
    ...typography.subheading,
    color: colors.textSecondary,
  },
  closeButton: {
    marginLeft: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(3),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  closeButtonFocused: {
    borderColor: colors.focus,
    backgroundColor: colors.primary,
  },
  closeButtonText: {
    ...typography.subheading,
    color: colors.text,
  },
  keyboardContainer: {
    alignItems: 'center',
  },
  keyboardRow: {
    flexDirection: 'row',
    marginBottom: KEY_GAP,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: KEY_GAP / 2,
    borderRadius: borderRadius.sm,
    borderWidth: scaleSize(3),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  keyFocused: {
    borderColor: colors.focus,
    backgroundColor: colors.primary,
    transform: [{ scale: 1.15 }],
  },
  keyText: {
    ...typography.subheading,
    color: colors.text,
  },
  wideKey: {
    width: KEY_SIZE * 2 + KEY_GAP,
  },
  extraWideKey: {
    width: KEY_SIZE * 4 + KEY_GAP * 3,
  },
  resultsContainer: {
    marginTop: spacing.md,
    width: screen.width * 0.6,
    maxHeight: screen.height * 0.35,
  },
  noResults: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
