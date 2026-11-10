export interface SelectorOption {
  value: number;
  label: string;
}

export interface OptionSelectorProps {
  title: string;
  options: SelectorOption[];
  value: number;
  onChange: (value: number) => void;
}
