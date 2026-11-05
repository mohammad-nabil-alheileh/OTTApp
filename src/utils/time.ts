export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

// 75 -> "1:15", 3725 -> "1:02:05"
export const formatTime = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
};
