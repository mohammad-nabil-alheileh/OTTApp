import { VODItem } from '../../types/vod';

export interface ShowDetailsProps {
  item: VODItem;
  // Saved playback position in seconds; shows Resume instead of Play.
  resumePosition?: number;
  onPlay: (item: VODItem) => void;
  onPlayTrailer: (item: VODItem) => void;
  onBack: () => void;
}
