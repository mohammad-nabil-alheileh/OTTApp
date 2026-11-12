import { toQualities } from '../../src/utils/quality';

describe('toQualities', () => {
  it('lists each height once, highest first', () => {
    expect(toQualities([720, 1080, 720, 480, 1080])).toEqual([1080, 720, 480]);
  });

  it('drops missing and non-positive heights', () => {
    expect(toQualities([undefined, 0, -1, 360])).toEqual([360]);
  });

  it('returns an empty list when nothing is usable', () => {
    expect(toQualities([])).toEqual([]);
    expect(toQualities([undefined])).toEqual([]);
  });
});
