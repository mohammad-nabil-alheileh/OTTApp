import { useCallback, useEffect, useRef, useState } from 'react';
import {
  isVoiceSearchAvailable,
  startVoiceListening,
  stopVoiceListening,
} from '../../services/voiceSearch';
import { VoiceSearchOptions } from '../../services/voiceSearch.types';

export const useVoiceSearch = () => {
  const [available, setAvailable] = useState(false);
  const [listening, setListening] = useState(false);
  // True once the browser is actually capturing audio; the permission prompt
  // and service handshake can take a moment on the first press.
  const [capturing, setCapturing] = useState(false);
  // Words recognized so far, before the service finalizes the utterance.
  const [partial, setPartial] = useState('');
  const listeningRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    isVoiceSearchAvailable()
      .then(result => {
        if (mountedRef.current) {
          setAvailable(result);
        }
      })
      .catch(() => {});
    return () => {
      mountedRef.current = false;
      stopVoiceListening();
    };
  }, []);

  const start = useCallback(async (options?: VoiceSearchOptions) => {
    if (listeningRef.current) {
      return null;
    }
    listeningRef.current = true;
    setListening(true);
    setCapturing(false);
    setPartial('');
    try {
      return await startVoiceListening({
        ...options,
        onStart: () => {
          if (mountedRef.current) {
            setCapturing(true);
          }
        },
        onPartial: text => {
          if (mountedRef.current) {
            setPartial(text);
          }
        },
      });
    } finally {
      listeningRef.current = false;
      if (mountedRef.current) {
        setListening(false);
        setCapturing(false);
        setPartial('');
      }
    }
  }, []);

  return { available, listening, capturing, partial, start };
};
