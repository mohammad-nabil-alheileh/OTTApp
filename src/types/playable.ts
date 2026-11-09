import { AdBreak } from './ads';

export interface Playable {
  title: string;
  url: string;
  isLive: boolean;
  // Mid-roll ad breaks (VOD only; ignored for live).
  adBreaks?: AdBreak[];
}
