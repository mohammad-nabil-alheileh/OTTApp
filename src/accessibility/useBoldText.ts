import { useContext } from 'react';
import { BoldTextContext, BoldTextContextValue } from './BoldTextContext';

export const useBoldText = (): BoldTextContextValue =>
  useContext(BoldTextContext);
