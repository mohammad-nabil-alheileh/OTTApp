import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { AccountScreen } from '../../../src/components/AccountScreen/AccountScreen';
import { MOCK_ACCOUNT } from '../../../src/services/account';
import { mockVODData } from '../../../src/services/mockData';
import { pressBack } from '../../helpers/native';
import { VODItem } from '../../../src/types/vod';

// Runs under both android-tv and apple-tv: the fake data is the only stand-in,
// the screen renders exactly as the app mounts it.
const favorites = mockVODData.slice(0, 2);

const renderAccount = async (items: VODItem[] = []) => {
  const onBack = jest.fn();
  const onSelectVOD = jest.fn();
  await render(
    <AccountScreen
      profile={MOCK_ACCOUNT}
      favorites={items}
      onSelectVOD={onSelectVOD}
      onBack={onBack}
    />,
  );
  return { onBack, onSelectVOD };
};

const favoriteCard = (title: string) =>
  screen.getByRole('button', {
    name: new RegExp(`^${title}, favorite`),
  });

interface TreeNode {
  props: Record<string, unknown>;
  parent: TreeNode | null;
}

// The TV focus engine only lands on focusable views; a block without one is a
// dead end for Down, which is exactly what this screen used to be.
const focusableAncestor = (element: unknown) => {
  let node = element as TreeNode | null;
  while (node && node.props.focusable !== true) {
    node = node.parent;
  }
  return node;
};

describe('AccountScreen (native TV)', () => {
  it('shows the profile with a placeholder avatar and account details', async () => {
    await renderAccount();

    expect(screen.getByRole('header', { name: 'Account' })).toBeTruthy();
    expect(screen.getByText('Alex Carter')).toBeTruthy();
    expect(screen.getByText('alex.carter@example.com')).toBeTruthy();
    // No photo on file, so the avatar falls back to initials; it is hidden
    // from screen readers, which already hear the name next to it.
    expect(screen.getByText('AC', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText('Premium 4K')).toBeTruthy();
    expect(screen.getByText('March 2024')).toBeTruthy();
    expect(screen.getByText('2 of 3 in use')).toBeTruthy();
  });

  it('starts on Back so leaving the page is one press away', async () => {
    const { onBack } = await renderAccount();
    const back = screen.getByRole('button', { name: 'Back' });

    expect(back.props.hasTVPreferredFocus).toBe(true);
    expect(back.props.accessibilityHint).toBe('Closes account');

    fireEvent.press(back);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('closes on the remote Back key', async () => {
    const { onBack } = await renderAccount();

    await pressBack();

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('gives the remote a focus stop on every section below Back', async () => {
    await renderAccount();

    expect(focusableAncestor(screen.getByText('Alex Carter'))).not.toBeNull();
    expect(focusableAncestor(screen.getByText('Plan'))).not.toBeNull();
    expect(
      focusableAncestor(screen.getByText(/Nothing saved yet/)),
    ).not.toBeNull();
  });

  it('explains how to fill an empty favorites row', async () => {
    await renderAccount();

    expect(screen.getByRole('header', { name: 'Favorites' })).toBeTruthy();
    expect(
      screen.getByText(
        "Nothing saved yet. Press Favorite on a title's details page and it will show up here.",
      ),
    ).toBeTruthy();
  });

  it('lists favorites and opens the chosen title', async () => {
    const { onSelectVOD } = await renderAccount(favorites);

    expect(screen.queryByText(/Nothing saved yet/)).toBeNull();
    favorites.forEach(item => expect(favoriteCard(item.title)).toBeTruthy());

    fireEvent.press(favoriteCard(favorites[1].title));
    expect(onSelectVOD).toHaveBeenCalledWith(favorites[1]);
  });
});
