import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { AppText } from '../../../src/components/AppText/AppText';
import { AppPressable } from '../../../src/components/AppPressable/AppPressable';

// With TalkBack on, Android TV turns the D-pad centre key into an
// accessibility "activate" action instead of a press.
const activate = (element: Parameters<typeof fireEvent>[0]) =>
  fireEvent(element, 'accessibilityAction', {
    nativeEvent: { actionName: 'activate' },
  });

describe('AppPressable with TalkBack (android-tv)', () => {
  it('declares the activate action and defaults to a button', async () => {
    await render(
      <AppPressable onPress={jest.fn()} accessibilityLabel="Play">
        <AppText>Play</AppText>
      </AppPressable>,
    );
    const button = screen.getByRole('button', { name: 'Play' });
    expect(button.props.accessibilityActions).toEqual(
      expect.arrayContaining([{ name: 'activate' }]),
    );
  });

  it('turns the activate action into onPress', async () => {
    const onPress = jest.fn();
    await render(
      <AppPressable onPress={onPress} accessibilityLabel="Play">
        <AppText>Play</AppText>
      </AppPressable>,
    );

    await activate(screen.getByRole('button', { name: 'Play' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores activate while disabled', async () => {
    const onPress = jest.fn();
    await render(
      <AppPressable onPress={onPress} disabled accessibilityLabel="Play">
        <AppText>Play</AppText>
      </AppPressable>,
    );

    await activate(screen.getByLabelText('Play'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('passes other accessibility actions through', async () => {
    const onAccessibilityAction = jest.fn();
    await render(
      <AppPressable
        onPress={jest.fn()}
        accessibilityLabel="Play"
        accessibilityActions={[{ name: 'longpress' }]}
        onAccessibilityAction={onAccessibilityAction}
      >
        <AppText>Play</AppText>
      </AppPressable>,
    );

    await fireEvent(screen.getByLabelText('Play'), 'accessibilityAction', {
      nativeEvent: { actionName: 'longpress' },
    });

    expect(onAccessibilityAction).toHaveBeenCalledTimes(1);
  });
});
