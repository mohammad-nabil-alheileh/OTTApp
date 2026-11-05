import React, { useEffect, useState } from 'react';
import { BackHandler, Pressable, Text, View } from 'react-native';
import Video from 'react-native-video';
import { styles } from './VideoPlayer.styles';
import { VideoPlayerProps } from './VideoPlayer.types';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onBack }) => {
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: item.url }}
        style={styles.video}
        paused={paused}
        resizeMode="contain"
        onError={e => setError(e.error.errorString ?? 'Playback failed')}
      />
      <Pressable hasTVPreferredFocus style={styles.overlay} onPress={() => setPaused(p => !p)}>
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
