/// <reference lib="dom" />
import { useEffect } from 'react';

// keyCode of the Back button on LG webOS remotes.
const LG_BACK_KEY = 461;

const isBackKey = (e: KeyboardEvent) =>
  e.keyCode === LG_BACK_KEY || e.key === 'Escape' || e.key === 'Backspace';

// Same contract as Android's BackHandler: newest handler runs first, and
// returning true stops the older ones.
const handlers: Array<() => boolean> = [];

const onKeyDown = (e: KeyboardEvent) => {
  if (!isBackKey(e)) {
    return;
  }
  for (let i = handlers.length - 1; i >= 0; i--) {
    if (handlers[i]()) {
      e.preventDefault();
      return;
    }
  }
};

export const useBackHandler = (handler: () => boolean, enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (handlers.length === 0) {
      window.addEventListener('keydown', onKeyDown);
    }
    handlers.push(handler);
    return () => {
      handlers.splice(handlers.indexOf(handler), 1);
      if (handlers.length === 0) {
        window.removeEventListener('keydown', onKeyDown);
      }
    };
  }, [handler, enabled]);
};
