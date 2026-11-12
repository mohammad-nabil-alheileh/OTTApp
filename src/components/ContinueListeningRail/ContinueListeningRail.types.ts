import { Podcast, PodcastEpisode } from '../../types/podcast';
import { EpisodeProgress } from '../../services/podcasts';

export interface ContinueListeningRailProps {
  items: EpisodeProgress[];
  // Resumes the episode straight away.
  onPlayEpisode: (podcast: Podcast, episode: PodcastEpisode) => void;
  // Give this rail initial focus when the screen opens.
  autoFocus?: boolean;
}
