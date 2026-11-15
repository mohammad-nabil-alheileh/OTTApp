import { Platform } from 'react-native';
import { renderHook } from '@testing-library/react';
import { useBackHandler } from '../../../src/hooks/useBackHandler';
import {USER_AGENTS, WEB_BACK_KEY_CODE } from '../../helpers/remote';
import { webKeyDown } from '../../helpers/dom';

describe('lg-webos test environment', () => {
  it('runs react-native-web with the webOS user agent', () => {
    expect(Platform.OS).toBe('web');
    expect(navigator.userAgent).toBe(USER_AGENTS['lg-webos']);
  });
});

describe('LG Magic Remote keys', () => {
  it('Back (keyCode 461) runs the back handler', () => {
    const handler = jest.fn(() => true);
    const { unmount } = renderHook(() => useBackHandler(handler));

    const event = webKeyDown({ keyCode: WEB_BACK_KEY_CODE['lg-webos'] });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
    unmount();
  });
});
