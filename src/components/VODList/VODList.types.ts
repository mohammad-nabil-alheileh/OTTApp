import { HomeRow } from '../../hooks/useHomeBack';
import { LoadFailure } from '../../types/load';
import { VODItem } from '../../types/vod';

export interface VODListProps {
  vodList: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
  isLoading: boolean;
  failure: LoadFailure | null;
  onRetry: () => void;
  // Set on the home screen so Back can return focus to the first row.
  homeRow?: HomeRow;
}
