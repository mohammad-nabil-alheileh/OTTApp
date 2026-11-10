import { StyleSheet } from 'react-native';
import { colors, scaleSize, typography } from '../../styles/theme';
import { styles as vodStyles } from '../VODList/VODList.styles';

const progressStyles = StyleSheet.create({
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
  remaining: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

// Same card layout as the VOD rail, plus the progress overlay.
export const styles = { ...vodStyles, ...progressStyles };