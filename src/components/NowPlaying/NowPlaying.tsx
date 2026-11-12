import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { OptionSelector } from '../OptionSelector/OptionSelector';
import { SelectorOption } from '../OptionSelector/OptionSelector.types';
import { colors, sharedStyles } from '../../styles/theme';
import { skipBy } from '../../utils/time';
import { styles } from './NowPlaying.styles';
import { NowPlayingProps } from './NowPlaying.types';

// Podcast-app convention: a short step back to re-hear a line, a longer one
// forward to skip ahead.
const SKIP_BACK_SECONDS = 15;
const SKIP_FORWARD_SECONDS = 30;
const SPEED_OPTIONS: SelectorOption[] = [0.75, 1, 1.25, 1.5, 2].map(rate => ({
  value: rate,
  label: `x${rate}`,
}));

// Audio player screen: artwork, titles, seek bar and transport controls. The
// platform AudioPlayer owns the media element and passes its state in.
export const NowPlaying: React.FC<NowPlayingProps> = ({
  item,
  paused,
  buffering,
  error,
  currentTime,
  duration,
  playbackRate,
  onPlaybackRateChange,
  onTogglePlay,
  onSeek,
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
      onSeek(skipBy(currentTime, seconds, duration));
    }
  };

  let status: React.ReactNode = null;
  if (error) {
    status = <Text style={styles.errorText}>{error}</Text>;
  } else if (buffering) {
    status = (
      <>
        <ActivityIndicator color={colors.text} />
        <Text style={styles.statusText}>Loading…</Text>
      </>
    );
  } else if (paused) {
    status = <Text style={styles.statusText}>❚❚ Paused</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.artwork }}
        style={styles.backdrop}
        resizeMode="cover"
        blurRadius={20}
      />
      <View style={styles.content}>
        <Image
          source={{ uri: item.artwork }}
          style={styles.artwork}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.label}>NOW PLAYING</Text>
          <Text style={styles.podcastTitle} numberOfLines={1}>
            {item.podcastTitle}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.status}>{status}</View>
          <View style={styles.progress}>
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={onSeek}
            />
          </View>
          <View style={styles.buttons}>
            <Pressable
              style={({ focused }) => [
                sharedStyles.controlButton,
                focused && sharedStyles.controlButtonFocused,
              ]}
              onPress={() => skip(-SKIP_BACK_SECONDS)}
            >
              <Text style={sharedStyles.controlButtonText}>
                −{SKIP_BACK_SECONDS}s
              </Text>
            </Pressable>
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
            <Pressable
              style={({ focused }) => [
                sharedStyles.controlButton,
                focused && sharedStyles.controlButtonFocused,
              ]}
              onPress={() => skip(SKIP_FORWARD_SECONDS)}
            >
              <Text style={sharedStyles.controlButtonText}>
                +{SKIP_FORWARD_SECONDS}s
              </Text>
            </Pressable>
            <OptionSelector
              title="Speed"
              options={SPEED_OPTIONS}
              value={playbackRate}
              onChange={onPlaybackRateChange}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
