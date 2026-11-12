import React, { useCallback, useEffect } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { PodcastEpisode } from '../../types/podcast';
import { formatDuration, formatTime } from '../../utils/time';
import { sharedStyles } from '../../styles/theme';
import { styles } from './PodcastDetails.styles';
import { PodcastDetailsProps } from './PodcastDetails.types';

const formatDate = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? isoDate
    : date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
};

export const PodcastDetails: React.FC<PodcastDetailsProps> = ({
  podcast,
  listenHistory,
  onPlayEpisode,
  onBack,
}) => {
  const { episodes } = podcast;
  const latest = episodes[0];
  const latestPosition = latest
    ? listenHistory.find(entry => entry.id === latest.id)?.position
    : undefined;

  // On web the button row and the episode rail are separate focus groups,
  // like the VOD details screen. Both hooks are no-ops on native TV.
  const buttons = useFocusGroup('podcast-buttons', latest ? 1 : 0);
  const episodeRail = useFocusGroup('podcast-episodes', episodes.length);
  const { focusFirst: focusButtons } = buttons;
  const { focusFirst: focusEpisodes } = episodeRail;

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

  // hasTVPreferredFocus is native-only, so the web needs an explicit focus.
  useEffect(() => {
    if (latest) {
      focusButtons();
    } else {
      focusEpisodes();
    }
  }, [latest, focusButtons, focusEpisodes]);

  const renderEpisode: ListRenderItem<PodcastEpisode> = ({
    item: episode,
    index,
  }) => {
    const saved = listenHistory.find(entry => entry.id === episode.id);
    const percent = saved
      ? Math.min(100, (saved.position / saved.duration) * 100)
      : 0;
    return (
      <Pressable
        {...episodeRail.getItemProps(index)}
        onPress={() => onPlayEpisode(podcast, episode)}
        style={({ focused }) => [
          styles.episodeCard,
          focused && styles.episodeCardFocused,
        ]}
      >
        <Text style={styles.episodeDate}>
          {formatDate(episode.releaseDate)}
        </Text>
        <Text style={styles.episodeTitle} numberOfLines={2}>
          {episode.title}
        </Text>
        <Text style={styles.episodeMeta}>
          {saved
            ? `${formatTime(Math.max(0, saved.duration - saved.position))} left`
            : formatDuration(episode.duration)}
        </Text>
        {saved && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: podcast.artwork }}
        style={styles.backdrop}
        resizeMode="cover"
        blurRadius={20}
      />
      <View style={styles.content}>
        <Image
          source={{ uri: podcast.artwork }}
          style={styles.artwork}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {podcast.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {podcast.author}
          </Text>
          <Text style={styles.metaText}>
            {podcast.category} · {episodes.length}{' '}
            {episodes.length === 1 ? 'episode' : 'episodes'}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {podcast.description}
          </Text>
          {latest && (
            <View style={styles.buttons} ref={buttons.containerRef}>
              <Pressable
                {...buttons.getItemProps(0)}
                hasTVPreferredFocus
                style={({ focused }) => [
                  sharedStyles.controlButton,
                  focused && sharedStyles.controlButtonFocused,
                ]}
                onPress={() => onPlayEpisode(podcast, latest)}
              >
                <Text style={sharedStyles.controlButtonText}>
                  {latestPosition !== undefined && latestPosition > 0
                    ? `▶ Resume Latest · ${formatTime(latestPosition)}`
                    : '▶ Play Latest'}
                </Text>
              </Pressable>
            </View>
          )}
          {episodes.length > 0 && (
            <View style={styles.episodes} ref={episodeRail.containerRef}>
              <Text style={styles.episodesHeading}>Episodes</Text>
              <FlatList
                data={episodes}
                renderItem={renderEpisode}
                keyExtractor={episode => episode.id}
                extraData={[episodeRail.activeIndex, listenHistory]}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.episodesListContent}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
