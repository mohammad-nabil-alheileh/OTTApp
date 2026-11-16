import { mockArchive, mockLiveChannels, mockVODData } from './mockData';
import { getAvailableArchive } from './archive';
import { isSeries } from './series';

describe('mock catalogue', () => {
  it('has at least one series with several seasons', () => {
    expect(mockVODData.filter(isSeries).some(s => s.seasons.length > 1)).toBe(true);
  });

  // Watch history is keyed by id for films, episodes and archive alike.
  it('never reuses an id across titles, episodes and archive programmes', () => {
    const ids = [
      ...mockVODData.map(v => v.id),
      ...mockVODData.flatMap(v => v.seasons ?? []).flatMap(s => s.episodes.map(e => e.id)),
      ...mockArchive.map(p => p.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('numbers seasons and episodes from 1 without gaps', () => {
    mockVODData.filter(isSeries).forEach(series => {
      expect(series.seasons.map(s => s.seasonNumber)).toEqual(
        series.seasons.map((_, i) => i + 1),
      );
      series.seasons.forEach(season =>
        expect(season.episodes.map(e => e.episodeNumber)).toEqual(
          season.episodes.map((_, i) => i + 1),
        ),
      );
    });
  });

  it('ties every archive programme to a live channel and offers some right now', () => {
    const channelIds = mockLiveChannels.map(c => c.id);
    mockArchive.forEach(p => expect(channelIds).toContain(p.channelId));
    expect(getAvailableArchive(mockArchive).length).toBeGreaterThan(0);
  });
});
