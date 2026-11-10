import { VODItem } from '../../types/vod';

export interface ContinueWatchingItem {
  vod: VODItem;
  // Saved playback position and stream duration, in seconds.
  position: number;
  duration: number;
}

export interface ContinueWatchingRailProps {
  items: ContinueWatchingItem[];
  onSelectVOD: (vod: VODItem) => void;
}