import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const errs = [];
m.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
await m.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await m.waitForTimeout(9000); // let intro finish naturally
await m.screenshot({ path: '/home/user/nch/shots/m2-hero.png' });
await m.evaluate(() => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * 0.72, behavior: 'instant' }));
await m.waitForTimeout(2200);
await m.screenshot({ path: '/home/user/nch/shots/m2-services.png' });
await m.evaluate(() => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * 0.32, behavior: 'instant' }));
await m.waitForTimeout(2200);
await m.screenshot({ path: '/home/user/nch/shots/m2-act3.png' });
console.log('ERRS:', errs.length ? errs : 'none');
await browser.close();
