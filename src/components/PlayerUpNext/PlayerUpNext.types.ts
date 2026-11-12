import { VODItem } from '../../types/vod';

export interface PlayerUpNextProps {
  items: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
  // fullScreen covers the finished frame; bottom is the shelf shown while paused.
  variant?: 'fullScreen' | 'bottom';
  // Only the end state pulls focus, so pausing leaves the play button focused.
  autoFocus?: boolean;
}
