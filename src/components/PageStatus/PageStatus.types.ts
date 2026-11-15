import { LoadFailureKind } from '../../types/load';

export interface PageStatusProps {
  // Focus group id; one status panel is mounted per screen.
  groupId: string;
  kind: LoadFailureKind;
  // What the page could not load, e.g. "videos" or "search results".
  subject: string;
  retrying: boolean;
  onRetry: () => void;
  autoFocus?: boolean;
}
