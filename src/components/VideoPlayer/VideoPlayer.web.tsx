/// <reference lib="dom" />
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Hls from 'hls.js';
import { styles, webVideoStyle } from './VideoPlayer.styles';
import { VideoPlayerProps } from './VideoPlayer.types';

// keyCode of the Back button on LG webOS remotes.
const LG_BACK_KEY = 461;

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<View>(null);
  const [paused, setPaused] = useState(false);
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
    overlayRef.current?.focus();
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

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        style={webVideoStyle}
        playsInline
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onError={() => setError('Playback failed')}
      />
      <Pressable ref={overlayRef} style={styles.overlay} onPress={togglePlay}>
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
        <Text style={styles.hint}>OK: play/pause · Back: home</Text>
      </Pressable>
    </View>
  );
};
