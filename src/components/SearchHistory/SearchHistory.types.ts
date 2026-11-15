export interface SearchHistoryProps {
  entries: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
}
