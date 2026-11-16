import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, scaleSize } from './styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // The wordmark is a focus stop, so the ring's box is reserved outside the
  // text: focus never shifts it off the rails' left edge or grows the header.
  headerText: {
    // Sized to the wordmark, not the row: a full-width stop centres over the
    // middle of the rail, so Down would land in the middle instead of card one.
    alignSelf: 'center',
    marginHorizontal: -(spacing.sm + scaleSize(3)),
    marginVertical: -(spacing.xs + scaleSize(3)),
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: scaleSize(3),
    borderColor: 'transparent',
    borderRadius: borderRadius.md,
  },
  headerTextFocused: {
    borderColor: colors.focus,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(3),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButtonSpacing: {
    marginRight: spacing.sm,
  },
  searchButtonFocused: {
    borderColor: colors.focus,
    backgroundColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },
  searchButtonSpacing: {
    marginRight: spacing.sm,
  },
  searchButtonIcon: {
    ...typography.heading,
    marginRight: spacing.xs,
  },
  searchButtonLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  // Square icon-only button that matches the search button's height.
  iconButton: {
    width: scaleSize(68),
    height: scaleSize(68),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(3),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  // Initials stand in for a profile photo in the account button.
  accountInitials: {
    ...typography.subheading,
    color: colors.text,
  },
  // Text-presentation gear (U+FE0E) so it renders as a monochrome glyph, not
  // an emoji that some TV browsers leave out.
  settingsIcon: {
    fontSize: scaleSize(34),
    lineHeight: scaleSize(42),
    color: colors.text,
  },
  // Room below the last row so a focused (scaled-up) card can scroll fully into view.
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    paddingBottom: spacing.xs,
  },
});
