import { ArchiveProgramme } from '../types/live';
import {
  archiveAccessibilityLabel,
  formatAiredAt,
  getAvailableArchive,
  toArchivePlayable,
} from './archive';

// Local-time constructor keeps the expected strings independent of TZ.
const now = new Date(2026, 10, 15, 12, 0);
const at = (day: number, hour: number, minute = 0) =>
  new Date(2026, 10, day, hour, minute).toISOString();

const programme = (
  id: string,
  airedAt: string,
  availableUntil: string,
): ArchiveProgramme => ({
  id,
  channelId: 'live-1',
  title: `Show ${id}`,
  description: '',
  thumbnail: '',
  airedAt,
  duration: 1800,
  url: `https://example.com/${id}.m3u8`,
  availableUntil,
});

describe('getAvailableArchive', () => {
  it('keeps aired, unexpired programmes, newest first', () => {
    const list = [
      programme('old', at(12, 8), at(19, 8)),
      programme('expired', at(1, 8), at(8, 8)),
      programme('new', at(15, 8), at(22, 8)),
      programme('future', at(15, 20), at(22, 20)),
      programme('mid', at(14, 21), at(21, 21)),
    ];
    expect(getAvailableArchive(list, now).map(p => p.id)).toEqual(['new', 'mid', 'old']);
  });

  it('drops a programme at the exact moment it expires', () => {
    expect(getAvailableArchive([programme('x', at(8, 12), at(15, 12))], now)).toEqual([]);
  });
});

describe('formatAiredAt', () => {
  it('says today and yesterday for recent broadcasts', () => {
    expect(formatAiredAt(at(15, 8, 5), now)).toBe('Today 08:05');
    expect(formatAiredAt(at(14, 21, 30), now)).toBe('Yesterday 21:30');
  });

  it('uses the weekday and date for older broadcasts', () => {
    expect(formatAiredAt(at(12, 9), now)).toBe('Thu 12 Nov 09:00');
  });
});

describe('archiveAccessibilityLabel', () => {
  it('reads title, channel, air time, length and days left', () => {
    expect(
      archiveAccessibilityLabel(programme('a', at(14, 21, 30), at(18, 12)), 'Live Demo', now),
    ).toBe('Show a, Live Demo, aired yesterday at 21:30, 30 min, available for 3 more days');
  });

  it('spells out older dates and a single day left', () => {
    expect(
      archiveAccessibilityLabel(programme('b', at(12, 9), at(16, 11)), 'News', now),
    ).toBe('Show b, News, aired Thursday 12 November at 09:00, 30 min, available for 1 more day');
  });

  it('warns when the programme leaves today', () => {
    expect(
      archiveAccessibilityLabel(programme('c', at(15, 8), at(15, 18)), 'News', now),
    ).toBe('Show c, News, aired today at 08:00, 30 min, leaving today');
  });
});

describe('toArchivePlayable', () => {
  it('plays as on-demand content and saves progress under the programme id', () => {
    expect(toArchivePlayable(programme('a', at(15, 8), at(22, 8)), 'Live Demo', 60)).toEqual({
      id: 'a',
      title: 'Show a · Live Demo',
      url: 'https://example.com/a.m3u8',
      isLive: false,
      startPosition: 60,
    });
  });
});
