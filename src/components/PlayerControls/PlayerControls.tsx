import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { OptionSelector } from '../OptionSelector/OptionSelector';
import { SelectorOption } from '../OptionSelector/OptionSelector.types';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { AUTO_QUALITY } from '../../types/quality';
import { formatTime, skipBy } from '../../utils/time';
import { sharedStyles } from '../../styles/theme';
import { styles } from './PlayerControls.styles';
import { PlayerControlsProps } from './PlayerControls.types';

const SKIP_SECONDS = 10;
const SPEED_OPTIONS: SelectorOption[] = [0.75, 1, 1.25, 1.5].map(rate => ({
  value: rate,
  label: `x${rate}`,
}));

// Fixed slots keep the indices stable whether or not the live-only controls
// render; the group skips the empty ones.
const SLOT = {
  skipBack: 0,
  play: 1,
  skipForward: 2,
  speed: 3,
  quality: 4,
  goLive: 5,
} as const;
const SLOT_COUNT = 6;

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isLive,
  paused,
  currentTime,
  duration,
  liveState,
  playbackRate,
  onPlaybackRateChange,
  qualities,
  quality,
  onQualityChange,
  onTogglePlay,
  onSeek,
  onGoLive,
  adMarkers,
  onSeekbarFocusChange,
}) => {
  const playButtonRef = useRef<View>(null);

  // Keeps Up/Down between the transport bar and the paused shelf predictable:
  // without a group the polyfill picks whatever sits nearest the focused card,
  // which lands on the seek bar for cards past the right-most button.
  const controls = useFocusGroup('player-controls', SLOT_COUNT);
  const playItem = controls.getItemProps(SLOT.play);
  const playGroupRef = playItem.ref;
  const setPlayRef = useCallback(
    (node: View | null) => {
      playButtonRef.current = node;
      playGroupRef?.(node);
    },
    [playGroupRef],
  );

  // hasTVPreferredFocus is native-only, so the web needs an explicit focus.
  useEffect(() => {
    if (Platform.OS === 'web') {
      playButtonRef.current?.focus();
    }
  }, []);

  const qualityOptions: SelectorOption[] = [
    { value: AUTO_QUALITY, label: 'Auto' },
    ...qualities.map(height => ({ value: height, label: `${height}p` })),
  ];

  const skip = (seconds: number) => {
    if (duration > 0) {
      onSeek(skipBy(currentTime, seconds, duration));
    }
  };

  return (
    <View style={styles.container} ref={controls.containerRef}>
      {!isLive && (
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          markers={adMarkers}
          onFocusChange={onSeekbarFocusChange}
        />
      )}
      <View style={styles.buttons}>
        {!isLive && (
          <Pressable
            {...controls.getItemProps(SLOT.skipBack)}
            accessibilityRole="button"
            accessibilityLabel="Skip back 10 seconds"
            style={({ focused }) => [
              sharedStyles.controlButton,
              focused && sharedStyles.controlButtonFocused,
            ]}
            onPress={() => skip(-SKIP_SECONDS)}
          >
            <Text style={sharedStyles.controlButtonText}>−10s</Text>
          </Pressable>
        )}
        <Pressable
          {...playItem}
          ref={setPlayRef}
          hasTVPreferredFocus
          accessibilityRole="button"
          accessibilityLabel={paused ? 'Play' : 'Pause'}
          accessibilityHint="Toggles playback"
          style={({ focused }) => [
            sharedStyles.controlButton,
            focused && sharedStyles.controlButtonFocused,
          ]}
          onPress={onTogglePlay}
        >
          <Text style={sharedStyles.controlButtonText}>
            {paused ? '▶ Play' : '❚❚ Pause'}
          </Text>
        </Pressable>
        {!isLive && (
          <Pressable
            {...controls.getItemProps(SLOT.skipForward)}
            accessibilityRole="button"
            accessibilityLabel="Skip forward 10 seconds"
            style={({ focused }) => [
              sharedStyles.controlButton,
              focused && sharedStyles.controlButtonFocused,
            ]}
            onPress={() => skip(SKIP_SECONDS)}
          >
            <Text style={sharedStyles.controlButtonText}>+10s</Text>
          </Pressable>
        )}
        {!isLive && (
          <OptionSelector
            focusProps={controls.getItemProps(SLOT.speed)}
            title="Speed"
            options={SPEED_OPTIONS}
            value={playbackRate}
            onChange={onPlaybackRateChange}
          />
        )}
        {!isLive && qualities.length > 1 && (
          <OptionSelector
            focusProps={controls.getItemProps(SLOT.quality)}
            title="Quality"
            options={qualityOptions}
            value={quality}
            onChange={onQualityChange}
          />
        )}
        {isLive && (
          <Pressable
            {...controls.getItemProps(SLOT.goLive)}
            accessibilityRole="button"
            accessibilityLabel={
              liveState.isBehindLive
                ? `Go live, ${formatTime(
                    liveState.secondsBehindLive,
                  )} behind live`
                : 'Live'
            }
            accessibilityHint={
              liveState.isBehindLive ? 'Jumps to the live edge' : undefined
            }
            style={({ focused }) => [
              sharedStyles.controlButton,
              focused && sharedStyles.controlButtonFocused,
            ]}
            onPress={onGoLive}
          >
            {({ focused }) => (
              <Text style={sharedStyles.controlButtonText}>
                <Text
                  style={[
                    liveState.isBehindLive
                      ? styles.liveDotBehind
                      : styles.liveDot,
                    focused && styles.liveDotFocused,
                  ]}
                >
                  ●{' '}
                </Text>
                {liveState.isBehindLive
                  ? `Go LIVE  −${formatTime(liveState.secondsBehindLive)}`
                  : 'LIVE'}
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};
