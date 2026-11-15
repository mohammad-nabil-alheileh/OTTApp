import { useMemo, useRef } from 'react';
import { FlatList } from 'react-native';
import { FocusGroupItemProps } from './useFocusGroup.types';
import { RailLayout } from './railReveal';
import { RailReveal } from './useRailReveal.types';

// useFocusGroup's revealWithGutter already keeps the rail's padding in view.
const passThrough = (props: FocusGroupItemProps) => props;

export const useRailReveal = <T>(_layout: RailLayout): RailReveal<T> => {
  const listRef = useRef<FlatList<T> | null>(null);
  const listProps = useMemo(() => ({ ref: listRef }), []);
  return { listProps, withReveal: passThrough };
};
