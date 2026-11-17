// 商品ページの診断（AIのキーがなくても動く、決まりにそった点検）と、CSVの読み書き
import { PAGES } from "./demo";

export type CheckKey = "title" | "target" | "ingredient" | "spec" | "faq" | "amount" | "data";
export const CHECKS: Record<CheckKey, { label: string; ok: string; ng: string }> = {
  title: { label: "商品名", ok: "商品の種類と容量が入っています", ng: "商品の種類か容量が、商品名から分かりません" },
  target: { label: "だれ向けか", ok: "どんな人に向いているかが書かれています", ng: "「敏感肌の方」のような、向いている人が書かれていません" },
  ingredient: { label: "成分・入っていないもの", ok: "成分や「入っていないもの」が書かれています", ng: "成分や「無香料」などが書かれていません" },
  spec: { label: "容量・使える期間", ok: "容量や使える期間が書かれています", ng: "説明の中に、容量や使える期間がありません" },
  faq: { label: "よくある質問", ok: "質問と答えの形の文章があります", ng: "よくある質問がありません" },
  amount: { label: "説明の量", ok: "AIが読むのに十分な量です", ng: "説明が短すぎます（120文字未満）" },
  data: { label: "AIが読む商品データ", ok: "商品データ（構造化データ）が入っています", ng: "AIが読む商品データが入っていません" },
};
export type Check = { key: CheckKey; ok: boolean | null };
export type Rewrite = { target: string; spec: string; ingredient: string; faq: string };
export type Item = { id: string; title: string; body: string; price: string; url?: string; checks: Check[]; score: number; rewrite?: Rewrite; aiNote?: string };

export const strip = (html: string) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<br\s*\/?>|<\/p>|<\/li>|<\/h\d>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/[ \t]+/g, " ").replace(/\n\s+/g, "\n").trim();

// 文章を点検する。data は HTML を読めたときだけ分かる（CSVでは null）
export function check(title: string, body: string, hasData: boolean | null): { checks: Check[]; score: number } {
  const t = body.normalize("NFKC");
  const c: Check[] = [
    { key: "title", ok: /\d+\s*(ml|g|個|枚|本|粒|包|セット)/i.test(title.normalize("NFKC")) },
    { key: "target", ok: /(肌の方|肌向け|の方に|の方へ|方のため|向けの|向けに|お子さま|子ども|赤ちゃん|メンズ|男性|女性|悩み)/.test(t) },
    { key: "ingredient", ok: /(成分|配合|不使用|フリー|入っていません|無香料|無添加|無着色)/.test(t) },
    { key: "spec", ok: /(\d+\s*(ml|g|日分|か月|ヶ月|カ月|回分|週間))|1日あたり/i.test(t) },
    { key: "faq", ok: /(Q\s*[.:]|よくある質問|よくあるご質問)/i.test(t) },
    { key: "amount", ok: t.replace(/\s/g, "").length >= 120 },
    { key: "data", ok: hasData },
  ];
  const known = c.filter((x) => x.ok !== null);
  return { checks: c, score: Math.round((known.filter((x) => x.ok).length / known.length) * 100) };
}

// AIのキーがないときの書き直しのひな形（分からない事実は【】で空ける）
export function template(title: string, body: string, price: string): Rewrite {
  const first = body.split(/[。\n]/)[0]?.trim();
  const size = title.normalize("NFKC").match(/\d+\s*(ml|g|個|枚|本|粒|包)/i)?.[0] ?? "【容量】";
  const p = price ? `${Number(price).toLocaleString("ja-JP")}円（税込）` : "【値段】";
  return {
    target: `【だれ向けか：例）敏感肌・乾燥肌の方】のために作りました。${first ? first + "。" : ""}【この商品で解決できる悩み】`,
    spec: `${size}　${p}\n【使える期間：例）朝晩使って約2か月】・1日あたり約【】円`,
    ingredient: "主な成分：【】\n入っていないもの：【例）香料、アルコール】",
    faq: "Q. 【敏感肌でも使えますか？】\nA. 【】\nQ. 【使う順番は？】\nA. 【】",
  };
}

