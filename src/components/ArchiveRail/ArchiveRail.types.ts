import { HomeRow } from '../../hooks/useHomeBack';
import { ArchiveProgramme, LiveChannel } from '../../types/live';
import { LoadFailure } from '../../types/load';

export interface ArchiveRailProps {
  // Already filtered to what is on offer, newest first.
  programmes: ArchiveProgramme[];
  // Used to name each recording's channel.
  channels: LiveChannel[];
  onSelectProgramme: (programme: ArchiveProgramme, channelName: string) => void;
  isLoading: boolean;
  failure: LoadFailure | null;
  onRetry: () => void;
  // Set on the home screen so Back can return focus to the first row.
  homeRow?: HomeRow;
  // Reference time for "today" and days left; tests pin it.
  now?: Date;
}
