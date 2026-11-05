import React, { useEffect, useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { OptionSelector } from '../OptionSelector/OptionSelector';
import { SelectorOption } from '../OptionSelector/OptionSelector.types';
import { AUTO_QUALITY } from '../../types/quality';
import { clamp, formatTime } from '../../utils/time';
import { sharedStyles } from '../../styles/theme';
import { styles } from './PlayerControls.styles';
import { PlayerControlsProps } from './PlayerControls.types';

const SKIP_SECONDS = 10;
const SPEED_OPTIONS: SelectorOption[] = [0.75, 1, 1.15, 1.25].map(rate => ({
  value: rate,
  label: `${rate}x`,
}));

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
}) => {
  const playButtonRef = useRef<View>(null);

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
      onSeek(clamp(currentTime + seconds, 0, duration));
    }
  };

  return (
    <View style={styles.container}>
      {!isLive && (
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
        />
      )}
      <View style={styles.buttons}>
        {!isLive && (
          <Pressable
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
          ref={playButtonRef}
          hasTVPreferredFocus
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
            title="Speed"
            options={SPEED_OPTIONS}
            value={playbackRate}
            onChange={onPlaybackRateChange}
          />
        )}
        {!isLive && qualities.length > 1 && (
          <OptionSelector
            title="Quality"
            options={qualityOptions}
            value={quality}
            onChange={onQualityChange}
          />
        )}
        {isLive && (
          <Pressable
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
