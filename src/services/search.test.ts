import { findSearchedShow, getRecommendedVideos, searchVideos } from './search';
import { VODItem } from '../types/vod';

const video = (
  id: string,
  title: string,
  description: string,
  releaseDate = '2020-01-01',
  rating = 7,
): VODItem => ({
  id,
  title,
  description,
  thumbnail: '',
  poster: '',
  duration: 600,
  releaseDate,
  rating,
  url: '',
});

const videos = [
  video(
    'bunny',
    'Big Buck Bunny',
    'A giant rabbit takes on three bullying rodents.',
    '2008-05-30',
    8.1,
  ),
  video(
    'steel',
    'Tears of Steel',
    'Warriors and scientists try to save the world from robots.',
    '2012-09-26',
    6.8,
  ),
  video(
    'angel',
    'Angel One',
    'A short sci-fi clip from the Shaka demo assets.',
    '2016-01-01',
    7,
  ),
];

const ids = (items: VODItem[]) => items.map(item => item.id);

describe('searchVideos', () => {
  it('returns every video for an empty or whitespace query', () => {
    expect(ids(searchVideos(videos, ''))).toEqual(['bunny', 'steel', 'angel']);
    expect(ids(searchVideos(videos, '   '))).toEqual([
      'bunny',
      'steel',
      'angel',
    ]);
  });

  it('matches titles case-insensitively', () => {
    expect(ids(searchVideos(videos, 'bUnNy'))).toEqual(['bunny']);
  });

  it('matches descriptions', () => {
    expect(ids(searchVideos(videos, 'robots'))).toEqual(['steel']);
  });

  it('matches the release year, rating and accents', () => {
    expect(ids(searchVideos(videos, '2012'))).toEqual(['steel']);
    expect(ids(searchVideos(videos, '8.1'))).toEqual(['bunny']);
    expect(
      ids(searchVideos([video('amelie', 'Amélie', '')], 'amelie')),
    ).toEqual(['amelie']);
  });

  it('requires every token to match', () => {
    expect(ids(searchVideos(videos, 'tears robots'))).toEqual(['steel']);
    expect(searchVideos(videos, 'tears bunny')).toEqual([]);
  });

  it('ranks title matches above description matches', () => {
    const titleHit = video('a', 'Steel', '');
    const descriptionHit = video('b', 'Other', 'Made of steel');
    expect(ids(searchVideos([descriptionHit, titleHit], 'steel'))).toEqual([
      'a',
      'b',
    ]);
  });

  it('returns nothing when no video matches', () => {
    expect(searchVideos(videos, 'dragon')).toEqual([]);
  });
});

describe('getRecommendedVideos', () => {
  it('ranks by rating without reordering the caller’s list', () => {
    const input = [
      video('low', 'Low', '', '2020-01-01', 5),
      video('high', 'High', '', '2020-01-01', 9),
      video('mid', 'Mid', '', '2020-01-01', 7),
    ];
    expect(ids(getRecommendedVideos(input))).toEqual(['high', 'mid', 'low']);
    expect(ids(input)).toEqual(['low', 'high', 'mid']);
  });

  it('caps the rail at the requested limit', () => {
    const many = Array.from({ length: 20 }, (_, index) =>
      video(`v${index}`, `Video ${index}`, '', '2020-01-01', index),
    );
    expect(ids(getRecommendedVideos(many, 4))).toEqual(['v19', 'v18', 'v17', 'v16']);
  });

  it('returns nothing when there are no videos', () => {
    expect(getRecommendedVideos([])).toEqual([]);
  });
});

describe('findSearchedShow', () => {
  const show = (id: string, title: string, seasons: number[][]): VODItem => ({
    ...video(id, title, 'A drama about the sea.'),
    seasons: seasons.map((episodes, s) => ({
      seasonNumber: s + 1,
      episodes: episodes.map(n => ({
        id: `${id}-s${s + 1}e${n}`,
        episodeNumber: n,
        title: `Ep ${n}`,
        description: '',
        thumbnail: '',
        duration: 1500,
        url: '',
      })),
    })),
  });
  const harbour = show('harbour', 'Harbour Lights', [[1, 2], [1, 2, 3]]);
  const kitchen = show('kitchen', 'Night Kitchen', [[1]]);
  const episodeIds = (found: ReturnType<typeof findSearchedShow>) =>
    found?.episodes.map(ref => ref.episode.id);

  it('lists every episode of every season, in order', () => {
    const found = findSearchedShow([harbour], 'harbour');
    expect(found?.series.id).toBe('harbour');
    expect(episodeIds(found)).toEqual([
      'harbour-s1e1',
      'harbour-s1e2',
      'harbour-s2e1',
      'harbour-s2e2',
      'harbour-s2e3',
    ]);
    expect(found?.episodes[2].season.seasonNumber).toBe(2);
  });

  it('picks the first show in the results whose title matches every word', () => {
    expect(findSearchedShow([videos[0], kitchen, harbour], 'harb lig')?.series.id).toBe(
      'harbour',
    );
    expect(findSearchedShow([kitchen, harbour], 'NIGHT')?.series.id).toBe('kitchen');
  });

  it('ignores shows matched only by their description', () => {
    expect(findSearchedShow([harbour], 'sea')).toBeNull();
    expect(findSearchedShow([harbour], 'harbour sea')).toBeNull();
  });

  it('ignores films and an empty query', () => {
    expect(findSearchedShow(videos, 'bunny')).toBeNull();
    expect(findSearchedShow([harbour], '   ')).toBeNull();
  });
});
