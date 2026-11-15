import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { VODList } from '../../../src/components/VODList/VODList';
import { mockVODData } from '../../../src/services/mockData';

// Runs under both android-tv and apple-tv.
const items = mockVODData.slice(0, 3);
const [first, second] = items;

const cardLabel = (title: string) => new RegExp(`^${title}, rated`);

describe('VODList (native TV)', () => {
  it('announces loading politely while data is on its way', async () => {
    await render(<VODList vodList={[]} onSelectVOD={jest.fn()} isLoading />);
    expect(screen.getByText('Loading VODs...')).toBeTruthy();
  });

  it('renders one labelled button per item under a header', async () => {
    await render(
      <VODList vodList={items} onSelectVOD={jest.fn()} isLoading={false} />,
    );

    expect(screen.getByRole('header', { name: 'Videos On Demand' })).toBeTruthy();
    for (const item of items) {
      expect(screen.getByRole('button', { name: cardLabel(item.title) })).toBeTruthy();
    }
  });

  it('gives the TV focus engine the first card as preferred focus', async () => {
    await render(
      <VODList vodList={items} onSelectVOD={jest.fn()} isLoading={false} />,
    );

    const firstCard = screen.getByRole('button', { name: cardLabel(first.title) });
    const secondCard = screen.getByRole('button', { name: cardLabel(second.title) });
    expect(firstCard.props.hasTVPreferredFocus).toBe(true);
    expect(secondCard.props.hasTVPreferredFocus).toBeFalsy();
  });

  it('selects the pressed item', async () => {
    const onSelectVOD = jest.fn();
    await render(
      <VODList vodList={items} onSelectVOD={onSelectVOD} isLoading={false} />,
    );

    await fireEvent.press(
      screen.getByRole('button', { name: cardLabel(second.title) }),
    );

    expect(onSelectVOD).toHaveBeenCalledWith(second);
  });
});