// --- CSV ---
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], f = "", q = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) { if (ch === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(f); f = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && s[i + 1] === "\n") i++; row.push(f); f = ""; if (row.some((x) => x.trim())) rows.push(row); row = []; }
    else f += ch;
  }
  row.push(f); if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}
const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
export const toCsv = (rows: string[][]) => "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");

// Shopify・BASE・STORESの書き出しや、かんたんな表（商品名・説明・値段・URL）を読み取る
const COLS = {
  id: ["handle", "商品ID", "商品コード", "id"],
  title: ["title", "商品名", "名前", "name"],
  body: ["body (html)", "body", "説明", "商品説明", "description"],
  price: ["variant price", "price", "価格", "値段", "販売価格"],
  url: ["url", "商品url", "ページ"],
};
export function readProducts(rows: string[][]): { items: { id: string; title: string; body: string; price: string; url?: string }[]; error?: string } {
  if (rows.length < 2) return { items: [], error: "商品の行が見つかりませんでした" };
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const col = (k: keyof typeof COLS) => head.findIndex((h) => COLS[k].includes(h));
  const ci = { id: col("id"), title: col("title"), body: col("body"), price: col("price"), url: col("url") };
  if (ci.title < 0 && ci.id < 0) return { items: [], error: "「商品名」または「Title」の列が見つかりませんでした" };
  const map = new Map<string, { id: string; title: string; body: string; price: string; url?: string }>();
  rows.slice(1).forEach((r, i) => {
    const id = (ci.id >= 0 ? r[ci.id] : "") || (ci.title >= 0 ? r[ci.title] : "") || `row${i}`;
    const cur = map.get(id);
    if (cur) { if (!cur.title && ci.title >= 0) cur.title = r[ci.title]; if (!cur.body && ci.body >= 0) cur.body = r[ci.body]; return; } // Shopifyは色・サイズごとに行が分かれる
    map.set(id, { id, title: ci.title >= 0 ? r[ci.title] ?? "" : id, body: ci.body >= 0 ? r[ci.body] ?? "" : "", price: ci.price >= 0 ? (r[ci.price] ?? "").replace(/[^\d.]/g, "") : "", url: ci.url >= 0 ? r[ci.url] : undefined });
  });
  return { items: [...map.values()].filter((x) => x.title.trim()) };
}

// --- 見本 ---
const P = (s: string) => `<p>${s}</p>`;
export const SAMPLE_CSV = toCsv([
  ["Handle", "Title", "Body (HTML)", "Vendor", "Variant Price"],
  ["sorae-lotion", "SORAE 化粧水 しっとり 150ml", P(PAGES.lotion.target[0]), "SORAE", "3300"],
  ["sorae-lotion", "", "", "", "4950"],
  ["sorae-serum", "SORAE 美容液 ナイアシンアミド 30ml", P(PAGES.serum.target[0]), "SORAE", "4950"],
  ["sorae-uv", "SORAE UVジェル SPF50 60g", P(PAGES.uv.target[0]), "SORAE", "2750"],
  ["sorae-cleansing", "SORAE クレンジングジェル 150g", P("メイクも毛穴の汚れもするんと落とす、敏感肌の方向けのクレンジングジェルです。香料・アルコールは入っていません。") + P("150gで約1か月分。"), "SORAE", "2420"],
  ["sorae-milk", "SORAE 乳液", P("やさしいうるおい。"), "SORAE", "3520"],
  ["sorae-hand", "SORAE ハンドクリーム 50g", P("水仕事で乾燥しやすい手の方へ。無香料のハンドクリームです。成分：シアバター、グリセリン。50gで約1か月使えます。") + P("Q. べたつきませんか？ A. すぐになじみ、スマホもさわれます。"), "SORAE", "1650"],
  ["sorae-lip", "SORAE リップバーム", P("ふっくら唇へ。"), "SORAE", "1320"],
  ["sorae-gift", "SORAE ギフトセット", P("大切な人へ。"), "SORAE", "6600"],
]);
export const SAMPLE_URL = "https://sorae-skin.example/products/lotion";
export const SAMPLE_HTML = `<html><head><title>SORAE 化粧水 しっとり 150ml</title></head><body><h1>SORAE 化粧水 しっとり 150ml</h1><p>3,300円（税込）</p><p>${PAGES.lotion.target[0]}</p><p>150ml</p></body></html>`;

