import { LoadFailureKind } from '../../types/load';

export interface RailStatusProps {
  // Focus group id; each rail on a page needs its own.
  groupId: string;
  kind: LoadFailureKind;
  // What failed to load, e.g. "videos" or "live channels".
  subject: string;
  retrying: boolean;
  onRetry: () => void;
  // The rail that owns initial focus puts it on Try again when it fails.
  autoFocus?: boolean;
}
