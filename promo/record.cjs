// Graba promo/index.html capturando fotogramas por CDP y los arma con ffmpeg.
// Uso: FFMPEG=ruta/ffmpeg.exe node promo/record.cjs   (servidor Vite en :5181)
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require(path.join(process.env.APPDATA, 'npm/node_modules/@playwright/mcp/node_modules/playwright'));

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const url = process.argv[2] || 'http://localhost:5181/promo/';
const out = path.join(__dirname, 'out');
const framesDir = path.join(out, 'frames');

(async () => {
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()));
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    const file = path.join(framesDir, `f${String(frames.length).padStart(5, '0')}.jpg`);
    frames.push({ file, t: metadata.timestamp });
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await page.goto(url);
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  await page.waitForFunction(() => window.__done || window.__error, null, { timeout: 180000, polling: 250 });
  const err = await page.evaluate(() => window.__error);
  if (err) console.log('ERROR:', err);
  await page.waitForTimeout(300);
  await cdp.send('Page.stopScreencast');
  await browser.close();

  let list = '';
  frames.forEach((f, i) => {
    const next = frames[i + 1] ? frames[i + 1].t : f.t + 1 / 30;
    list += `file '${f.file.replace(/\\/g, '/')}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}\n`;
  });
  list += `file '${frames[frames.length - 1].file.replace(/\\/g, '/')}'\n`;
  fs.writeFileSync(path.join(out, 'frames.txt'), list);
  console.log('frames', frames.length, 'dur', (frames.at(-1).t - frames[0].t).toFixed(1) + 's');
  execFileSync(FFMPEG, ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(out, 'frames.txt'),
    '-vf', 'fps=30,scale=1080:1920:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    path.join(out, 'raw.mp4')], { stdio: 'inherit' });
  console.log('ok', path.join(out, 'raw.mp4'));
})();
