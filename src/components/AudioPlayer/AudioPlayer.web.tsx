/// <reference lib="dom" />
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { NowPlaying } from '../NowPlaying/NowPlaying';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useWatchProgress } from '../../hooks/useWatchProgress';
import { listenHistoryStore } from '../../services/listenHistory';
import { styles } from './AudioPlayer.styles';
import { AudioPlayerProps } from './AudioPlayer.types';

// Web / LG webOS: a plain <audio> element (MP3 needs no hls.js).
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ item, onBack }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.src = item.url;
    // Autoplay can be blocked until the user interacts; show Play instead.
    audio.play().catch(() => setPaused(true));
    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  }, [item.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // defaultPlaybackRate too, because loading a source resets playbackRate to it.
      audio.defaultPlaybackRate = playbackRate;
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

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

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      // play() after the end starts over on its own.
      audio.play().catch(() => setPaused(true));
    } else {
      audio.pause();
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <View style={styles.container}>
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onWaiting={() => setBuffering(true)}
        onSeeking={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        // Ignore positions reported mid-seek so the seek bar doesn't jump back.
        onTimeUpdate={e => {
          if (!e.currentTarget.seeking) {
            setCurrentTime(e.currentTarget.currentTime);
          }
        }}
        onSeeked={e => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={e => {
          if (item.startPosition !== undefined) {
            e.currentTarget.currentTime = item.startPosition;
          }
        }}
        onDurationChange={e => {
          const d = e.currentTarget.duration;
          setDuration(Number.isFinite(d) ? d : 0);
        }}
        onEnded={markFinished}
        onError={() => {
          setError('Playback failed');
          setBuffering(false);
        }}
      />
      <NowPlaying
        item={item}
        paused={paused}
        buffering={buffering}
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
