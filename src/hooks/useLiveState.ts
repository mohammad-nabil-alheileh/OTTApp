import { useRef } from 'react';
import { LiveState } from '../types/live';

// The live edge jumps forward one segment at a time, so allow some slack
// before saying the viewer has fallen behind.
const LIVE_TOLERANCE_SECONDS = 6;

// Treat positions this close to the start of the DVR window as already gone:
// the oldest segments may be removed before the player can load them.
const DVR_SAFETY_SECONDS = 10;

// liveEdge is the end of the stream's seekable (DVR) window. Players start a
// few segments before it; that initial gap counts as "live", and only extra
// delay (from pausing or seeking back) counts as being behind.
export const useLiveState = (
  currentTime: number,
  liveEdge: number,
  dvrWindowLength: number,
): LiveState => {
  const startGap = useRef<number | null>(null);
  if (startGap.current === null && liveEdge > 0 && currentTime > 0) {
    startGap.current = Math.max(0, liveEdge - currentTime);
  }
  const gap = startGap.current ?? 0;
  const secondsBehindLive = Math.max(0, liveEdge - currentTime - gap);

  return {
    isBehindLive: secondsBehindLive > LIVE_TOLERANCE_SECONDS,
    secondsBehindLive,
    livePosition: liveEdge - gap,
    hasLeftDvrWindow:
      dvrWindowLength > 0 &&
      liveEdge - currentTime > dvrWindowLength - DVR_SAFETY_SECONDS,
  };
};
