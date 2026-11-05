import React, { useEffect, useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { clamp, formatTime } from '../../utils/time';
import { styles } from './PlayerControls.styles';
import { PlayerControlsProps } from './PlayerControls.types';

const SKIP_SECONDS = 10;

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isLive,
  paused,
  currentTime,
  duration,
  liveState,
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

  const skip = (seconds: number) => {
    if (duration > 0) {
      onSeek(clamp(currentTime + seconds, 0, duration));
    }
  };

  return (
    <View style={styles.container}>
      {!isLive && <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek} />}
      <View style={styles.buttons}>
        {!isLive && (
          <Pressable
            style={({ focused }) => [styles.button, focused && styles.buttonFocused]}
            onPress={() => skip(-SKIP_SECONDS)}
          >
            <Text style={styles.buttonText}>−10s</Text>
          </Pressable>
        )}
        <Pressable
          ref={playButtonRef}
          hasTVPreferredFocus
          style={({ focused }) => [styles.button, focused && styles.buttonFocused]}
          onPress={onTogglePlay}
        >
          <Text style={styles.buttonText}>{paused ? '▶ Play' : '❚❚ Pause'}</Text>
        </Pressable>
        {!isLive && (
          <Pressable
            style={({ focused }) => [styles.button, focused && styles.buttonFocused]}
            onPress={() => skip(SKIP_SECONDS)}
          >
            <Text style={styles.buttonText}>+10s</Text>
          </Pressable>
        )}
        {isLive && (
          <Pressable
            style={({ focused }) => [styles.button, focused && styles.buttonFocused]}
            onPress={onGoLive}
          >
            {({ focused }) => (
              <Text style={styles.buttonText}>
                <Text
                  style={[
                    liveState.isBehindLive ? styles.liveDotBehind : styles.liveDot,
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
