"use client";

// データはこの端末のブラウザの中だけに保存する（サーバーには送らない）
import { useSyncExternalStore } from "react";
import type { PersonalTag } from "./accounts";
import { buildSeed } from "./seed";

export type Change = { at: string; what: string };
export type Entry = {
  id: string;
  date: string; // YYYY-MM-DD
  debit: string; // 借方（お金の使い道・増えたもの）
  credit: string; // 貸方（お金の出どころ）
  amount: number; // 税込
  partner: string; // 取引先
  memo: string;
  taxRate: 10 | 8 | 0;
  invoice: string; // 登録番号（T＋13桁）
  bizPct: number; // 仕事で使った割合（家事按分）
  personal: PersonalTag; // 生活費のとき、申告で使うかどうか
  source: "bank" | "card" | "receipt" | "manual" | "start";
  status: "ok" | "check";
  voided?: boolean; // 取り消し（消さずに残す）
  history: Change[];
  raw?: string; // 取り込んだ元の明細
  receipt?: string; // レシート画像のID
};
export type Rule = { key: string; account: string; bizPct: number; personal: PersonalTag; taxRate: 10 | 8 | 0; partner?: string; invoice?: string };
export type Asset = { id: string; name: string; date: string; price: number; kind: "pc" | "furniture" | "car"; method: "small" | "straight"; bizPct: number };
export type Profile = {
  name: string; shop: string; job: string;
  blue: "etax" | "paper" | "white";
  invoiceNo: string; ctax: "exempt" | "twoWari" | "simple" | "general"; simpleType: number;
  bizTaxRate: number;
};
export type Answers = { spouse: boolean; dependents: number; lifePaid: number; medicalPaid: number; medicalRefund: number; earthquake: number; extraSocial: number };
export type State = { v: 1; profile: Profile; entries: Entry[]; rules: Rule[]; assets: Asset[]; inventory: { start: number; end: number }; answers: Answers; done: string[] };

const KEY = "jbs-state-v1";
let st: State | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function load(): State {
  if (st) return st;
  if (typeof window === "undefined") return (st = buildSeed());
  try { const raw = localStorage.getItem(KEY); if (raw) return (st = JSON.parse(raw)); } catch {}
  st = buildSeed();
  save();
  return st;
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {} }
export function update(fn: (s: State) => State) { st = fn(load()); save(); emit(); }
export const getState = () => load();

let server: State | null = null;
const serverSnap = () => (server ??= buildSeed());
export function useStore(): State {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, load, serverSnap);
}
// 画面を開いたあと（ブラウザの保存を読んだあと）だけ true
let mounted = false;
const msubs = new Set<() => void>();
export function useMounted() {
  return useSyncExternalStore((f) => { msubs.add(f); if (!mounted) { mounted = true; queueMicrotask(() => msubs.forEach((g) => g())); } return () => msubs.delete(f); }, () => mounted, () => false);
}

export const now = () => new Date().toLocaleString("ja-JP", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
export const uid = () => Math.random().toString(36).slice(2, 10);

// 仕訳を直す：前の内容を履歴に残す（電子帳簿保存法：訂正の記録）
export function editEntry(id: string, patch: Partial<Entry>, what: string) {
  update((s) => ({ ...s, entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch, history: [...e.history, { at: now(), what }] } : e)) }));
}
export function addEntries(list: Entry[]) { update((s) => ({ ...s, entries: [...s.entries, ...list] })); }
export function voidEntry(id: string) { editEntry(id, { voided: true, status: "ok" }, "取り消しました（記録は残しています）"); }

export function learn(rule: Rule) {
  update((s) => ({ ...s, rules: [...s.rules.filter((r) => r.key !== rule.key), rule] }));
}
export function resetDemo() { st = buildSeed(); save(); emit(); }
export function replaceState(next: State) { st = next; save(); emit(); }
