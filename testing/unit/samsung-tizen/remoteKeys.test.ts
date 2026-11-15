import { Platform } from 'react-native';
import { renderHook } from '@testing-library/react';
import { useBackHandler } from '../../../src/hooks/useBackHandler';
import {USER_AGENTS, WEB_BACK_KEY_CODE } from '../../helpers/remote';
import { webKeyDown } from '../../helpers/dom';

describe('samsung-tizen test environment', () => {
  it('runs react-native-web with the Tizen user agent', () => {
    expect(Platform.OS).toBe('web');
    expect(navigator.userAgent).toBe(USER_AGENTS['samsung-tizen']);
  });
});

describe('Samsung Smart Remote keys', () => {
  // KNOWN GAP: the app has no Tizen support yet. `it.failing` passes while
  // the behaviour is missing and fails once it works; when that happens,
  // change it to a plain `it`.
  it.failing('Back (keyCode 10009) runs the back handler', () => {
    const handler = jest.fn(() => true);
    const { unmount } = renderHook(() => useBackHandler(handler));

    webKeyDown({ keyCode: WEB_BACK_KEY_CODE['samsung-tizen'] });

    unmount();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  // Tizen only delivers media keys (Play, Pause, FF, RW...) to apps that
  // register them with tizen.tvinputdevice.registerKey().
  it.todo('registers the media keys the player handles');
});
