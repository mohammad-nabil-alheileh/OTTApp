export type SearchInputMethod = 'typed' | 'voice';

export interface SearchTrackingEvent {
  query: string;
  resultCount: number;
  inputMethod: SearchInputMethod;
}

export type SearchTrackingSink = (event: SearchTrackingEvent) => void;

let sink: SearchTrackingSink | null = null;

export const setSearchTrackingSink = (next: SearchTrackingSink | null) => {
  sink = next;
};

export const trackSearch = (event: SearchTrackingEvent) => {
  sink?.(event);
};
