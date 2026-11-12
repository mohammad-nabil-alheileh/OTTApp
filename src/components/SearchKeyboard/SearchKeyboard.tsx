import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { AppText as Text } from '../AppText/AppText';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { SearchKeyboardProps } from './SearchKeyboard.types';
import { ROW_INDENTS, keyWidth, styles } from './SearchKeyboard.styles';

const KEY_ROWS: string[][] = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.', ',', '-'],
];

const ACTIONS = [
  { id: 'delete', label: '⌫', units: 2 },
  { id: 'space', label: 'SPACE', units: 4 },
  { id: 'clear', label: 'CLEAR', units: 2 },
];

// Screen readers announce these keys as words, not symbols.
const KEY_LABELS: Record<string, string> = {
  '.': 'period',
  ',': 'comma',
  '-': 'dash',
};

const ACTION_LABELS: Record<string, string> = {
  delete: 'Delete',
  space: 'Space',
  clear: 'Clear',
};

interface KeyboardRowProps {
  groupId: string;
  keys: string[];
  indent: number;
  autoFocus?: boolean;
  focusRequest?: number;
  onKeyPress: (key: string) => void;
  onFocus?: () => void;
}

const KeyboardRow: React.FC<KeyboardRowProps> = ({
  groupId,
  keys,
  indent,
  autoFocus,
  focusRequest,
  onKeyPress,
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

  return (
    <View ref={containerRef} style={[styles.row, { marginLeft: indent }]}>
      {keys.map((key, index) => {
        const itemProps = getItemProps(index);
        return (
          <Pressable
            key={key}
            {...itemProps}
            onFocus={() => {
              itemProps.onFocus?.();
              onFocus?.();
            }}
            hasTVPreferredFocus={autoFocus && index === 0}
            onPress={() => onKeyPress(key)}
            accessibilityRole="button"
            accessibilityLabel={KEY_LABELS[key] ?? key}
            style={({ focused }) => [styles.key, focused && styles.keyFocused]}
          >
            {({ focused }) => (
              <Text
                style={[styles.keyText, focused && styles.keyTextFocused]}
                numberOfLines={1}
              >
                {key}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

interface ActionRowProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onFocus?: () => void;
}

const ActionRow: React.FC<ActionRowProps> = ({
  onKeyPress,
  onDelete,
  onClear,
  onFocus,
}) => {
  const { containerRef, getItemProps } = useFocusGroup(
    'search-actions',
    ACTIONS.length,
  );

  const pressAction = (id: string) => {
    if (id === 'delete') {
      onDelete();
    } else if (id === 'clear') {
      onClear();
    } else {
      onKeyPress(' ');
    }
  };

  return (
    <View ref={containerRef} style={styles.actionRow}>
      {ACTIONS.map((action, index) => {
        const itemProps = getItemProps(index);
        return (
          <Pressable
            key={action.id}
            {...itemProps}
            accessibilityRole="button"
            accessibilityLabel={ACTION_LABELS[action.id]}
            onFocus={() => {
              itemProps.onFocus?.();
              onFocus?.();
            }}
            onPress={() => pressAction(action.id)}
            style={({ focused }) => [
              styles.actionKey,
              { width: keyWidth(action.units) },
              focused && styles.keyFocused,
            ]}
          >
            {({ focused }) => (
              <Text
                style={[styles.actionText, focused && styles.keyTextFocused]}
                numberOfLines={1}
              >
                {action.label}
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
  <View style={styles.plate}>
    <View style={styles.keyboard}>
      {KEY_ROWS.map((keys, row) => (
        <KeyboardRow
          key={`search-row-${row}`}
          groupId={`search-row-${row}`}
          keys={keys}
          indent={ROW_INDENTS[row]}
          autoFocus={row === 0}
          focusRequest={row === 0 ? focusRequest : undefined}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
        />
      ))}
      <ActionRow
        onKeyPress={onKeyPress}
        onDelete={onDelete}
        onClear={onClear}
        onFocus={onFocus}
      />
    </View>
  </View>
);
