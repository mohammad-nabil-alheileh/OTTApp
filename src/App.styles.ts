import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './styles/theme';

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
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  // The rails are sized to fit the viewport; flexGrow lets them share any
  // leftover height so the home screen fills the screen at any aspect ratio.
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    paddingBottom: spacing.xs,
  },
});
