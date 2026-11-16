import { SavedPlayable } from '../types/playable';
import { VODEpisode, VODItem, VODSeason } from '../types/vod';
import { formatDuration, formatTime } from '../utils/time';
import { WatchProgress } from './progressStore';

export type Series = VODItem & { seasons: VODSeason[] };

export interface EpisodeRef {
  season: VODSeason;
  episode: VODEpisode;
}

export interface ResumeEpisode extends EpisodeRef {
  // Saved position in seconds; unset when the episode starts from the top.
  position?: number;
}

export const isSeries = (vod: VODItem): vod is Series =>
  (vod.seasons?.length ?? 0) > 0;

const episodeRefs = (series: Series): EpisodeRef[] =>
  series.seasons.flatMap(season =>
    season.episodes.map(episode => ({ season, episode })),
  );

export const findSeriesEpisode = (
  vods: VODItem[],
  episodeId: string,
): (EpisodeRef & { series: Series }) | null => {
  for (const vod of vods) {
    if (isSeries(vod)) {
      const ref = episodeRefs(vod).find(r => r.episode.id === episodeId);
      if (ref) {
        return { series: vod, ...ref };
      }
    }
  }
  return null;
};

// Next in the season, else the first episode of the following season.
export const getNextEpisode = (
  series: Series,
  episodeId: string,
): EpisodeRef | null => {
  const refs = episodeRefs(series);
  const index = refs.findIndex(r => r.episode.id === episodeId);
  return index >= 0 && index + 1 < refs.length ? refs[index + 1] : null;
};

// Watch history is newest first and drops finished episodes, so the first
// entry belonging to this series is the one to resume.
export const getResumeEpisode = (
  series: Series,
  history: WatchProgress[],
): ResumeEpisode => {
  const refs = episodeRefs(series);
  for (const entry of history) {
    const ref = refs.find(r => r.episode.id === entry.id);
    if (ref) {
      return {
        ...ref,
        position: entry.position > 0 ? entry.position : undefined,
      };
    }
  }
  return refs[0];
};

export const episodeCode = ({ season, episode }: EpisodeRef) =>
  `S${season.seasonNumber} E${episode.episodeNumber}`;

export const toEpisodePlayable = (
  series: Series,
  ref: EpisodeRef,
  startPosition?: number,
): SavedPlayable => ({
  id: ref.episode.id,
  title: `${series.title} · ${episodeCode(ref)} · ${ref.episode.title}`,
  url: ref.episode.url,
  isLive: false,
  adBreaks: ref.episode.adBreaks,
  startPosition: startPosition && startPosition > 0 ? startPosition : undefined,
});

const plural = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? '' : 's'}`;

export const seasonCountLabel = (series: Series) =>
  plural(series.seasons.length, 'season');

export const seasonAccessibilityLabel = (season: VODSeason) =>
  `Season ${season.seasonNumber}, ${plural(season.episodes.length, 'episode')}`;

export const episodeAccessibilityLabel = (
  season: VODSeason,
  episode: VODEpisode,
  position?: number,
) => {
  const label = `Season ${season.seasonNumber}, episode ${
    episode.episodeNumber
  } of ${season.episodes.length}, ${episode.title}, ${formatDuration(
    episode.duration,
  )}`;
  return position && position > 0
    ? `${label}, ${formatDuration(episode.duration - position)} left`
    : label;
};

// What Play does for any title: a film resumes itself, a series its episode.
export const toPlayable = (
  vod: VODItem,
  history: WatchProgress[],
): SavedPlayable => {
  if (isSeries(vod)) {
    const resume = getResumeEpisode(vod, history);
    return toEpisodePlayable(vod, resume, resume.position);
  }
  const saved = history.find(entry => entry.id === vod.id);
  return {
    id: vod.id,
    title: vod.title,
    url: vod.url,
    isLive: false,
    adBreaks: vod.adBreaks,
    startPosition: saved && saved.position > 0 ? saved.position : undefined,
  };
};

export const playButtonText = (resume: ResumeEpisode) =>
  resume.position
    ? `▶ Resume ${episodeCode(resume)} · ${formatTime(resume.position)}`
    : `▶ Play ${episodeCode(resume)}`;

// Spoken form of an episode code: "season 1, episode 2, Title".
export const spokenEpisode = ({ season, episode }: EpisodeRef) =>
  `season ${season.seasonNumber}, episode ${episode.episodeNumber}, ${episode.title}`;

export const playAccessibilityLabel = (resume: ResumeEpisode) =>
  resume.position
    ? `Resume ${spokenEpisode(resume)}, from ${formatTime(resume.position)}`
    : `Play ${spokenEpisode(resume)}`;

// What a card shows as a title's length: a series has no single runtime.
export const runtimeLabel = (vod: VODItem) =>
  isSeries(vod) ? seasonCountLabel(vod) : formatDuration(vod.duration);
