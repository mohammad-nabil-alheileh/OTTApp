import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  getBoldTextPreference,
  loadBoldTextPreference,
  saveBoldTextPreference,
} from '../services/boldText';
import { BoldTextContext, BoldTextContextValue } from './BoldTextContext';

// React Native only exposes the OS bold-text setting on iOS/tvOS; Android and
// web always report false, so there the in-app toggle is the only way in.
const readOsBoldText = (): Promise<boolean> => {
  if (typeof AccessibilityInfo.isBoldTextEnabled !== 'function') {
    return Promise.resolve(false);
  }
  return AccessibilityInfo.isBoldTextEnabled().catch(() => false);
};

export const BoldTextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // null = no explicit choice yet, so the OS setting (where it exists) wins.
  const [preference, setPreference] = useState<boolean | null>(
    getBoldTextPreference,
  );
  const [osBoldText, setOsBoldText] = useState(false);
  // A choice made before the async reads finish must not be overwritten by them.
  const toggled = useRef(false);

  useEffect(() => {
    let active = true;
    loadBoldTextPreference().then(stored => {
      if (active && !toggled.current) {
        setPreference(stored);
      }
    });
    readOsBoldText().then(enabled => {
      if (active) {
        setOsBoldText(enabled);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // A no-op subscription on Android and web, where the event never fires.
    const subscription = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      setOsBoldText,
    );
    return () => subscription.remove();
  }, []);

  const isBoldText = preference ?? osBoldText;

  const toggleBoldText = useCallback(() => {
    toggled.current = true;
    const next = !isBoldText;
    setPreference(next);
    saveBoldTextPreference(next);
  }, [isBoldText]);

  const value = useMemo<BoldTextContextValue>(
    () => ({ isBoldText, toggleBoldText }),
    [isBoldText, toggleBoldText],
  );

  return (
    <BoldTextContext.Provider value={value}>
      {children}
    </BoldTextContext.Provider>
  );
};
