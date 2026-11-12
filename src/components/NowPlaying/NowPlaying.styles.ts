import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

const ARTWORK_SIZE = scaleSize(520);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
    marginLeft: spacing.xxl,
  },
  label: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: 'bold',
    letterSpacing: scaleSize(2),
    marginBottom: spacing.xs,
  },
  podcastTitle: {
    ...typography.subheading,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  // Fixed height so the controls don't jump as the status appears and goes.
  status: {
    height: scaleSize(48),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statusText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  errorText: {
    ...typography.body,
    color: colors.primary,
  },
  progress: {
    marginTop: spacing.md,
  },
  // Cancel the first button's margin so the row lines up with the text.
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
    marginLeft: -spacing.xs,
  },
});
