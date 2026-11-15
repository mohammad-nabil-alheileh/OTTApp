import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { AccountScreen } from '../../../src/components/AccountScreen/AccountScreen';
import { MOCK_ACCOUNT } from '../../../src/services/account';
import { mockVODData } from '../../../src/services/mockData';
import { pressArrow } from '../../helpers/web';
import { VODItem } from '../../../src/types/vod';

// Runs under lg-webos and samsung-tizen: react-native-web renders real DOM and
// the web focus group, not a native focus engine, decides where focus lands.
const favorites = mockVODData.slice(0, 2);

const renderAccount = (items: VODItem[] = []) => {
  const onBack = jest.fn();
  const onSelectVOD = jest.fn();
  const view = render(
    <AccountScreen
      profile={MOCK_ACCOUNT}
      favorites={items}
      onSelectVOD={onSelectVOD}
      onBack={onBack}
    />,
  );
  return { onBack, onSelectVOD, view };
};

const favoriteCard = (title: string) =>
  screen.getByRole('button', { name: new RegExp(`^${title}, favorite`) });

// The block that holds the text, i.e. the focus stop the remote lands on.
const blockAround = (text: string | RegExp) =>
  screen.getByText(text).closest('[tabindex]') as HTMLElement;

describe('AccountScreen (web TV)', () => {
  it('shows the profile and account details', () => {
    const { view } = renderAccount();

    expect(screen.getByRole('heading', { name: 'Account' })).toBeTruthy();
    expect(screen.getByText('Alex Carter')).toBeTruthy();
    expect(screen.getByText('alex.carter@example.com')).toBeTruthy();
    expect(screen.getByText('AC')).toBeTruthy();
    expect(screen.getByText('Premium 4K')).toBeTruthy();
    expect(screen.getByText('March 2024')).toBeTruthy();
    expect(screen.getByText('2 of 3 in use')).toBeTruthy();
    view.unmount();
  });

  it('puts the remote on Back, even with favorites competing for focus', () => {
    const { view } = renderAccount(favorites);

    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Back' }),
    );
    view.unmount();
  });

  it('closes with Escape and from the visible Back button', () => {
    const { onBack, view } = renderAccount();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onBack).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(2);
    view.unmount();
  });

  it('walks down the page to the favorites rail', async () => {
    const { view } = renderAccount(favorites);

    await pressArrow('down');
    expect(document.activeElement).toBe(blockAround('Alex Carter'));
    await pressArrow('down');
    expect(document.activeElement).toBe(blockAround('Plan'));
    await pressArrow('down');
    expect(document.activeElement).toBe(favoriteCard(favorites[0].title));
    view.unmount();
  });

  it('walks down every section when there are no favorites', async () => {
    const { view } = renderAccount();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Back' }),
    );

    await pressArrow('down');
    expect(document.activeElement).toBe(blockAround('Alex Carter'));
    await pressArrow('down');
    expect(document.activeElement).toBe(blockAround('Plan'));
    await pressArrow('down');
    expect(document.activeElement).toBe(blockAround(/Nothing saved yet/));

    // Up retraces the same path instead of jumping back to Back.
    await pressArrow('up');
    expect(document.activeElement).toBe(blockAround('Plan'));
    await pressArrow('up');
    expect(document.activeElement).toBe(blockAround('Alex Carter'));
    await pressArrow('up');
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Back' }),
    );
    view.unmount();
  });

  it('explains how to fill an empty favorites row', () => {
    const { view } = renderAccount();

    expect(screen.getByRole('heading', { name: 'Favorites' })).toBeTruthy();
    expect(screen.getByText(/Nothing saved yet/)).toBeTruthy();
    view.unmount();
  });

  it('lists favorites and opens the chosen title', () => {
    const { onSelectVOD, view } = renderAccount(favorites);

    expect(screen.getByRole('heading', { name: 'Favorites' })).toBeTruthy();

    fireEvent.click(favoriteCard(favorites[0].title));
    expect(onSelectVOD).toHaveBeenCalledWith(favorites[0]);
    view.unmount();
  });
});
