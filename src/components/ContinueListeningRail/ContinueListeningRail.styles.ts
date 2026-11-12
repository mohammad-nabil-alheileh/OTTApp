import { StyleSheet } from 'react-native';
import { colors, scaleSize } from '../../styles/theme';
import { styles as podcastStyles } from '../PodcastRail/PodcastRail.styles';

const progressStyles = StyleSheet.create({
  // Overlays the bottom edge of the artwork.
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
});

// Same card as the podcast rails, plus the progress bar.
export const styles = { ...podcastStyles, ...progressStyles };
