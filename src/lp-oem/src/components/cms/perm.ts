"use client";

// メンバーと権限（デモ：ブラウザの localStorage に保存）
// 本番では Supabase Auth でログインし、権限はデータベースの行レベルの権限（RLS）でも守る
import { useSyncExternalStore } from "react";

export const PERMS = [
  { id: "deals.view", ja: "案件を見る" },
  { id: "deals.advance", ja: "案件の段階を進める・戻す" },
  { id: "customer.view", ja: "お客様の名前・連絡先を見る" },
  { id: "money.view", ja: "原価・粗利・売上を見る" },
  { id: "products.edit", ja: "商品を登録・編集する" },
  { id: "factory.use", ja: "工場の画面を使う" },
  { id: "inspect.use", ja: "検品の画面を使う" },
  { id: "analytics.view", ja: "アナリティクスを見る" },
  { id: "members.manage", ja: "メンバーと権限を管理する" },
] as const;
export type Perm = (typeof PERMS)[number]["id"];

export type Role = { id: string; name: string; desc: string; perms: Perm[]; locked?: boolean };
export type Member = { id: string; name: string; email: string; role: string };
type State = { roles: Role[]; members: Member[]; me: string };

const ALL = PERMS.map((p) => p.id) as Perm[];
export function seedPerm(): State {
  return {
    roles: [
      { id: "owner", name: "オーナー", desc: "すべての操作ができる", perms: ALL, locked: true },
      { id: "sales", name: "営業スタッフ", desc: "案件の対応と商品の登録", perms: ["deals.view", "deals.advance", "customer.view", "products.edit", "analytics.view"] },
      { id: "factory", name: "工場", desc: "工場の画面だけ（顧客情報・価格は見えない）", perms: ["factory.use"] },
      { id: "inspector", name: "検品担当", desc: "検品の画面と案件の確認", perms: ["inspect.use", "deals.view"] },
      { id: "viewer", name: "閲覧のみ", desc: "見るだけ（経理・外部の確認用）", perms: ["deals.view", "money.view", "analytics.view"] },
    ],
    members: [
      { id: "u1", name: "白川", email: "owner@craft.example", role: "owner" },
      { id: "u2", name: "佐藤", email: "sato@craft.example", role: "sales" },
      { id: "u3", name: "田中", email: "tanaka@craft.example", role: "sales" },
      { id: "u4", name: "Somchai", email: "factory@bkk-leather.example", role: "factory" },
      { id: "u5", name: "鈴木", email: "qc@craft.example", role: "inspector" },
      { id: "u6", name: "山本（経理）", email: "account@craft.example", role: "viewer" },
    ],
    me: "u1",
  };
}

const KEY = "craft-oem-perm-v1";
let cache: State | null = null;
const subs = new Set<() => void>();
function load(): State {
  if (cache) return cache;
  try { const raw = localStorage.getItem(KEY); cache = raw ? JSON.parse(raw) : seedPerm(); } catch { cache = seedPerm(); }
  return cache!;
}
function save(next: State) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  subs.forEach((f) => f());
}
const EMPTY: State = { roles: [], members: [], me: "" };
export function usePermState(): State {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => load(), () => EMPTY);
}

// いまの人と、その人ができること
export function useAuth() {
  const s = usePermState();
  const me = s.members.find((m) => m.id === s.me);
  const role = s.roles.find((r) => r.id === me?.role);
  const ready = s.members.length > 0;
  return { ready, me, role, can: (p: Perm) => !ready || !!role?.perms.includes(p) };
}

export function switchUser(id: string) { save({ ...load(), me: id }); }
export function setMemberRole(id: string, role: string) { const s = load(); save({ ...s, members: s.members.map((m) => (m.id === id ? { ...m, role } : m)) }); }
export function addMember(name: string, email: string, role: string) { const s = load(); save({ ...s, members: [...s.members, { id: `u${Date.now().toString(36)}`, name, email, role }] }); }
export function removeMember(id: string) { const s = load(); save({ ...s, members: s.members.filter((m) => m.id !== id), me: s.me === id ? "u1" : s.me }); }
export function togglePerm(roleId: string, p: Perm) {
  const s = load();
  save({ ...s, roles: s.roles.map((r) => (r.id !== roleId || r.locked ? r : { ...r, perms: r.perms.includes(p) ? r.perms.filter((x) => x !== p) : [...r.perms, p] })) });
}
export function resetPerm() { save(seedPerm()); }
