import { HomeRow } from '../../hooks/useHomeBack';
import { VODItem } from '../../types/vod';

export interface FavoritesRailProps {
  items: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
  // Set on the home screen so Back can return focus to the first row.
  homeRow?: HomeRow;
}
