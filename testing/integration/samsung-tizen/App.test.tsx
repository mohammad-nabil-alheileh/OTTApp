import { fireEvent, screen } from '@testing-library/react';
import { WEB_BACK_KEY_CODE } from '../../helpers/remote';
import { findFirstCard, pressKeyCode, renderApp } from '../../helpers/web';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('App navigation (samsung-tizen)', () => {
  // KNOWN GAP: no Tizen support yet (see unit/samsung-tizen/remoteKeys).
  // Flip to a plain `it` once keyCode 10009 is handled.
  it.failing('the Smart Remote Back key returns from details to home', async () => {
    await renderApp();
    fireEvent.click(await findFirstCard());
    expect(await screen.findByRole('button', { name: 'Play' })).toBeTruthy();

    await pressKeyCode(WEB_BACK_KEY_CODE['samsung-tizen']);

    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
  });
});
