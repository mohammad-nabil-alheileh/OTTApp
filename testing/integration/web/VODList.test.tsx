import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { VODList } from '../../../src/components/VODList/VODList';
import { mockVODData } from '../../../src/services/mockData';
import { pressArrow } from '../../helpers/web';

// Runs under both lg-webos and samsung-tizen: react-native-web renders real
// DOM, and the web focus group (not a native focus engine) moves focus.
const items = mockVODData.slice(0, 3);
const [first, second, third] = items;

const card = (title: string) =>
  screen.getByRole('button', { name: new RegExp(`^${title}, rated`) });

describe('VODList (web TV)', () => {
  it('announces loading in a polite live region', () => {
    render(<VODList vodList={[]} onSelectVOD={jest.fn()} isLoading />);
    const status = screen.getByText('Loading VODs...');
    expect(status.closest('[aria-live="polite"]')).not.toBeNull();
  });

  it('renders one labelled button per item under a heading', () => {
    render(<VODList vodList={items} onSelectVOD={jest.fn()} isLoading={false} />);

    expect(screen.getByRole('heading', { name: 'Videos On Demand' })).toBeTruthy();
    items.forEach(item => expect(card(item.title)).toBeTruthy());
  });

  it('focuses the first card once data has loaded', () => {
    const { rerender } = render(
      <VODList vodList={[]} onSelectVOD={jest.fn()} isLoading />,
    );
    rerender(<VODList vodList={items} onSelectVOD={jest.fn()} isLoading={false} />);

    expect(document.activeElement).toBe(card(first.title));
  });

  it('keeps a single tab stop on the rail (roving tabindex)', () => {
    render(<VODList vodList={items} onSelectVOD={jest.fn()} isLoading={false} />);

    expect(card(first.title).tabIndex).toBe(0);
    expect(card(second.title).tabIndex).toBe(-1);
  });

  it('moves focus along the rail with Left/Right and stops at the ends', async () => {
    render(<VODList vodList={items} onSelectVOD={jest.fn()} isLoading={false} />);

    await pressArrow('right');
    expect(document.activeElement).toBe(card(second.title));

    await pressArrow('right');
    await pressArrow('right');
    expect(document.activeElement).toBe(card(third.title));

    await pressArrow('left');
    expect(document.activeElement).toBe(card(second.title));
  });

  it('selects the activated item', () => {
    const onSelectVOD = jest.fn();
    render(<VODList vodList={items} onSelectVOD={onSelectVOD} isLoading={false} />);

    fireEvent.click(card(second.title));

    expect(onSelectVOD).toHaveBeenCalledWith(second);
  });
});
