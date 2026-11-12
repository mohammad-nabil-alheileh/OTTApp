import { Podcast, PodcastEpisode } from '../../types/podcast';
import { WatchProgress } from '../../services/progressStore';

export interface PodcastDetailsProps {
  podcast: Podcast;
  // Saved episode positions, used for Resume and the episode progress bars.
  listenHistory: WatchProgress[];
  onPlayEpisode: (podcast: Podcast, episode: PodcastEpisode) => void;
  onBack: () => void;
}
