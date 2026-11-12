import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { NowPlaying } from '../NowPlaying/NowPlaying';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useWatchProgress } from '../../hooks/useWatchProgress';
import { listenHistoryStore } from '../../services/listenHistory';
import { styles } from './AudioPlayer.styles';
import { AudioPlayerProps } from './AudioPlayer.types';

// Players may land slightly off the requested time.
const SEEK_MATCH_TOLERANCE_SECONDS = 2;
const SEEK_CONFIRM_TIMEOUT_MS = 3000;

// react-native-video plays audio-only sources too (ExoPlayer / AVPlayer);
// the screen is drawn by NowPlaying instead of a video surface.
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ item, onBack }) => {
  const playerRef = useRef<VideoRef>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

  const markFinished = useWatchProgress(
    { id: item.id, isLive: false, startPosition: item.startPosition },
    currentTime,
    duration,
    listenHistoryStore,
  );

  // Until a seek settles, onProgress can still report the old position and
  // pull the seek bar back, so hold progress until onSeek confirms it.
  const pendingSeekRef = useRef<number | null>(null);
  const pendingSeekTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const clearPendingSeek = useCallback(() => {
    clearTimeout(pendingSeekTimer.current);
    pendingSeekRef.current = null;
  }, []);
  useEffect(() => clearPendingSeek, [clearPendingSeek]);

  const seek = (time: number) => {
    pendingSeekRef.current = time;
    clearTimeout(pendingSeekTimer.current);
    pendingSeekTimer.current = setTimeout(
      clearPendingSeek,
      SEEK_CONFIRM_TIMEOUT_MS,
    );
    playerRef.current?.seek(time);
    setCurrentTime(time);
  };

  const togglePlay = () => {
    // Play after the end starts the episode over.
    if (paused && duration > 0 && currentTime >= duration - 1) {
      seek(0);
    }
    setPaused(p => !p);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={playerRef}
        source={{
          uri: item.url,
          // react-native-video takes the resume point in milliseconds.
          startPosition:
            item.startPosition !== undefined
              ? Math.round(item.startPosition * 1000)
              : undefined,
        }}
        style={styles.hiddenMedia}
        paused={paused}
        rate={playbackRate}
        progressUpdateInterval={250}
        onLoad={e => {
          clearPendingSeek();
          setDuration(e.duration);
        }}
        onBuffer={e => setBuffering(e.isBuffering)}
        onSeek={e => {
          const target = pendingSeekRef.current;
          if (
            target !== null &&
            Math.abs(e.currentTime - target) <= SEEK_MATCH_TOLERANCE_SECONDS
          ) {
            clearPendingSeek();
            setCurrentTime(e.currentTime);
          }
        }}
        onProgress={e => {
          if (pendingSeekRef.current === null) {
            setCurrentTime(e.currentTime);
          }
        }}
        onError={e => setError(e.error.errorString ?? 'Playback failed')}
        onEnd={() => {
          markFinished();
          setPaused(true);
          setCurrentTime(duration);
        }}
      />
      <NowPlaying
        item={item}
        paused={paused}
        buffering={buffering && !error}
        error={error}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        onPlaybackRateChange={setPlaybackRate}
        onTogglePlay={togglePlay}
        onSeek={seek}
      />
    </View>
  );
};
