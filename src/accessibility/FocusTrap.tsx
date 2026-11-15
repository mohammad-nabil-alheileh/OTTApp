import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

export interface FocusTrapProps {
  visible: boolean;
  onDismiss: () => void;
  onShow?: () => void;
  children: React.ReactNode;
}

// A layered surface that keeps focus inside itself. Modal is a dialog window
// on Android and an over-full-screen presentation on Apple TV, so TalkBack,
// VoiceOver and the D-pad focus engine cannot reach the screen behind it;
// react-native-web's Modal supplies the same semantics with aria-modal and a
// DOM focus trap. Accessibility escape (the screen reader's dismiss gesture)
// closes the layer through the same path as Back.
export const FocusTrap: React.FC<FocusTrapProps> = ({
  visible,
  onDismiss,
  onShow,
  children,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="none"
    onRequestClose={onDismiss}
    onShow={onShow}
    supportedOrientations={['landscape']}
  >
    <View
      style={styles.layer}
      accessibilityViewIsModal
      aria-modal
      onAccessibilityEscape={onDismiss}
    >
      {children}
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
});
