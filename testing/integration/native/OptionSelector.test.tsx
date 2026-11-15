import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { OptionSelector } from '../../../src/components/OptionSelector/OptionSelector';
import { pressBack } from '../../helpers/native';

const OPTIONS = [
  { value: 1, label: 'x1' },
  { value: 1.5, label: 'x1.5' },
];

const renderSelector = async () => {
  const onChange = jest.fn();
  const onOpenChange = jest.fn();
  await render(
    <OptionSelector
      title="Speed"
      options={OPTIONS}
      value={1}
      onChange={onChange}
      onOpenChange={onOpenChange}
    />,
  );
  return { onChange, onOpenChange };
};

const openMenu = () =>
  fireEvent.press(screen.getByRole('button', { name: 'Speed: x1' }));

const modalHost = () =>
  screen.container.queryAll(
    node => typeof node.props.onRequestClose === 'function',
  )[0];

const modalLayer = () =>
  screen.container.queryAll(
    node => node.props.accessibilityViewIsModal === true,
  );

describe('OptionSelector focus trap (native TV)', () => {
  it('moves the options into a modal layer while open', async () => {
    await renderSelector();
    expect(screen.queryByRole('button', { name: 'x1.5' })).toBeNull();

    await openMenu();

    expect(screen.getByRole('button', { name: 'x1.5' })).toBeTruthy();
    expect(modalLayer()).toHaveLength(1);
  });

  it('reports the menu opening and closing to the player', async () => {
    const { onOpenChange } = await renderSelector();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    await openMenu();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await fireEvent(modalHost(), 'requestClose');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('selects an option, reports it and closes the trap', async () => {
    const { onChange } = await renderSelector();
    await openMenu();

    await fireEvent.press(screen.getByRole('button', { name: 'x1.5' }));

    expect(onChange).toHaveBeenCalledWith(1.5);
    expect(screen.queryByRole('button', { name: 'x1.5' })).toBeNull();
  });

  it('closes on Back and on an accessibility escape', async () => {
    await renderSelector();

    await openMenu();
    await pressBack();
    expect(screen.queryByRole('button', { name: 'x1.5' })).toBeNull();

    await openMenu();
    await fireEvent(
      screen.getByRole('button', { name: 'x1.5' }),
      'accessibilityEscape',
    );
    expect(screen.queryByRole('button', { name: 'x1.5' })).toBeNull();
  });
});
