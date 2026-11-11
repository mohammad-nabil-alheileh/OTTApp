import { searchVideos } from './search';
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
