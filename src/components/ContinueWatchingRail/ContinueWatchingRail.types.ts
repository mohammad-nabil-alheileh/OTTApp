import { HomeRow } from '../../hooks/useHomeBack';
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
  // Set on the home screen so Back can return focus to the first row.
  homeRow?: HomeRow;
}