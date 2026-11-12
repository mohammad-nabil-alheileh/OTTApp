import { Playable } from '../../types/playable';
import { VODItem } from '../../types/vod';

export interface VideoPlayerProps {
  item: Playable;
  onBack: () => void;
  // Titles offered in the "Up Next" rail once a VOD finishes.
  recommendedItems?: VODItem[];
  onSelectRecommended?: (vod: VODItem) => void;
}
