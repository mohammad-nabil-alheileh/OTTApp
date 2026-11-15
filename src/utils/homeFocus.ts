// The home card that opened Details, so focus can go back to it.
export interface HomeFocusTarget {
  row: string;
  videoId: string;
}

export interface HomeFocus {
  row: string;
  index: number;
}

export const DEFAULT_HOME_FOCUS: HomeFocus = { row: 'vod', index: 0 };

// Looked up by id, not position: playing a title moves it to the front of
// Continue Watching, so a saved index would land on its neighbour.
export const resolveHomeFocus = (
  target: HomeFocusTarget | null,
  rows: Record<string, readonly string[]>,
): HomeFocus => {
  const index = target ? rows[target.row]?.indexOf(target.videoId) ?? -1 : -1;
  return target && index >= 0 ? { row: target.row, index } : DEFAULT_HOME_FOCUS;
};
