import { AudioPlayable, Podcast, PodcastEpisode } from '../types/podcast';
import { WatchProgress } from './progressStore';

export interface PodcastCategory {
  category: string;
  podcasts: Podcast[];
}

export interface EpisodeProgress {
  podcast: Podcast;
  episode: PodcastEpisode;
  position: number;
  duration: number;
}

// One rail per category, in the order categories first appear in the feed.
export const groupByCategory = (podcasts: Podcast[]): PodcastCategory[] => {
  const groups = new Map<string, Podcast[]>();
  podcasts.forEach(podcast => {
    const group = groups.get(podcast.category);
    if (group) {
      group.push(podcast);
    } else {
      groups.set(podcast.category, [podcast]);
    }
  });
  return Array.from(groups, ([category, items]) => ({
    category,
    podcasts: items,
  }));
};

// Joins saved positions with their episodes, most recent first. Entries for
// episodes no longer in the feed are dropped.
export const getContinueListening = (
  history: WatchProgress[],
  podcasts: Podcast[],
): EpisodeProgress[] => {
  const byEpisodeId = new Map<
    string,
    { podcast: Podcast; episode: PodcastEpisode }
  >();
  podcasts.forEach(podcast =>
    podcast.episodes.forEach(episode =>
      byEpisodeId.set(episode.id, { podcast, episode }),
    ),
  );
  return history.flatMap(entry => {
    const match = byEpisodeId.get(entry.id);
    return match && entry.position > 0
      ? [{ ...match, position: entry.position, duration: entry.duration }]
      : [];
  });
};

export const toAudioPlayable = (
  podcast: Podcast,
  episode: PodcastEpisode,
  startPosition?: number,
): AudioPlayable => ({
  id: episode.id,
  title: episode.title,
  podcastTitle: podcast.title,
  artwork: podcast.artwork,
  url: episode.audioUrl,
  startPosition:
    startPosition !== undefined && startPosition > 0
      ? startPosition
      : undefined,
});
