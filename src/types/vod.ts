import { AdBreak } from './ads';

export interface Trailer {
  url: string;
  // Length in seconds.
  duration: number;
}

export interface VODItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  poster: string;
  releaseDate: string;
  rating: number;
  url: string;
  // Mid-roll ad breaks; omit for ad-free content.
  adBreaks?: AdBreak[];
  trailer?: Trailer;
}
