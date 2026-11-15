import { FocusGroupItemProps } from '../../focus/useFocusGroup.types';

export interface SelectorOption {
  value: number;
  label: string;
}

export interface OptionSelectorProps {
  title: string;
  options: SelectorOption[];
  value: number;
  onChange: (value: number) => void;
  // Lets the button join a surrounding rail's arrow-key group (web only).
  focusProps?: FocusGroupItemProps;
}
