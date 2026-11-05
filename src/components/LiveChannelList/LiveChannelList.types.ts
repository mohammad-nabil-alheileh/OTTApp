import { LiveChannel } from '../../types/live';

export interface LiveChannelListProps {
  channels: LiveChannel[];
  onSelectChannel: (channel: LiveChannel) => void;
  isLoading: boolean;
}
