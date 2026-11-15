import { findCrossedBreaks, formatAdvertiser } from './ads';
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

describe('formatAdvertiser', () => {
  it('keeps accented Latin letters', () => {
    expect(formatAdvertiser('Café Média')).toBe('Café Média');
  });

  it('keeps non-Latin scripts', () => {
    expect(formatAdvertiser('日本テレビ')).toBe('日本テレビ');
    expect(formatAdvertiser('قناة الجزيرة')).toBe('قناة الجزيرة');
  });

  it('composes decomposed input into NFC', () => {
    expect(formatAdvertiser('Café')).toBe('Café');
  });

  it('keeps symbols and punctuation that are part of a brand', () => {
    expect(formatAdvertiser('AT&T')).toBe('AT&T');
    expect(formatAdvertiser('Ben & Jerry’s')).toBe('Ben & Jerry’s');
  });

  it('drops control characters', () => {
    expect(formatAdvertiser('Acme\u0000\u0007\u009F Ltd')).toBe('Acme Ltd');
  });

  it('collapses whitespace and trims', () => {
    expect(formatAdvertiser('  MDN \n Web\tDocs ')).toBe('MDN Web Docs');
  });

  it('truncates without splitting a surrogate pair', () => {
    const result = formatAdvertiser('😀'.repeat(500));
    expect(Array.from(result)).toHaveLength(400);
    expect(result.endsWith('😀…')).toBe(true);
  });
});
