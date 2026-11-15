// Remote-control input for the lg-webos and samsung-tizen Jest projects.
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import App from '../../src/App';
import { mockVODData } from '../../src/services/mockData';
import { webKeyDown } from './dom';

const ARROW_KEYS = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
} as const;

// Remotes deliver D-pad presses as arrow keydowns on the focused element.
export const pressArrow = (direction: keyof typeof ARROW_KEYS) =>
  act(() => {
    webKeyDown({ key: ARROW_KEYS[direction] }, document.activeElement ?? window);
  });

export const pressKeyCode = (keyCode: number) =>
  act(() => {
    webKeyDown({ keyCode }, document.activeElement ?? window);
  });

export const pressKey = (key: string) =>
  act(() => {
    webKeyDown({ key }, document.activeElement ?? window);
  });

// Renders the whole app and lets the simulated catalogue load finish. Each
// dataset waits for its own promise before starting its timer, so time and
// microtasks have to advance together. Call jest.useFakeTimers() first.
export const renderApp = async () => {
  render(<App />);
  await act(async () => {
    await jest.advanceTimersByTimeAsync(600);
  });
};

const [firstVod] = mockVODData;
export const FIRST_VOD = firstVod;
export const findFirstCard = () =>
  screen.findByRole('button', { name: new RegExp(`^${firstVod.title}, rated`) });
