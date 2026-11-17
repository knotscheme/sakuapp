// お店のサイトの種類ごとに、書き直しの「届け方」を決める
import { toCsv } from "./check";

export type Method = "api" | "csv" | "copy";
export type Platform = { id: string; name: string; method: Method; action: string; note: string };
export const PLATFORMS: Platform[] = [
  { id: "shopify", name: "Shopify", method: "api", action: "Shopifyに書きかえる", note: "TSURETEのアプリを入れてもらい、Shopify公式のしくみで商品ページを書きかえます。" },
  { id: "base", name: "BASE", method: "api", action: "BASEに書きかえる", note: "BASE公式のしくみで、商品説明を書きかえます（対応する項目は確認して決めます）。" },
  { id: "wordpress", name: "WordPress（WooCommerce）", method: "api", action: "WordPressに書きかえる", note: "WordPressのプラグインを入れてもらい、商品ページを書きかえます。" },
  { id: "spider", name: "Spider", method: "api", action: "Spiderに書きかえる", note: "Spiderの拡張アプリとして、商品ページを書きかえます。" },
  { id: "rakuten", name: "楽天市場", method: "csv", action: "楽天用のCSVで受け取る", note: "楽天の管理画面（RMS）の「CSVで商品を更新」で取りこみます。" },
  { id: "amazon", name: "Amazon", method: "csv", action: "Amazon用のCSVで受け取る", note: "セラーセントラルの「アップロードによる一括商品登録」で取りこみます。" },
  { id: "yahoo", name: "Yahoo!ショッピング", method: "csv", action: "Yahoo!用のCSVで受け取る", note: "ストアクリエイターProの「商品データのアップロード」で取りこみます。" },
  { id: "stores", name: "STORES", method: "csv", action: "STORES用のCSVで受け取る", note: "STORESの管理画面の「CSVで一括編集」で取りこみます。" },
  { id: "other", name: "そのほか・自作のサイト", method: "copy", action: "コピーする", note: "書き直した文章をコピーして、サイトの編集画面に貼りつけます。" },
];
export const platformOf = (id: string) => PLATFORMS.find((p) => p.id === id);
export const METHOD = { api: "つないで自動で書きかえ", csv: "CSVで一括", copy: "コピーして貼る" } as const;

// サイトごとのCSV（列名は目安。実際の取りこみ形式に合わせて調整する）
export type Row = { id: string; title: string; desc: string; faq: string };
export function platformCsv(id: string, rows: Row[]) {
  const html = (s: string) => s.split("\n").map((l) => `<p>${l}</p>`).join("");
  if (id === "rakuten") return toCsv([["コントロールカラム", "商品管理番号（商品URL）", "PC用商品説明文", "スマートフォン用商品説明文"], ...rows.map((r) => ["u", r.id, html(r.desc + "\n" + r.faq), html(r.desc + "\n" + r.faq)])]);
  if (id === "amazon") return toCsv([["sku", "product_description", "update_delete"], ...rows.map((r) => [r.id, r.desc + "\n" + r.faq, "PartialUpdate"])]);
  if (id === "yahoo") return toCsv([["code", "name", "caption"], ...rows.map((r) => [r.id, r.title, html(r.desc + "\n" + r.faq)])]);
  if (id === "shopify") return toCsv([["Handle", "Title", "Body (HTML)"], ...rows.map((r) => [r.id, r.title, html(r.desc + "\n" + r.faq)])]);
  return toCsv([["商品ID", "商品名", "商品説明", "よくある質問"], ...rows.map((r) => [r.id, r.title, r.desc, r.faq])]);
}
