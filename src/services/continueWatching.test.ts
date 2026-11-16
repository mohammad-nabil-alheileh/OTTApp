import { VODItem } from '../types/vod';
import { buildContinueWatching } from './continueWatching';

const vod = (id: string, extra: Partial<VODItem> = {}): VODItem => ({
  id,
  title: id,
  description: '',
  thumbnail: '',
  poster: '',
  duration: 600,
  releaseDate: '2020-01-01',
  rating: 7,
  url: '',
  ...extra,
});

const episode = (id: string, episodeNumber: number) => ({
  id,
  episodeNumber,
  title: id,
  description: '',
  thumbnail: '',
  duration: 1500,
  url: '',
});

const show = vod('show', {
  seasons: [
    { seasonNumber: 1, episodes: [episode('e1', 1), episode('e2', 2)] },
    { seasonNumber: 2, episodes: [episode('e3', 1)] },
  ],
});
const entry = (id: string, position: number) => ({ id, position, duration: 1500 });

describe('buildContinueWatching', () => {
  it('keeps films in history order and drops unknown ids', () => {
    const items = buildContinueWatching(
      [entry('b', 10), entry('gone', 5), entry('a', 20)],
      [vod('a'), vod('b')],
    );
    expect(items.map(i => [i.vod.id, i.position])).toEqual([
      ['b', 10],
      ['a', 20],
    ]);
    expect(items[0].episode).toBeUndefined();
  });

  it('shows an episode in progress as its series card with the episode attached', () => {
    const [item] = buildContinueWatching([entry('e3', 300)], [show]);
    expect(item.vod.id).toBe('show');
    expect(item.position).toBe(300);
    expect(item.episode?.season.seasonNumber).toBe(2);
    expect(item.episode?.episode.id).toBe('e3');
  });

  it('shows each series once, for its most recently watched episode', () => {
    const items = buildContinueWatching(
      [entry('e2', 100), entry('a', 50), entry('e1', 200)],
      [show, vod('a')],
    );
    expect(items.map(i => i.vod.id)).toEqual(['show', 'a']);
    expect(items[0].episode?.episode.id).toBe('e2');
  });
});
