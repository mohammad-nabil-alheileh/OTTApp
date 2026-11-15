import { useRef } from 'react';
import { LoadFailure } from '../types/load';

export interface CachedRail<T> {
  items: T[];
  failure: LoadFailure | null;
}

// Keeps the last successfully loaded list for as long as the rail is mounted.
// A failed reload re-renders the cached cards instead of an error state; the
// failure is only surfaced while there is nothing cached to show. Data that
// loads normally (including an empty list with no failure) passes straight
// through, so the cache never masks a real result.
export const useRailCache = <T>(
  items: T[],
  failure: LoadFailure | null,
): CachedRail<T> => {
  const lastLoaded = useRef<T[]>(items);
  if (items.length > 0) {
    lastLoaded.current = items;
  }
  const cached = items.length > 0 || !failure ? items : lastLoaded.current;
  return {
    items: cached,
    failure: cached.length > 0 ? null : failure,
  };
};
