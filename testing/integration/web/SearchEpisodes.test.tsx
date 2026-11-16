import React, { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import { SearchScreen } from '../../../src/components/SearchScreen/SearchScreen';
import { mockVODData } from '../../../src/services/mockData';
import { pressArrow } from '../../helpers/web';

// Runs under lg-webos and samsung-tizen against the real catalogue.
jest.mock('../../../src/services/voiceSearch', () => ({
  isVoiceSearchAvailable: jest.fn().mockResolvedValue(false),
  startVoiceListening: jest.fn(),
  stopVoiceListening: jest.fn(),
}));

let setQuery: (query: string) => void = () => {};

const Harness: React.FC<{ initialQuery: string }> = ({ initialQuery }) => {
  const [query, setState] = useState(initialQuery);
  setQuery = next => setState(next);
  return (
    <SearchScreen
      videos={mockVODData}
      isLoading={false}
      failure={null}
      onRetry={jest.fn()}
      query={query}
      onQueryChange={setState}
      onSelectVOD={jest.fn()}
      onPlayEpisode={jest.fn()}
      watchHistory={[]}
      onBack={jest.fn()}
    />
  );
};

// Lets the async search-history load settle inside act.
const renderSearch = async (initialQuery: string) => {
  render(<Harness initialQuery={initialQuery} />);
  await act(async () => {});
};

const showCard = () =>
  screen.getByRole('button', { name: /^Harbour Lights, rated/ });
const episodeCard = (index: number) =>
  screen.getAllByRole('button', { name: /^Harbour Lights, Season/ })[index];

describe('SearchScreen episodes rail (web TV)', () => {
  it('is reached with Down from the show and walked with Left/Right', async () => {
    await renderSearch('harbour');
    act(() => showCard().focus());

    pressArrow('down');
    expect(document.activeElement).toBe(episodeCard(0));

    pressArrow('right');
    pressArrow('right');
    pressArrow('right');
    expect(document.activeElement).toBe(episodeCard(3));
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(
      /^Harbour Lights, Season 2, episode 1 of 4/,
    );

    pressArrow('up');
    expect(document.activeElement).toBe(showCard());
  });

  it('is a single Tab stop', async () => {
    await renderSearch('harbour');
    const tabbable = screen
      .getAllByRole('button', { name: /^Harbour Lights, Season/ })
      .filter(card => card.getAttribute('tabindex') === '0');
    expect(tabbable).toHaveLength(1);
  });

  it('moves focus to the results when the query stops naming the show', async () => {
    await renderSearch('harbour');
    act(() => showCard().focus());
    pressArrow('down');
    expect(document.activeElement).toBe(episodeCard(0));

    act(() => setQuery('bunny'));

    expect(screen.queryAllByRole('button', { name: /^Harbour Lights, Season/ })).toHaveLength(0);
    expect(document.activeElement).toBe(
      screen.getAllByRole('button', { name: /, rated .* out of 5/ })[0],
    );
  });
});
