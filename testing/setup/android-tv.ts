// Android TV: Platform.OS === 'android' comes from haste defaultPlatform in
// jest.config.js; this makes Platform.isTV true like a real TV device.
import { setPlatformConstants } from './native';

setPlatformConstants({ uiMode: 'tv', Release: '14', Model: 'Android TV' });
