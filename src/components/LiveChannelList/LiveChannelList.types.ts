import { HomeRow } from '../../hooks/useHomeBack';
import { LiveChannel } from '../../types/live';

export interface LiveChannelListProps {
  channels: LiveChannel[];
  onSelectChannel: (channel: LiveChannel) => void;
  isLoading: boolean;
  // Set on the home screen so Back can return focus to the first row.
  homeRow?: HomeRow;
}
