// Usage: node render.mjs <reel.html> <out.mp4> [fps] [--stills t1,t2,...]
import { createRequire } from 'module';
import { spawn } from 'child_process';
import path from 'path';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const [, , html, out, fpsArg, flag, stillArg] = process.argv;
const fps = Number(fpsArg || 30);
const blur = Number(process.env.BLUR || 1);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const [file, query] = html.split('?');
await page.goto('file://' + path.resolve(file) + (query ? '?' + query : ''));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
const dur = await page.evaluate(() => window.DURATION);

if (flag === '--stills') {
  for (const t of stillArg.split(',').map(Number)) {
    await page.evaluate(t => window.renderAt(t), t);
    await page.screenshot({ path: `${out}-${t.toFixed(2)}.jpg`, type: 'jpeg', quality: 80 });
  }
} else {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps * blur), '-i', '-',
    ...(blur > 1 ? ['-vf', `tmix=frames=${blur},fps=${fps}`] : []),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(dur * fps * blur);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.renderAt(t), i / (fps * blur));
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}
await browser.close();
