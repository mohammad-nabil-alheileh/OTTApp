import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  liveDot: {
    color: colors.primary,
  },
  liveDotBehind: {
    color: colors.textSecondary,
  },
  // A focused button is red, so a red dot would disappear.
  liveDotFocused: {
    color: colors.text,
  },
});
