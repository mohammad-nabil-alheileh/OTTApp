import { EpisodeRef, Series } from '../../services/series';
import { WatchProgress } from '../../services/watchHistory';
import { VODItem } from '../../types/vod';

export interface ShowDetailsProps {
  item: VODItem;
  // Saved playback position in seconds; shows Resume instead of Play.
  resumePosition?: number;
  // Other VODs shown in the carousel under the buttons.
  relatedItems: VODItem[];
  // Saved positions; a series uses them to pick and label its episodes.
  watchHistory: WatchProgress[];
  onPlay: (item: VODItem) => void;
  // Plays one episode of a series (Play button or an episode card).
  onPlayEpisode: (series: Series, ref: EpisodeRef) => void;
  onPlayTrailer: (item: VODItem) => void;
  // Opens the details of a carousel card.
  onSelectVOD: (item: VODItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: VODItem) => void;
  onBack: () => void;
}
