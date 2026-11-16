import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ShowDetails } from '../../../src/components/ShowDetails/ShowDetails';
import { mockVODData } from '../../../src/services/mockData';

// Runs under lg-webos and samsung-tizen.
const series = mockVODData.find(v => v.id === 'vod-17')!;

const renderDetails = () =>
  render(
    <ShowDetails
      item={series}
      relatedItems={mockVODData.slice(0, 2)}
      watchHistory={[]}
      onPlay={jest.fn()}
      onPlayEpisode={jest.fn()}
      onPlayTrailer={jest.fn()}
      onSelectVOD={jest.fn()}
      isFavorite={false}
      onToggleFavorite={jest.fn()}
      onBack={jest.fn()}
    />,
  );

describe('ShowDetails seasons (web TV)', () => {
  it('exposes the seasons as a tab list with one selected tab', () => {
    renderDetails();
    const tabs = screen.getAllByRole('tab');
    expect(screen.getByRole('tablist')).toBeTruthy();
    expect(tabs.map(t => t.getAttribute('aria-selected'))).toEqual(['true', 'false']);
  });

  it('moves Play → season tabs → episodes with the Down key', () => {
    renderDetails();
    const play = screen.getByLabelText('Play season 1, episode 1, Low Tide');
    expect(document.activeElement).toBe(play);

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByLabelText('Season 1, 3 episodes'));

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByLabelText('Season 2, 4 episodes'));

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(
      screen.getByLabelText('Season 1, episode 1 of 3, Low Tide, 44 min'),
    );
  });

  it('shows the chosen season after Enter on its tab', () => {
    renderDetails();
    const seasonTwo = screen.getByLabelText('Season 2, 4 episodes');
    fireEvent.click(seasonTwo);

    expect(seasonTwo.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Season 2 · 4 episodes')).toBeTruthy();
    expect(screen.getByLabelText('Season 2, episode 4 of 4, High Water, 49 min')).toBeTruthy();
  });
});
