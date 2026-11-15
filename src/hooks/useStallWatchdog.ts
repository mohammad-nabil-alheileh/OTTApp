import { useEffect, useState } from 'react';

// Players retry network failures silently, so a dropped connection can leave
// the picture frozen with no error. "Playing but not moving" is the stall.
export const STALL_TIMEOUT_MS = 15000;

// `attempt` bumps on a manual retry so the watchdog re-arms even though the
// position has not changed yet.
export const useStallWatchdog = (
  active: boolean,
  position: number,
  attempt = 0,
): boolean => {
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    if (!active) {
      setStalled(false);
      return undefined;
    }
    setStalled(false);
    const timer = setTimeout(() => setStalled(true), STALL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [active, attempt, position]);

  return stalled;
};
