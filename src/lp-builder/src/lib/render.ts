// 型と入力内容から、LPのHTMLを作る
// プレビュー・単体HTML・WordPress・Shopify のどれも、ここで作った同じHTMLとCSSを使う
import type { Ctx, Project, Template } from "./types";

// 文字をHTMLに安全に入れる。{ } も変えておく（Shopify の Liquid が命令と間違えないように）
export function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
}
const br = (s: string) => esc(s).replace(/\r?\n/g, "<br>");

// リンク先は http(s)・mailto・tel・ページ内（#）だけ。それ以外（javascript: など）は # にする
export function safeUrl(u: string) {
  const s = u.trim();
  if (!s) return "#";
  if (/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(s)) return s;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(s)) return `https://${s}`;
  return "#";
}

export type Mode = "edit" | "export";
export type ImgSrc = (slot: string) => string;

export function makeCtx(t: Template, p: Project, src: ImgSrc, mode: Mode): Ctx {
  const val = (id: string) => p.fields[id] ?? "";
  const label = (id: string) => t.fields.find((x) => x.id === id)?.label ?? id;
  const edit = mode === "edit";
  return {
    f: (id, tag = "span", cls = "") =>
      `<${tag}${cls ? ` class="${cls}"` : ""}${edit ? ` data-f="${id}" data-ph="${esc(label(id))}"` : ""}>${br(val(id))}</${tag}>`,
    img: (slot, cls = "") => {
      const s = t.slots.find((x) => x.id === slot);
      const r = s ? `${s.ratio[0]} / ${s.ratio[1]}` : "auto";
      const w = s ? s.max : 1200;
      const h = s ? Math.round((s.max * s.ratio[1]) / s.ratio[0]) : 800;
      return `<img class="lpb-img${cls ? ` ${cls}` : ""}" src="${src(slot)}" alt="${esc(s?.label ?? "")}" width="${w}" height="${h}" style="aspect-ratio:${r}" ${slot === t.slots[0].id ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${edit ? ` data-s="${slot}"` : ""}>`;
    },
    link: (l, u, cls = "") =>
      `<a class="${cls}" href="${esc(safeUrl(val(u)))}"${edit ? ` data-f="${l}" data-ph="${esc(label(l))}" data-u="${u}"` : ""}>${br(val(l))}</a>`,
    when: (ids, html) => (edit || ids.some((id) => val(id).trim()) ? html : ""),
    v: (id) => esc(val(id)),
  };
}

// 色の設定（CSSの変数）
export const colorVars = (t: Template, p: Project) =>
  t.colors.map((c) => `--${c.id}:${/^#[0-9a-f]{3,8}$/i.test(p.colors[c.id] ?? "") ? p.colors[c.id] : c.value}`).join(";");

// 共通の土台（どの型にも入る）
const BASE = `.lpb{box-sizing:border-box;-webkit-text-size-adjust:100%;line-break:strict;overflow-wrap:anywhere;line-height:1.8;-webkit-font-smoothing:antialiased}
.lpb *,.lpb *::before,.lpb *::after{box-sizing:border-box;margin:0;padding:0}
.lpb img{display:block;max-width:100%;height:auto;object-fit:cover}
.lpb a{color:inherit;text-decoration:none}
.lpb h1,.lpb h2,.lpb h3,.lpb blockquote,.lpb .lpb-keep{word-break:auto-phrase;text-wrap:pretty}
.lpb details summary{cursor:pointer;list-style:none}.lpb details summary::-webkit-details-marker{display:none}
.lpb .lpb-img{width:100%}
@media (prefers-reduced-motion:reduce){.lpb *{animation:none!important;transition:none!important}}`;

// プレビューで編集するときだけ足す見た目
const EDIT_CSS = `[data-f]{outline:1px dashed transparent;outline-offset:3px;border-radius:2px;cursor:text;transition:outline-color .2s}
[data-f]:hover{outline-color:rgba(37,99,235,.55)}[data-f]:focus{outline:2px solid #2563eb}
[data-f]:empty::before{content:attr(data-ph);opacity:.35}
img[data-s]{cursor:pointer;transition:filter .2s}img[data-s]:hover{filter:brightness(.82)}`;

export function buildParts(t: Template, p: Project, src: ImgSrc, mode: Mode) {
  const body = `<div class="lpb lpb-${t.id}" style="${colorVars(t, p)}">${t.render(makeCtx(t, p, src, mode))}</div>`;
  return { css: `${BASE}\n${t.css}`, body, fonts: t.fonts };
}

const title = (p: Project) => (p.fields.brand || p.info.brand || "LP").trim();
const descr = (p: Project) => (p.fields.heroSub || p.fields.heroCopy || "").replace(/\s+/g, " ").trim().slice(0, 120);

