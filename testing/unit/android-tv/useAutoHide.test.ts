import { act, renderHook } from '@testing-library/react-native';
import { useAutoHide } from '../../../src/hooks/useAutoHide';
import { pressRemote } from '../../helpers/native';

const hideControls = async () => {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(6000);
  });
};

describe('useAutoHide (android-tv)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('remembers that Up woke the hidden controls', async () => {
    const { result, unmount } = await renderHook(() => useAutoHide(false));
    await hideControls();
    expect(result.current.visible).toBe(false);

    await pressRemote('up');

    expect(result.current.visible).toBe(true);
    expect(result.current.wokeWithUp).toBe(true);
    await unmount();
  });

  it('does not report Up for other wake keys or while already visible', async () => {
    const { result, unmount } = await renderHook(() => useAutoHide(false));
    expect(result.current.wokeWithUp).toBe(false);

    await pressRemote('up');
    expect(result.current.wokeWithUp).toBe(false);

    await hideControls();
    await pressRemote('select');
    expect(result.current.visible).toBe(true);
    expect(result.current.wokeWithUp).toBe(false);
    await unmount();
  });
});
