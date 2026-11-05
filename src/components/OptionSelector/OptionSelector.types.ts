export interface SelectorOption {
  value: number;
  label: string;
}

export interface OptionSelectorProps {
  // Prefix on the button, e.g. "Speed" -> "Speed 1x".
  title: string;
  options: SelectorOption[];
  value: number;
  onChange: (value: number) => void;
}
