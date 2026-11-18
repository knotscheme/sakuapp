// 商品ページの健康診断：AIに選ばれるための情報が、ページにそろっているかを点検する
// AIは使わない（決まったルールで点検する）ので、AIの利用料はかからない
import { PRODUCTS, signals, type Sig } from "./demo";

export type Item = { id: string; label: string; why: string; sig?: Sig };
export const ITEMS: Item[] = [
  { id: "target", label: "向いている人／向いていない人", why: "AIは「〇〇な人向け」という言葉で商品を探します", sig: "target" },
  { id: "compare", label: "比較表", why: "表になった情報は、AIが答えにそのまま使いやすい" },
  { id: "faq", label: "よくある質問", why: "質問と答えの形は、AIがよく引用します", sig: "faq" },
  { id: "data", label: "構造化データ", why: "AIや検索エンジンが読む、決まった形の商品情報", sig: "data" },
  { id: "ingredient", label: "成分・素材", why: "「無香料」などの条件で聞かれたときの手がかり", sig: "ingredient" },
  { id: "spec", label: "値段・容量", why: "「3,000円台」などで比べられる数字", sig: "spec" },
  { id: "glossary", label: "用語の説明", why: "言葉の意味が分かると、何に効くかを正しく読める" },
  { id: "review", label: "レビューの中身", why: "どんな人に合ったかが書かれた口コミ", sig: "review" },
];

// 1商品の点検結果（直す前から足りている項目は、元のページの状態で決まる）
export function health(pid: string, applied: string[]) {
  const p = PRODUCTS.find((x) => x.id === pid)!;
  const sg = signals(pid, applied);
  const items = ITEMS.map((it) => ({ ...it, ok: applied.includes(it.id) || (it.sig ? p.base[it.sig] >= 0.3 && sg[it.sig] >= 0.3 : false) }));
  const ok = items.filter((x) => x.ok).length;
  return { p, items, ok, score: Math.round((ok / ITEMS.length) * 100) };
}
export function healthAll(applied: string[]) {
  const all = PRODUCTS.map((p) => health(p.id, applied));
  return { all, avg: Math.round(all.reduce((a, x) => a + x.score, 0) / all.length) };
}
// この案を使うと、平均点が何点上がるか
export const healthGain = (id: string, applied: string[]) => (applied.includes(id) ? 0 : healthAll([...applied, id]).avg - healthAll(applied).avg);
