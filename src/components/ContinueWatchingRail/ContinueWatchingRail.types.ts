import { VODItem } from '../../types/vod';

export interface ContinueWatchingRailProps {
  items: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
}
