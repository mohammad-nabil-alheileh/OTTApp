import { SearchedShow } from '../../services/search';
import { EpisodeRef, Series } from '../../services/series';
import { WatchProgress } from '../../services/watchHistory';

export interface SearchEpisodesRailProps {
  show: SearchedShow;
  // Saved positions; episodes in progress show time left and a progress bar.
  watchHistory: WatchProgress[];
  onPlayEpisode: (series: Series, ref: EpisodeRef) => void;
  onFocus?: () => void;
  // Bumped by the search screen when focus should land on the first card.
  focusRequest?: number;
}