// プレビュー用（iframe の中身）。文字の編集と画像のクリックを親に知らせる小さなスクリプトつき
export function previewDoc(t: Template, p: Project, src: ImgSrc) {
  const { css, body, fonts } = buildParts(t, p, src, "edit");
  const js = `(function(){var P=parent;
document.querySelectorAll('[data-f]').forEach(function(el){try{el.contentEditable='plaintext-only'}catch(e){el.contentEditable='true'}
el.addEventListener('input',function(){var id=el.dataset.f,v=el.innerText.replace(/\\n$/,'');document.querySelectorAll('[data-f="'+id+'"]').forEach(function(o){if(o!==el)o.innerText=v});P.postMessage({lpb:'field',id:id,value:v},'*')});
el.addEventListener('paste',function(e){if(el.contentEditable==='true'){e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text'))}})});
document.querySelectorAll('details').forEach(function(d){d.open=true});
document.addEventListener('click',function(e){if(e.target.closest('summary [data-f]'))e.preventDefault();var a=e.target.closest('a');if(a)e.preventDefault();var im=e.target.closest('img[data-s]');if(im)P.postMessage({lpb:'slot',id:im.dataset.s},'*')});
window.addEventListener('message',function(e){var d=e.data||{};if(d.lpb==='set'){document.querySelectorAll('[data-f="'+d.id+'"]').forEach(function(o){if(document.activeElement!==o)o.innerText=d.value})}
if(d.lpb==='url'){document.querySelectorAll('[data-u="'+d.id+'"]').forEach(function(o){o.setAttribute('href',d.value)})}
if(d.lpb==='img'){document.querySelectorAll('img[data-s="'+d.id+'"]').forEach(function(o){o.src=d.value})}
if(d.lpb==='vars'){document.querySelector('.lpb').setAttribute('style',d.value)}
if(d.lpb==='scroll'){var el=document.querySelector('[data-s="'+d.id+'"],[data-f="'+d.id+'"]');if(el){var r=el.getBoundingClientRect();window.scrollTo({top:scrollY+r.top-innerHeight/2+r.height/2,behavior:'smooth'})}}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')P.postMessage({lpb:'esc'},'*')});
P.postMessage({lpb:'ready'},'*')})();`;
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${fonts}"><style>body{margin:0}${css}\n${EDIT_CSS}</style></head><body>${body}<script>${js}</script></body></html>`;
}

// 作品例の表示用（編集なし）
export function viewDoc(t: Template, p: Project, src: ImgSrc) {
  const { css, body, fonts } = buildParts(t, p, src, "export");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${fonts}"><style>body{margin:0}${css}</style><script>document.addEventListener('click',function(e){if(e.target.closest('a'))e.preventDefault()})</script></head><body>${body}</body></html>`;
}

// 単体で動くHTML（index.html）
export function standaloneDoc(t: Template, p: Project, src: ImgSrc, ogImage: string) {
  const { css, body, fonts } = buildParts(t, p, src, "export");
  const tt = esc(title(p)), d = esc(descr(p));
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${tt}</title>
<meta name="description" content="${d}">
<meta property="og:type" content="website">
<meta property="og:title" content="${tt}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>
body{margin:0}
${css}
</style>
</head>
<body>
${body}
</body>
</html>
`;
}

// WordPress（カスタムHTMLブロック）に貼る形。<html> や <body> は付けない
export function snippetHtml(t: Template, p: Project, src: ImgSrc) {
  const { css, body, fonts } = buildParts(t, p, src, "export");
  return `<!-- ${esc(title(p))}：LP BUILDER で作成（WordPress のカスタムHTMLブロックに、このまま貼り付けます） -->
<link rel="stylesheet" href="${fonts}">
<style>
${css}
</style>
${body}
`;
}

// Shopify のセクション（.liquid）。画像はテーマの assets に置き、asset_url で読む
export function shopifySection(t: Template, p: Project, assetName: (slot: string) => string) {
  const { css, body, fonts } = buildParts(t, p, (s) => `{{ '${assetName(s)}' | asset_url }}`, "export");
  const name = `LP ${t.name}`.slice(0, 25);
  return `{% comment %}${esc(title(p))}：LP BUILDER で作成したセクションです{% endcomment %}
<link rel="stylesheet" href="${fonts}">
<style>
${css}
</style>
${body}

{% schema %}
${JSON.stringify({ name, tag: "section", class: "lpb-section", settings: [], presets: [{ name }] }, null, 2)}
{% endschema %}
`;
}

// まだ画像が無い枠に出す仮の画像（枠の名前と縦横比を書いたもの）
export function placeholder(label: string, ratio: [number, number], dark = false) {
  const w = 1200, h = Math.round((1200 * ratio[1]) / ratio[0]);
  const bg = dark ? "#0d1726" : "#ecebe7", fg = dark ? "#7f93ad" : "#8b8a85";
  const fs = Math.round(Math.min(w, h) / 11);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${bg}"/><rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="none" stroke="${fg}" stroke-opacity=".35" stroke-width="3" stroke-dasharray="14 12"/><text x="50%" y="48%" fill="${fg}" font-family="sans-serif" font-size="${fs}" text-anchor="middle">${esc(label)}</text><text x="50%" y="${48 + 100 / 7}%" fill="${fg}" font-family="sans-serif" font-size="${Math.round(fs * 0.6)}" text-anchor="middle" opacity=".8">${ratio[0]}:${ratio[1]}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
