"use client";

// デモの状態は、このブラウザの中だけに保存する
import { useSyncExternalStore } from "react";

export type Booking = { id: string; day: string; hour: number; menu: string; who: string; via: string; at: string };
export type State = {
  v: 1;
  applied: string[]; // ①で入れた改善
  history: { week: string; share: number }[]; // AI推薦シェアの記録
  windowOn: boolean; // ②AI窓口を公開しているか
  bookings: Booking[]; // ②AIからの予約
  autoMode: "auto" | "approve"; // ③空き枠の呼びかけ：自動か、承認してからか
  campaigns: Record<string, "pending" | "sent" | "skip">; // ③呼びかけの状態（キー：日付-時）
  partners: Record<string, "on" | "ask" | "suggest" | "no">; // ④提携の状態
  real: { name: string; area: string; kind: string }; // 自分の店で本当に試すとき
};
const KEY = "tsr-state-v1";
export const SEED: State = {
  v: 1, applied: [],
  history: [{ week: "10/14", share: 19 }, { week: "10/21", share: 17 }, { week: "10/28", share: 20 }, { week: "11/4", share: 19 }, { week: "11/11", share: 18 }],
  windowOn: false, bookings: [], autoMode: "approve", campaigns: {}, partners: {},
  real: { name: "", area: "", kind: "" },
};
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
