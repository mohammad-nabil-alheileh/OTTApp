import { fireEvent, screen } from '@testing-library/react';
import { findFirstCard, pressKey, renderApp } from '../../helpers/web';
import { mockVODData } from '../../../src/services/mockData';
import { mockStore } from '../../mocks/asyncStorage';

// Whole-app flow under both lg-webos and samsung-tizen. Each platform's own
// Back keyCode is covered in integration/<platform>/.
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const appTitle = () =>
  screen.getByRole('heading', { name: /OTT TV App/ });

describe('App navigation (web TV)', () => {
  it('lands focus on the app title after loading', async () => {
    await renderApp();
    expect(await findFirstCard()).toBeTruthy();
    expect(document.activeElement).toBe(appTitle());
  });

  it('opens details from a card and returns home with Escape', async () => {
    await renderApp();

    fireEvent.click(await findFirstCard());
    expect(await screen.findByRole('button', { name: 'Play' })).toBeTruthy();

    await pressKey('Escape');

    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
    expect(await findFirstCard()).toBeTruthy();
  });

  it('opens the account page from the header and returns home with Escape', async () => {
    await renderApp();

    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(screen.getByText('Alex Carter')).toBeTruthy();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Back' }),
    );

    await pressKey('Escape');

    expect(screen.queryByText('Alex Carter')).toBeNull();
    expect(await findFirstCard()).toBeTruthy();
  });
});

describe('Focus after Player → Continue Watching (web TV)', () => {
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

  it('returns focus to the played title by id, though it moved to the front', async () => {
    await renderApp();

    fireEvent.click(await continueCard(b.title));
    fireEvent.click(await screen.findByRole('button', { name: /^Resume from/ }));
    await pressKey('Escape'); // player → details
    await pressKey('Escape'); // details → home

    expect(document.activeElement).toBe(await continueCard(b.title));
  });

  it('forgets the card once Home is left from the header', async () => {
    await renderApp();

    fireEvent.click(await continueCard(b.title));
    await pressKey('Escape'); // details → home
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await pressKey('Escape'); // search → home

    expect(document.activeElement).toBe(appTitle());
  });
});
