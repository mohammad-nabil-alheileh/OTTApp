import { useCallback, useEffect, useRef } from 'react';
import { Playable } from '../types/playable';
import { ProgressStore } from '../services/progressStore';
import { watchHistoryStore } from '../services/watchHistory';

const SAVE_INTERVAL_SECONDS = 5;
const FINISHED_RATIO = 0.95;
// Players confirm a resume seek within a couple of seconds of the target.
const RESUME_TOLERANCE_SECONDS = 2;

// Saves playback position for Continue Watching (or, with another store,
// Continue Listening). Live streams and trailers have no id, so they are never
// saved. Returns the onEnd handler.
export const useWatchProgress = (
  item: Pick<Playable, 'id' | 'isLive' | 'startPosition'>,
  currentTime: number,
  duration: number,
  store: ProgressStore = watchHistoryStore,
): (() => void) => {
  const { save: saveProgress, clear: clearProgress } = store;
  const id = item.isLive ? undefined : item.id;
  const latest = useRef({ currentTime, duration });
  latest.current = { currentTime, duration };
  const lastSaved = useRef(0);
  const finished = useRef(false);
  // Until the resume seek lands, the player can briefly report position 0;
  // saving that would overwrite the point we are resuming from.
  const resumePending = useRef((item.startPosition ?? 0) > 0);

  useEffect(() => {
    if (!id || duration <= 0) {
      return;
    }
    if (resumePending.current) {
      if (currentTime < (item.startPosition ?? 0) - RESUME_TOLERANCE_SECONDS) {
        return;
      }
      resumePending.current = false;
    }
    if (currentTime >= duration * FINISHED_RATIO) {
      if (!finished.current) {
        finished.current = true;
        clearProgress(id);
      }
      return;
    }
    finished.current = false;
    // The second clause covers seeking backwards.
    if (
      currentTime - lastSaved.current >= SAVE_INTERVAL_SECONDS ||
      currentTime < lastSaved.current
    ) {
      lastSaved.current = currentTime;
      saveProgress(id, currentTime, duration);
    }
  }, [
    id,
    item.startPosition,
    currentTime,
    duration,
    saveProgress,
    clearProgress,
  ]);

  // Back/unmount between saves: keep the latest position, not the last tick.
  useEffect(() => {
    if (!id) {
      return;
    }
    return () => {
      const { currentTime: time, duration: total } = latest.current;
      if (
        !resumePending.current &&
        total > 0 &&
        time < total * FINISHED_RATIO
      ) {
        saveProgress(id, time, total);
      }
    };
  }, [id, saveProgress]);

  return useCallback(() => {
    if (id) {
      clearProgress(id);
    }
  }, [id, clearProgress]);
};
