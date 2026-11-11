export interface SearchKeyboardProps {
  visible: boolean;
  onClose: () => void;
  onQueryChange: (query: string) => void;
}
