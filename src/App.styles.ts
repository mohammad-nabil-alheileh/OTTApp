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
  // Room below the last row so a focused (scaled-up) card can scroll fully into view.
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
});
