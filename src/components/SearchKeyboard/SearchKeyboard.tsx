import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { SearchKeyboardProps } from './SearchKeyboard.types';
import { keyWidth, styles } from './SearchKeyboard.styles';

type KeyAction = 'space' | 'clear';

interface KeyDef {
  id: string;
  label: string;
  // How many of the ten columns the key spans.
  units?: number;
  action?: KeyAction;
  // Screen readers announce punctuation as words, not symbols.
  spoken?: string;
  muted?: boolean;
}

const letterKeys = (keys: string[], muted = false): KeyDef[] =>
  keys.map(key => ({ id: key, label: key, muted }));

// Five rows of ten units each: every row fills the same width, so all columns
// line up and the backspace, space and clear keys sit on the right edge.
const KEY_ROWS: KeyDef[][] = [
  letterKeys(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], true),
  letterKeys(['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']),
  [
    ...letterKeys(['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']),
    { id: 'delete', label: '⌫' },
  ],
  [
    ...letterKeys(['Z', 'X', 'C', 'V', 'B', 'N', 'M']),
    { id: 'period', label: '.', spoken: 'period' },
    { id: 'comma', label: ',', spoken: 'comma' },
    { id: 'dash', label: '-', spoken: 'dash' },
  ],
  [
    { id: 'space', label: 'SPACE', units: 8, action: 'space' },
    { id: 'clear', label: 'CLEAR', units: 2, action: 'clear' },
  ],
];

const ACTION_LABELS: Record<KeyAction, string> = {
  space: 'Space',
  clear: 'Clear',
};

interface KeyboardRowProps {
  groupId: string;
  keys: KeyDef[];
  autoFocus?: boolean;
  focusRequest?: number;
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onFocus?: () => void;
}

const KeyboardRow: React.FC<KeyboardRowProps> = ({
  groupId,
  keys,
  autoFocus,
  focusRequest,
  onKeyPress,
  onDelete,
  onClear,
  onFocus,
}) => {
  const { containerRef, getItemProps, focusFirst } = useFocusGroup(
    groupId,
    keys.length,
  );

  // The first row takes focus when the screen opens. On native the TV engine
  // handles this through hasTVPreferredFocus below.
  useEffect(() => {
    if (autoFocus) {
      focusFirst();
    }
  }, [autoFocus, focusRequest, focusFirst]);

  const press = (def: KeyDef) => {
    if (def.action === 'clear') {
      onClear();
    } else if (def.action === 'space') {
      onKeyPress(' ');
    } else if (def.id === 'delete') {
      onDelete();
    } else {
      onKeyPress(def.label);
    }
  };

  return (
    <View ref={containerRef} style={styles.row}>
      {keys.map((def, index) => {
        const itemProps = getItemProps(index);
        const isAction = def.action !== undefined;
        return (
          <Pressable
            key={def.id}
            {...itemProps}
            hasTVPreferredFocus={autoFocus && index === 0}
            onFocus={() => {
              itemProps.onFocus?.();
              onFocus?.();
            }}
            onPress={() => press(def)}
            accessibilityRole="button"
            accessibilityLabel={
              def.action
                ? ACTION_LABELS[def.action]
                : def.id === 'delete'
                  ? 'Delete'
                  : def.spoken ?? def.label
            }
            style={({ focused }) => [
              styles.key,
              isAction && styles.actionKey,
              def.units !== undefined && { width: keyWidth(def.units) },
              focused && styles.keyFocused,
            ]}
          >
            {({ focused }) => (
              <Text
                style={[
                  isAction ? styles.actionText : styles.keyText,
                  def.muted && styles.keyTextMuted,
                  focused && styles.keyTextFocused,
                ]}
                numberOfLines={1}
              >
                {def.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export const SearchKeyboard: React.FC<SearchKeyboardProps> = ({
  onKeyPress,
  onDelete,
  onClear,
  onFocus,
  focusRequest,
}) => (
  <View style={styles.keyboard}>
    {KEY_ROWS.map((keys, row) => (
      <KeyboardRow
        key={`search-row-${row}`}
        groupId={`search-row-${row}`}
        keys={keys}
        autoFocus={row === 0}
        focusRequest={row === 0 ? focusRequest : undefined}
        onKeyPress={onKeyPress}
        onDelete={onDelete}
        onClear={onClear}
        onFocus={onFocus}
      />
    ))}
  </View>
);
