import { AdBreak } from './ads';

export interface Playable {
  title: string;
  url: string;
  isLive: boolean;
  // VOD id; set only for content whose progress is saved (not live/trailers).
  id?: string;
  // Resume point in seconds, from Continue Watching.
  startPosition?: number;
  // Mid-roll ad breaks (VOD only; ignored for live).
  adBreaks?: AdBreak[];
}
