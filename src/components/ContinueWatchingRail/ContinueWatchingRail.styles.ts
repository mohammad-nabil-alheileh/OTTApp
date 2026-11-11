import { StyleSheet } from 'react-native';
import { colors, scaleSize } from '../../styles/theme';
import { styles as vodStyles } from '../VODList/VODList.styles';

const progressStyles = StyleSheet.create({
  // Sit above the progress bar instead of covering it.
  cardOverlay: {
    ...vodStyles.cardOverlay,
    bottom: scaleSize(6),
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaleSize(6),
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleSize(4),
  },
  remaining: {
    fontSize: scaleSize(14),
    fontWeight: '400',
    lineHeight: scaleSize(18),
    color: colors.textSecondary,
  },
});

// Same card layout as the VOD rail, plus the progress overlay.
export const styles = { ...vodStyles, ...progressStyles };
