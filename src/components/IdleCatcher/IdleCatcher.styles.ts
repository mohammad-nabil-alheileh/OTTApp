import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Invisible and full screen; no focus outline on web either.
  catcher: {
    ...StyleSheet.absoluteFillObject,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
});
