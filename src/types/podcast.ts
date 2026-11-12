export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  // Length in seconds.
  duration: number;
  releaseDate: string;
  audioUrl: string;
}

export interface Podcast {
  id: string;
  title: string;
  author: string;
  description: string;
  // Square cover art.
  artwork: string;
  category: string;
  // Newest first.
  episodes: PodcastEpisode[];
}

// What the audio player needs to play one episode.
export interface AudioPlayable {
  // Episode id; listening progress is saved under it.
  id: string;
  title: string;
  podcastTitle: string;
  artwork: string;
  url: string;
  // Resume point in seconds.
  startPosition?: number;
}
