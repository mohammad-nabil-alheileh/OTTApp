export interface PlayerControlsProps {
  isLive: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
}
