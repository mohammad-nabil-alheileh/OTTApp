import { TVEventControl } from 'react-native';
import { renderHook } from '@testing-library/react-native';
import { useBackHandler } from '../../../src/hooks/useBackHandler';

// On tvOS the Menu button exits the app unless the menu key is enabled, so
// the hook must enable it while any handler is active and release it after.
describe('useBackHandler (apple-tv)', () => {
  let enable: jest.SpyInstance;
  let disable: jest.SpyInstance;

  beforeEach(() => {
    enable = jest
      .spyOn(TVEventControl, 'enableTVMenuKey')
      .mockImplementation(() => {});
    disable = jest
      .spyOn(TVEventControl, 'disableTVMenuKey')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('enables the menu key once for the first handler', async () => {
    const a = await renderHook(() => useBackHandler(() => true));
    const b = await renderHook(() => useBackHandler(() => true));
    expect(enable).toHaveBeenCalledTimes(1);
    await a.unmount();
    await b.unmount();
  });

  it('releases the menu key only after the last handler goes away', async () => {
    const a = await renderHook(() => useBackHandler(() => true));
    const b = await renderHook(() => useBackHandler(() => true));

    await a.unmount();
    expect(disable).not.toHaveBeenCalled();

    await b.unmount();
    expect(disable).toHaveBeenCalledTimes(1);
  });

  it('leaves the menu key alone while disabled, so Menu exits the app', async () => {
    const { unmount } = await renderHook(() => useBackHandler(() => true, false));
    await unmount();
    expect(enable).not.toHaveBeenCalled();
    expect(disable).not.toHaveBeenCalled();
  });
});
