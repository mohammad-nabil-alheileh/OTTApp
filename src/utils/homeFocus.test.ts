import { resolveHomeFocus } from './homeFocus';

const rows = {
  continue: ['vod-2', 'vod-1', 'vod-3'],
  favorites: ['vod-5'],
  vod: ['vod-1', 'vod-2', 'vod-3'],
};

describe('resolveHomeFocus', () => {
  it('finds the opened card by video id after it moved to the front', () => {
    // vod-2 was opened at index 1; playing it moved it to index 0.
    expect(
      resolveHomeFocus({ row: 'continue', videoId: 'vod-2' }, rows),
    ).toEqual({ row: 'continue', index: 0 });
  });

  it('keeps the row the card was opened from', () => {
    expect(resolveHomeFocus({ row: 'vod', videoId: 'vod-2' }, rows)).toEqual({
      row: 'vod',
      index: 1,
    });
  });

  it('falls back to the first VOD card without a target', () => {
    expect(resolveHomeFocus(null, rows)).toEqual({ row: 'vod', index: 0 });
  });

  it('falls back to the first VOD card when the video left its row', () => {
    expect(
      resolveHomeFocus({ row: 'favorites', videoId: 'vod-1' }, rows),
    ).toEqual({ row: 'vod', index: 0 });
    expect(
      resolveHomeFocus({ row: 'continue', videoId: 'vod-1' }, { vod: [] }),
    ).toEqual({ row: 'vod', index: 0 });
  });
});
