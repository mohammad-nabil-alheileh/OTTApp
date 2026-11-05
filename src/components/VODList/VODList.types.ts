import { VODItem } from '../../types/vod';

export interface VODListProps {
  vodList: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
  isLoading: boolean;
}
