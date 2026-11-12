import { Podcast } from '../../types/podcast';

export interface PodcastRailProps {
  // Unique per screen; the web focus manager tracks rails by it.
  groupId: string;
  title: string;
  podcasts: Podcast[];
  onSelectPodcast: (podcast: Podcast) => void;
  // Give this rail initial focus when the screen opens.
  autoFocus?: boolean;
}
