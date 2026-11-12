import { AudioPlayable } from '../../types/podcast';

export interface AudioPlayerProps {
  item: AudioPlayable;
  onBack: () => void;
}
