import { chromium } from 'playwright';
const shots = '/home/user/nch/shots';

const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });

/* ---------- mobile + reduced motion ---------- */
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
const m = await ctx.newPage();
const merrs = [];
m.on('pageerror', (e) => merrs.push(e.message.slice(0, 200)));
await m.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await m.waitForTimeout(4000);
console.log('MOBILE h-overflow:', await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
console.log('MOBILE reduced intro skipped:', await m.evaluate(() => document.querySelector('.hero-copy')?.className.includes('hero-live')));
await m.screenshot({ path: `${shots}/m-hero.png` });
await m.evaluate(() => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * 0.68, behavior: 'instant' }));
await m.waitForTimeout(2000);
await m.screenshot({ path: `${shots}/m-services.png` });
// mobile menu
await m.tap('button[aria-label="Open menu"]');
await m.waitForTimeout(700);
await m.screenshot({ path: `${shots}/m-menu.png` });
await m.tap('button[aria-label="Close menu"]');
// contact on mobile
await m.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
await m.waitForTimeout(1800);
await m.screenshot({ path: `${shots}/m-contact.png` });
console.log('MOBILE ERRORS:', merrs.length ? merrs : 'none');
await ctx.close();

/* ---------- desktop interactions ---------- */
const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const derrs = [];
d.on('pageerror', (e) => derrs.push(e.message.slice(0, 200)));
await d.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await d.waitForTimeout(2500);
// skip intro
await d.click('text=SKIP INTRO');
await d.waitForTimeout(1500);
console.log('SKIP-INTRO works:', await d.evaluate(() => document.querySelector('.hero-copy')?.className.includes('hero-live')));
// sound toggle (starts AudioContext — should not error)
await d.click('button[aria-label="Enable sound"]');
await d.waitForTimeout(300);
console.log('SOUND aria-pressed:', await d.getAttribute('button[aria-pressed]', 'aria-pressed'));
// service CTA → prefill + contact scroll
await d.evaluate(() => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * 0.72, behavior: 'instant' }));
await d.waitForTimeout(2200);
await d.click('text=START THIS BUILD');
await d.waitForTimeout(2600);
console.log('CTA prefill:', await d.inputValue('#nch-service'));
// validation errors
await d.click('text=PREPARE TRANSMISSION');
await d.waitForTimeout(400);
console.log('VALIDATION shown:', await d.evaluate(() => document.querySelectorAll('[role="alert"]').length));
// fill + submit → honest ready state
await d.fill('#nch-name', 'Ada Lovelace');
await d.fill('#nch-email', 'ada@analytical.co');
await d.fill('#nch-message', 'I want to build the first general-purpose creation engine.');
await d.click('text=PREPARE TRANSMISSION');
await d.waitForTimeout(600);
console.log('SUBMIT state:', await d.evaluate(() => document.querySelector('[role="status"]') ? 'ready-state shown' : 'FAILED'));
console.log('MAILTO href ok:', await d.evaluate(() => document.querySelector('a[href^="mailto:"]')?.getAttribute('href')?.slice(0, 60)));
await d.screenshot({ path: `${shots}/d-form-ready.png` });
// fast scroll stress
for (const p of [0.02, 0.9, 0.05, 0.95, 0.3, 1.0, 0.0]) {
  await d.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), (await d.evaluate(() => document.documentElement.scrollHeight - innerHeight)) * p);
  await d.waitForTimeout(350);
}
console.log('FAST-SCROLL survived, errors so far:', derrs.length ? derrs : 'none');
// resize stress
await d.setViewportSize({ width: 900, height: 1200 });
await d.waitForTimeout(1200);
await d.setViewportSize({ width: 1440, height: 900 });
await d.waitForTimeout(1200);
console.log('RESIZE survived');
console.log('DESKTOP ERRORS:', derrs.length ? derrs : 'none');
await browser.close();
