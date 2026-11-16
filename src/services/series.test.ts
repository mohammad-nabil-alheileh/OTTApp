import { VODEpisode, VODItem, VODSeason } from '../types/vod';
import {
  episodeAccessibilityLabel,
  findSeriesEpisode,
  getNextEpisode,
  getResumeEpisode,
  isSeries,
  playAccessibilityLabel,
  playButtonText,
  runtimeLabel,
  Series,
  seasonAccessibilityLabel,
  seasonCountLabel,
  searchEpisodeAccessibilityLabel,
  showEpisodesSummary,
  toEpisodePlayable,
  toPlayable,
} from './series';

const ep = (id: string, n: number, duration = 1500): VODEpisode => ({
  id,
  episodeNumber: n,
  title: `Title ${id}`,
  description: '',
  thumbnail: '',
  duration,
  url: `https://example.com/${id}.m3u8`,
});

const season = (n: number, ids: string[]): VODSeason => ({
  seasonNumber: n,
  episodes: ids.map((id, i) => ep(id, i + 1)),
});

const film: VODItem = {
  id: 'film',
  title: 'Film',
  description: '',
  thumbnail: '',
  poster: '',
  duration: 600,
  releaseDate: '2020-01-01',
  rating: 7,
  url: 'https://example.com/film.m3u8',
};

const show: Series = {
  ...film,
  id: 'show',
  title: 'Show',
  seasons: [season(1, ['a', 'b']), season(2, ['c', 'd', 'e'])],
};

const progress = (id: string, position: number) => ({ id, position, duration: 1500 });

describe('isSeries', () => {
  it('is true only when the item has at least one season', () => {
    expect(isSeries(show)).toBe(true);
    expect(isSeries(film)).toBe(false);
    expect(isSeries({ ...film, seasons: [] })).toBe(false);
  });
});

describe('findSeriesEpisode', () => {
  it('finds the series, season and episode for an episode id', () => {
    const found = findSeriesEpisode([film, show], 'd');
    expect(found?.series.id).toBe('show');
    expect(found?.season.seasonNumber).toBe(2);
    expect(found?.episode.id).toBe('d');
  });

  it('returns null for ids that are not episodes', () => {
    expect(findSeriesEpisode([film, show], 'film')).toBeNull();
    expect(findSeriesEpisode([film, show], 'missing')).toBeNull();
  });
});

describe('getNextEpisode', () => {
  it('moves to the next episode in the same season', () => {
    expect(getNextEpisode(show, 'a')?.episode.id).toBe('b');
  });

  it('rolls over to the first episode of the next season', () => {
    const next = getNextEpisode(show, 'b');
    expect(next?.season.seasonNumber).toBe(2);
    expect(next?.episode.id).toBe('c');
  });

  it('returns null after the last episode and for unknown ids', () => {
    expect(getNextEpisode(show, 'e')).toBeNull();
    expect(getNextEpisode(show, 'zzz')).toBeNull();
  });
});

describe('getResumeEpisode', () => {
  it('starts at season 1 episode 1 with no history', () => {
    const resume = getResumeEpisode(show, []);
    expect(resume.episode.id).toBe('a');
    expect(resume.position).toBeUndefined();
  });

  it('resumes the most recently watched episode of this series', () => {
    const history = [progress('film', 30), progress('d', 300), progress('a', 90)];
    const resume = getResumeEpisode(show, history);
    expect(resume.episode.id).toBe('d');
    expect(resume.season.seasonNumber).toBe(2);
    expect(resume.position).toBe(300);
  });

  it('treats a saved position of 0 as not started', () => {
    const resume = getResumeEpisode(show, [progress('c', 0)]);
    expect(resume.episode.id).toBe('c');
    expect(resume.position).toBeUndefined();
  });
});

