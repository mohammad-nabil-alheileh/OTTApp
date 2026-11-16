import React, { useEffect } from 'react';
import { FlatList, Image, ListRenderItem, View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useFocusGroup } from '../../focus/useFocusGroup';
import {
  EpisodeRef,
  episodeCode,
  searchEpisodeAccessibilityLabel,
  showEpisodesSummary,
} from '../../services/series';
import { clamp, formatDuration } from '../../utils/time';
import { SearchEpisodesRailProps } from './SearchEpisodesRail.types';
import { styles } from './SearchEpisodesRail.styles';

// Every episode of the show the query names, across all seasons, so a
// viewer can start one straight from Search without opening Details.
export const SearchEpisodesRail: React.FC<SearchEpisodesRailProps> = ({
  show,
  watchHistory,
  onPlayEpisode,
  onFocus,
  focusRequest,
}) => {
  const { series, episodes } = show;
  const { containerRef, getItemProps, activeIndex, focusFirst } = useFocusGroup(
    'search-episodes',
    episodes.length,
  );

  useEffect(() => {
    if (focusRequest) {
      focusFirst();
    }
  }, [focusRequest, focusFirst]);

  const renderEpisode: ListRenderItem<EpisodeRef> = ({ item: ref, index }) => {
    const itemProps = getItemProps(index);
    const { episode } = ref;
    const position = watchHistory.find(e => e.id === episode.id)?.position;
    const inProgress = position !== undefined && position > 0;
    const percent = inProgress
      ? clamp((position / episode.duration) * 100, 0, 100)
      : 0;
    return (
      <Pressable
        {...itemProps}
        onFocus={() => {
          itemProps.onFocus?.();
          onFocus?.();
        }}
        onPress={() => onPlayEpisode(series, ref)}
        accessibilityRole="button"
        accessibilityLabel={searchEpisodeAccessibilityLabel(series, ref, position)}
        accessibilityHint="Plays episode"
        style={({ focused }) => [styles.card, focused && styles.cardFocused]}
      >
        <View aria-hidden>
          <Image
            source={{ uri: episode.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <Text style={styles.code}>{episodeCode(ref)}</Text>
          <View style={styles.overlay}>
            <Text style={styles.episodeTitle} numberOfLines={1}>
              {episode.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {inProgress
                ? `${formatDuration(Math.round(episode.duration - position))} left`
                : formatDuration(episode.duration)}
            </Text>
          </View>
          {inProgress && (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container} ref={containerRef}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
          {`Episodes of ${series.title}`}
        </Text>
        {/* Live region: a new query that names another show is announced. */}
        <Text style={styles.count} accessibilityLiveRegion="polite">
          {showEpisodesSummary(series)}
        </Text>
      </View>
      <FlatList
        // Remount per show so the rail starts scrolled to the first episode.
        key={series.id}
        data={episodes}
        renderItem={renderEpisode}
        keyExtractor={ref => ref.episode.id}
        extraData={activeIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
