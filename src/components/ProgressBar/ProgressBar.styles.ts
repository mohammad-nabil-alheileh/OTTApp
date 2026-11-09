import { StyleSheet } from 'react-native';
import { colors, spacing, typography, scaleSize } from '../../styles/theme';

const TRACK_HEIGHT = scaleSize(8);
const THUMB_SIZE = scaleSize(24);
const MARKER_WIDTH = scaleSize(6);
const THUMB_SIZE_FOCUSED = scaleSize(36);

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  // Taller than the track so it is easy to hit with a pointer.
  hitArea: {
    height: scaleSize(48),
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  trackFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  // Ad break marker; drawn before the thumb so the thumb stays on top.
  marker: {
    position: 'absolute',
    width: MARKER_WIDTH,
    height: TRACK_HEIGHT,
    marginLeft: -MARKER_WIDTH / 2,
    backgroundColor: colors.gold,
    pointerEvents: 'none',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: -THUMB_SIZE / 2,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.primary,
    pointerEvents: 'none',
  },
  thumbFocused: {
    width: THUMB_SIZE_FOCUSED,
    height: THUMB_SIZE_FOCUSED,
    marginLeft: -THUMB_SIZE_FOCUSED / 2,
    borderRadius: THUMB_SIZE_FOCUSED / 2,
    backgroundColor: colors.focus,
    borderWidth: scaleSize(4),
    borderColor: colors.primary,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  time: {
    ...typography.body,
    color: colors.text,
  },
  timeScrubbing: {
    color: colors.gold,
  },
});
