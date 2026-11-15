import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { FocusTrap } from '../../../src/accessibility/FocusTrap';

// The native Modal host is the dialog window TalkBack and VoiceOver land in.
// Query the rendered host directly: it is the element that receives Back.
const modalHost = () =>
  screen.container.queryAll(
    node => typeof node.props.onRequestClose === 'function',
  )[0];

const modalLayer = () =>
  screen.container.queryAll(
    node => node.props.accessibilityViewIsModal === true,
  )[0];

describe('FocusTrap (native TV)', () => {
  it('keeps its content out of the tree while closed', async () => {
    await render(
      <FocusTrap visible={false} onDismiss={jest.fn()}>
        <Text>Menu</Text>
      </FocusTrap>,
    );

    expect(screen.queryByText('Menu')).toBeNull();
  });

  it('shows its content in a modal window with a modal layer', async () => {
    await render(
      <FocusTrap visible onDismiss={jest.fn()}>
        <Text>Menu</Text>
      </FocusTrap>,
    );

    expect(screen.getByText('Menu')).toBeTruthy();
    expect(modalHost()).toBeTruthy();
    expect(modalLayer().props.accessibilityViewIsModal).toBe(true);
  });

  it('dismisses when the modal requests close (Android Back)', async () => {
    const onDismiss = jest.fn();
    await render(
      <FocusTrap visible onDismiss={onDismiss}>
        <Text>Menu</Text>
      </FocusTrap>,
    );

    await fireEvent(modalHost(), 'requestClose');

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses on an accessibility escape from inside the trap', async () => {
    const onDismiss = jest.fn();
    await render(
      <FocusTrap visible onDismiss={onDismiss}>
        <Text>Menu</Text>
      </FocusTrap>,
    );

    await fireEvent(modalLayer(), 'accessibilityEscape');

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
