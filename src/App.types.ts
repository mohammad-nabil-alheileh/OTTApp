import { VODItem } from './types/vod';

export interface AppState {
  vodList: VODItem[];
  isLoading: boolean;
}
