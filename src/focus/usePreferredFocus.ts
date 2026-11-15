import { useEffect } from 'react';

const FLATLIST_INITIAL_RENDER = 10;

// Web focuses the rail's preferred card once it is ready (native uses
// hasTVPreferredFocus). Returns an initialNumToRender that keeps that card
// mounted, since an unrendered card can't take focus.
export const usePreferredFocus = (
  index: number | null | undefined,
  focusIndex: (index: number) => void,
  ready = true,
): number => {
  useEffect(() => {
    if (ready && index != null) {
      focusIndex(index);
    }
  }, [ready, index, focusIndex]);
  return Math.max(FLATLIST_INITIAL_RENDER, (index ?? 0) + 1);
};
