export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

// Relative skip that snaps to a whole second, so the time label moves by
// exactly `seconds` even when playback is mid-second: step from the end of
// the previous whole second rather than from the one in progress.
export const skipBy = (from: number, seconds: number, duration: number): number =>
  clamp(Math.floor(from) - 1 + seconds, 0, duration);

// 75 -> "1:15", 3725 -> "1:02:05"
export const formatTime = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
};

// Runtime label for cards and details: 45 -> "45 sec", 596 -> "10 min".
export const formatDuration = (seconds: number): string =>
  seconds < 60 ? `${seconds} sec` : `${Math.round(seconds / 60)} min`;
