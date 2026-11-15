import { DeviceEventEmitter, TVEventControl } from 'react-native';
import { renderHook } from '@testing-library/react-native';
import { useBackHandler } from '../../../src/hooks/useBackHandler';

// The Android back key arrives as a 'hardwareBackPress' device event.
const pressBack = () => DeviceEventEmitter.emit('hardwareBackPress');

describe('useBackHandler (android-tv)', () => {
  it('runs the newest handler first and stops when it returns true', async () => {
    const order: string[] = [];
    const older = jest.fn(() => {
      order.push('older');
      return false;
    });
    const newer = jest.fn(() => {
      order.push('newer');
      return true;
    });
    const a = await renderHook(() => useBackHandler(older));
    const b = await renderHook(() => useBackHandler(newer));

    pressBack();

    expect(order).toEqual(['newer']);
    await a.unmount();
    await b.unmount();
  });

  it('falls through to older handlers when the newer returns false', async () => {
    const older = jest.fn(() => true);
    const newer = jest.fn(() => false);
    const a = await renderHook(() => useBackHandler(older));
    const b = await renderHook(() => useBackHandler(newer));

    pressBack();

    expect(newer).toHaveBeenCalledTimes(1);
    expect(older).toHaveBeenCalledTimes(1);
    await a.unmount();
    await b.unmount();
  });

  it('stops listening when disabled or unmounted', async () => {
    const handler = jest.fn(() => true);
    const { rerender, unmount } = await renderHook(
      ({ enabled }: { enabled: boolean }) => useBackHandler(handler, enabled),
      { initialProps: { enabled: false } },
    );
    pressBack();
    expect(handler).not.toHaveBeenCalled();

    await rerender({ enabled: true });
    pressBack();
    expect(handler).toHaveBeenCalledTimes(1);

    await unmount();
    pressBack();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('never touches the tvOS menu key', async () => {
    const enable = jest.spyOn(TVEventControl, 'enableTVMenuKey');
    const { unmount } = await renderHook(() => useBackHandler(() => true));
    await unmount();
    expect(enable).not.toHaveBeenCalled();
  });
});
