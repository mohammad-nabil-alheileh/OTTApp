// Calls onKey for D-pad up/down while enabled. Native TV focus engines already
// keep focus inside an open menu, so this is a no-op off the web.
export const useMenuKeys = (
  _onKey: (key: 'up' | 'down') => void,
  _enabled: boolean,
) => {};