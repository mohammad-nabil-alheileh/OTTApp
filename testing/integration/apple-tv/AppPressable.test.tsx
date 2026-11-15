import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AppText } from '../../../src/components/AppText/AppText';
import { AppPressable } from '../../../src/components/AppPressable/AppPressable';

// The TalkBack "activate" workaround is Android-only; VoiceOver on tvOS
// presses through the normal path, so nothing extra may be added there.
describe('AppPressable (apple-tv)', () => {
  it('does not add the Android activate action', async () => {
    await render(
      <AppPressable
        onPress={jest.fn()}
        accessibilityRole="button"
        accessibilityLabel="Play"
      >
        <AppText>Play</AppText>
      </AppPressable>,
    );

    const button = screen.getByRole('button', { name: 'Play' });
    expect(button.props.accessibilityActions ?? []).not.toEqual(
      expect.arrayContaining([{ name: 'activate' }]),
    );
  });
});
