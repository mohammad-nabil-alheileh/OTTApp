import { AdBreak } from '../../types/ads';

export interface AdPlayerProps {
  adBreak: AdBreak;
  // Called once every ad of the break has ended, been skipped or failed.
  onComplete: () => void;
}
