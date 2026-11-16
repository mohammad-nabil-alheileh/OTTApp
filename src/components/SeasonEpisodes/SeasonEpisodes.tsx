import React, { useState } from 'react';
import { FlatList, Image, ListRenderItem, View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useFocusGroup } from '../../focus/useFocusGroup';
import {
  episodeAccessibilityLabel,
  seasonAccessibilityLabel,
} from '../../services/series';
import { VODEpisode } from '../../types/vod';
import { clamp, formatDuration } from '../../utils/time';
import { styles } from './SeasonEpisodes.styles';
import { SeasonEpisodesProps } from './SeasonEpisodes.types';

export const SeasonEpisodes: React.FC<SeasonEpisodesProps> = ({
  series,
  watchHistory,
  initialSeasonNumber,
  onPlayEpisode,
}) => {
  const { seasons } = series;
  const [seasonNumber, setSeasonNumber] = useState(initialSeasonNumber);
  const season =
    seasons.find(s => s.seasonNumber === seasonNumber) ?? seasons[0];
  const { episodes } = season;

  const tabs = useFocusGroup('details-seasons', seasons.length);
  const rail = useFocusGroup('details-episodes', episodes.length);

  const renderEpisode: ListRenderItem<VODEpisode> = ({ item: episode, index }) => {
    const position = watchHistory.find(e => e.id === episode.id)?.position;
    const inProgress = position !== undefined && position > 0;
    const percent = inProgress ? clamp((position / episode.duration) * 100, 0, 100) : 0;
    return (
      <Pressable
        {...rail.getItemProps(index)}
        onPress={() => onPlayEpisode(series, { season, episode })}
        accessibilityRole="button"
        accessibilityLabel={episodeAccessibilityLabel(season, episode, position)}
        accessibilityHint="Plays episode"
        style={({ focused }) => [styles.card, focused && styles.cardFocused]}
      >
        <View aria-hidden>
          <Image
            source={{ uri: episode.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          {inProgress && (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
          )}
        </View>
        <View style={styles.cardBody} aria-hidden>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {`${episode.episodeNumber}. ${episode.title}`}
          </Text>
          <Text style={styles.cardMeta}>
            {inProgress
              ? `${formatDuration(Math.round(episode.duration - position))} left`
              : formatDuration(episode.duration)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs only when there is a choice; one season is just its heading. */}
      {seasons.length > 1 && (
        <View ref={tabs.containerRef} style={styles.tabs} accessibilityRole="tablist">
          {seasons.map((s, index) => {
            const selected = s.seasonNumber === season.seasonNumber;
            return (
              <Pressable
                key={s.seasonNumber}
                {...tabs.getItemProps(index)}
                onPress={() => setSeasonNumber(s.seasonNumber)}
                accessibilityRole="tab"
                accessibilityLabel={seasonAccessibilityLabel(s)}
                accessibilityState={{ selected }}
                aria-selected={selected}
                style={({ focused }) => [
                  styles.tab,
                  selected && styles.tabSelected,
                  focused && styles.tabFocused,
                ]}
              >
                <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
                  {`Season ${s.seasonNumber}`}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
      <View ref={rail.containerRef}>
        {/* Live region: TalkBack reads the new season after a tab press. */}
        <Text
          style={styles.heading}
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
        >
          {`Season ${season.seasonNumber} · ${episodes.length} ${
            episodes.length === 1 ? 'episode' : 'episodes'
          }`}
        </Text>
        <FlatList
          // Remount per season so the rail starts scrolled to episode 1.
          key={season.seasonNumber}
          data={episodes}
          renderItem={renderEpisode}
          keyExtractor={episode => episode.id}
          extraData={rail.activeIndex}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};
