import { expect, test } from '@playwright/test';
import { mockVODData } from '../../../src/services/mockData';
import { APP_URL, focusedName, platformOf, press, pressRemoteBack } from './tv';

// Driven only with remote keys, like a viewer on the couch.
const cardName = (index: number) => new RegExp(`^${mockVODData[index].title}, rated`);
const CARD = cardName(0);
const SECOND_CARD = cardName(1);
const PLAY = { name: 'Play', exact: true } as const;

test.beforeEach(async ({ page }) => {
  await page.goto(APP_URL);
  await expect(page.getByRole('button', { name: CARD })).toBeFocused();
});

test('boots to home with focus on the first video', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Videos On Demand' }),
  ).toBeVisible();
});

test('Right moves focus along the rail and Left comes back', async ({ page }) => {
  await press(page, 'ArrowRight');
  await expect(page.getByRole('button', { name: SECOND_CARD })).toBeFocused();

  await press(page, 'ArrowLeft');
  await expect(page.getByRole('button', { name: CARD })).toBeFocused();
});

test('Down leaves the video rail and Up returns to the same card', async ({ page }) => {
  await press(page, 'ArrowRight');
  await press(page, 'ArrowDown');
  expect(await focusedName(page)).not.toMatch(/rated/);

  await press(page, 'ArrowUp');
  await expect(page.getByRole('button', { name: SECOND_CARD })).toBeFocused();
});

test('OK opens details with Play focused', async ({ page }) => {
  await press(page, 'Enter');
  await expect(page.getByRole('button', PLAY)).toBeFocused();
});

test('the remote Back key returns from details to home', async ({ page }, testInfo) => {
  const platform = platformOf(testInfo);
  // KNOWN GAP: Tizen's Back key (10009) is not handled yet.
  test.fail(platform === 'samsung-tizen', 'Tizen Back key not supported yet');

  await press(page, 'Enter');
  await expect(page.getByRole('button', PLAY)).toBeFocused();

  await pressRemoteBack(page, platform);

  await expect(page.getByRole('button', PLAY)).toHaveCount(0, {
    timeout: 2000,
  });
  await expect(page.getByRole('button', { name: CARD })).toBeFocused();
});
