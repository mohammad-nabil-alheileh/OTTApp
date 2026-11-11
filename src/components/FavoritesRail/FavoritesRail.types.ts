import { VODItem } from '../../types/vod';

export interface FavoritesRailProps {
  items: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
}
