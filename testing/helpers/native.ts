// Remote-control input for the android-tv and apple-tv Jest projects.
import { DeviceEventEmitter, Platform } from 'react-native';
import { act } from '@testing-library/react-native';
import { RemoteButton } from './remote';

const TV_EVENT_TYPES: Record<RemoteButton, string> = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
  select: 'select',
  back: 'menu',
};

// D-pad / select press as react-native-tvos delivers it to TVEventHandler.
export const pressRemote = async (button: RemoteButton) => {
  await act(async () => {
    DeviceEventEmitter.emit('onHWKeyEvent', {
      eventType: TV_EVENT_TYPES[button],
      eventKeyAction: 'down',
    });
  });
};

// Back the way each platform delivers it: Android's hardware back event, or
// the Siri Remote's Menu button on tvOS.
export const pressBack = async () => {
  await act(async () => {
    if (Platform.OS === 'android') {
      DeviceEventEmitter.emit('hardwareBackPress');
    } else {
      DeviceEventEmitter.emit('onHWKeyEvent', { eventType: 'menu' });
    }
  });
};
