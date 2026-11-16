import { AdBreak } from './ads';

export interface Trailer {
  url: string;
  // Length in seconds.
  duration: number;
}

export interface VODEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  // Length in seconds.
  duration: number;
  url: string;
  adBreaks?: AdBreak[];
}

export interface VODSeason {
  seasonNumber: number;
  // In airing order.
  episodes: VODEpisode[];
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
  // Set for a series: Play starts an episode instead of `url`.
  seasons?: VODSeason[];
}
