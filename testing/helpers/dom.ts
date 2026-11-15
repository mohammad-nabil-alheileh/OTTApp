/// <reference lib="dom" />
// Dispatches a keydown the way a TV remote does in jsdom/browsers: some
// remote keys only have a keyCode, which KeyboardEvent's init can't set.
export const webKeyDown = (
  init: { key?: string; keyCode?: number },
  target: EventTarget = window,
) => {
  const event = new KeyboardEvent('keydown', {
    key: init.key ?? '',
    bubbles: true,
    cancelable: true,
  });
  if (init.keyCode !== undefined) {
    Object.defineProperty(event, 'keyCode', { get: () => init.keyCode });
    Object.defineProperty(event, 'which', { get: () => init.keyCode });
  }
  target.dispatchEvent(event);
  return event;
};
