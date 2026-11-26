"use client";

// 商品とカテゴリのデータ置き場（デモ：ブラウザの localStorage に保存）
// 管理画面の「商品管理」で登録・編集した内容が、LPの製品一覧ページにそのまま出る
import { useSyncExternalStore } from "react";
import { ALL_MODELS, MODELS, type BaseModel } from "@/lib/models";
import { asset } from "@/lib/asset";
import { autoLeatherTr } from "@/lib/leatherTr";

export type Cat = { id: string; name: string };
export type Product = {
  id: string;
  name: string; // 正式名
  short: string; // 一覧での名前
  cat: string; // カテゴリのid
  feature: string;
  size: string;
  logo: string;
  unitPrice: number;
  img: string; // メイン画像（初期の商品はサイト内の写真、追加した商品は縮小した画像データ）
  subImgs?: string[]; // サブ画像（10枚まで）
  video?: string; // 動画のURL（YouTube・Vimeo）
  visible: boolean; // 製品一覧に出すか
  sku?: string; // 基本の品番（バリエーションが無いときは、これがそのままSKU）
  options?: VOption[]; // バリエーションの種類（カラー・サイズなど、用途に合わせて最大3つ）
  variants?: Variant[]; // 組み合わせごとのSKU品番
  leathers?: string[]; // 選べる革素材（登録した革のid。先頭が標準）
  cost?: { ds: number; labor: number }; // 社内用（お客様には見せない）：1個に使う革の量（デシ）と加工賃（円）
};
// 革素材：name はお客様にも見える名前。dsPrice（デシ単価・円）は社内用。add はお客様の単価への上乗せ（1個・円）
// ※1デシ＝10cm×10cm
// colors：この革で作れるカラー（登録したカラーの名前）。無ければ全部の色で作れる
// group：系統（イタリアンレザー・国産レザーなど）、tan：鞣し方、en・th：工場向けの英語・タイ語の名前（空なら日本語のまま出す）
export type LeatherDef = { id: string; name: string; code: string; dsPrice: number; add: number; img?: string; colors?: string[]; group?: string; tan?: Tan; en?: string; th?: string; minLot?: number }; // minLot：この革の最小ロット（無ければ全体の最小ロット） // img：革の見本の写真
export type Tan = "タンニン鞣し" | "クロム鞣し" | "混合鞣し";
export const TANS: Tan[] = ["タンニン鞣し", "クロム鞣し", "混合鞣し"];
// 例：{ name: "カラー", values: ["ブラック", "キャメル"] }
// kind：color は登録したカラーから、size は登録したサイズから選ぶ。custom は自由に入力
export type VOption = { name: string; values: string[]; kind?: "color" | "size" | "custom" };
// 例：{ key: "ブラック|M", values: ["ブラック", "M"], sku: "CR-TT-BK-M", visible: true }
// swatch：このSKUで丸のカラーピッカーに出す色（登録したカラーの名前）。無ければカラーの値と同じ色
export type Variant = { key: string; values: string[]; sku: string; visible: boolean; swatch?: string };
// あらかじめ登録しておくカラーとサイズ（カテゴリと同じように、商品管理の画面で増やせる）
export type ColorDef = { id: string; name: string; hex: string; code?: string }; // code：SKUに入れる記号（例：BK）
export type SizeDef = { id: string; name: string };
// products の並び＝製品一覧（カタログ）の表示順。lp＝LPのトップ（ベースモデル）に出す商品のidと、その表示順
type Catalog = { cats: Cat[]; products: Product[]; colors: ColorDef[]; sizes: SizeDef[]; leathers: LeatherDef[]; lp: string[] };

