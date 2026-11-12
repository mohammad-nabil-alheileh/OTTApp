import { HomeRow } from '../../hooks/useHomeBack';
import { VODItem } from '../../types/vod';

export interface VODListProps {
  vodList: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
  isLoading: boolean;
  // Set on the home screen so Back can return focus to the first row.
  homeRow?: HomeRow;
}
