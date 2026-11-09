import { useCallback, useEffect, useRef, useState } from 'react';
import { AdBreak } from '../types/ads';

// An ad that has not loaded by then is skipped, so a dead ad URL
// cannot hold the content hostage.
const LOAD_TIMEOUT_MS = 10000;

// Steps through the ads of one break; calls onComplete after the last one.
export const useAdBreak = (adBreak: AdBreak, onComplete: () => void) => {
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  // onEnd and onError can both fire for one ad; only advance once.
  const advancedFrom = useRef(-1);
  const count = adBreak.ads.length;

  const next = useCallback(() => {
    if (advancedFrom.current === index) {
      return;
    }
    advancedFrom.current = index;
    if (index + 1 < count) {
      setPosition(0);
      setDuration(0);
      setIndex(index + 1);
    } else {
      onComplete();
    }
  }, [index, count, onComplete]);

  const loaded = duration > 0;
  useEffect(() => {
    if (loaded) {
      return;
    }
    const timer = setTimeout(next, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loaded, next]);

  // An empty break has nothing to show.
  useEffect(() => {
    if (count === 0) {
      onComplete();
    }
  }, [count, onComplete]);

  return {
    ad: adBreak.ads[index],
    index,
    count,
    position,
    duration,
    loaded,
    setPosition,
    setDuration,
    next,
  };
};
