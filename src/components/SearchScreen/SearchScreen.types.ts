import { LoadFailure } from '../../types/load';
import { EpisodeRef, Series } from '../../services/series';
import { WatchProgress } from '../../services/watchHistory';
import { VODItem } from '../../types/vod';

export interface SearchScreenProps {
  videos: VODItem[];
  isLoading: boolean;
  failure: LoadFailure | null;
  onRetry: () => void;
  query: string;
  onQueryChange: (update: (query: string) => string) => void;
  onSelectVOD: (vod: VODItem) => void;
  // Plays an episode straight from the rail shown when the query names a show.
  onPlayEpisode: (series: Series, ref: EpisodeRef) => void;
  // Saved positions, so episode cards show what is in progress.
  watchHistory: WatchProgress[];
  onBack: () => void;
}
