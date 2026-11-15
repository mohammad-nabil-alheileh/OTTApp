// Apple TV: Platform.OS === 'ios' comes from haste defaultPlatform in
// jest.config.js; interfaceIdiom 'tv' makes Platform.isTV and isTVOS true.
import { setPlatformConstants } from './native';

setPlatformConstants({
  interfaceIdiom: 'tv',
  systemName: 'tvOS',
  osVersion: '18.0',
});
