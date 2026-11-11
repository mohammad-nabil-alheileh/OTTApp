import { VODItem } from '../../types/vod';

export interface ShowDetailsProps {
  item: VODItem;
  // Saved playback position in seconds; shows Resume instead of Play.
  resumePosition?: number;
  // Other VODs shown in the carousel under the buttons.
  relatedItems: VODItem[];
  onPlay: (item: VODItem) => void;
  onPlayTrailer: (item: VODItem) => void;
  // Opens the details of a carousel card.
  onSelectVOD: (item: VODItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: VODItem) => void;
  onBack: () => void;
}
