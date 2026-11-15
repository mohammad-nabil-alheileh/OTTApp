import { fireEvent, screen } from '@testing-library/react';
import { WEB_BACK_KEY_CODE } from '../../helpers/remote';
import { findFirstCard, pressKeyCode, renderApp } from '../../helpers/web';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('App navigation (lg-webos)', () => {
  it('the Magic Remote Back key returns from details to home', async () => {
    await renderApp();
    fireEvent.click(await findFirstCard());
    expect(await screen.findByRole('button', { name: 'Play' })).toBeTruthy();

    await pressKeyCode(WEB_BACK_KEY_CODE['lg-webos']);

    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
  });
});
