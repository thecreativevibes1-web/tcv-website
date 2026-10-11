// Runtime verification: loads the page, captures console errors, WebGL state,
// scroll behavior and screenshots at key narrative beats.
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const shots = '/home/user/nch/shots';
import { mkdirSync } from 'fs';
mkdirSync(shots, { recursive: true });

const run = async () => {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 300));
  });

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  const webgl = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    return { canvas: !!c, w: c?.width, h: c?.height };
  });
  console.log('WEBGL canvas:', JSON.stringify(webgl));

  // intro beats
  await page.screenshot({ path: `${shots}/01-intro.png` });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${shots}/02-activation.png` });
  await page.waitForTimeout(4500);
  await page.screenshot({ path: `${shots}/03-hero-live.png` });

  // scroll through acts (forward)
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const stops = [
    ['10-act1', 0.10], ['20-act2', 0.21], ['30-act3', 0.32], ['40-act4', 0.42],
    ['50-act5', 0.52], ['60-services', 0.68], ['70-service-3', 0.78],
    ['80-act6', 0.875], ['90-contact', 0.985],
  ];
  for (const [name, p] of stops) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.floor(total * p));
    await page.waitForTimeout(2600);
    await page.screenshot({ path: `${shots}/${name}.png` });
  }

  // scroll-backward sanity
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.floor(total * 0.21));
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${shots}/95-backward-act2.png` });

  // keyboard reachability: tab to first interactive element
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.tagName + ' / ' + (document.activeElement?.textContent || '').slice(0, 40));
  console.log('FOCUS:', focused);

  // section presence
  const segs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-seg]')).map((e) => e.getAttribute('data-seg')).join(',')
  );
  console.log('SEGMENTS:', segs);

  // horizontal overflow check
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('H-OVERFLOW px:', overflow);

  console.log('ERRORS:', errors.length ? errors.slice(0, 12) : 'none');
  await browser.close();
};

run().catch((e) => { console.error('VERIFY FAILED:', e.message); process.exit(1); });
