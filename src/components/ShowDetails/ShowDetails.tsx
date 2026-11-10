import React, { useCallback, useEffect, useRef } from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { useBackHandler } from '../../hooks/useBackHandler';
import { formatDuration, formatTime } from '../../utils/time';
import { sharedStyles } from '../../styles/theme';
import { styles } from './ShowDetails.styles';
import { ShowDetailsProps } from './ShowDetails.types';

export const ShowDetails: React.FC<ShowDetailsProps> = ({
  item,
  resumePosition,
  onPlay,
  onPlayTrailer,
  onBack,
}) => {
  const playButtonRef = useRef<View>(null);

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

  // hasTVPreferredFocus is native-only, so the web needs an explicit focus.
  useEffect(() => {
    if (Platform.OS === 'web') {
      playButtonRef.current?.focus();
    }
  }, []);

  const { trailer } = item;

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.thumbnail }} style={styles.backdrop} resizeMode="cover" />
      <View style={styles.content}>
        <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{item.releaseDate.slice(0, 4)}</Text>
            <Text style={styles.rating}>★ {item.rating}</Text>
            <Text style={styles.metaText}>{formatDuration(item.duration)}</Text>
          </View>
          <Text style={styles.description} numberOfLines={4}>
            {item.description}
          </Text>
          <View style={styles.buttons}>
            <Pressable
              ref={playButtonRef}
              hasTVPreferredFocus
              style={({ focused }) => [
                sharedStyles.controlButton,
                focused && sharedStyles.controlButtonFocused,
              ]}
              onPress={() => onPlay(item)}
            >
              <Text style={sharedStyles.controlButtonText}>
                {resumePosition !== undefined && resumePosition > 0
                  ? `▶ Resume · ${formatTime(resumePosition)}`
                  : '▶ Play'}
              </Text>
            </Pressable>
            {trailer && (
              <Pressable
                style={({ focused }) => [
                  sharedStyles.controlButton,
                  focused && sharedStyles.controlButtonFocused,
                ]}
                onPress={() => onPlayTrailer(item)}
              >
                <Text style={sharedStyles.controlButtonText}>
                  Trailer · {formatTime(trailer.duration)}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