const KEY = "craft-oem-catalog-v3";
const ALL4 = ["ブラック", "ダークブラウン", "キャメル", "ネイビー"];
// 初期の革（デシ単価・上乗せ・作れる色は仮の値。管理画面で直せる）
const SEED_LEATHERS: LeatherDef[] = [
  { id: "l-my", group: "イタリアンレザー", tan: "タンニン鞣し", name: "マヤレザー", en: "Maya leather", th: "หนังมายา", code: "MY", dsPrice: 90, add: 800, img: "/images/leather-it.webp", colors: ALL4 },
  { id: "l-ms", group: "イタリアンレザー", tan: "タンニン鞣し", name: "ミッスーリレザー", en: "Missouri leather", th: "หนังมิสซูรี", code: "MS", dsPrice: 95, add: 900, img: "/images/leather-st.webp", colors: ["ブラック", "ダークブラウン", "キャメル"] },
  { id: "l-ak", group: "イタリアンレザー", tan: "タンニン鞣し", name: "アラスカレザー", en: "Alaska leather", th: "หนังอลาสก้า", code: "AK", dsPrice: 100, add: 1000, img: "/images/leather-vc.webp", colors: ["ブラック", "ダークブラウン", "ネイビー"] },
  { id: "l-tv", group: "国産レザー", tan: "タンニン鞣し", name: "たつの（ヴィンテージ）", en: "Tatsuno leather (vintage)", th: "หนังทัตสึโนะ (วินเทจ)", code: "TV", dsPrice: 75, add: 600, img: "/images/leather-tv.webp", colors: ["ダークブラウン", "キャメル"] },
  { id: "l-tn", group: "国産レザー", tan: "タンニン鞣し", name: "たつの（本ヌメ）", en: "Tatsuno leather (natural veg-tan)", th: "หนังทัตสึโนะ (หนังฟอกฝาดธรรมชาติ)", code: "TN", dsPrice: 70, add: 500, img: "/images/leather-nm.webp", colors: ["キャメル", "アイボリー"] },
  { id: "l-tj", group: "国産レザー", tan: "タンニン鞣し", name: "栃木レザー（ジーンズ）", en: "Tochigi leather (jeans)", th: "หนังโทจิงิ (ยีนส์)", code: "TJ", dsPrice: 80, add: 700, img: "/images/leather-jn.webp", colors: ["ネイビー"] },
  { id: "l-vc", group: "オリジナルレザー", tan: "タンニン鞣し", name: "ヴァイカウント", en: "Viscount leather", th: "หนังไวเคานต์", code: "VC", dsPrice: 60, add: 300, img: "/images/leather-vc.webp", colors: ALL4 },
  { id: "l-hb", group: "オリジナルレザー", tan: "タンニン鞣し", name: "ハイブリッド（混合鞣し）", en: "Hybrid leather (combination tanned)", th: "หนังไฮบริด (ฟอกผสม)", code: "HB", dsPrice: 50, add: 0, img: "/images/leather-it.webp", colors: [...ALL4, "グレー"] },
  { id: "l-sh", group: "シュリンクレザー", tan: "クロム鞣し", name: "シュリンクレザー", en: "Shrink leather", th: "หนังชริงค์", code: "SH", dsPrice: 45, add: 0, minLot: 300, img: "/images/leather-sh.webp", colors: ["ブラック", "ダークブラウン", "ネイビー", "グレー"] },
];
// 商品ごとの使用デシ数・加工賃・選べる革（先頭が標準）（初期の値）
const SEED_COST: Record<string, { ds: number; labor: number; leathers: string[] }> = {
  long: { ds: 14, labor: 900, leathers: ["l-hb", "l-vc", "l-my", "l-ms", "l-ak", "l-tv"] },
  bifold: { ds: 8, labor: 700, leathers: ["l-hb", "l-sh", "l-vc", "l-my", "l-ms", "l-tj"] },
  trifold: { ds: 7, labor: 650, leathers: ["l-hb", "l-vc", "l-my", "l-tv", "l-tn"] },
  fragment: { ds: 4, labor: 400, leathers: ["l-hb", "l-sh", "l-my", "l-tj"] },
  tote: { ds: 45, labor: 1800, leathers: ["l-hb", "l-ak", "l-tv", "l-tn"] },
  phone: { ds: 12, labor: 900, leathers: ["l-hb", "l-sh", "l-my", "l-tj"] },
};
const OLD_LEATHERS = ["l-st", "l-nm", "l-it"]; // 以前の初期の革（新しい革に置きかえる）
let cache: Catalog | null = null;
const subs = new Set<() => void>();

