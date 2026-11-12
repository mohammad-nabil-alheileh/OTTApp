import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, Pressable, View } from 'react-native';
import { AppText as Text } from '../AppText/AppText';
import { useRemoteKeys } from '../../hooks/useRemoteKeys';
import { RemoteKey } from '../../types/remote';
import { clamp, formatTime, skipBy } from '../../utils/time';
import { styles } from './ProgressBar.styles';
import { ProgressBarProps } from './ProgressBar.types';

const SCRUB_STEP_SECONDS = 10;
// Seek once the user stops pressing left/right, instead of on every press.
const COMMIT_DELAY_MS = 800;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  markers = [],
}) => {
  const [focused, setFocused] = useState(false);
  const [scrubTime, setScrubTime] = useState<number | null>(null);
  const scrubTimeRef = useRef<number | null>(null);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hitAreaWidth = useRef(0);

  const commitScrub = useCallback(() => {
    clearTimeout(commitTimer.current);
    if (scrubTimeRef.current !== null) {
      onSeek(scrubTimeRef.current);
      scrubTimeRef.current = null;
      setScrubTime(null);
    }
  }, [onSeek]);

  const handleKey = useCallback(
    (key: RemoteKey) => {
      const from = scrubTimeRef.current ?? currentTime;
      const step = key === 'right' ? SCRUB_STEP_SECONDS : -SCRUB_STEP_SECONDS;
      const next = skipBy(from, step, duration);
      scrubTimeRef.current = next;
      setScrubTime(next);
      clearTimeout(commitTimer.current);
      commitTimer.current = setTimeout(commitScrub, COMMIT_DELAY_MS);
    },
    [currentTime, duration, commitScrub],
  );

  useRemoteKeys(handleKey, focused && duration > 0);
  useEffect(() => () => clearTimeout(commitTimer.current), []);

  const seekToPointer = (e: GestureResponderEvent) => {
    if (hitAreaWidth.current > 0 && duration > 0) {
      const ratio = clamp(e.nativeEvent.locationX / hitAreaWidth.current, 0, 1);
      onSeek(ratio * duration);
    }
  };

  const shownTime = scrubTime ?? currentTime;
  const percent = `${duration > 0 ? (shownTime / duration) * 100 : 0}%` as const;

  return (
    <View style={styles.container}>
      <Pressable
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commitScrub();
        }}
        onPress={commitScrub}
        accessibilityRole="adjustable"
        accessibilityLabel="Playback position"
        accessibilityHint="Left and right skip 10 seconds"
        accessibilityValue={{
          min: 0,
          max: Math.round(duration),
          now: Math.round(shownTime),
          text: `${formatTime(shownTime)} of ${formatTime(duration)}`,
        }}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(shownTime)}
        aria-valuetext={`${formatTime(shownTime)} of ${formatTime(duration)}`}
        accessibilityActions={[
          { name: 'increment', label: 'Forward 10 seconds' },
          { name: 'decrement', label: 'Back 10 seconds' },
        ]}
        onAccessibilityAction={event => {
          if (duration <= 0) {
            return;
          }
          const step =
            event.nativeEvent.actionName === 'increment'
              ? SCRUB_STEP_SECONDS
              : -SCRUB_STEP_SECONDS;
          onSeek(skipBy(currentTime, step, duration));
        }}
      >
        <View
          style={styles.hitArea}
          onLayout={(e: LayoutChangeEvent) => {
            hitAreaWidth.current = e.nativeEvent.layout.width;
          }}
          onStartShouldSetResponder={() => true}
          onResponderRelease={seekToPointer}
        >
          <View style={[styles.track, focused && styles.trackFocused]}>
            <View style={[styles.fill, { width: percent }]} />
          </View>
          {duration > 0 &&
            markers
              .filter(time => time < duration)
              .map(time => (
                <View
                  key={time}
                  style={[styles.marker, { left: `${(time / duration) * 100}%` }]}
                />
              ))}
          <View style={[styles.thumb, focused && styles.thumbFocused, { left: percent }]} />
        </View>
      </Pressable>
      <View style={styles.times}>
        <Text style={[styles.time, scrubTime !== null && styles.timeScrubbing]}>
          {formatTime(shownTime)}
        </Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};
