import { VODItem } from '../../types/vod';

export interface ShowDetailsProps {
  item: VODItem;
  onPlay: (item: VODItem) => void;
  onPlayTrailer: (item: VODItem) => void;
  onBack: () => void;
}
