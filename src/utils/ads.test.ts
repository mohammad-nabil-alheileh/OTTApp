import { findCrossedBreaks } from './ads';
import { AdBreak } from '../types/ads';

const breaks: AdBreak[] = [
  { id: 'a', time: 0, ads: [] },
  { id: 'b', time: 120, ads: [] },
  { id: 'c', time: 300, ads: [] },
];
const ids = (list: AdBreak[]) => list.map(b => b.id);

describe('findCrossedBreaks', () => {
  it('finds the break crossed by normal playback', () => {
    expect(ids(findCrossedBreaks(breaks, new Set(), 119.8, 120.05))).toEqual([
      'b',
    ]);
  });

  it('ignores a break at 0 (no pre-rolls)', () => {
    expect(ids(findCrossedBreaks(breaks, new Set(), 0, 0.25))).toEqual([]);
  });

  it('finds every break jumped over by a forward seek', () => {
    expect(ids(findCrossedBreaks(breaks, new Set(), 10, 400))).toEqual([
      'b',
      'c',
    ]);
  });

  it('skips breaks already played', () => {
    expect(ids(findCrossedBreaks(breaks, new Set(['b']), 10, 400))).toEqual([
      'c',
    ]);
  });

  it('finds nothing on a backward seek', () => {
    expect(ids(findCrossedBreaks(breaks, new Set(), 400, 10))).toEqual([]);
  });
});
