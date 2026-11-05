import { LiveState } from '../../types/live';

export interface PlayerControlsProps {
  isLive: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  liveState: LiveState;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onGoLive: () => void;
}
