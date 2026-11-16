import { StyleSheet } from 'react-native';
import { scaleSize } from '../../styles/theme';

export const styles = StyleSheet.create({
  // Fills the row's height so it sits beside the last card, the nearest target to its right.
  footer: {
    alignSelf: 'stretch',
  },
  stop: {
    flex: 1,
    width: scaleSize(4),
  },
});
