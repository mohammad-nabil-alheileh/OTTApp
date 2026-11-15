import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Text,
  View,
} from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { EpisodeProgress } from '../../services/podcasts';
import { clamp, formatDuration } from '../../utils/time';
import { styles } from './ContinueListeningRail.styles';
import { ContinueListeningRailProps } from './ContinueListeningRail.types';

export const ContinueListeningRail: React.FC<ContinueListeningRailProps> = ({
  items,
  onPlayEpisode,
  autoFocus = false,
}) => {
  const { containerRef, getItemProps, activeIndex, focusFirst } = useFocusGroup(
    'continue-listening-rail',
    items.length,
  );

  // Native uses hasTVPreferredFocus below; the web needs an explicit focus.
  useEffect(() => {
    if (autoFocus) {
      focusFirst();
    }
  }, [autoFocus, focusFirst]);

  if (items.length === 0) {
    return null;
  }

  const renderItem: ListRenderItem<EpisodeProgress> = ({ item, index }) => {
    const { podcast, episode, position, duration } = item;
    const percent =
      duration > 0 ? clamp((position / duration) * 100, 0, 100) : 0;
    return (
      <Pressable
        {...getItemProps(index)}
        hasTVPreferredFocus={autoFocus && index === 0}
        onPress={() => onPlayEpisode(podcast, episode)}
        accessibilityRole="button"
        accessibilityLabel={`${episode.title}, ${podcast.title}, ${formatDuration(
          Math.max(0, duration - position),
        )} left`}
        accessibilityHint="Resumes playback"
        style={({ focused }) => [
          styles.podcastItem,
          focused && styles.vodItemFocused,
        ]}
      >
        <View>
          <Image
            source={{ uri: podcast.artwork }}
            style={styles.artwork}
            resizeMode="cover"
          />
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {episode.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {formatDuration(Math.max(0, duration - position))} left ·{' '}
            {podcast.title}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container} ref={containerRef}>
      <Text style={styles.sectionTitle}>Continue Listening</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.episode.id}
        extraData={activeIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
