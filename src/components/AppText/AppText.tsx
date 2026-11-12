import React from 'react';
import { StyleSheet, Text as RNText, TextProps, TextStyle } from 'react-native';
import { useBoldText } from '../../accessibility/useBoldText';

// Bold text is also enlarged slightly to make it easier to read.
const BOLD_TEXT_SCALE = 1.1;

const boldTextStyle = (style: TextProps['style']): TextStyle => {
  const flat = StyleSheet.flatten(style) ?? {};
  const bold: TextStyle = { fontWeight: 'bold' };
  if (flat.fontSize) {
    bold.fontSize = Math.round(flat.fontSize * BOLD_TEXT_SCALE);
  }
  if (flat.lineHeight) {
    bold.lineHeight = Math.round(flat.lineHeight * BOLD_TEXT_SCALE);
  }
  return bold;
};

// Every label goes through here, so one setting bolds and enlarges the whole
// app without each screen needing its own style.
export const AppText: React.FC<TextProps> = ({ style, ...props }) => {
  const { isBoldText } = useBoldText();
  return (
    <RNText {...props} style={[style, isBoldText && boldTextStyle(style)]} />
  );
};
