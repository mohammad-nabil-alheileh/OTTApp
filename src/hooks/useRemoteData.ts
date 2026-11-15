import { useCallback, useEffect, useRef, useState } from 'react';
import { toLoadFailure } from '../services/catalog';
import { subscribeToNetwork } from '../services/network';
import { LoadFailure } from '../types/load';

export interface RemoteData<T> {
  data: T;
  isLoading: boolean;
  failure: LoadFailure | null;
  retry: () => void;
}

// One request per screen or rail. A failure stays on screen (instead of
// flashing back to "loading") until the retry succeeds, so focus can rest on
// the Try again button, and the connection returning retries it automatically.
export const useRemoteData = <T,>(
  load: () => Promise<T>,
  initial: T,
): RemoteData<T> => {
  const [data, setData] = useState<T>(initial);
  const [isLoading, setIsLoading] = useState(true);
  const [failure, setFailure] = useState<LoadFailure | null>(null);
  const requestId = useRef(0);
  const failed = useRef(false);
  failed.current = failure !== null;

  const run = useCallback(() => {
    const id = requestId.current + 1;
    requestId.current = id;
    setIsLoading(true);
    load().then(
      result => {
        if (id !== requestId.current) {
          return;
        }
        setData(result);
        setFailure(null);
        setIsLoading(false);
      },
      error => {
        if (id !== requestId.current) {
          return;
        }
        setFailure(toLoadFailure(error));
        setIsLoading(false);
      },
    );
  }, [load]);

  useEffect(() => {
    run();
    return subscribeToNetwork(status => {
      if (status === 'online' && failed.current) {
        run();
      }
    });
  }, [run]);

  return { data, isLoading, failure, retry: run };
};
