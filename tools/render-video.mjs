/*
 * Exporte l'intro en MP4, image par image (rendu parfaitement fluide).
 *
 *   node tools/render-video.mjs                 → video/intro-16x9.mp4 (1920×1080)
 *   node tools/render-video.mjs --vertical      → video/intro-9x16.mp4 (1080×1920)
 *   options : --fps 30
 *
 * Nécessite Playwright (Chromium) et ffmpeg.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const vertical = args.includes("--vertical");
const fps = Number(args[args.indexOf("--fps") + 1]) || 30;
const [W, H] = vertical ? [1080, 1920] : [1920, 1080];
const out = path.join(ROOT, "video", vertical ? "intro-9x16.mp4" : "intro-16x9.mp4");

let playwright;
try {
  playwright = await import("playwright");
} catch {
  const req = createRequire(path.join(execSync("npm root -g").toString().trim(), "noop.js"));
  playwright = req("playwright");
}

// Petit serveur statique
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  const target = file.endsWith(path.sep) ? path.join(file, "index.html") : file;
  if (!target.startsWith(ROOT) || !fs.existsSync(target)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": types[path.extname(target)] || "application/octet-stream" });
  fs.createReadStream(target).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const url = `http://localhost:${server.address().port}/index.html?render`;

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__intro);
const duration = await page.evaluate(() => window.__intro.duration);
const total = Math.round(duration * fps);

fs.mkdirSync(path.dirname(out), { recursive: true });
const ff = spawn(
  "ffmpeg",
  ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
   "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
  { stdio: ["pipe", "inherit", "inherit"] }
);

for (let i = 0; i < total; i++) {
  await page.evaluate(
    (t) => new Promise((r) => { window.__intro.seek(t); requestAnimationFrame(() => requestAnimationFrame(r)); }),
    i / fps
  );
  const buf = await page.screenshot({ type: "png" });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % fps === 0) process.stdout.write(`\r${Math.round((i / total) * 100)} %`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
server.close();
console.log(`\r✔ ${path.relative(ROOT, out)} (${W}×${H}, ${fps} fps, ${duration}s)`);
