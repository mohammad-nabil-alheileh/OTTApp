import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ContinueWatchingRail } from '../../../src/components/ContinueWatchingRail/ContinueWatchingRail';
import { mockVODData } from '../../../src/services/mockData';
import { isSeries } from '../../../src/services/series';

// Runs under both android-tv and apple-tv.
const film = mockVODData[0];
const series = mockVODData.filter(isSeries)[0];
const season = series.seasons[0];
const episode = season.episodes[1];

describe('ContinueWatchingRail (native TV)', () => {
  it('reads a film card with time left and percent watched', async () => {
    await render(
      <ContinueWatchingRail
        items={[{ vod: film, position: 296, duration: 596 }]}
        onSelectVOD={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('button', {
        name: `${film.title}, 5 min left, 50 percent watched`,
      }),
    ).toBeTruthy();
  });

  it('names the episode an in-progress series card resumes', async () => {
    const position = episode.duration - 600;
    const percent = Math.round((position / episode.duration) * 100);
    await render(
      <ContinueWatchingRail
        items={[{ vod: series, position, duration: episode.duration, episode: { season, episode } }]}
        onSelectVOD={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('button', {
        name: `${series.title}, season 1, episode 2, ${episode.title}, 10 min left, ${percent} percent watched`,
      }),
    ).toBeTruthy();
    // The overlay is aria-hidden; the button's label carries the same text.
    expect(
      screen.getByText('S1 E2 · 10 min left', { includeHiddenElements: true }),
    ).toBeTruthy();
  });
});