describe('toEpisodePlayable', () => {
  it('saves progress under the episode id and names the episode', () => {
    const [s2] = [show.seasons[1]];
    const playable = toEpisodePlayable(show, { season: s2, episode: s2.episodes[1] }, 120);
    expect(playable).toEqual({
      id: 'd',
      title: 'Show · S2 E2 · Title d',
      url: 'https://example.com/d.m3u8',
      isLive: false,
      adBreaks: undefined,
      startPosition: 120,
    });
  });

  it('omits a start position of 0', () => {
    const s1 = show.seasons[0];
    expect(
      toEpisodePlayable(show, { season: s1, episode: s1.episodes[0] }, 0).startPosition,
    ).toBeUndefined();
  });
});

describe('accessibility labels', () => {
  it('counts seasons', () => {
    expect(seasonCountLabel(show)).toBe('2 seasons');
    expect(seasonCountLabel({ ...show, seasons: [season(1, ['a'])] })).toBe('1 season');
  });

  it('names a season tab with its episode count', () => {
    expect(seasonAccessibilityLabel(show.seasons[1])).toBe('Season 2, 3 episodes');
    expect(seasonAccessibilityLabel(season(4, ['x']))).toBe('Season 4, 1 episode');
  });

  it('reads the episode position, title and length', () => {
    const s2 = show.seasons[1];
    expect(episodeAccessibilityLabel(s2, s2.episodes[0])).toBe(
      'Season 2, episode 1 of 3, Title c, 25 min',
    );
  });

  it('adds the time left when the episode is in progress', () => {
    const s1 = show.seasons[0];
    expect(episodeAccessibilityLabel(s1, s1.episodes[1], 900)).toBe(
      'Season 1, episode 2 of 2, Title b, 25 min, 10 min left',
    );
  });
});

describe('toPlayable', () => {
  it('plays a film from its saved position under its own id', () => {
    expect(toPlayable({ ...film, adBreaks: [] }, [progress('film', 42)])).toEqual({
      id: 'film',
      title: 'Film',
      url: 'https://example.com/film.m3u8',
      isLive: false,
      adBreaks: [],
      startPosition: 42,
    });
  });

  it('starts a film from the top when nothing is saved', () => {
    expect(toPlayable(film, []).startPosition).toBeUndefined();
  });

  it('plays the episode to resume for a series, never the series url', () => {
    const playable = toPlayable(show, [progress('c', 200)]);
    expect(playable.id).toBe('c');
    expect(playable.url).toBe('https://example.com/c.m3u8');
    expect(playable.startPosition).toBe(200);
  });
});

describe('Play button for a series', () => {
  it('offers the first episode when nothing has been watched', () => {
    const resume = getResumeEpisode(show, []);
    expect(playButtonText(resume)).toBe('▶ Play S1 E1');
    expect(playAccessibilityLabel(resume)).toBe('Play season 1, episode 1, Title a');
  });

  it('offers to resume the episode in progress', () => {
    const resume = getResumeEpisode(show, [progress('d', 754)]);
    expect(playButtonText(resume)).toBe('▶ Resume S2 E2 · 12:34');
    expect(playAccessibilityLabel(resume)).toBe(
      'Resume season 2, episode 2, Title d, from 12:34',
    );
  });
});

describe('runtimeLabel', () => {
  it('gives a film its length and a series its season count', () => {
    expect(runtimeLabel(film)).toBe('10 min');
    expect(runtimeLabel(show)).toBe('2 seasons');
  });
});

describe('search episode labels', () => {
  it('names the show before the episode, since the card sits outside Details', () => {
    const s2 = show.seasons[1];
    expect(searchEpisodeAccessibilityLabel(show, { season: s2, episode: s2.episodes[2] })).toBe(
      'Show, Season 2, episode 3 of 3, Title e, 25 min',
    );
    expect(
      searchEpisodeAccessibilityLabel(show, { season: s2, episode: s2.episodes[0] }, 900),
    ).toBe('Show, Season 2, episode 1 of 3, Title c, 25 min, 10 min left');
  });

  it('summarises seasons and episodes across the whole show', () => {
    expect(showEpisodesSummary(show)).toBe('2 seasons, 5 episodes');
    expect(showEpisodesSummary({ ...show, seasons: [season(1, ['a'])] })).toBe(
      '1 season, 1 episode',
    );
  });
});