export function seedCatalog(): Catalog {
  return {
    cats: [
      { id: "wallet", name: "財布・小物" },
      { id: "bag", name: "バッグ" },
    ],
    colors: [
      { id: "c-bk", name: "ブラック", hex: "#1f1f21", code: "BK" },
      { id: "c-db", name: "ダークブラウン", hex: "#4a3226", code: "DB" },
      { id: "c-cm", name: "キャメル", hex: "#b0743f", code: "CM" },
      { id: "c-nv", name: "ネイビー", hex: "#1f2b45", code: "NV" },
      { id: "c-gy", name: "グレー", hex: "#8c8c8a", code: "GY" },
      { id: "c-iv", name: "アイボリー", hex: "#ece6d8", code: "IV" },
    ],
    sizes: [
      { id: "s-s", name: "S" }, { id: "s-m", name: "M" }, { id: "s-l", name: "L" }, { id: "s-xl", name: "XL" }, { id: "s-f", name: "フリー" },
    ],
    products: ALL_MODELS.map((m) => {
      const sku = SEED_SKU[m.id] ?? `CR-${m.id.toUpperCase()}`;
      const options: VOption[] = m.id === "tote"
        ? [{ name: "カラー", kind: "color", values: ["ブラック", "ダークブラウン"] }, { name: "サイズ", kind: "size", values: ["M", "L"] }]
        : [{ name: "カラー", kind: "color", values: ["ブラック", "ダークブラウン", "キャメル", "ネイビー"] }];
      const variants = buildVariants(options, []).map((v) => ({ ...v, sku: autoSku(sku, options, v.values) }));
      const c = SEED_COST[m.id];
      return { id: m.id, name: m.name, short: m.short, cat: m.cat, feature: m.feature, size: m.size, logo: m.logo, unitPrice: m.unitPrice, img: m.img, visible: !m.soon, sku, options, variants, leathers: c?.leathers, cost: c && { ds: c.ds, labor: c.labor } };
    }),
    leathers: SEED_LEATHERS,
    lp: MODELS.map((m) => m.id),
  };
}

export function loadCatalog(): Catalog {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? migrate(JSON.parse(raw)) : seedCatalog();
  } catch {
    cache = seedCatalog();
  }
  return cache!;
}
// 革素材を入れる前に保存したデータには、初期の革と、初期の商品の原価を足す（登録した商品や変更はそのまま）
function migrate(c: Catalog): Catalog {
  // 革を系統（イタリアン・国産・オリジナル・シュリンク）に分ける前のデータ：初期の革を新しい革に置きかえ、初期の商品の革も新しくする（追加した革はそのまま）
  if (c.leathers && !c.leathers.some((l) => l.group)) {
    const mine = c.leathers.filter((l) => !OLD_LEATHERS.includes(l.id) && l.id !== "l-sh");
    const map = (ids?: string[]) => ids && [...new Set(ids.map((id) => (OLD_LEATHERS.includes(id) ? "l-hb" : id)))];
    c = { ...c, leathers: [...SEED_LEATHERS, ...mine], products: c.products.map((p) => (SEED_COST[p.id] ? { ...p, leathers: SEED_COST[p.id].leathers } : { ...p, leathers: map(p.leathers) })) };
  }
  // LPの表示順を入れる前のデータ：シミュレーターのある公開中の商品を、今の並びのままLPに出す
  if (!c.lp) c = { ...c, lp: c.products.filter((p) => p.visible && ALL_MODELS.some((m) => m.id === p.id)).map((p) => p.id) };
  // 革ごとのカラーを入れる前の初期の革には、初期のカラーを足す
  if (c.leathers?.some((l) => !("colors" in l) && SEED_LEATHERS.find((x) => x.id === l.id)?.colors)) c = { ...c, leathers: c.leathers.map((l) => ("colors" in l ? l : { ...l, colors: SEED_LEATHERS.find((x) => x.id === l.id)?.colors })) };
  // 革ごとの最小ロットを入れる前のデータ：シュリンクレザーは300個から
  if (c.leathers?.some((l) => l.id === "l-sh" && !("minLot" in l))) c = { ...c, leathers: c.leathers.map((l) => (l.id === "l-sh" && !("minLot" in l) ? { ...l, minLot: 300 } : l)) };
  // 写真を入れる前の初期の革には、見本の写真を足す
  if (c.leathers) return c.leathers.some((l) => !l.img && SEED_LEATHERS.some((x) => x.id === l.id)) ? { ...c, leathers: c.leathers.map((l) => l.img ? l : { ...l, img: SEED_LEATHERS.find((x) => x.id === l.id)?.img }) } : c;
  return { ...c, leathers: SEED_LEATHERS, products: c.products.map((p) => { const x = SEED_COST[p.id]; return x && !p.leathers ? { ...p, leathers: x.leathers, cost: p.cost ?? { ds: x.ds, labor: x.labor } } : p; }) };
}
function save(next: Catalog) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    alert("保存できる容量を超えました。画像を小さくするか、商品を減らしてください。");
  }
  subs.forEach((f) => f());
}

