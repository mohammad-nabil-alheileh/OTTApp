import React from 'react';
import { AccessibilityInfo, View } from 'react-native';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react-native';
import { useRailEndStop } from '../../../src/focus/useRailEndStop';

// Stand-in for a card's native view: only what the end stop calls on it.
const fakeNode = () =>
  ({ requestTVFocus: jest.fn() } as unknown as View & {
    requestTVFocus: jest.Mock;
  });

const renderRail = async (screenReader: boolean, itemCount = 3) => {
  jest
    .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
    .mockResolvedValue(screenReader);
  const hook = await renderHook(() => useRailEndStop(itemCount));
  await act(async () => {});
  return hook;
};

describe('useRailEndStop (android-tv)', () => {
  afterEach(() => jest.restoreAllMocks());

  it('sends focus from the end stop back to the last card under TalkBack', async () => {
    const send = jest
      .spyOn(AccessibilityInfo, 'sendAccessibilityEvent')
      .mockImplementation(() => {});
    const hook = await renderRail(true);
    const last = fakeNode();
    hook.result.current.withEndStop({}, 2).ref?.(last);

    await render(<>{hook.result.current.endStopProps.ListFooterComponent}</>);
    fireEvent(screen.getByLabelText('End of row'), 'focus');

    expect(last.requestTVFocus).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(last, 'focus');
  });

  it('keeps the card refs it wraps', async () => {
    const hook = await renderRail(true);
    const ownRef = jest.fn();
    const node = fakeNode();

    hook.result.current.withEndStop({ ref: ownRef }, 2).ref?.(node);

    expect(ownRef).toHaveBeenCalledWith(node);
  });

  it('adds no end stop without a screen reader', async () => {
    const hook = await renderRail(false);
    const props = { onFocus: jest.fn() };

    expect(hook.result.current.endStopProps.ListFooterComponent).toBeUndefined();
    expect(hook.result.current.withEndStop(props, 2)).toBe(props);
  });
});
