import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { VODList } from '../../../src/components/VODList/VODList';
import { mockVODData } from '../../../src/services/mockData';

// Runs under both android-tv and apple-tv.
const items = mockVODData.slice(0, 3);
const [first, second] = items;

const cardLabel = (title: string) => new RegExp(`^${title}, rated`);

const railProps = {
  failure: null,
  onRetry: jest.fn(),
};

describe('VODList (native TV)', () => {
  it('announces loading politely while data is on its way', async () => {
    await render(
      <VODList vodList={[]} onSelectVOD={jest.fn()} isLoading {...railProps} />,
    );
    expect(screen.getByText('Loading VODs...')).toBeTruthy();
  });

  it('holds preferred focus in the first card slot while loading', async () => {
    await render(
      <VODList vodList={[]} onSelectVOD={jest.fn()} isLoading {...railProps} />,
    );

    const placeholder = screen.getByRole('button', { name: 'Loading videos' });
    expect(placeholder.props.hasTVPreferredFocus).toBe(true);
  });

  it('keeps the same focused view when the videos arrive', async () => {
    const { rerender } = await render(
      <VODList vodList={[]} onSelectVOD={jest.fn()} isLoading {...railProps} />,
    );
    const placeholder = screen.getByRole('button', { name: 'Loading videos' });

    await rerender(
      <VODList
        vodList={items}
        onSelectVOD={jest.fn()}
        isLoading={false}
        {...railProps}
      />,
    );

    // A remount would drop native focus to the header before the card took it.
    const firstCard = screen.getByRole('button', { name: cardLabel(first.title) });
    // Compared as a boolean: a failing diff of host elements is circular.
    expect(firstCard === placeholder).toBe(true);
  });

  it('renders one labelled button per item under a header', async () => {
    await render(
      <VODList
        vodList={items}
        onSelectVOD={jest.fn()}
        isLoading={false}
        {...railProps}
      />,
    );

    expect(screen.getByRole('header', { name: 'Videos On Demand' })).toBeTruthy();
    for (const item of items) {
      expect(screen.getByRole('button', { name: cardLabel(item.title) })).toBeTruthy();
    }
  });

  it('gives the TV focus engine the first card as preferred focus', async () => {
    await render(
      <VODList
        vodList={items}
        onSelectVOD={jest.fn()}
        isLoading={false}
        {...railProps}
      />,
    );

    const firstCard = screen.getByRole('button', { name: cardLabel(first.title) });
    const secondCard = screen.getByRole('button', { name: cardLabel(second.title) });
    expect(firstCard.props.hasTVPreferredFocus).toBe(true);
    expect(secondCard.props.hasTVPreferredFocus).toBeFalsy();
  });

  it('selects the pressed item', async () => {
    const onSelectVOD = jest.fn();
    await render(
      <VODList
        vodList={items}
        onSelectVOD={onSelectVOD}
        isLoading={false}
        {...railProps}
      />,
    );

    await fireEvent.press(
      screen.getByRole('button', { name: cardLabel(second.title) }),
    );

    expect(onSelectVOD).toHaveBeenCalledWith(second);
  });

  it('keeps the row header and offers a focused retry when the row fails', async () => {
    const onRetry = jest.fn();
    await render(
      <VODList
        vodList={[]}
        onSelectVOD={jest.fn()}
        isLoading={false}
        failure={{ kind: 'offline' }}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('header', { name: 'Videos On Demand' })).toBeTruthy();
    const retry = screen.getByRole('button', { name: /^You're offline/ });
    expect(retry.props.hasTVPreferredFocus).toBe(true);

    await fireEvent.press(retry);
    expect(onRetry).toHaveBeenCalled();
  });
});

describe('VODList series cards (native TV)', () => {
  it('reads the season count instead of a runtime', async () => {
    const series = mockVODData.find(v => v.id === 'vod-17')!;
    await render(
      <VODList vodList={[series]} onSelectVOD={jest.fn()} isLoading={false} {...railProps} />,
    );
    expect(
      screen.getByRole('button', { name: 'Harbour Lights, rated 7.9 out of 5, 2 seasons' }),
    ).toBeTruthy();
  });
});
