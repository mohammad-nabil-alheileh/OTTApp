import { VODItem } from '../../types/vod';

export interface SearchNoResultsProps {
  query: string;
  recommended: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
  recommendedFocusRequest: number;
  onRecommendedFocus: () => void;
}
