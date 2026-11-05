import { Playable } from '../../types/playable';

export interface VideoPlayerProps {
  item: Playable;
  onBack: () => void;
}
