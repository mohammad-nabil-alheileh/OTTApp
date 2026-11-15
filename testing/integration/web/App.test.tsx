import { fireEvent, screen } from '@testing-library/react';
import { findFirstCard, pressKey, renderApp } from '../../helpers/web';

// Whole-app flow under both lg-webos and samsung-tizen. Each platform's own
// Back keyCode is covered in integration/<platform>/.
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('App navigation (web TV)', () => {
  it('lands focus on the first card after loading', async () => {
    await renderApp();
    expect(document.activeElement).toBe(await findFirstCard());
  });

  it('opens details from a card and returns home with Escape', async () => {
    await renderApp();

    fireEvent.click(await findFirstCard());
    expect(await screen.findByRole('button', { name: 'Play' })).toBeTruthy();

    await pressKey('Escape');

    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
    expect(await findFirstCard()).toBeTruthy();
  });
});
