// Shared setup for the react-native-tvos projects (android-tv, apple-tv).
// Runs after the react-native Jest preset's own setup.

// Make Platform report a TV. Platform reads these constants lazily on first
// access, so patching them here is early enough.
export const setPlatformConstants = (extra: Record<string, unknown>) => {
  const { NativeModules } = require('react-native');
  const original = NativeModules.PlatformConstants.getConstants;
  NativeModules.PlatformConstants.getConstants = () => ({
    ...original(),
    ...extra,
  });
};

// The TV remote's events (D-pad, select, Menu/Back on tvOS) come from this
// native emitter. The Jest preset has no such module, which on tvOS would make
// TVEventHandler and BackHandler silently ignore every key. With the stub in
// place, testing/helpers/native.ts can emit remote presses.
{
  const { NativeModules } = require('react-native');
  NativeModules.TVNavigationEventEmitter = {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    enableTVMenuKey: jest.fn(),
    disableTVMenuKey: jest.fn(),
    enableTVPanGesture: jest.fn(),
    disableTVPanGesture: jest.fn(),
    enableGestureHandlersCancelTouches: jest.fn(),
    disableGestureHandlersCancelTouches: jest.fn(),
  };
}

jest.mock('@react-native-async-storage/async-storage', () =>
  require('../mocks/asyncStorage'),
);

// Never let a test reach the real reachability probe.
jest.mock('../../src/services/network', () =>
  require('../mocks/network').onlineNetwork,
);

// react-native-video is a native view; render it as a plain host component
// so tests can find it and read its props.
jest.mock('react-native-video', () => {
  const React = require('react');
  const Video = React.forwardRef((props: object, ref: unknown) =>
    React.createElement('Video', { ...props, ref }),
  );
  return {
    __esModule: true,
    default: Video,
    SelectedVideoTrackType: { AUTO: 'auto', RESOLUTION: 'resolution' },
    ViewType: { TEXTURE: 0 },
  };
});
