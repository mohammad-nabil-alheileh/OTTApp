import { HomeRow } from '../../hooks/useHomeBack';
import { LiveChannel } from '../../types/live';
import { LoadFailure } from '../../types/load';

export interface LiveChannelListProps {
  channels: LiveChannel[];
  onSelectChannel: (channel: LiveChannel) => void;
  isLoading: boolean;
  failure: LoadFailure | null;
  onRetry: () => void;
  // Set on the home screen so Back can return focus to the first row.
  homeRow?: HomeRow;
}
