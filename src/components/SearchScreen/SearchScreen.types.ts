import { VODItem } from '../../types/vod';

export interface SearchScreenProps {
  videos: VODItem[];
  isLoading: boolean;
  query: string;
  onQueryChange: (update: (query: string) => string) => void;
  onSelectVOD: (vod: VODItem) => void;
  onBack: () => void;
}
