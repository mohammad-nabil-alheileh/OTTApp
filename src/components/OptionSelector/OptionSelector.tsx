import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useMenuKeys } from '../../hooks/useMenuKeys';
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
  const optionRefs = useRef<Record<number, View | null>>({});
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
      optionRefs.current[value]?.focus();
    }
  }, [open, value]);

  // The menu opens over the seekbar; without this the web arrow-key polyfill
  // jumps to the seekbar instead of the next option. Move focus directly.
  const handleMenuKey = useCallback(
    (key: 'up' | 'down') => {
      const values = options.map(o => o.value);
      const index = values.indexOf(focusedOption.current ?? value);
      if (index === -1) {
        return;
      }
      const next =
        key === 'down'
          ? Math.min(index + 1, values.length - 1)
          : Math.max(index - 1, 0);
      optionRefs.current[values[next]]?.focus();
    },
    [options, value],
  );
  useMenuKeys(handleMenuKey, open);

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
                ref={node => {
                  optionRefs.current[option.value] = node;
                }}
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
