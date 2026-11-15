# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> the remote Back key returns from details to home
- Location: testing/e2e/web/home.spec.ts:44:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('button', { name: 'Play', exact: true })
Expected: 0
Received: 1
Timeout:  2000ms

Call log:
  - Expect "toHaveCount" getByRole('button', { name: 'Play', exact: true }) with timeout 2000ms
  - waiting for getByRole('button', { name: 'Play', exact: true })
    19 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=e9]:
  - heading "Big Buck Bunny" [level=1] [ref=e10]
  - generic [ref=e11]:
    - generic [ref=e12]: "2008"
    - generic [ref=e13]: ★ 8.1
    - generic [ref=e14]: 10 min
  - generic [ref=e15]: A giant rabbit takes on three bullying rodents.
  - generic [ref=e16]:
    - button "Play" [active] [ref=e17] [cursor=pointer]:
      - generic [ref=e18]: ▶ Play
    - button "Play trailer, 1:00" [ref=e19] [cursor=pointer]:
      - generic [ref=e20]: Trailer · 1:00
    - button "Add to favorites" [ref=e21] [cursor=pointer]:
      - generic [ref=e22]: ♡ Favorite
  - generic [ref=e23]:
    - heading "More to Watch" [level=1] [ref=e24]
    - generic [ref=e26]:
      - button "Tears of Steel" [ref=e28] [cursor=pointer]:
        - generic [ref=e32]: Tears of Steel
      - button "Angel One" [ref=e34] [cursor=pointer]:
        - generic [ref=e38]: Angel One
      - button "Sintel" [ref=e40] [cursor=pointer]:
        - generic [ref=e44]: Sintel
      - button "Art of Motion" [ref=e46] [cursor=pointer]:
        - generic [ref=e50]: Art of Motion
      - button "BipBop Lab" [ref=e52] [cursor=pointer]:
        - generic [ref=e56]: BipBop Lab
      - button "Dark Truths" [ref=e58] [cursor=pointer]:
        - generic [ref=e62]: Dark Truths
      - button "Midnight Harbor" [ref=e64] [cursor=pointer]:
        - generic [ref=e68]: Midnight Harbor
      - button "The Last Orchard" [ref=e70] [cursor=pointer]:
        - generic [ref=e74]: The Last Orchard
      - button "Neon Drift" [ref=e76] [cursor=pointer]:
        - generic [ref=e80]: Neon Drift
      - button "Paper Lanterns" [ref=e82] [cursor=pointer]:
        - generic [ref=e86]: Paper Lanterns
      - button "Cold Signal" [ref=e88] [cursor=pointer]:
        - generic [ref=e92]: Cold Signal
      - button "Wildwood" [ref=e94] [cursor=pointer]:
        - generic [ref=e98]: Wildwood
      - button "Glass City" [ref=e100] [cursor=pointer]:
        - generic [ref=e104]: Glass City
      - button "Low Tide" [ref=e106] [cursor=pointer]:
        - generic [ref=e110]: Low Tide
      - button "Static Bloom" [ref=e112] [cursor=pointer]:
        - generic [ref=e116]: Static Bloom
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | import { mockVODData } from '../../../src/services/mockData';
  3  | import { APP_URL, focusedName, platformOf, press, pressRemoteBack } from './tv';
  4  | 
  5  | // Driven only with remote keys, like a viewer on the couch.
  6  | const cardName = (index: number) => new RegExp(`^${mockVODData[index].title}, rated`);
  7  | const CARD = cardName(0);
  8  | const SECOND_CARD = cardName(1);
  9  | const PLAY = { name: 'Play', exact: true } as const;
  10 | 
  11 | test.beforeEach(async ({ page }) => {
  12 |   await page.goto(APP_URL);
  13 |   await expect(page.getByRole('button', { name: CARD })).toBeFocused();
  14 | });
  15 | 
  16 | test('boots to home with focus on the first video', async ({ page }) => {
  17 |   await expect(
  18 |     page.getByRole('heading', { name: 'Videos On Demand' }),
  19 |   ).toBeVisible();
  20 | });
  21 | 
  22 | test('Right moves focus along the rail and Left comes back', async ({ page }) => {
  23 |   await press(page, 'ArrowRight');
  24 |   await expect(page.getByRole('button', { name: SECOND_CARD })).toBeFocused();
  25 | 
  26 |   await press(page, 'ArrowLeft');
  27 |   await expect(page.getByRole('button', { name: CARD })).toBeFocused();
  28 | });
  29 | 
  30 | test('Down leaves the video rail and Up returns to the same card', async ({ page }) => {
  31 |   await press(page, 'ArrowRight');
  32 |   await press(page, 'ArrowDown');
  33 |   expect(await focusedName(page)).not.toMatch(/rated/);
  34 | 
  35 |   await press(page, 'ArrowUp');
  36 |   await expect(page.getByRole('button', { name: SECOND_CARD })).toBeFocused();
  37 | });
  38 | 
  39 | test('OK opens details with Play focused', async ({ page }) => {
  40 |   await press(page, 'Enter');
  41 |   await expect(page.getByRole('button', PLAY)).toBeFocused();
  42 | });
  43 | 
  44 | test('the remote Back key returns from details to home', async ({ page }, testInfo) => {
  45 |   const platform = platformOf(testInfo);
  46 |   // KNOWN GAP: Tizen's Back key (10009) is not handled yet.
  47 |   test.fail(platform === 'samsung-tizen', 'Tizen Back key not supported yet');
  48 | 
  49 |   await press(page, 'Enter');
  50 |   await expect(page.getByRole('button', PLAY)).toBeFocused();
  51 | 
  52 |   await pressRemoteBack(page, platform);
  53 | 
> 54 |   await expect(page.getByRole('button', PLAY)).toHaveCount(0, {
     |                                                ^ Error: expect(locator).toHaveCount(expected) failed
  55 |     timeout: 2000,
  56 |   });
  57 |   await expect(page.getByRole('button', { name: CARD })).toBeFocused();
  58 | });
  59 | 
```