const EMPTY: Catalog = { cats: [], products: [], colors: [], sizes: [], leathers: [], lp: [] };
export function useCatalog(): Catalog {
  return useSyncExternalStore(
    (f) => { subs.add(f); return () => subs.delete(f); },
    () => loadCatalog(),
    () => EMPTY,
  );
}

// LPのベースモデル・シミュレーター・見積フォームに出すモデル：商品管理で「公開中」のものだけ（非公開・削除したものは出さない）
// 読み込み前（サーバーで作るとき）は、初期の公開モデルを出しておく
// LPのトップに出す商品（公開中で「LPに出す」もの・LPの表示順）。読み込み前は初期の商品
let seedLp: Product[] | null = null;
const SEED_LP = () => { if (!seedLp) { const s = seedCatalog(); seedLp = s.lp.map((id) => s.products.find((p) => p.id === id)!).filter((p) => p.visible); } return seedLp; };
export function useLpProducts(): Product[] {
  const { products, lp } = useCatalog();
  if (!products.length) return SEED_LP();
  return lp.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p && p.visible);
}
// そのうち、利益シミュレーターと見積フォームで扱える（初期の）モデル
export function useLpModels(): BaseModel[] {
  return useLpProducts().map((p) => ALL_MODELS.find((m) => m.id === p.id)).filter((m): m is BaseModel => !!m);
}
// ===== 表示順 =====
// 製品一覧の順：ids（いま画面に出ている並び）の中で、1つ前・後ろと入れ替える
export function moveProduct(id: string, dir: -1 | 1, ids: string[]) {
  const c = loadCatalog();
  const k = ids.indexOf(id), other = ids[k + dir];
  if (k < 0 || !other) return;
  const a = c.products.findIndex((p) => p.id === id), b = c.products.findIndex((p) => p.id === other);
  const next = [...c.products];
  [next[a], next[b]] = [next[b], next[a]];
  save({ ...c, products: next });
}
export function setLp(id: string, on: boolean) {
  const c = loadCatalog();
  save({ ...c, lp: on ? (c.lp.includes(id) ? c.lp : [...c.lp, id]) : c.lp.filter((x) => x !== id) });
}
export function moveLp(id: string, dir: -1 | 1) {
  const c = loadCatalog();
  const k = c.lp.indexOf(id);
  if (k < 0 || k + dir < 0 || k + dir >= c.lp.length) return;
  const next = [...c.lp];
  [next[k], next[k + dir]] = [next[k + dir], next[k]];
  save({ ...c, lp: next });
}

export const imgSrc = (img: string) => (img.startsWith("data:") ? img : asset(img));

