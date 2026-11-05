import { LiveState } from '../../types/live';

export interface PlayerControlsProps {
  isLive: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  liveState: LiveState;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onGoLive: () => void;
}
