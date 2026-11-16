import { AccessibilityInfo } from 'react-native';
import { act, renderHook } from '@testing-library/react-native';
import { useRailEndStop } from '../../../src/focus/useRailEndStop';

describe('useRailEndStop (apple-tv)', () => {
  afterEach(() => jest.restoreAllMocks());

  // VoiceOver follows the tvOS focus engine, which already stops at a rail's end.
  it('adds no end stop while VoiceOver runs', async () => {
    jest.spyOn(AccessibilityInfo, 'isScreenReaderEnabled').mockResolvedValue(true);
    const hook = await renderHook(() => useRailEndStop(3));
    await act(async () => {});

    expect(hook.result.current.endStopProps.ListFooterComponent).toBeUndefined();
  });
});
