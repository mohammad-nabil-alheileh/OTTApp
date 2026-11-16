import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { SearchScreen } from '../../../src/components/SearchScreen/SearchScreen';
import { mockVODData } from '../../../src/services/mockData';

// Runs under android-tv and apple-tv against the real catalogue, where
// "Harbour Lights" (vod-17) has two seasons and seven episodes.
jest.mock('../../../src/services/voiceSearch', () => ({
  isVoiceSearchAvailable: jest.fn().mockResolvedValue(false),
  startVoiceListening: jest.fn(),
  stopVoiceListening: jest.fn(),
}));

const renderSearch = async (
  query: string,
  { onPlayEpisode = jest.fn(), watchHistory = [] as { id: string; position: number; duration: number }[] } = {},
) => {
  await render(
    <SearchScreen
      videos={mockVODData}
      isLoading={false}
      failure={null}
      onRetry={jest.fn()}
      query={query}
      onQueryChange={jest.fn()}
      onSelectVOD={jest.fn()}
      onPlayEpisode={onPlayEpisode}
      watchHistory={watchHistory}
      onBack={jest.fn()}
    />,
  );
  return { onPlayEpisode };
};

const episodeCards = () =>
  screen.queryAllByRole('button', { name: /^Harbour Lights, Season \d, episode/ });

describe('SearchScreen episodes rail (native TV)', () => {
  it('keeps the show in Results and lists all its episodes in a rail below', async () => {
    await renderSearch('harbour');

    expect(
      screen.getByRole('button', { name: /^Harbour Lights, rated 7.9 out of 5, 2 seasons$/ }),
    ).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Episodes of Harbour Lights' })).toBeTruthy();
    expect(screen.getByText('2 seasons, 7 episodes')).toBeTruthy();
    expect(episodeCards().map(card => card.props.accessibilityLabel)).toEqual([
      'Harbour Lights, Season 1, episode 1 of 3, Low Tide, 44 min',
      'Harbour Lights, Season 1, episode 2 of 3, The Ledger, 43 min',
      'Harbour Lights, Season 1, episode 3 of 3, Fog Bank, 46 min',
      'Harbour Lights, Season 2, episode 1 of 4, New Moorings, 45 min',
      'Harbour Lights, Season 2, episode 2 of 4, Salt, 44 min',
      'Harbour Lights, Season 2, episode 3 of 4, Beacon, 47 min',
      'Harbour Lights, Season 2, episode 4 of 4, High Water, 49 min',
    ]);
  });

  it('shows each card’s season and episode, hidden from the screen reader', async () => {
    await renderSearch('harbour');
    const card = episodeCards()[3];
    const hidden = { includeHiddenElements: true };
    expect(within(card).getByText('S2 E1', hidden)).toBeTruthy();
    expect(within(card).getByText('New Moorings', hidden)).toBeTruthy();
    // The label already says it, so the visible text must not be read twice.
    expect(within(card).queryByText('S2 E1')).toBeNull();
    expect(within(card).queryByText('New Moorings')).toBeNull();
    expect(card.props.accessibilityHint).toBe('Plays episode');
  });

  it('plays the pressed episode', async () => {
    const { onPlayEpisode } = await renderSearch('harbour lights');
    fireEvent.press(episodeCards()[4]);

    expect(onPlayEpisode).toHaveBeenCalledTimes(1);
    const [series, ref] = onPlayEpisode.mock.calls[0];
    expect(series.id).toBe('vod-17');
    expect(ref.season.seasonNumber).toBe(2);
    expect(ref.episode.id).toBe('vod-17-s2e2');
  });

  it('reads the time left on an episode in progress', async () => {
    await renderSearch('harbour', {
      watchHistory: [{ id: 'vod-17-s1e2', position: 1380, duration: 2580 }],
    });
    expect(episodeCards()[1].props.accessibilityLabel).toBe(
      'Harbour Lights, Season 1, episode 2 of 3, The Ledger, 43 min, 20 min left',
    );
  });

  it('has no episodes rail for a film or an empty query', async () => {
    await renderSearch('bunny');
    expect(screen.queryByRole('header', { name: /^Episodes of/ })).toBeNull();
    expect(episodeCards()).toHaveLength(0);
  });

  it('has no episodes rail before anything is typed', async () => {
    await renderSearch('');
    expect(screen.queryByRole('header', { name: /^Episodes of/ })).toBeNull();
  });
});
