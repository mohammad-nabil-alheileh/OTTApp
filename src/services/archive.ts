import { ArchiveProgramme } from '../types/live';
import { SavedPlayable } from '../types/playable';
import { formatDuration } from '../utils/time';

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Aired and not yet expired, newest broadcast first.
export const getAvailableArchive = (
  programmes: ArchiveProgramme[],
  now: Date = new Date(),
): ArchiveProgramme[] =>
  programmes
    .filter(
      p =>
        new Date(p.airedAt).getTime() <= now.getTime() &&
        new Date(p.availableUntil).getTime() > now.getTime(),
    )
    .sort((a, b) => new Date(b.airedAt).getTime() - new Date(a.airedAt).getTime());

const pad = (n: number) => String(n).padStart(2, '0');
const clock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
// Calendar days, not 24 h spans, so 23:00 yesterday is still "yesterday".
const daysAgo = (d: Date, now: Date) =>
  Math.round((startOfDay(now) - startOfDay(d)) / DAY_MS);

export const formatAiredAt = (airedAt: string, now: Date = new Date()) => {
  const d = new Date(airedAt);
  const ago = daysAgo(d, now);
  if (ago === 0) {
    return `Today ${clock(d)}`;
  }
  if (ago === 1) {
    return `Yesterday ${clock(d)}`;
  }
  return `${DAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${clock(d)}`;
};

const spokenAiredAt = (airedAt: string, now: Date) => {
  const d = new Date(airedAt);
  const ago = daysAgo(d, now);
  const day =
    ago === 0
      ? 'today'
      : ago === 1
      ? 'yesterday'
      : `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return `${day} at ${clock(d)}`;
};

const availability = (availableUntil: string, now: Date) => {
  const until = new Date(availableUntil);
  if (daysAgo(until, now) === 0) {
    return 'leaving today';
  }
  const days = Math.ceil((until.getTime() - now.getTime()) / DAY_MS);
  return `available for ${days} more ${days === 1 ? 'day' : 'days'}`;
};

export const archiveAccessibilityLabel = (
  programme: ArchiveProgramme,
  channelName: string,
  now: Date = new Date(),
) =>
  `${programme.title}, ${channelName}, aired ${spokenAiredAt(
    programme.airedAt,
    now,
  )}, ${formatDuration(programme.duration)}, ${availability(
    programme.availableUntil,
    now,
  )}`;

export const toArchivePlayable = (
  programme: ArchiveProgramme,
  channelName: string,
  startPosition?: number,
): SavedPlayable => ({
  id: programme.id,
  title: `${programme.title} · ${channelName}`,
  url: programme.url,
  isLive: false,
  startPosition: startPosition && startPosition > 0 ? startPosition : undefined,
});
