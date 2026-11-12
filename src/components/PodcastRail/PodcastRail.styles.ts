import { StyleSheet } from 'react-native';
import { colors, scaleSize, spacing } from '../../styles/theme';
import { styles as vodStyles } from '../VODList/VODList.styles';

const CARD_WIDTH = scaleSize(260);

const podcastStyles = StyleSheet.create({
  podcastItem: {
    ...vodStyles.vodItem,
    width: CARD_WIDTH,
  },
  // Cover art is square, unlike the VOD thumbnails.
  artwork: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.border,
  },
  info: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  author: {
    fontSize: scaleSize(14),
    fontWeight: '400',
    lineHeight: scaleSize(18),
    color: colors.textSecondary,
    marginTop: scaleSize(2),
  },
});

// Same rail layout and focus look as the VOD rails.
export const styles = { ...vodStyles, ...podcastStyles };
