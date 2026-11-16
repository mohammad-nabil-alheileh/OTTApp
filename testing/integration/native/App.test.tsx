import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import App from '../../../src/App';
import { mockVODData } from '../../../src/services/mockData';
import { pressBack } from '../../helpers/native';
import { mockStore } from '../../mocks/asyncStorage';

// Whole-app flow under both android-tv and apple-tv: real components, real
// state, only the native boundary (storage, video, remote) is faked.
const [first] = mockVODData;
const firstCard = () =>
  screen.findByRole('button', { name: new RegExp(`^${first.title}, rated`) });

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const renderHome = async () => {
  await render(<App />);
  // The catalogue arrives after a simulated 500 ms network delay that starts
  // once the network status promise settles.
  await act(async () => {
    await jest.advanceTimersByTimeAsync(600);
  });
};

describe('App navigation (native TV)', () => {
  it('shows the catalogue after loading', async () => {
    await renderHome();
    expect(await firstCard()).toBeTruthy();
  });

  it('opens details from a card and returns home with Back', async () => {
    await renderHome();

    await fireEvent.press(await firstCard());
    expect(await screen.findByRole('button', { name: 'Play' })).toBeTruthy();
    expect(screen.getByRole('header', { name: first.title })).toBeTruthy();

    await pressBack();

    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
    expect(await firstCard()).toBeTruthy();
  });

  it('opens the account page from the header and returns home with Back', async () => {
    await renderHome();

    await fireEvent.press(screen.getByRole('button', { name: 'Account' }));
    expect(await screen.findByText('Alex Carter')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Account' })).toBeTruthy();

    await pressBack();

    expect(screen.queryByRole('header', { name: 'Account' })).toBeNull();
    expect(await firstCard()).toBeTruthy();
  });
});

describe('Focus after Player → Continue Watching (native TV)', () => {
  const [a, b, c] = mockVODData;
  const continueCard = (title: string) =>
    screen.findByRole('button', { name: new RegExp(`^${title}, .* left`) });

  beforeEach(() => {
    mockStore.clear();
    mockStore.set(
      'ott:watchHistory',
      JSON.stringify(
        [a, b, c].map(vod => ({ id: vod.id, position: 30, duration: 600 })),
      ),
    );
  });

  it('gives preferred focus to the played title by id, though it moved to the front', async () => {
    await renderHome();

    await fireEvent.press(await continueCard(b.title));
    await fireEvent.press(await screen.findByRole('button', { name: /^Resume from/ }));
    await pressBack(); // player → details
    await pressBack(); // details → home

    const preferred = screen
      .getAllByRole('button')
      .filter(button => button.props.hasTVPreferredFocus)
      .map(button => button.props.accessibilityLabel);
    expect(preferred).toEqual([
      (await continueCard(b.title)).props.accessibilityLabel,
    ]);
  });
});

describe('Series and catch-up (native TV)', () => {
  beforeEach(() => {
    mockStore.clear();
  });

  it('resumes an episode in progress from Continue Watching through Details', async () => {
    mockStore.set(
      'ott:watchHistory',
      JSON.stringify([{ id: 'vod-17-s2e2', position: 630, duration: 2610 }]),
    );
    await renderHome();

    await fireEvent.press(
      await screen.findByRole('button', {
        name: /^Harbour Lights, season 2, episode 2, Salt, 33 min left/,
      }),
    );
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Resume season 2, episode 2, Salt, from 10:30' }),
    );

    expect(await screen.findByText('Harbour Lights · S2 E2 · Salt')).toBeTruthy();
    await pressBack(); // player → details
    expect(await screen.findByRole('tab', { name: 'Season 2, 4 episodes' })).toBeTruthy();
  });

  it('plays a catch-up recording from its Home rail', async () => {
    await renderHome();

    expect(screen.getByRole('header', { name: 'Catch-up' })).toBeTruthy();
    await fireEvent.press(
      await screen.findByRole('button', { name: /^Morning Briefing, Live Demo, aired / }),
    );

    expect(await screen.findByText('Morning Briefing · Live Demo')).toBeTruthy();
  });
});
