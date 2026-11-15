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

const MAX_ADVERTISER_LENGTH = 400;

const isControlChar = (code: number): boolean =>
  code <= 0x1f || (code >= 0x7f && code <= 0x9f);

// NFC so "e" + U+0301 renders as "é"; any script is kept, only control chars go.
// Truncate by code point so an emoji or other astral char is never split in half.
export const formatAdvertiser = (text: string): string => {
  const chars = Array.from(
    text.normalize('NFC').replace(/\s+/g, ' ').trim(),
  ).filter(ch => !isControlChar(ch.codePointAt(0) ?? 0));
  return chars.length > MAX_ADVERTISER_LENGTH
    ? `${chars.slice(0, MAX_ADVERTISER_LENGTH - 1).join('')}…`
    : chars.join('');
};
