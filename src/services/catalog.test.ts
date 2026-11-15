import { ensureNetworkKnown, getNetworkStatus, probeNetwork } from './network';
import { LoadError, loadLiveChannels, loadPodcasts, loadVods, toLoadFailure } from './catalog';

jest.mock('./network', () => ({
  getNetworkStatus: jest.fn(),
  ensureNetworkKnown: jest.fn(),
  probeNetwork: jest.fn(),
}));

const mockOffline = () => {
  (getNetworkStatus as jest.Mock).mockReturnValue('offline');
  (ensureNetworkKnown as jest.Mock).mockResolvedValue('offline');
  (probeNetwork as jest.Mock).mockResolvedValue('offline');
};

const mockOnline = () => {
  (getNetworkStatus as jest.Mock).mockReturnValue('online');
  (ensureNetworkKnown as jest.Mock).mockResolvedValue('online');
  (probeNetwork as jest.Mock).mockResolvedValue('online');
};

describe('catalog', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('loads each dataset on its own request', async () => {
    mockOnline();
    const vodRequest = loadVods();
    const liveRequest = loadLiveChannels();
    const podcastRequest = loadPodcasts();

    await jest.advanceTimersByTimeAsync(500);

    await expect(vodRequest).resolves.toBeDefined();
    await expect(liveRequest).resolves.toBeDefined();
    await expect(podcastRequest).resolves.toBeDefined();
    expect(probeNetwork).not.toHaveBeenCalled();
  });

  it('probes again on retry instead of trusting a cached offline reading', async () => {
    (getNetworkStatus as jest.Mock).mockReturnValue('offline');
    (ensureNetworkKnown as jest.Mock)
      .mockResolvedValueOnce('offline')
      .mockResolvedValue('online');
    (probeNetwork as jest.Mock).mockResolvedValueOnce('online');

    const request = loadVods();
    await jest.advanceTimersByTimeAsync(500);

    await expect(request).resolves.toBeDefined();
    expect(probeNetwork).toHaveBeenCalledTimes(1);
  });

  it('fails immediately as offline when the device has no connection', async () => {
    mockOffline();

    await expect(loadVods()).rejects.toMatchObject({ kind: 'offline' });
  });

  it('fails as offline when the connection drops during the request', async () => {
    mockOnline();
    const request = loadVods();
    // Attach the handler before the request settles so the rejection is never
    // reported as unhandled.
    const settled = request.catch((error: unknown) => error);
    (ensureNetworkKnown as jest.Mock).mockResolvedValue('offline');

    await jest.advanceTimersByTimeAsync(500);

    await expect(settled).resolves.toMatchObject({ kind: 'offline' });
  });

  it('keeps a failed service distinct from an offline device', () => {
    mockOnline();
    expect(toLoadFailure(new LoadError('error', 'boom'))).toEqual({
      kind: 'error',
    });
    expect(toLoadFailure(new Error('unexpected'))).toEqual({ kind: 'error' });

    mockOffline();
    expect(toLoadFailure(new Error('network request failed'))).toEqual({
      kind: 'offline',
    });
  });
});
