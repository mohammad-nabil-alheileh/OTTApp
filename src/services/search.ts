import { VODItem } from '../types/vod';
import { EpisodeRef, episodeRefs, isSeries, Series } from './series';

// Lowercase and strip diacritics so "amelie" finds "Amélie".
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const tokensOf = (query: string) =>
  normalize(query).split(/\s+/).filter(Boolean);

// Every query token must appear somewhere; title hits rank above
// description/meta hits so the closest match comes first.
export const searchVideos = (videos: VODItem[], query: string): VODItem[] => {
  const tokens = tokensOf(query);
  if (tokens.length === 0) {
    return videos;
  }

  return videos
    .map(video => {
      const title = normalize(video.title);
      const description = normalize(video.description);
      const meta = normalize(
        `${video.releaseDate.slice(0, 4)} ${video.rating}`,
      );
      const haystack = `${title} ${description} ${meta}`;

      let score = 0;
      for (const token of tokens) {
        if (!haystack.includes(token)) {
          return { video, score: -1 };
        }
        if (title.startsWith(token)) {
          score += 3;
        } else if (title.includes(token)) {
          score += 2;
        } else {
          score += 1;
        }
      }
      return { video, score };
    })
    .filter(result => result.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.video);
};

// A dead-end search still needs somewhere to go, so suggest the best-rated
// titles. Copy before sorting so the caller's list keeps its order.
export const getRecommendedVideos = (
  videos: VODItem[],
  limit = 12,
): VODItem[] =>
  [...videos].sort((a, b) => b.rating - a.rating).slice(0, limit);

export interface SearchedShow {
  series: Series;
  episodes: EpisodeRef[];
}

// The show the query names: the first series in the results whose title holds
// every query word. A description-only hit is too loose to list episodes for.
export const findSearchedShow = (
  results: VODItem[],
  query: string,
): SearchedShow | null => {
  const tokens = tokensOf(query);
  if (tokens.length === 0) {
    return null;
  }
  for (const video of results) {
    const title = normalize(video.title);
    if (isSeries(video) && tokens.every(token => title.includes(token))) {
      return { series: video, episodes: episodeRefs(video) };
    }
  }
  return null;
};
