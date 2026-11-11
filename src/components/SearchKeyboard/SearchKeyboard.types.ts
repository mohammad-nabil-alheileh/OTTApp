export interface SearchKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onFocus?: () => void;
  // Bumping this refocuses the first row (used when results disappear).
  focusRequest?: number;
}
