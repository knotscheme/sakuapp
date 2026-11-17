"use client";

// デモの状態は、このブラウザの中だけに保存する
import { useSyncExternalStore } from "react";

export type Order = { id: string; product: string; ai: string; price: number; at: string };
export type State = {
  v: 2;
  applied: string[]; // 「直す」で反映したもの
  orders: Order[]; // デモの中で、AIの画面から買われた注文
  real: { brand: string; item: string; kind: string }; // 自分の商品で本当に試すとき
  site: string; // お店のサイトの種類（Shopify・楽天など）
  sent: string[]; // 「この案を使う」で、サイトへ届けたもの（商品ID:項目）
  feed: boolean; // 商品フィードを作ったか
};
const KEY = "tsr-state-v2";
export const SEED: State = { v: 2, applied: [], orders: [], real: { brand: "", item: "", kind: "" }, site: "", sent: [], feed: false };
let st: State | null = null;
const subs = new Set<() => void>();
function load(): State {
  if (st) return st;
  if (typeof window === "undefined") return SEED;
  try { const r = localStorage.getItem(KEY); if (r) return (st = { ...SEED, ...JSON.parse(r) }); } catch {}
  return (st = structuredClone(SEED));
}
export function update(fn: (s: State) => State) { st = fn(load()); try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {} subs.forEach((f) => f()); }
export const getState = () => load();
export const useStore = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, load, () => SEED);
export function resetDemo() { st = structuredClone(SEED); try { localStorage.removeItem(KEY); } catch {} subs.forEach((f) => f()); }
let mounted = false;
const ms = new Set<() => void>();
export const useMounted = () => useSyncExternalStore((f) => { ms.add(f); if (!mounted) { mounted = true; queueMicrotask(() => ms.forEach((g) => g())); } return () => ms.delete(f); }, () => mounted, () => false);
export const uid = () => Math.random().toString(36).slice(2, 9);
