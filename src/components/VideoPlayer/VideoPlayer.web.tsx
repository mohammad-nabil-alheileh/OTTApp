/// <reference lib="dom" />
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Hls from 'hls.js';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { styles, webVideoStyle } from './VideoPlayer.styles';
import { VideoPlayerProps } from './VideoPlayer.types';

// keyCode of the Back button on LG webOS remotes.
const LG_BACK_KEY = 461;

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const isHls = item.url.includes('.m3u8');
    let hls: Hls | undefined;

    // Prefer hls.js (same behaviour on every TV); native HLS is the fallback
    // for browsers without Media Source Extensions.
    if (isHls && Hls.isSupported()) {
      hls = new Hls();
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError(`Stream failed: ${data.details}`);
        }
      });
      hls.loadSource(item.url);
      hls.attachMedia(video);
    } else {
      video.src = item.url;
    }
    video.play().catch(() => setPaused(true));

    return () => {
      hls?.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [item.url]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === LG_BACK_KEY || e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onBack]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused) {
      video.play().catch(() => setPaused(true));
    } else {
      video.pause();
    }
  };

  const seek = (time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        style={webVideoStyle}
        playsInline
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
        // Live streams report Infinity; the controls hide the bar for live anyway.
        onDurationChange={e => {
          const d = e.currentTarget.duration;
          setDuration(Number.isFinite(d) ? d : 0);
        }}
        onError={() => setError('Playback failed')}
      />
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {item.isLive && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>● LIVE</Text>
            </View>
          )}
        </View>
        <View style={styles.center}>
          {error ? (
            <Text style={styles.statusText}>{error}</Text>
          ) : (
            paused && <Text style={styles.statusText}>❚❚ Paused</Text>
          )}
        </View>
        <PlayerControls
          isLive={item.isLive}
          paused={paused}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={togglePlay}
          onSeek={seek}
        />
      </View>
    </View>
  );
};
