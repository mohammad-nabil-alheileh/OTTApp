import { VODItem } from '../types/vod';

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