// 見本のときに出す「AIの書き直し案」（実際には、AIがページを読んで作る）
const R = (target: string, spec: string, ingredient: string, faq: string): Rewrite => ({ target, spec, ingredient, faq });
export const SAMPLE_REWRITES: Record<string, Rewrite> = {
  "sorae-lotion": R(PAGES.lotion.target[1], PAGES.lotion.spec[1], PAGES.lotion.ingredient[1], PAGES.lotion.faq[1]),
  "sorae-serum": R(PAGES.serum.target[1], PAGES.serum.spec[1], PAGES.serum.ingredient[1], PAGES.serum.faq[1]),
  "sorae-uv": R(PAGES.uv.target[1], PAGES.uv.spec[1], PAGES.uv.ingredient[1], PAGES.uv.faq[1]),
  "sorae-cleansing": R("敏感肌の方向けのクレンジングジェルです。メイクも毛穴の汚れも、こすらずにするんと落とせます。", "150g　2,420円（税込）\n毎晩使って約1か月・1日あたり約80円", "入っていないもの：香料、アルコール（エタノール）\n主な成分：【】", "Q. まつげエクステをしていても使えますか？\nA. 【】\nQ. ぬれた手でも使えますか？\nA. 【】"),
  "sorae-milk": R("【だれ向けか：例）乾燥肌の方】のための乳液です。化粧水のあとに、うるおいを閉じこめます。", "【容量】　3,520円（税込）\n【使える期間】・1日あたり約【】円", "主な成分：【】\n入っていないもの：【】", "Q. 化粧水のあとすぐ使えますか？\nA. 【】\nQ. べたつきませんか？\nA. 【】"),
  "sorae-hand": R("水仕事で手が乾燥しやすい方のための、無香料のハンドクリームです。すぐになじむので、塗ったあとすぐスマホもさわれます。", "50g　1,650円（税込）\n約1か月・1日あたり約55円", "主な成分：シアバター、グリセリン\n入っていないもの：香料", "Q. べたつきませんか？\nA. すぐになじみ、スマホもさわれます。\nQ. 料理の前に使えますか？\nA. 【】"),
  "sorae-lip": R("【だれ向けか：例）唇の乾燥や皮むけが気になる方】のためのリップバームです。", "【容量】　1,320円（税込）\n【使える期間】", "主な成分：【】\n入っていないもの：【】", "Q. 口紅の下地に使えますか？\nA. 【】\nQ. 寝る前に使えますか？\nA. 【】"),
  "sorae-gift": R("SORAEの化粧水・美容液・【】を1つの箱に入れたギフトセットです。【だれに贈るのに向いているか：例）30代の友だちへの誕生日プレゼント】", "【内容と容量】　6,600円（税込）\n別々に買うより【】円お得", "【入っている商品と、それぞれの成分】", "Q. のし・メッセージカードはつけられますか？\nA. 【】\nQ. 敏感肌の人に贈っても大丈夫ですか？\nA. 【】"),
};

export function diagnose(x: { id: string; title: string; body: string; price: string; url?: string }, hasData: boolean | null): Item {
  const text = strip(x.body);
  const r = check(x.title, text, hasData);
  return { ...x, body: text, ...r };
}

export function download(name: string, text: string, type = "text/csv;charset=utf-8") {
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
