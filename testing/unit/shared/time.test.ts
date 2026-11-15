import { clamp, formatDuration, formatTime, skipBy } from '../../../src/utils/time';

describe('clamp', () => {
  it('keeps values inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('pins values to the bounds', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
});

describe('skipBy', () => {
  it('steps from the last whole second', () => {
    expect(skipBy(12.7, 10, 600)).toBe(22);
    expect(skipBy(12.7, -10, 600)).toBe(2);
  });

  it('never goes past the start or the end', () => {
    expect(skipBy(3, -10, 600)).toBe(0);
    expect(skipBy(595, 10, 600)).toBe(600);
  });
});

describe('formatTime', () => {
  it.each([
    [0, '0:00'],
    [5, '0:05'],
    [75, '1:15'],
    [3599, '59:59'],
    [3600, '1:00:00'],
    [3725, '1:02:05'],
  ])('formats %d seconds as %s', (seconds, label) => {
    expect(formatTime(seconds)).toBe(label);
  });

  it('drops fractions and treats negatives as zero', () => {
    expect(formatTime(75.9)).toBe('1:15');
    expect(formatTime(-4)).toBe('0:00');
  });
});

describe('formatDuration', () => {
  it('uses seconds under a minute and rounded minutes above', () => {
    expect(formatDuration(45)).toBe('45 sec');
    expect(formatDuration(60)).toBe('1 min');
    expect(formatDuration(596)).toBe('10 min');
  });
});
