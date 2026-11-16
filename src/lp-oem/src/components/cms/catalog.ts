"use client";

// 商品とカテゴリのデータ置き場（デモ：ブラウザの localStorage に保存）
// 管理画面の「商品管理」で登録・編集した内容が、LPの製品一覧ページにそのまま出る
import { useSyncExternalStore } from "react";
import { ALL_MODELS } from "@/lib/models";
import { asset } from "@/lib/asset";

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
};
// 例：{ name: "カラー", values: ["ブラック", "キャメル"] }
export type VOption = { name: string; values: string[] };
// 例：{ key: "ブラック|M", values: ["ブラック", "M"], sku: "CR-TT-BK-M", visible: true }
export type Variant = { key: string; values: string[]; sku: string; visible: boolean };
type Catalog = { cats: Cat[]; products: Product[] };

const KEY = "craft-oem-catalog-v2";
let cache: Catalog | null = null;
const subs = new Set<() => void>();

export function seedCatalog(): Catalog {
  return {
    cats: [
      { id: "wallet", name: "財布・小物" },
      { id: "bag", name: "バッグ" },
    ],
    products: ALL_MODELS.map((m) => {
      const sku = SEED_SKU[m.id] ?? `CR-${m.id.toUpperCase()}`;
      const options: VOption[] = m.id === "tote"
        ? [{ name: "カラー", values: ["ブラック", "ダークブラウン"] }, { name: "サイズ", values: ["M", "L"] }]
        : [{ name: "カラー", values: ["ブラック", "ダークブラウン", "キャメル", "ネイビー"] }];
      const variants = buildVariants(options, []).map((v) => ({ ...v, sku: autoSku(sku, options, v.values) }));
      return { id: m.id, name: m.name, short: m.short, cat: m.cat, feature: m.feature, size: m.size, logo: m.logo, unitPrice: m.unitPrice, img: m.img, visible: !m.soon, sku, options, variants };
    }),
  };
}

export function loadCatalog(): Catalog {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? JSON.parse(raw) : seedCatalog();
  } catch {
    cache = seedCatalog();
  }
  return cache!;
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

const EMPTY: Catalog = { cats: [], products: [] };
export function useCatalog(): Catalog {
  return useSyncExternalStore(
    (f) => { subs.add(f); return () => subs.delete(f); },
    () => loadCatalog(),
    () => EMPTY,
  );
}

export const imgSrc = (img: string) => (img.startsWith("data:") ? img : asset(img));

export function saveProduct(p: Product) {
  const c = loadCatalog();
  const exists = c.products.some((x) => x.id === p.id);
  save({ ...c, products: exists ? c.products.map((x) => (x.id === p.id ? p : x)) : [p, ...c.products] });
}
export function deleteProduct(id: string) {
  const c = loadCatalog();
  save({ ...c, products: c.products.filter((x) => x.id !== id) });
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
  { name: "カラー", values: ["ブラック", "ダークブラウン", "キャメル", "ネイビー"] },
  { name: "サイズ", values: ["S", "M", "L"] },
  { name: "素材", values: ["牛革", "ヌメ革"] },
  { name: "金具の色", values: ["ゴールド", "シルバー"] },
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
export function autoSku(base: string, options: VOption[], values: string[]) {
  const opts = options.filter((o) => o.name.trim() && o.values.length);
  const parts = values.map((v, i) => {
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
