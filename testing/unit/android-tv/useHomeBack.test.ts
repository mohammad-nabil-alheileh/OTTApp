import { createRef } from 'react';
import { AccessibilityInfo, ScrollView, View } from 'react-native';
import { act, renderHook } from '@testing-library/react-native';
import { HOME_HEADER_ROW, useHomeBack } from '../../../src/hooks/useHomeBack';
import { pressBack } from '../../helpers/native';

// Stand-in for a card's native view: only what useHomeBack calls on it.
const fakeNode = () =>
  ({ requestTVFocus: jest.fn() } as unknown as View & {
    requestTVFocus: jest.Mock;
  });

const renderHome = async () => {
  const scrollRef = createRef<ScrollView>();
  const hook = await renderHook(() => useHomeBack(scrollRef, true));
  const header = fakeNode();
  const vod = fakeNode();
  await act(async () => {
    hook.result.current.getRow(HOME_HEADER_ROW).firstItemRef(header);
    hook.result.current.getRow('vod').firstItemRef(vod);
  });
  return { hook, header, vod };
};

describe('useHomeBack (android-tv)', () => {
  afterEach(() => jest.restoreAllMocks());

  it('sends Back from a content row to the header, not the first content row', async () => {
    const { hook, header, vod } = await renderHome();
    await act(async () => hook.result.current.getRow('vod').onFocus());

    await pressBack();

    expect(header.requestTVFocus).toHaveBeenCalledTimes(1);
    expect(vod.requestTVFocus).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it('moves TalkBack focus to the header too', async () => {
    const send = jest
      .spyOn(AccessibilityInfo, 'sendAccessibilityEvent')
      .mockImplementation(() => {});
    const { hook, header } = await renderHome();
    await act(async () => hook.result.current.getRow('vod').onFocus());

    await pressBack();

    expect(send).toHaveBeenCalledWith(header, 'focus');
    await hook.unmount();
  });

  it('leaves Back unhandled on the header so the app can exit', async () => {
    const { hook, header, vod } = await renderHome();
    await act(async () =>
      hook.result.current.getRow(HOME_HEADER_ROW).onFocus(),
    );

    await pressBack();

    expect(header.requestTVFocus).not.toHaveBeenCalled();
    expect(vod.requestTVFocus).not.toHaveBeenCalled();
    await hook.unmount();
  });
});
