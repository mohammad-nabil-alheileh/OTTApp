import { Ad } from '../../types/ads';

export interface AdOverlayProps {
  ad: Ad;
  // 0-based position of this ad in its break.
  index: number;
  count: number;
  position: number;
  duration: number;
  loaded: boolean;
  onSkip: () => void;
}
