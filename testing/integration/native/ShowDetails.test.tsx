import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ShowDetails } from '../../../src/components/ShowDetails/ShowDetails';
import { mockVODData } from '../../../src/services/mockData';
import { VODItem } from '../../../src/types/vod';
import { Series } from '../../../src/services/series';
import { WatchProgress } from '../../../src/services/watchHistory';

// Runs under both android-tv and apple-tv.
const film = mockVODData[0];
const series = mockVODData.find(v => v.id === 'vod-17') as Series;
const others = mockVODData.slice(1, 3);

const renderDetails = async (
  item: VODItem = series,
  watchHistory: WatchProgress[] = [],
  onPlayEpisode = jest.fn(),
) => {
  await render(
    <ShowDetails
      item={item}
      relatedItems={others}
      watchHistory={watchHistory}
      onPlay={jest.fn()}
      onPlayEpisode={onPlayEpisode}
      onPlayTrailer={jest.fn()}
      onSelectVOD={jest.fn()}
      isFavorite={false}
      onToggleFavorite={jest.fn()}
      onBack={jest.fn()}
    />,
  );
  return { onPlayEpisode };
};

const tab = (name: string) => screen.getByRole('tab', { name });

describe('ShowDetails for a series (native TV)', () => {
  it('shows no seasons for a film', async () => {
    await renderDetails(film);
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Play' })).toBeTruthy();
  });

  it('plays season 1 episode 1 when nothing has been watched', async () => {
    const { onPlayEpisode } = await renderDetails();
    const play = screen.getByRole('button', { name: 'Play season 1, episode 1, Low Tide' });
    expect(play.props.hasTVPreferredFocus).toBe(true);

    await fireEvent.press(play);

    const [, ref] = onPlayEpisode.mock.calls[0];
    expect(ref.episode.id).toBe('vod-17-s1e1');
    expect(screen.getByText('2 seasons', { includeHiddenElements: true })).toBeTruthy();
  });

  it('labels each season tab and marks the selected one', async () => {
    await renderDetails();
    expect(tab('Season 1, 3 episodes').props.accessibilityState).toMatchObject({ selected: true });
    expect(tab('Season 2, 4 episodes').props.accessibilityState).toMatchObject({ selected: false });
  });

  it('opens on the season being watched and offers to resume the episode', async () => {
    await renderDetails(series, [{ id: 'vod-17-s2e2', position: 630, duration: 2610 }]);

    expect(
      screen.getByRole('button', { name: 'Resume season 2, episode 2, Salt, from 10:30' }),
    ).toBeTruthy();
    expect(tab('Season 2, 4 episodes').props.accessibilityState).toMatchObject({ selected: true });
    expect(
      screen.getByRole('button', { name: 'Season 2, episode 2 of 4, Salt, 44 min, 33 min left' }),
    ).toBeTruthy();
  });

  it('switches the episode rail when another season is chosen', async () => {
    const { onPlayEpisode } = await renderDetails();
    expect(screen.getByRole('header', { name: 'Season 1 · 3 episodes' })).toBeTruthy();

    await fireEvent.press(tab('Season 2, 4 episodes'));

    expect(tab('Season 2, 4 episodes').props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByRole('header', { name: 'Season 2 · 4 episodes' })).toBeTruthy();
    const beacon = screen.getByRole('button', {
      name: 'Season 2, episode 3 of 4, Beacon, 47 min',
    });
    expect(beacon.props.accessibilityHint).toBe('Plays episode');

    await fireEvent.press(beacon);
    const [played, ref] = onPlayEpisode.mock.calls[0];
    expect(played.id).toBe('vod-17');
    expect(ref.season.seasonNumber).toBe(2);
    expect(ref.episode.id).toBe('vod-17-s2e3');
  });

  it('announces the season change politely', async () => {
    await renderDetails();
    const heading = screen.getByRole('header', { name: 'Season 1 · 3 episodes' });
    expect(heading.props.accessibilityLiveRegion).toBe('polite');
  });
});
