import type { NetworkStatus } from '../../src/services/network';

// The app's monitor HEAD-probes a real host. Jest must never depend on the
// internet (or on how fast a probe times out), so every test starts from a
// device that is already online and is never told otherwise. Offline and
// error behaviour is covered by mocking the loaders instead.
export const onlineNetwork = {
  getNetworkStatus: (): NetworkStatus => 'online',
  ensureNetworkKnown: (): Promise<NetworkStatus> => Promise.resolve('online'),
  probeNetwork: (): Promise<NetworkStatus> => Promise.resolve('online'),
  subscribeToNetwork: () => () => undefined,
};
