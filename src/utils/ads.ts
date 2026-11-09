import { AdBreak } from '../types/ads';

// Unplayed breaks whose cue point lies in (from, to], oldest first. Normal
// playback crosses at most one; a forward seek can jump over several.
// A break at 0 is never crossed, so these are mid-rolls only.
export const findCrossedBreaks = (
  breaks: AdBreak[],
  playedIds: ReadonlySet<string>,
  from: number,
  to: number,
): AdBreak[] =>
  breaks.filter(b => !playedIds.has(b.id) && b.time > from && b.time <= to);
