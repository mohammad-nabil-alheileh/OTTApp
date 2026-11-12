import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useBoldText } from '../../accessibility/useBoldText';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { styles } from './SettingsScreen.styles';
import { SettingsScreenProps } from './SettingsScreen.types';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { isBoldText, toggleBoldText } = useBoldText();
  const { containerRef: backContainerRef, getItemProps: getBackItemProps } =
    useFocusGroup('settings-back', 1);
  const {
    containerRef: boldContainerRef,
    getItemProps: getBoldItemProps,
    focusFirst: focusFirstBoldOption,
  } = useFocusGroup('settings-bold', 1);

  useBackHandler(() => {
    onBack();
    return true;
  });

  useEffect(() => {
    focusFirstBoldOption();
  }, [focusFirstBoldOption]);

  const backItemProps = getBackItemProps(0);
  const boldItemProps = getBoldItemProps(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View ref={backContainerRef}>
          <Pressable
            {...backItemProps}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            accessibilityHint="Closes settings"
            style={({ focused }) => [
              styles.backButton,
              focused && styles.backButtonFocused,
            ]}
          >
            <Text style={styles.backChevron}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Settings
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Display
        </Text>
        <View ref={boldContainerRef}>
          <Pressable
            {...boldItemProps}
            hasTVPreferredFocus
            onPress={toggleBoldText}
            accessibilityRole="button"
            accessibilityLabel="Bold text"
            accessibilityHint="Toggles bold text"
            accessibilityState={{ selected: isBoldText }}
            aria-selected={isBoldText}
            style={({ focused }) => [
              styles.settingRow,
              focused && styles.settingRowFocused,
            ]}
          >
            <View style={styles.settingInfo} aria-hidden>
              <Text style={styles.settingTitle}>Bold text</Text>
              <Text style={styles.settingDescription}>
                Heavier, slightly larger text for easier reading.
              </Text>
            </View>
            <View
              style={[styles.badge, isBoldText && styles.badgeOn]}
              aria-hidden
            >
              <Text style={styles.badgeText}>
                {isBoldText ? 'On' : 'Off'}
              </Text>
            </View>
          </Pressable>
        </View>
        <Text style={styles.footnote}>
          Changes apply instantly across the whole app.
        </Text>
      </View>
    </View>
  );
};
