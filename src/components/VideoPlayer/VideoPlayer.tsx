import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Text, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { styles } from './VideoPlayer.styles';
import { VideoPlayerProps } from './VideoPlayer.types';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onBack }) => {
  const videoRef = useRef<VideoRef>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  const seek = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: item.url }}
        style={styles.video}
        paused={paused}
        resizeMode="contain"
        progressUpdateInterval={250}
        onLoad={e => setDuration(e.duration)}
        onProgress={e => setCurrentTime(e.currentTime)}
        onError={e => setError(e.error.errorString ?? 'Playback failed')}
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
          onTogglePlay={() => setPaused(p => !p)}
          onSeek={seek}
        />
      </View>
    </View>
  );
};
