import { AppState } from 'react-native';

export type NetworkStatus = 'online' | 'offline';

// The catalog's artwork comes from this CDN, so reaching it is what "online"
// means for this app. Any HTTP answer proves reachability; only a failed
// request (DNS, timeout, refused) counts as offline. Works on every platform:
// the web also gets instant navigator events, TV platforms rely on the probe.
const PROBE_URL =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=32';
const PROBE_TIMEOUT_MS = 4000;
const ONLINE_POLL_MS = 20000;
// Poll faster while offline so the app recovers without a manual retry.
const OFFLINE_POLL_MS = 5000;

const listeners = new Set<(status: NetworkStatus) => void>();

let status: NetworkStatus = 'online';
// False until a probe or a browser event has actually reported a status.
let known = false;
let started = false;
let probeInFlight: Promise<NetworkStatus> | null = null;
let pollTimer: ReturnType<typeof setTimeout> | null = null;

const hasOnlineEvents =
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean';

const setStatus = (next: NetworkStatus) => {
  status = next;
  known = true;
  listeners.forEach(listener => listener(next));
};

const runProbe = async (): Promise<NetworkStatus> => {
  const controller =
    typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller
    ? setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)
    : null;
  try {
    await fetch(PROBE_URL, {
      method: 'HEAD',
      // The web must treat any HTTP answer (even a CORS-blocked one) as
      // reachable; only a failed request means offline.
      mode: 'no-cors',
      signal: controller ? controller.signal : undefined,
    });
    setStatus('online');
  } catch {
    setStatus('offline');
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
  return status;
};

// One probe at a time: a load asking for the status while the monitor is
// already probing joins that request instead of starting another.
export const probeNetwork = (): Promise<NetworkStatus> => {
  if (hasOnlineEvents && !navigator.onLine) {
    setStatus('offline');
    return Promise.resolve(status);
  }
  if (!probeInFlight) {
    probeInFlight = runProbe().finally(() => {
      probeInFlight = null;
    });
  }
  return probeInFlight;
};

const scheduleNextPoll = () => {
  if (pollTimer) {
    clearTimeout(pollTimer);
  }
  pollTimer = setTimeout(() => {
    probeNetwork().then(scheduleNextPoll);
  }, status === 'offline' ? OFFLINE_POLL_MS : ONLINE_POLL_MS);
};

const startMonitor = () => {
  if (started) {
    return;
  }
  started = true;

  if (hasOnlineEvents && typeof window !== 'undefined') {
    window.addEventListener('offline', () => setStatus('offline'));
    window.addEventListener('online', () => {
      probeNetwork();
    });
  }
  AppState.addEventListener('change', next => {
    if (next === 'active') {
      probeNetwork();
    }
  });

  probeNetwork().then(scheduleNextPoll);
};

export const getNetworkStatus = (): NetworkStatus => status;

// Resolves once a real signal exists. Startup loads wait for this so a device
// that boots without a connection fails as offline instead of "online".
export const ensureNetworkKnown = (): Promise<NetworkStatus> => {
  if (known) {
    return Promise.resolve(status);
  }
  return probeNetwork();
};

export const subscribeToNetwork = (
  listener: (status: NetworkStatus) => void,
): (() => void) => {
  listeners.add(listener);
  startMonitor();
  return () => {
    listeners.delete(listener);
  };
};
