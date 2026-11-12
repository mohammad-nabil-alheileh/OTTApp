import { AudioPlayable } from '../../types/podcast';

export interface NowPlayingProps {
  item: AudioPlayable;
  paused: boolean;
  buffering: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
}
