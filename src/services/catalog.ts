import { mockLiveChannels, mockPodcasts, mockVODData } from './mockData';
import {
  ensureNetworkKnown,
  getNetworkStatus,
  probeNetwork,
} from './network';
import { LoadFailure, LoadFailureKind } from '../types/load';

// Simulated request latency; swap the bodies for real calls when an API
// exists. The shape is what matters here: every dataset loads on its own, so
// one failed row never takes the rest of the page down with it.
const REQUEST_LATENCY_MS = 500;

export class LoadError extends Error {
  readonly kind: LoadFailureKind;

  constructor(kind: LoadFailureKind, message: string) {
    super(message);
    this.name = 'LoadError';
    this.kind = kind;
  }
}

const delay = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

const request = async <T>(data: T): Promise<T> => {
  // Always confirm a cached "offline" reading with a fresh probe: the user may
  // have just plugged the network back in and pressed Try again.
  const online =
    (await ensureNetworkKnown()) === 'online' ||
    (await probeNetwork()) === 'online';
  if (!online) {
    throw new LoadError('offline', 'The device is offline.');
  }
  await delay(REQUEST_LATENCY_MS);
  // The connection can drop during the request; check after it resolves so a
  // device that boots offline lands in the offline state, not a failed one.
  if ((await ensureNetworkKnown()) === 'offline') {
    throw new LoadError('offline', 'The device is offline.');
  }
  return data;
};

export const loadVods = () => request(mockVODData);

export const loadLiveChannels = () => request(mockLiveChannels);

export const loadPodcasts = () => request(mockPodcasts);

// Shared by every screen so "no connection" and "the service failed" get the
// same treatment everywhere, including errors thrown by real fetches later.
export const toLoadFailure = (error: unknown): LoadFailure => {
  if (error instanceof LoadError) {
    return { kind: error.kind };
  }
  return { kind: getNetworkStatus() === 'offline' ? 'offline' : 'error' };
};
