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
  // Just enough room for the focused card's scale-up; the rails are sized to
  // fit the viewport, so the home screen should not need to scroll.
  scrollContent: {
    paddingBottom: spacing.xs,
  },
});
