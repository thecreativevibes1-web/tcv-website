import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
await page.evaluate((y) => window.scrollTo({ top: y }), Math.floor(total * 0.32));
await page.waitForTimeout(2600);
const info = await page.evaluate(() => {
  const out = {};
  const sec = document.querySelector('[data-seg="act3"]');
  out.active = sec?.getAttribute('data-active');
  const k = sec?.querySelector('.act-kicker');
  const h = sec?.querySelector('.act-h');
  const m = sec?.querySelector('.act-mask');
  const sticky = sec?.querySelector('.sticky');
  for (const [name, el] of [['kicker', k], ['headline', h], ['mask', m], ['sticky', sticky]]) {
    if (!el) { out[name] = 'MISSING'; continue; }
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    out[name] = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), op: cs.opacity, transform: cs.transform.slice(0, 60) };
  }
  const card = document.querySelector('.sv-card');
  out.serviceCard = card ? card.getBoundingClientRect().toJSON() : 'MISSING';
  return out;
});
console.log(JSON.stringify(info, null, 1));
await page.screenshot({ path: '/home/user/nch/shots/debug-act3.png' });
await browser.close();
