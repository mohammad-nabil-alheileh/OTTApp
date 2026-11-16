import { EpisodeRef, Series } from '../../services/series';
import { WatchProgress } from '../../services/watchHistory';

export interface SeasonEpisodesProps {
  series: Series;
  // Saved positions; episodes in progress show time left and a progress bar.
  watchHistory: WatchProgress[];
  // Season shown first, usually the one holding the episode to resume.
  initialSeasonNumber: number;
  onPlayEpisode: (series: Series, ref: EpisodeRef) => void;
}
