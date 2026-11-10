import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdBreak } from '../types/ads';
import { findCrossedBreaks } from '../utils/ads';

const PRE_CROSS_SECONDS = 0.5;

// Decides when a mid-roll break starts. Each break plays once per session.
// Resuming past cue points plays the last crossed break from the first
// render, so the ad covers the content before any resume frame is shown;
// earlier crossed breaks are marked played. A seek that jumps over several
// unplayed breaks plays only the last one and marks the others played, so
// the viewer is not sent through a stack of ads.
export const useMidRollAds = (
  adBreaks: AdBreak[] | undefined,
  currentTime: number,
  enabled: boolean,
  startPosition = 0,
) => {
  const breaks = useMemo(
    () => [...(adBreaks ?? [])].sort((a, b) => a.time - b.time),
    [adBreaks],
  );
  // Breaks the resume has already reached, counting the pre-cross margin
  // (a resume just before a cue would otherwise flash a frame while the
  // first progress report triggers the break). The last one plays on mount;
  // all are marked played so none re-fires after the break.
  const resumeCrossed = useMemo(
    () =>
      breaks.filter(b => b.time > 0 && b.time <= startPosition + PRE_CROSS_SECONDS),
    [breaks, startPosition],
  );
  const [activeBreak, setActiveBreak] = useState<AdBreak | null>(() =>
    enabled && resumeCrossed.length > 0
      ? resumeCrossed[resumeCrossed.length - 1]
      : null,
  );
  const playedIds = useRef(new Set(resumeCrossed.map(b => b.id)));
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
      // Progress reports lag the video layer by up to one tick (250ms) plus
      // render/pause latency, so trigger early enough that the ad covers the
      // content before the cue frame is shown.
      currentTime + PRE_CROSS_SECONDS,
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
