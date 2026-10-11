import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const r1 = await page.evaluate(() => {
  const sec = document.querySelector('[data-seg="act3"]');
  const r = sec.getBoundingClientRect();
  const sticky = sec.querySelector('.sticky').getBoundingClientRect();
  const cs = getComputedStyle(document.documentElement);
  return {
    scrollY, docH: document.documentElement.scrollHeight,
    secTop: sec.offsetTop, secH: sec.offsetHeight,
    secRectY: Math.round(r.y), stickyY: Math.round(sticky.y),
    htmlOverflowX: cs.overflowX,
    bodyOverflowX: getComputedStyle(document.body).overflowX,
    actives: Array.from(document.querySelectorAll('[data-seg]')).map((e) => e.getAttribute('data-seg') + '=' + e.getAttribute('data-active')).join(' '),
  };
});
await page.evaluate(() => window.scrollTo(0, 5200));
await page.waitForTimeout(2500);
const r2 = await page.evaluate(() => ({
  scrollY,
  stickyY: Math.round(document.querySelector('[data-seg="act3"] .sticky').getBoundingClientRect().y),
  actives: Array.from(document.querySelectorAll('[data-seg]')).map((e) => e.getAttribute('data-seg') + '=' + e.getAttribute('data-active')).join(' '),
  h2op: getComputedStyle(document.querySelector('[data-seg="act3"] .act-mask')).opacity,
}));
console.log(JSON.stringify({ r1, r2 }, null, 1));
await browser.close();
