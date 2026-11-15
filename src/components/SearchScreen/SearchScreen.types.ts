import { LoadFailure } from '../../types/load';
import { VODItem } from '../../types/vod';

export interface SearchScreenProps {
  videos: VODItem[];
  isLoading: boolean;
  failure: LoadFailure | null;
  onRetry: () => void;
  query: string;
  onQueryChange: (update: (query: string) => string) => void;
  onSelectVOD: (vod: VODItem) => void;
  onBack: () => void;
}
