import { StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

export const styles = StyleSheet.create({
  // Opaque, so it fully covers the paused content player underneath.
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
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
