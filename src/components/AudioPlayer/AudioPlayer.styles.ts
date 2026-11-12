import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // The native player still needs a view; audio plays without a visible surface.
  hiddenMedia: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});
