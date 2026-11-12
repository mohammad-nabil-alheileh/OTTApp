import { Animated } from 'react-native';
import { VODItem } from '../../types/vod';

export interface SearchRecommendedRailProps {
  items: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
  onFocus?: () => void;
  // Bumped by the search screen when focus should land on the first card.
  focusRequest?: number;
  // Shared 0→1 clock from the no-results state; the heading and cards stagger
  // off it so the whole empty state enters as one sequence.
  entranceProgress: Animated.Value;
}
