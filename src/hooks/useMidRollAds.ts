import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdBreak } from '../types/ads';
import { findCrossedBreaks } from '../utils/ads';

// Decides when a mid-roll break starts. Each break plays once per session.
// A seek that jumps over several unplayed breaks plays only the last one
// and marks the others played, so the viewer is not sent through a stack of ads.
export const useMidRollAds = (
  adBreaks: AdBreak[] | undefined,
  currentTime: number,
  enabled: boolean,
) => {
  const breaks = useMemo(
    () => [...(adBreaks ?? [])].sort((a, b) => a.time - b.time),
    [adBreaks],
  );
  const [activeBreak, setActiveBreak] = useState<AdBreak | null>(null);
  const playedIds = useRef(new Set<string>());
  const lastTime = useRef(0);

  useEffect(() => {
    // Content is paused during a break, so there is nothing to track.
    if (!enabled || activeBreak) {
      return;
    }
    const crossed = findCrossedBreaks(
      breaks,
      playedIds.current,
      lastTime.current,
      currentTime,
    );
    lastTime.current = currentTime;
    if (crossed.length > 0) {
      crossed.forEach(b => playedIds.current.add(b.id));
      setActiveBreak(crossed[crossed.length - 1]);
    }
  }, [enabled, activeBreak, breaks, currentTime]);

  const finishBreak = useCallback(() => setActiveBreak(null), []);

  return {
    activeBreak,
    finishBreak,
    markers: useMemo(
      () => breaks.map(b => b.time).filter(t => t > 0),
      [breaks],
    ),
  };
};
