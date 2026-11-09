export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  // Content positions, in seconds, to mark on the track (ad breaks).
  markers?: number[];
}
