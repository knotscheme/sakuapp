// ダウンロード用のファイルを作る（zip はブラウザの中で作る）
import { strToU8, unzipSync, zipSync, strFromU8, type Zippable } from "fflate";
import { placeholder, shopifySection, snippetHtml, standaloneDoc } from "./render";
import { isDark } from "./templates";
import type { Project, Template } from "./types";

export type Format = "html" | "wordpress" | "shopify" | "all";
export type ImgFiles = Record<string, { data: Uint8Array; ext: string } | undefined>;

const slug = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "lp";
const today = () => { const d = new Date(); return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`; };
export const zipName = (p: Project, t: Template, f: Format) => `${slug(p.fields.brand || p.info.brand || t.name)}-${f === "all" ? "lp" : f}-${today()}.zip`;

// 仮の画像（SVG）を、ファイルとして入れるための中身
function placeholderSvg(t: Template, slotId: string) {
  const s = t.slots.find((x) => x.id === slotId)!;
  return decodeURIComponent(placeholder(s.label, s.ratio, isDark(t)).split(",")[1]);
}

const README = (t: Template, p: Project, wpBase: string) => `LP BUILDER で作ったLP「${p.fields.brand || t.name}」（型：${t.name}）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ html/ … そのまま公開できる、単体のホームページ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
・index.html をダブルクリックすると、ブラウザで開けます。
・html フォルダの中身を、まるごとサーバーに置けば公開できます。
  （Netlify / GitHub Pages / Cloudflare Pages などの無料のサービスでも公開できます）
・画像は images フォルダに入っています。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ wordpress/ … WordPress のページに貼る形
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. images フォルダの画像を、WordPress の「メディア」→「新規追加」でアップロードします。
2. アップロードした画像のURLの「ファイル名より前の部分」を確かめます。
   例：https://あなたのサイト/wp-content/uploads/2026/11/
${wpBase ? `   ※ダウンロードのときに「${wpBase}」を入れたので、そのまま使えます。` : "   ※lp-snippet.html の中の「__IMAGE_BASE__/」を、このURLにまとめて置き換えます。"}
3. 固定ページを新しく作り、ブロックの「カスタムHTML」を追加して、lp-snippet.html の中身をすべて貼り付けます。
4. ページのテンプレートは「全幅」や「ヘッダー・フッターなし」を選ぶと、LPらしく広く表示されます。
※LPの見た目は .lpb で始まる名前でまとめてあるので、サイトのほかの部分は崩れません。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ shopify/ … Shopify のテーマに入れる形（セクション）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Shopify の管理画面 →「オンラインストア」→「テーマ」→「…」→「コードを編集」を開きます。
2. 「sections」フォルダで「新しいセクションを追加」→ 名前を lp-${t.id} にして、
   shopify/sections/lp-${t.id}.liquid の中身をすべて貼り付けて保存します。
3. 「assets」フォルダで「アセットを追加」→ shopify/assets の画像をすべてアップロードします。
4. 「カスタマイズ」でLPを出したいページ（新しいページテンプレートがおすすめ）を開き、
   「セクションを追加」→「LP ${t.name}」を選びます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ project.json … 作業の続きをするためのファイル
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
・LP BUILDER の「つくる」画面の「zipから読み込む」で、このzipを選ぶと続きから直せます。

※文章や写真の内容（効果の表現・お客様の声・人物の写真の許可など）は、公開前に必ずご自身で確かめてください。
`;

export function buildZip(t: Template, p: Project, imgs: ImgFiles, f: Format, wpBase = "") {
  const files: Zippable = {};
  const opt = (slot: string) => !imgs[slot] && !!t.slots.find((s) => s.id === slot)?.optional;
  const name = (slot: string) => {
    const im = imgs[slot];
    return opt(slot) ? "" : `${slot}.${im ? im.ext : "svg"}`;
  };
  const slots = t.slots.filter((s) => !opt(s.id));
  const data = (slot: string) => imgs[slot]?.data ?? strToU8(placeholderSvg(t, slot));
  const want = (x: Format) => f === "all" || f === x;
  const pre = (x: string) => (f === "all" ? `${x}/` : "");

  if (want("html")) {
    const doc = standaloneDoc(t, p, (s) => (name(s) ? `images/${name(s)}` : ""), `images/${name(t.slots[0].id)}`);
    files[`${pre("html")}index.html`] = strToU8(doc);
    for (const s of slots) files[`${pre("html")}images/${name(s.id)}`] = [data(s.id), { level: 0 }];
  }
  if (want("wordpress")) {
    const base = wpBase.trim() ? wpBase.trim().replace(/\/?$/, "/") : "__IMAGE_BASE__/";
    const file = (s: string) => (name(s) ? `lpb-${t.id}-${name(s)}` : "");
    files[`${pre("wordpress")}lp-snippet.html`] = strToU8(snippetHtml(t, p, (s) => (file(s) ? `${base}${file(s)}` : "")));
    for (const s of slots) files[`${pre("wordpress")}images/${file(s.id)}`] = [data(s.id), { level: 0 }];
  }
  if (want("shopify")) {
    const file = (s: string) => (name(s) ? `lpb-${t.id}-${name(s)}` : "");
    files[`${pre("shopify")}sections/lp-${t.id}.liquid`] = strToU8(shopifySection(t, p, file));
    for (const s of slots) files[`${pre("shopify")}assets/${file(s.id)}`] = [data(s.id), { level: 0 }];
  }
  files["project.json"] = strToU8(JSON.stringify({ app: "lp-builder", ...p }, null, 2));
  files["README.txt"] = strToU8(README(t, p, wpBase.trim()));
  return zipSync(files, { level: 6 });
}

export function wpSnippet(t: Template, p: Project, imgs: ImgFiles, wpBase: string) {
  const base = wpBase.trim() ? wpBase.trim().replace(/\/?$/, "/") : "__IMAGE_BASE__/";
  return snippetHtml(t, p, (s) => (!imgs[s] && t.slots.find((x) => x.id === s)?.optional ? "" : `${base}lpb-${t.id}-${s}.${imgs[s]?.ext ?? "svg"}`));
}

export function download(bytes: Uint8Array | string, filename: string, type = "application/zip") {
  const blob = new Blob([typeof bytes === "string" ? bytes : (bytes as BlobPart)], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

// 書き出したzipから、作業の続きを読み込む
export function readZip(buf: Uint8Array) {
  const all = unzipSync(buf);
  const pj = all["project.json"];
  if (!pj) throw new Error("このzipには project.json がありません（LP BUILDER で書き出したzipを選んでください）");
  const p = JSON.parse(strFromU8(pj)) as Project & { app?: string };
  const imgs: Record<string, Blob> = {};
  for (const [path, bytes] of Object.entries(all)) {
    const m = path.match(/^(?:[a-z]+\/)?(?:images|assets)\/(?:lpb-[a-z]+-)?([a-z0-9]+)\.(webp|jpg|png)$/);
    if (m && !imgs[m[1]]) imgs[m[1]] = new Blob([bytes as BlobPart], { type: m[2] === "jpg" ? "image/jpeg" : `image/${m[2]}` });
  }
  return { p, imgs };
}