export function saveProduct(p: Product) {
  const c = loadCatalog();
  const exists = c.products.some((x) => x.id === p.id);
  save({ ...c, products: exists ? c.products.map((x) => (x.id === p.id ? p : x)) : [p, ...c.products] });
}
export function deleteProduct(id: string) {
  const c = loadCatalog();
  save({ ...c, products: c.products.filter((x) => x.id !== id), lp: c.lp.filter((x) => x !== id) });
}
export function toggleVisible(id: string) {
  const c = loadCatalog();
  save({ ...c, products: c.products.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)) });
}
export function addCat(name: string) {
  const c = loadCatalog();
  const id = `cat-${Date.now().toString(36)}`;
  save({ ...c, cats: [...c.cats, { id, name }] });
  return id;
}
export function renameCat(id: string, name: string) {
  const c = loadCatalog();
  save({ ...c, cats: c.cats.map((x) => (x.id === id ? { ...x, name } : x)) });
}
export function deleteCat(id: string) {
  const c = loadCatalog();
  if (c.products.some((p) => p.cat === id)) return false; // 商品が入っているカテゴリは消さない
  save({ ...c, cats: c.cats.filter((x) => x.id !== id) });
  return true;
}
// ===== カラー・サイズの登録 =====
export function addColor(name: string, hex: string, code?: string) {
  const c = loadCatalog();
  if (c.colors.some((x) => x.name === name)) return false;
  const cd = (code ?? "").normalize("NFKC").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || `C${c.colors.length + 1}`;
  save({ ...c, colors: [...c.colors, { id: `c-${Date.now().toString(36)}`, name, hex, code: cd }] });
  return true;
}
export function setColorHex(id: string, hex: string) {
  const c = loadCatalog();
  save({ ...c, colors: c.colors.map((x) => (x.id === id ? { ...x, hex } : x)) });
}
// 名前を変えたら、その名前を使っている商品のバリエーション（値・組み合わせ・丸の色）も同じ名前に変える
function renameIn(products: Product[], kind: "color" | "size", from: string, to: string): Product[] {
  return products.map((p) => {
    const i = (p.options ?? []).findIndex((o) => o.kind === kind && o.values.includes(from));
    const sw = kind === "color" && p.variants?.some((v) => v.swatch === from);
    if (i < 0 && !sw) return p;
    const options = p.options?.map((o, k) => (k === i ? { ...o, values: o.values.map((v) => (v === from ? to : v)) } : o));
    const variants = p.variants?.map((v) => {
      const values = i >= 0 ? v.values.map((x, k) => (k === i && x === from ? to : x)) : v.values;
      return { ...v, values, key: values.join("|"), swatch: v.swatch === from ? to : v.swatch };
    });
    return { ...p, options, variants };
  });
}
export function updateColor(id: string, patch: { name?: string; code?: string }) {
  const c = loadCatalog();
  const col = c.colors.find((x) => x.id === id);
  if (!col) return false;
  const name = patch.name?.trim();
  if (name && name !== col.name && c.colors.some((x) => x.name === name)) return false; // 同じ名前は2つ作らない
  const code = patch.code !== undefined ? patch.code.normalize("NFKC").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || col.code : col.code;
  const ren = !!name && name !== col.name;
  save({ ...c, colors: c.colors.map((x) => (x.id === id ? { ...x, name: name || x.name, code } : x)), products: ren ? renameIn(c.products, "color", col.name, name!) : c.products, leathers: ren ? c.leathers.map((l) => (l.colors ? { ...l, colors: l.colors.map((v) => (v === col.name ? name! : v)) } : l)) : c.leathers });
  return true;
}
export function renameSize(id: string, name: string) {
  const c = loadCatalog();
  const sz = c.sizes.find((x) => x.id === id);
  const n = name.trim();
  if (!sz || !n || n === sz.name) return true;
  if (c.sizes.some((x) => x.name === n)) return false;
  save({ ...c, sizes: c.sizes.map((x) => (x.id === id ? { ...x, name: n } : x)), products: renameIn(c.products, "size", sz.name, n) });
  return true;
}
// 使っている商品があるカラー・サイズは消さない
const usedIn = (c: Catalog, kind: "color" | "size", name: string) =>
  c.products.some((p) => p.options?.some((o) => o.kind === kind && o.values.includes(name)) || (kind === "color" && p.variants?.some((v) => v.swatch === name)));
