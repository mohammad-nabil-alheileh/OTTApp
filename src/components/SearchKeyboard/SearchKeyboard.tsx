import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useBackHandler } from '../../hooks/useBackHandler';
import { SearchKeyboardProps } from './SearchKeyboard.types';
import { KeyboardFocusPos } from './keyboardNavigation.types';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { styles } from './SearchKeyboard.styles';

// TV-friendly on-screen keyboard layout.
const KEYBOARD_ROWS: string[][] = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y', 'Z', '-', "'", '.', ','],
];

const SPACE_LABEL = 'SPACE';
const DELETE_LABEL = '⌫ DEL';
const CLEAR_LABEL = 'CLEAR';

export const SearchKeyboard: React.FC<SearchKeyboardProps> = ({
  visible,
  onClose,
  onQueryChange,
}) => {
  const [query, setQuery] = useState('');

  const handleBack = useCallback(() => {
    if (visible) {
      onClose();
      return true;
    }
    return false;
  }, [visible, onClose]);

  useBackHandler(handleBack, visible);

  // Reset query when overlay opens
  useEffect(() => {
    if (visible) {
      setQuery('');
    }
  }, [visible]);

  // Notify parent on every query change
  useEffect(() => {
    onQueryChange(query);
  }, [query, onQueryChange]);

  const handleSelect = useCallback(
    (pos: KeyboardFocusPos) => {
      const { row, col } = pos;
      if (row === -1) {
        onClose();
      } else if (row >= 0 && row <= 3) {
        setQuery(prev => prev + KEYBOARD_ROWS[row][col]);
      } else if (row === 4) {
        if (col === 0) {
          setQuery(prev => prev.slice(0, -1));
        } else if (col === 1) {
          setQuery(prev => prev + ' ');
        } else if (col === 2) {
          setQuery('');
        }
      }
    },
    [onClose],
  );

  const handleChar = useCallback((char: string) => {
    setQuery(prev => prev + char);
  }, []);

  const handleBackspace = useCallback(() => {
    setQuery(prev => prev.slice(0, -1));
  }, []);

  const handleSpace = useCallback(() => {
    setQuery(prev => prev + ' ');
  }, []);

  const { focusPos, setFocusPos } = useKeyboardNavigation({
    visible,
    onClose,
    onSelect: handleSelect,
    onChar: handleChar,
    onBackspace: handleBackspace,
    onSpace: handleSpace,
  });

  if (!visible) {
    return null;
  }

  const isCloseFocused = focusPos.row === -1;
  const isDelFocused = focusPos.row === 4 && focusPos.col === 0;
  const isSpaceFocused = focusPos.row === 4 && focusPos.col === 1;
  const isClearFocused = focusPos.row === 4 && focusPos.col === 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* ── Search Bar ── */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            {query.length > 0 ? (
              <Text style={styles.searchText}>
                {query}
                <Text style={styles.cursor}>|</Text>
              </Text>
            ) : (
              <Text style={styles.placeholder}>Search movies, shows…</Text>
            )}
          </View>
          <Pressable
            onPress={onClose}
            style={[
              styles.closeButton,
              isCloseFocused && styles.closeButtonFocused,
            ]}
          >
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </Pressable>
        </View>

        {/* ── Keyboard Grid ── */}
        <View style={styles.keyboardContainer}>
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <View style={styles.keyboardRow} key={`row-${rowIdx}`}>
              {row.map((char, colIdx) => {
                const isKeyFocused =
                  focusPos.row === rowIdx && focusPos.col === colIdx;
                return (
                  <Pressable
                    key={char}
                    onPress={() => {
                      setFocusPos({ row: rowIdx, col: colIdx });
                      handleChar(char);
                    }}
                    style={[
                      styles.key,
                      isKeyFocused && styles.keyFocused,
                    ]}
                  >
                    <Text style={styles.keyText}>{char}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}

          {/* Action Row: DEL · SPACE · CLEAR */}
          <View style={styles.keyboardRow}>
            <Pressable
              onPress={() => {
                setFocusPos({ row: 4, col: 0 });
                handleBackspace();
              }}
              style={[
                styles.key,
                styles.wideKey,
                isDelFocused && styles.keyFocused,
              ]}
            >
              <Text style={styles.keyText}>{DELETE_LABEL}</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setFocusPos({ row: 4, col: 1 });
                handleSpace();
              }}
              style={[
                styles.key,
                styles.extraWideKey,
                isSpaceFocused && styles.keyFocused,
              ]}
            >
              <Text style={styles.keyText}>{SPACE_LABEL}</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setFocusPos({ row: 4, col: 2 });
                setQuery('');
              }}
              style={[
                styles.key,
                styles.wideKey,
                isClearFocused && styles.keyFocused,
              ]}
            >
              <Text style={styles.keyText}>{CLEAR_LABEL}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
