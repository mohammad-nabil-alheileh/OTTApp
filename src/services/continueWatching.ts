import { ContinueWatchingItem } from '../components/ContinueWatchingRail/ContinueWatchingRail.types';
import { VODItem } from '../types/vod';
import { WatchProgress } from './progressStore';
import { findSeriesEpisode } from './series';

// Joins watch history with the catalogue. Episodes show as their series card,
// once per series, for the most recent episode (history is newest first).
export const buildContinueWatching = (
  history: WatchProgress[],
  vods: VODItem[],
): ContinueWatchingItem[] => {
  const seen = new Set<string>();
  const items: ContinueWatchingItem[] = [];
  history.forEach(({ id, position, duration }) => {
    const film = vods.find(vod => vod.id === id);
    const found = film ? null : findSeriesEpisode(vods, id);
    const vod = film ?? found?.series;
    if (!vod || seen.has(vod.id)) {
      return;
    }
    seen.add(vod.id);
    items.push({
      vod,
      position,
      duration,
      episode: found
        ? { season: found.season, episode: found.episode }
        : undefined,
    });
  });
  return items;
};
