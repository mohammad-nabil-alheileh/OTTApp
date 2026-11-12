import { Podcast, PodcastEpisode } from '../types/podcast';
import {
  getContinueListening,
  groupByCategory,
  toAudioPlayable,
} from './podcasts';

const episode = (id: string): PodcastEpisode => ({
  id,
  title: `Episode ${id}`,
  description: '',
  duration: 300,
  releaseDate: '2026-11-01',
  audioUrl: `https://example.com/${id}.mp3`,
});

const podcast = (
  id: string,
  category: string,
  episodeIds: string[],
): Podcast => ({
  id,
  title: `Podcast ${id}`,
  author: 'Host',
  description: '',
  artwork: `https://example.com/${id}.jpg`,
  category,
  episodes: episodeIds.map(episode),
});

const tech = podcast('p1', 'Technology', ['p1-e1', 'p1-e2']);
const news = podcast('p2', 'News', ['p2-e1']);
const tech2 = podcast('p3', 'Technology', ['p3-e1']);

describe('groupByCategory', () => {
  it('groups podcasts in the order categories first appear', () => {
    expect(groupByCategory([tech, news, tech2])).toEqual([
      { category: 'Technology', podcasts: [tech, tech2] },
      { category: 'News', podcasts: [news] },
    ]);
  });

  it('returns no groups for no podcasts', () => {
    expect(groupByCategory([])).toEqual([]);
  });
});

describe('getContinueListening', () => {
  it('joins history with episodes, keeping history order', () => {
    const items = getContinueListening(
      [
        { id: 'p2-e1', position: 40, duration: 300 },
        { id: 'p1-e2', position: 10, duration: 300 },
      ],
      [tech, news],
    );
    expect(items.map(item => [item.podcast.id, item.episode.id])).toEqual([
      ['p2', 'p2-e1'],
      ['p1', 'p1-e2'],
    ]);
    expect(items[0].position).toBe(40);
  });

  it('drops unknown episodes and ones that never got going', () => {
    const items = getContinueListening(
      [
        { id: 'gone', position: 40, duration: 300 },
        { id: 'p1-e1', position: 0, duration: 300 },
      ],
      [tech],
    );
    expect(items).toEqual([]);
  });
});

describe('toAudioPlayable', () => {
  it('builds the player input from the podcast and episode', () => {
    expect(toAudioPlayable(tech, tech.episodes[0], 42)).toEqual({
      id: 'p1-e1',
      title: 'Episode p1-e1',
      podcastTitle: 'Podcast p1',
      artwork: 'https://example.com/p1.jpg',
      url: 'https://example.com/p1-e1.mp3',
      startPosition: 42,
    });
  });

  it('starts from the beginning without a saved position', () => {
    expect(toAudioPlayable(tech, tech.episodes[0]).startPosition).toBe(
      undefined,
    );
    expect(toAudioPlayable(tech, tech.episodes[0], 0).startPosition).toBe(
      undefined,
    );
  });
});
