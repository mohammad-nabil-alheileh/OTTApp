import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import App from '../../../src/App';
import { mockVODData } from '../../../src/services/mockData';
import { pressBack } from '../../helpers/native';

// Whole-app flow under both android-tv and apple-tv: real components, real
// state, only the native boundary (storage, video, remote) is faked.
const [first] = mockVODData;
const firstCard = () =>
  screen.findByRole('button', { name: new RegExp(`^${first.title}, rated`) });

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const renderHome = async () => {
  await render(<App />);
  // The catalogue arrives after a simulated 500 ms network delay.
  await act(async () => {
    jest.advanceTimersByTime(600);
  });
};

describe('App navigation (native TV)', () => {
  it('shows the catalogue after loading', async () => {
    await renderHome();
    expect(await firstCard()).toBeTruthy();
  });

  it('opens details from a card and returns home with Back', async () => {
    await renderHome();

    await fireEvent.press(await firstCard());
    expect(await screen.findByRole('button', { name: 'Play' })).toBeTruthy();
    expect(screen.getByRole('header', { name: first.title })).toBeTruthy();

    await pressBack();

    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
    expect(await firstCard()).toBeTruthy();
  });
});
