import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useBackHandler } from '../../hooks/useBackHandler';
import { sharedStyles } from '../../styles/theme';
import { styles } from './OptionSelector.styles';
import { OptionSelectorProps } from './OptionSelector.types';

// A control-bar button that opens a dropdown of options (speed, quality, ...).
export const OptionSelector: React.FC<OptionSelectorProps> = ({
  title,
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  // Flipping hasTVPreferredFocus to true is how Android TV moves focus back.
  const [refocusButton, setRefocusButton] = useState(false);
  const buttonRef = useRef<View>(null);
  const selectedOptionRef = useRef<View>(null);
  const focusedOption = useRef<number | null>(null);

  const openMenu = () => {
    setRefocusButton(false);
    setOpen(true);
  };

  const closeMenu = useCallback(() => {
    setOpen(false);
    setRefocusButton(true);
    if (Platform.OS === 'web') {
      buttonRef.current?.focus();
    }
  }, []);

  const handleBack = useCallback(() => {
    closeMenu();
    return true;
  }, [closeMenu]);
  useBackHandler(handleBack, open);

  // hasTVPreferredFocus is native-only, so the web focuses the selected option itself.
  useEffect(() => {
    if (open && Platform.OS === 'web') {
      selectedOptionRef.current?.focus();
    }
  }, [open]);

  // Focus left the menu (e.g. Left/Right to another button): just close it.
  const handleOptionBlur = () => {
    focusedOption.current = null;
    setTimeout(() => {
      if (focusedOption.current === null) {
        setOpen(false);
      }
    }, 0);
  };

  return (
    <View style={styles.container}>
      {open && (
        <View style={styles.menu}>
          {options.map(option => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                ref={selected ? selectedOptionRef : undefined}
                hasTVPreferredFocus={selected}
                onFocus={() => {
                  focusedOption.current = option.value;
                }}
                onBlur={handleOptionBlur}
                onPress={() => {
                  onChange(option.value);
                  closeMenu();
                }}
                style={({ focused }) => [
                  styles.option,
                  focused && styles.optionFocused,
                ]}
              >
                {({ focused }) => (
                  <>
                    <Text style={styles.check}>{selected ? '✓' : ''}</Text>
                    <Text
                      style={[
                        styles.optionText,
                        (selected || focused) && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
      <Pressable
        ref={buttonRef}
        hasTVPreferredFocus={refocusButton}
        onPress={open ? closeMenu : openMenu}
        style={({ focused }) => [
          sharedStyles.controlButton,
          focused && sharedStyles.controlButtonFocused,
        ]}
      >
        <Text style={sharedStyles.controlButtonText}>
          {title} {options.find(o => o.value === value)?.label}
        </Text>
      </Pressable>
    </View>
  );
};
