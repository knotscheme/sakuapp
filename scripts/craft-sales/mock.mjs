// CRAFT OEM 営業用：相手のブランド名（またはロゴ画像）を刻印した革小物のサンプル案を PNG で書き出す
// 使い方:
//   node scripts/craft-sales/mock.mjs --brand "GEAer" --item wallet --color camel --out out/geaer.png
//   node scripts/craft-sales/mock.mjs --logo path/to/logo.png --brand "esméw" --item cardcase --colors black,ivory,red
// --item   : wallet（ミニ財布） | cardcase（カードケース） | keycase（キーケース）
// --color  : 1色。--colors でカンマ区切りの複数色（並べて描く）
// ※ あくまで「イメージ案」。実物の写真ではないことを DM でも明記すること。
import { createRequire } from "node:module";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
// playwright はグローバルに入っているものを使う（require なら見つかる）
const { chromium } = createRequire(import.meta.url)("playwright");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith("--") ? [...a, [v.slice(2), all[i + 1]?.startsWith("--") ? "1" : all[i + 1]]] : a), []),
);

const COLORS = {
  black: ["#2a2725", "#151312"],
  camel: ["#b9814a", "#8a5a2e"],
  choco: ["#5a3a26", "#3a2416"],
  navy: ["#2c3a55", "#1a2336"],
  red: ["#9c2f2a", "#6e1c19"],
  green: ["#3f5a45", "#283b2d"],
  ivory: ["#e9dfcc", "#cbbd9f"],
  gray: ["#8b8682", "#605b57"],
};
const ITEMS = {
  wallet: { name: "ミニ財布", w: 300, h: 230, flap: true },
  cardcase: { name: "カードケース", w: 300, h: 190, flap: false },
  keycase: { name: "キーケース", w: 200, h: 270, flap: true },
};

const brand = args.brand ?? "YOUR BRAND";
const item = ITEMS[args.item ?? "wallet"] ?? ITEMS.wallet;
const colors = (args.colors ?? args.color ?? "camel").split(",").map((c) => c.trim()).filter((c) => COLORS[c]);
if (!colors.length) colors.push("camel");
const out = resolve(args.out ?? `out/${brand.replace(/[^\w-]+/g, "_") || "mock"}.png`);

let logo = "";
if (args.logo) {
  const mime = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" }[extname(args.logo).toLowerCase()] ?? "image/png";
  logo = `data:${mime};base64,${readFileSync(args.logo).toString("base64")}`;
}
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// 革の表情（細かいシボ）は SVG のノイズで描く
const grain = `url("data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='200' height='200' filter='url(#n)'/></svg>")}")`;

const piece = (c) => {
  const [base, dark] = COLORS[c];
  const light = c === "ivory";
  const mark = logo
    ? `<img src="${logo}" class="logo" style="filter:${light ? "brightness(.55)" : "brightness(0) invert(1)"} opacity(.55) drop-shadow(0 1px 0 rgba(255,255,255,.18)) drop-shadow(0 -1px 0 rgba(0,0,0,.45))">`
    : `<span class="deboss" style="color:${dark}">${esc(brand)}</span>`;
  return `<div class="item" style="width:${item.w}px;height:${item.h}px;background:linear-gradient(150deg,${base},${dark});">
    <div class="grain"></div>
    <div class="stitch"></div>
    ${item.flap ? `<div class="flap" style="background:linear-gradient(170deg,${base},${dark})"><div class="grain"></div><div class="stitch"></div></div>` : ""}
    <div class="mark">${mark}</div>
  </div><p class="cap">${c.toUpperCase()}</p>`;
};

const html = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:800px;background:#f4f0ea;font-family:"Noto Sans CJK JP","Hiragino Sans",sans-serif;color:#2a2622;display:flex;flex-direction:column;padding:56px 64px}
h1{font-size:30px;font-weight:700;letter-spacing:.02em}
h1 small{display:block;font-size:15px;font-weight:500;color:#8a7f72;margin-top:8px;letter-spacing:.06em}
.row{flex:1;display:flex;align-items:center;justify-content:center;gap:56px}
.col{display:flex;flex-direction:column;align-items:center}
.item{position:relative;border-radius:18px;box-shadow:0 18px 30px rgba(60,40,20,.22),0 3px 6px rgba(60,40,20,.18);overflow:hidden}
.grain{position:absolute;inset:0;background:${grain};mix-blend-mode:soft-light;opacity:.9}
.stitch{position:absolute;inset:10px;border:2px dashed rgba(255,255,255,.28);border-radius:12px}
.flap{position:absolute;left:0;right:0;top:0;height:42%;border-radius:18px 18px 22px 22px;box-shadow:0 6px 10px rgba(0,0,0,.25);overflow:hidden}
.mark{position:absolute;left:0;right:0;bottom:22%;display:flex;justify-content:center}
.deboss{font-family:Georgia,"Times New Roman",serif;font-size:26px;letter-spacing:.12em;text-shadow:0 1px 0 rgba(255,255,255,.22),0 -1px 1px rgba(0,0,0,.55);filter:brightness(.8)}
.logo{max-width:55%;max-height:46px}
.cap{margin-top:18px;font-size:13px;letter-spacing:.2em;color:#8a7f72}
footer{display:flex;justify-content:space-between;font-size:14px;color:#8a7f72}
footer b{color:#2a2622}
</style><body>
<h1>${esc(brand)} オリジナル${item.name} サンプル案<small>CRAFT OEM ／ 刻印ロゴ・カラー別 50個〜</small></h1>
<div class="row">${colors.map((c) => `<div class="col">${piece(c)}</div>`).join("")}</div>
<footer><span>※ 提案用のイメージです。実物の写真ではありません。形・革・色はご相談で決めます。</span><b>CRAFT OEM</b></footer>
</body>`;

mkdirSync(dirname(out), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({ path: out });
await browser.close();
console.log(out);
