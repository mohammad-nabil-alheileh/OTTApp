import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    ...typography.heading,
    color: colors.text,
    flexShrink: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    ...typography.heading,
    color: colors.text,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
});

// The web player renders a DOM <video>, which takes CSS rather than RN styles.
export const webVideoStyle = {
  position: 'absolute' as const,
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain' as const,
  backgroundColor: colors.background,
};
