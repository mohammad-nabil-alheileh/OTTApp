import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { FocusTrap } from '../../accessibility/FocusTrap';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useMenuKeys } from '../../hooks/useMenuKeys';
import { scaleSize, sharedStyles, spacing } from '../../styles/theme';
import { styles } from './OptionSelector.styles';
import { OptionSelectorProps } from './OptionSelector.types';

interface MenuFrame {
  left: number;
  width: number;
  bottom: number;
}

// A control-bar button that opens a dropdown of options (speed, quality, ...).
// The dropdown lives in a FocusTrap: while it is open, the options are the only
// things TalkBack, VoiceOver and the remote can reach, and Back closes it.
export const OptionSelector: React.FC<OptionSelectorProps> = ({
  title,
  options,
  value,
  onChange,
  focusProps,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  // Measured in window coordinates, because the menu is rendered in its own
  // modal layer rather than inline in the control bar.
  const [frame, setFrame] = useState<MenuFrame | null>(null);
  // Flipping hasTVPreferredFocus to true is how Android TV moves focus back.
  const [refocusButton, setRefocusButton] = useState(false);
  // Inside a newly shown modal the option view has to be attached before
  // hasTVPreferredFocus can request focus; onShow is that moment.
  const [claimFocus, setClaimFocus] = useState(false);
  const buttonRef = useRef<View>(null);
  const optionRefs = useRef<Record<number, View | null>>({});
  const focusedOption = useRef<number | null>(null);
  const groupRef = focusProps?.ref;
  const window = useWindowDimensions();

  const setButtonRef = useCallback(
    (node: View | null) => {
      buttonRef.current = node;
      groupRef?.(node);
    },
    [groupRef],
  );

  // Reporting through a ref keeps an inline parent callback from re-running
  // the effect on every render.
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  useEffect(() => {
    onOpenChangeRef.current?.(open);
  }, [open]);

  // Place the menu directly above the button, at the button's width.
  const measureButton = useCallback(() => {
    buttonRef.current?.measureInWindow?.((x, y, width) => {
      setFrame({
        left: x + spacing.xs,
        width: Math.max(width - spacing.xs * 2, scaleSize(160)),
        bottom: window.height - y + spacing.sm,
      });
    });
  }, [window.height]);

  // Until the button has been measured (first render, or in a test with no
  // layout), keep the menu on screen in the bottom-right corner.
  const menuFrame: MenuFrame = frame ?? {
    left: window.width - scaleSize(360) - spacing.xl,
    width: scaleSize(360),
    bottom: scaleSize(240),
  };

  const openMenu = () => {
    setRefocusButton(false);
    setClaimFocus(false);
    measureButton();
    setOpen(true);
  };

  const closeMenu = useCallback(() => {
    setOpen(false);
    setClaimFocus(false);
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

  return (
    <View style={styles.container} onLayout={measureButton}>
      <Pressable
        ref={setButtonRef}
        tabIndex={focusProps?.tabIndex}
        onFocus={focusProps?.onFocus}
        hasTVPreferredFocus={refocusButton}
        onPress={open ? closeMenu : openMenu}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${
          options.find(o => o.value === value)?.label
        }`}
        accessibilityHint={`Opens ${title.toLowerCase()} options`}
        accessibilityState={{ expanded: open }}
        aria-expanded={open}
        style={({ focused }) => [
          sharedStyles.controlButton,
          focused && sharedStyles.controlButtonFocused,
        ]}
      >
        <Text style={sharedStyles.controlButtonText}>
          {title} {options.find(o => o.value === value)?.label}
        </Text>
      </Pressable>

      <FocusTrap
        visible={open}
        onDismiss={closeMenu}
        onShow={() => setClaimFocus(true)}
      >
        <View style={[styles.menu, menuFrame]}>
          {options.map(option => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                ref={node => {
                  optionRefs.current[option.value] = node;
                }}
                hasTVPreferredFocus={claimFocus && selected}
                onFocus={() => {
                  focusedOption.current = option.value;
                }}
                onPress={() => {
                  onChange(option.value);
                  closeMenu();
                }}
                onAccessibilityEscape={closeMenu}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                accessibilityState={{ selected }}
                aria-selected={selected}
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
      </FocusTrap>
    </View>
  );
};
