import { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { FocusGroupItemProps } from '../focus/useFocusGroup.types';
import { useBackHandler } from './useBackHandler';

// What a home row needs to report focus and expose its first card.
export interface HomeRow {
  onFocus: () => void;
  firstItemRef: (node: View | null) => void;
}

// Adds home-row tracking to a card's props without dropping the web focus
// group's own ref/onFocus.
export const withHomeRow = (
  props: FocusGroupItemProps,
  index: number,
  row?: HomeRow,
): FocusGroupItemProps => {
  if (!row) {
    return props;
  }
  return {
    ...props,
    ref:
      index === 0
        ? (node: View | null) => {
            props.ref?.(node);
            row.firstItemRef(node);
          }
        : props.ref,
    onFocus: () => {
      props.onFocus?.();
      row.onFocus();
    },
  };
};

const focusNode = (node: View) => {
  if (Platform.OS === 'web') {
    (node as unknown as HTMLElement).focus();
  } else {
    (node as unknown as { requestTVFocus?: () => void }).requestTVFocus?.();
  }
};

// Back on the home screen first returns focus to the first row; Back from the
// first row is left unhandled, so the app exits as usual (on Apple TV this
// also keeps the menu key released there).
export const useHomeBack = (
  rowKeys: string[],
  scrollRef: RefObject<ScrollView | null>,
  enabled: boolean,
) => {
  const [focusedRow, setFocusedRow] = useState<string | null>(null);
  const firstItems = useRef(new Map<string, View | null>());
  const rows = useRef(new Map<string, HomeRow>());
  const firstRow = rowKeys[0];

  const getRow = useCallback((key: string): HomeRow => {
    let row = rows.current.get(key);
    if (!row) {
      row = {
        onFocus: () => setFocusedRow(key),
        firstItemRef: node => {
          firstItems.current.set(key, node);
        },
      };
      rows.current.set(key, row);
    }
    return row;
  }, []);

  const handleBack = useCallback(() => {
    const target = firstRow ? firstItems.current.get(firstRow) : null;
    if (!target) {
      return false;
    }
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    focusNode(target);
    setFocusedRow(firstRow);
    return true;
  }, [firstRow, scrollRef]);

  useBackHandler(
    handleBack,
    enabled && focusedRow !== null && focusedRow !== firstRow,
  );

  return useMemo(() => ({ getRow }), [getRow]);
};
