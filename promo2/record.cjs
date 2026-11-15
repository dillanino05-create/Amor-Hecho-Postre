// Renderiza promo2/index.html cuadro por cuadro (30 fps exactos, sin saltos) en vertical y horizontal.
// Uso: FFMPEG=ruta/ffmpeg node promo2/record.cjs [urlDelSitio]   (sitio en http://[::1]:5180 para las capturas del teléfono)
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require(path.join(process.env.APPDATA, 'npm/node_modules/@playwright/mcp/node_modules/playwright'));

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const SITE = process.argv[2] || 'http://[::1]:5180/';
const FPS = 30;
const dir = __dirname;
const only = process.env.ONLY; // 'v' o 'h'

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shots(browser) {
  const out = path.join(dir, 'shots');
  fs.mkdirSync(out, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto(SITE);
  await wait(3500);
  const targets = [null, '#catalogo', '#medida', '#galeria', '#pedido'];
  for (let i = 0; i < targets.length; i++) {
    if (targets[i]) {
      for (let k = 0; k < 3; k++) {
        await page.evaluate((s) => document.querySelector(s).scrollIntoView(), targets[i]);
        await wait(900);
      }
      await page.evaluate(() => window.scrollBy(0, -10));
      await wait(1200);
    }
    await page.screenshot({ path: path.join(out, `s${i + 1}.png`) });
    console.log('shot', i + 1);
  }
  await page.close();
}

async function render(browser, name, w, h) {
  const frames = path.join(dir, 'out', `frames-${name}`);
  fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames, { recursive: true });
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto('file:///' + path.join(dir, 'index.html').replace(/\\/g, '/') + `?w=${w}&h=${h}`);
  await page.waitForFunction(() => window.__ready, null, { timeout: 60000 });
  const dur = await page.evaluate(() => window.DURATION);
  const n = Math.round(dur * FPS);
  for (let f = 0; f < n; f++) {
    await page.evaluate((t) => window.render(t), f / FPS);
    await page.screenshot({ path: path.join(frames, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    if (f % 150 === 0) console.log(name, f, '/', n);
  }
  await page.close();
  const file = path.join(dir, 'out', `El-Poli-promo-${name}.mp4`);
  execFileSync(FFMPEG, ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.jpg'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file], { stdio: 'inherit' });
  console.log('ok', file);
}

(async () => {
  const browser = await chromium.launch();
  if (!fs.existsSync(path.join(dir, 'shots', 's5.png')) || process.env.SHOTS) await shots(browser);
  if (only === 'shots') return browser.close();
  if (only !== 'h') await render(browser, 'celular', 1080, 1920);
  if (only !== 'v') await render(browser, 'pc', 1920, 1080);
  await browser.close();
})();
