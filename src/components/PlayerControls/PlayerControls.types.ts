import { LiveState } from '../../types/live';

export interface PlayerControlsProps {
  isLive: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  liveState: LiveState;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  // Video heights offered by the stream, highest first.
  qualities: number[];
  quality: number;
  onQualityChange: (quality: number) => void;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onGoLive: () => void;
  // Ad break positions to mark on the progress bar.
  adMarkers?: number[];
}
