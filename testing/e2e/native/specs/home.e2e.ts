import { expect } from '@wdio/globals';
import { mockVODData } from '../../../../src/services/mockData';
import { APP_ID, byLabel, byLabelPrefix, byText, press, waitForFocus } from '../tv';

// Same journeys as testing/e2e/web/home.spec.ts, on the native TVs.
const [first, second] = mockVODData;

describe('home screen (native TV)', () => {
  beforeEach(async () => {
    // Relaunch so every test starts on a freshly loaded home screen.
    await browser.terminateApp(APP_ID);
    await browser.activateApp(APP_ID);
    await waitForFocus(byLabelPrefix(first.title), 'first video card');
  });

  it('boots with focus on the first video', async () => {
    await expect(byText('Videos On Demand')).toBeDisplayed();
  });

  it('Right moves focus along the rail and Left comes back', async () => {
    await press('right');
    await waitForFocus(byLabelPrefix(second.title), 'second video card');

    await press('left');
    await waitForFocus(byLabelPrefix(first.title), 'first video card');
  });

  it('Select opens details with Play focused', async () => {
    await press('select');
    await waitForFocus(byLabel('Play'), 'Play button');
  });

  it('Back returns from details to home', async () => {
    await press('select');
    await waitForFocus(byLabel('Play'), 'Play button');

    await press('back');

    await byLabel('Play').waitForExist({ reverse: true });
    await waitForFocus(byLabelPrefix(first.title), 'first video card');
  });
});
