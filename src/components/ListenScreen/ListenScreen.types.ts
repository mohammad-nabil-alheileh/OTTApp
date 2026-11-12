import { Podcast, PodcastEpisode } from '../../types/podcast';
import { EpisodeProgress } from '../../services/podcasts';

export interface ListenScreenProps {
  podcasts: Podcast[];
  isLoading: boolean;
  // In-progress episodes, most recently played first.
  continueListening: EpisodeProgress[];
  onSelectPodcast: (podcast: Podcast) => void;
  onPlayEpisode: (podcast: Podcast, episode: PodcastEpisode) => void;
  onBack: () => void;
}
