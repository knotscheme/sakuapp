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
};
type Catalog = { cats: Cat[]; products: Product[] };

const KEY = "craft-oem-catalog-v1";
let cache: Catalog | null = null;
const subs = new Set<() => void>();

export function seedCatalog(): Catalog {
  return {
    cats: [
      { id: "wallet", name: "財布・小物" },
      { id: "bag", name: "バッグ" },
    ],
    products: ALL_MODELS.map((m) => ({ id: m.id, name: m.name, short: m.short, cat: m.cat, feature: m.feature, size: m.size, logo: m.logo, unitPrice: m.unitPrice, img: m.img, visible: !m.soon })),
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