export function deleteColor(id: string) {
  const c = loadCatalog();
  const col = c.colors.find((x) => x.id === id);
  if (!col || usedIn(c, "color", col.name)) return false;
  save({ ...c, colors: c.colors.filter((x) => x.id !== id), leathers: c.leathers.map((l) => (l.colors ? { ...l, colors: l.colors.filter((v) => v !== col.name) } : l)) });
  return true;
}
export function addSize(name: string) {
  const c = loadCatalog();
  if (c.sizes.some((x) => x.name === name)) return false;
  save({ ...c, sizes: [...c.sizes, { id: `s-${Date.now().toString(36)}`, name }] });
  return true;
}
export function deleteSize(id: string) {
  const c = loadCatalog();
  const sz = c.sizes.find((x) => x.id === id);
  if (!sz || usedIn(c, "size", sz.name)) return false;
  save({ ...c, sizes: c.sizes.filter((x) => x.id !== id) });
  return true;
}
// ===== 革素材の登録 =====
export function addLeather(name: string, code: string, dsPrice: number, add: number, img?: string, group?: string, tan?: Tan) {
  const c = loadCatalog();
  if (c.leathers.some((x) => x.name === name)) return false;
  const cd = code.normalize("NFKC").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || `L${c.leathers.length + 1}`;
  save({ ...c, leathers: [...c.leathers, { id: `l-${Date.now().toString(36)}`, name, code: cd, dsPrice: Math.max(0, dsPrice), add: Math.max(0, add), img, group: group?.trim() || undefined, tan, ...autoLeatherTr(name) }] });
  return true;
}
export function updateLeather(id: string, patch: Partial<Omit<LeatherDef, "id">>) {
  const c = loadCatalog();
  save({ ...c, leathers: c.leathers.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
}
export function deleteLeather(id: string) {
  const c = loadCatalog();
  if (c.products.some((p) => p.leathers?.includes(id))) return false; // 使っている商品があれば消さない
  save({ ...c, leathers: c.leathers.filter((x) => x.id !== id) });
  return true;
}
// その商品で選べる革（登録が無ければ、いちばん上の革だけ）
export function leathersOf(p: Pick<Product, "leathers"> | undefined, all: LeatherDef[]): LeatherDef[] {
  const ids = p?.leathers?.length ? p.leathers : all[0] ? [all[0].id] : [];
  return ids.map((id) => all.find((x) => x.id === id)).filter((x): x is LeatherDef => !!x);
}
// 革の最小ロット：全体の最小ロットより小さくはしない
export const minLotOf = (l: Pick<LeatherDef, "minLot"> | undefined, base: number) => Math.max(base, l?.minLot ?? 0);
// 商品が対応する革を付け外し（革素材の側から設定するとき）
export function toggleProductLeather(productId: string, leatherId: string) {
  const c = loadCatalog();
  save({ ...c, products: c.products.map((p) => {
    if (p.id !== productId) return p;
    const cur = p.leathers ?? [];
    return { ...p, leathers: cur.includes(leatherId) ? cur.filter((x) => x !== leatherId) : [...cur, leatherId] };
  }) });
}
// その革で作れる色だけに絞る（革に色の指定が無ければ、そのまま）
export const colorsForLeather = (names: string[], l?: Pick<LeatherDef, "colors">) => (l?.colors ? names.filter((n) => l.colors!.includes(n)) : names);
// 革で作れる色を、押して付け外しする
export function toggleLeatherColor(id: string, color: string, all: string[]) {
  const c = loadCatalog();
  save({ ...c, leathers: c.leathers.map((l) => {
    if (l.id !== id) return l;
    const cur = l.colors ?? all;
    return { ...l, colors: cur.includes(color) ? cur.filter((x) => x !== color) : all.filter((x) => cur.includes(x) || x === color) };
  }) });
}

// 原価と利益（1個・社内用）。販売単価は参考単価＋革の上乗せ。lot を渡すと、その数の数量割引を入れた単価で計算する
export function costOf(p: Pick<Product, "unitPrice" | "cost">, l: LeatherDef, rate = 0) {
  const ds = p.cost?.ds ?? 0, labor = p.cost?.labor ?? 0;
  const leather = Math.round(ds * l.dsPrice);
  const total = leather + labor;
  const price = Math.round(((p.unitPrice + l.add) * (1 - rate)) / 10) * 10;
  const profit = price - total;
  return { ds, leather, labor, total, price, profit, margin: price > 0 ? profit / price : 0 };
}

// そのSKUの丸に出す色
export function swatchOf(colors: ColorDef[], p: Product, v: Variant): ColorDef | undefined {
  const i = (p.options ?? []).findIndex((o) => o.kind === "color");
  const name = v.swatch ?? (i >= 0 ? v.values[i] : undefined);
  return colors.find((c) => c.name === name);
}

export function resetCatalog() {
  save(seedCatalog());
}

// アップロードした画像を 4:3・横960px に縮小して保存できる大きさにする
export const MAX_SUB = 10;

// YouTube・Vimeo のURLを、埋め込み用のURLに変える（対応していないURLは null）
export function embedUrl(url?: string): string | null {
  if (!url) return null;
  const u = url.trim();
  const yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`;
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export function shrinkImage(file: File, W = 960, H = 720, q = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = W; cv.height = H;
      const ctx = cv.getContext("2d")!;
      ctx.fillStyle = "#f4f4f2";
      ctx.fillRect(0, 0, W, H);
      const k = Math.min(W / im.width, H / im.height);
      const w = im.width * k, h = im.height * k;
      ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
      URL.revokeObjectURL(url);
      resolve(cv.toDataURL("image/jpeg", q));
    };
    im.onerror = reject;
    im.src = url;
  });
}

// ===== SKU品番とバリエーション =====
// ※本番では：product_options（種類）と product_variants（組み合わせ・SKU）のテーブル。SKUは重複できないように一意の制約を付ける
const SEED_SKU: Record<string, string> = { long: "CR-LW", bifold: "CR-BF", trifold: "CR-TF", fragment: "CR-FC", tote: "CR-TT", phone: "CR-PS" };
export const MAX_OPTIONS = 3;
// よく使う種類（押すだけで入る。名前も値も自由に変えられる）
export const OPTION_PRESETS: VOption[] = [
  { name: "カラー", kind: "color", values: [] },
  { name: "サイズ", kind: "size", values: [] },
  { name: "素材", kind: "custom", values: ["牛革", "ヌメ革"] },
  { name: "金具の色", kind: "custom", values: ["ゴールド", "シルバー"] },
];
const CODE: Record<string, string> = {
  ブラック: "BK", ダークブラウン: "DB", ブラウン: "BR", キャメル: "CM", ネイビー: "NV", グレー: "GY", ホワイト: "WH", レッド: "RD", グリーン: "GR", ベージュ: "BE",
  ゴールド: "GD", シルバー: "SV", 牛革: "CW", ヌメ革: "NM",
};
const vkey = (values: string[]) => values.join("|");

// 種類と値から、すべての組み合わせを作る（前に入れたSKUは引き継ぐ）
export function buildVariants(options: VOption[], old: Variant[]): Variant[] {
  const opts = options.filter((o) => o.name.trim() && o.values.length);
  if (!opts.length) return [];
  let combos: string[][] = [[]];
  for (const o of opts) combos = combos.flatMap((c) => o.values.map((v) => [...c, v]));
  return combos.map((values) => {
    const prev = old.find((x) => x.key === vkey(values));
    return prev ?? { key: vkey(values), values, sku: "", visible: true };
  });
}

// SKUを自動で作る：基本の品番＋値の記号（例：CR-TT-BK-M）。英数字の値はそのまま、日本語は記号の表か連番
export function autoSku(base: string, options: VOption[], values: string[], codes: Record<string, string> = {}) {
  const opts = options.filter((o) => o.name.trim() && o.values.length);
  const parts = values.map((v, i) => {
    if (opts[i]?.kind === "color" && codes[v]) return codes[v]; // 登録したカラーの記号
    if (CODE[v]) return CODE[v];
    const ascii = v.normalize("NFKC").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (ascii) return ascii.slice(0, 4);
    return String((opts[i]?.values.indexOf(v) ?? 0) + 1).padStart(2, "0");
  });
  return [base.trim() || "SKU", ...parts].join("-");
}

// 同じSKUが他にもあるか（全商品・全バリエーションで）
export function skuList(products: Product[], exceptId?: string) {
  const out: string[] = [];
  for (const p of products) {
    if (p.id === exceptId) continue;
    if (p.variants?.length) p.variants.forEach((v) => v.sku && out.push(v.sku.trim().toUpperCase()));
    else if (p.sku) out.push(p.sku.trim().toUpperCase());
  }
  return out;
}

