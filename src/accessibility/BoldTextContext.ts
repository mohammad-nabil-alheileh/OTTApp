import { createContext } from 'react';

export type BoldTextContextValue = {
  isBoldText: boolean;
  toggleBoldText: () => void;
};

export const BoldTextContext = createContext<BoldTextContextValue>({
  isBoldText: false,
  toggleBoldText: () => {},
});
