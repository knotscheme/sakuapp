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
// extra：役割に加えて許可、deny：役割にあっても禁止（人ごとの個別設定）
// lang：その人の画面の言語（タイの工場の人はタイ語）
export type Member = { id: string; name: string; email: string; role: string; lang?: "ja" | "th" | "en"; extra?: Perm[]; deny?: Perm[] };
export type PermLog = { at: string; by: string; text: string };
type State = { roles: Role[]; members: Member[]; me: string; logs: PermLog[] };

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
      { id: "u1", name: "佐藤", email: "owner@craft.example", role: "owner" },
      { id: "u2", name: "田中", email: "tanaka@craft.example", role: "sales" },
      { id: "u3", name: "小川", email: "ogawa@craft.example", role: "sales" },
      { id: "u4", name: "Somchai", email: "factory@bkk-leather.example", role: "factory", lang: "th" },
      { id: "u5", name: "鈴木", email: "qc@craft.example", role: "inspector" },
      { id: "u6", name: "山本（経理）", email: "account@craft.example", role: "viewer" },
    ],
    me: "u1",
    logs: [],
  };
}

const KEY = "craft-oem-perm-v4";
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
const EMPTY: State = { roles: [], members: [], me: "", logs: [] };
export function usePermState(): State {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => load(), () => EMPTY);
}

// いまの人と、その人ができること
export function useAuth() {
  const s = usePermState();
  const me = s.members.find((m) => m.id === s.me);
  const role = s.roles.find((r) => r.id === me?.role);
  const ready = s.members.length > 0;
  const perms = me ? effective(me, s.roles) : [];
  return { ready, me, role, isOwner: role?.id === "owner", can: (p: Perm) => !ready || perms.includes(p) };
}

export function switchUser(id: string) { save({ ...load(), me: id }); }
export function setMemberRole(id: string, role: string) { const s = load(); const m = s.members.find((x) => x.id === id); const r = s.roles.find((x) => x.id === role); save(log({ ...s, members: s.members.map((x) => (x.id === id ? { ...x, role } : x)) }, `${m?.name}の役割を「${r?.name}」に変更しました`)); }
export function addMember(name: string, email: string, role: string) { const s = load(); const r = s.roles.find((x) => x.id === role); save(log({ ...s, members: [...s.members, { id: `u${Date.now().toString(36)}`, name, email, role }] }, `${name}を「${r?.name}」として招待しました`)); }
export function removeMember(id: string) { const s = load(); const m = s.members.find((x) => x.id === id); save(log({ ...s, members: s.members.filter((x) => x.id !== id), me: s.me === id ? "u1" : s.me }, `${m?.name}をメンバーから外しました`)); }
export function togglePerm(roleId: string, p: Perm) {
  const s = load();
  const r = s.roles.find((x) => x.id === roleId);
  if (!r || r.locked) return;
  const on = !r.perms.includes(p);
  save(log({ ...s, roles: s.roles.map((x) => (x.id !== roleId ? x : { ...x, perms: on ? [...x.perms, p] : x.perms.filter((y) => y !== p) })) }, `役割「${r.name}」：「${permName(p)}」を${on ? "許可" : "禁止"}しました`));
}
const LANG_JA = { ja: "日本語", th: "タイ語", en: "英語" } as const;
export function setMemberLang(id: string, lang: "ja" | "th" | "en") { const s = load(); const m = s.members.find((x) => x.id === id); save(log({ ...s, members: s.members.map((x) => (x.id === id ? { ...x, lang } : x)) }, `${m?.name}の表示言語を「${LANG_JA[lang]}」に変更しました`)); }
export function addMemberWithLang(name: string, email: string, role: string, lang: "ja" | "th" | "en") { addMember(name, email, role); const s = load(); const last = s.members[s.members.length - 1]; save({ ...s, members: s.members.map((x) => (x.id === last.id ? { ...x, lang } : x)) }); }
export function resetPerm() { save(seedPerm()); }

// その人が実際にできること（役割＋個別の許可−個別の禁止）
export function effective(m: Member, roles: Role[]): Perm[] {
  const r = roles.find((x) => x.id === m.role);
  if (r?.locked) return [...r.perms];
  const base = new Set<Perm>([...(r?.perms ?? []), ...(m.extra ?? [])]);
  (m.deny ?? []).forEach((p) => base.delete(p));
  return [...base];
}

const nowStr = () => new Date().toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
const meName = (st: State) => st.members.find((m) => m.id === st.me)?.name ?? "";
const permName = (p: Perm) => PERMS.find((x) => x.id === p)?.ja ?? p;
function log(st: State, text: string): State { return { ...st, logs: [{ at: nowStr(), by: meName(st), text }, ...st.logs].slice(0, 50) }; }

// 人ごとの個別設定：役割どおり → 許可 → 禁止 → 役割どおり、の順に切り替える
export function cycleMemberPerm(memberId: string, p: Perm) {
  const st = load();
  const m = st.members.find((x) => x.id === memberId);
  if (!m) return;
  const r = st.roles.find((x) => x.id === m.role);
  const inRole = !!r?.perms.includes(p);
  const extra = new Set(m.extra ?? []), deny = new Set(m.deny ?? []);
  let text: string;
  if (inRole) {
    if (deny.has(p)) { deny.delete(p); text = `${m.name}：「${permName(p)}」を役割どおり（許可）に戻しました`; }
    else { deny.add(p); text = `${m.name}：「${permName(p)}」を個別に禁止しました`; }
  } else {
    if (extra.has(p)) { extra.delete(p); text = `${m.name}：「${permName(p)}」の個別の許可を外しました`; }
    else { extra.add(p); text = `${m.name}：「${permName(p)}」を個別に許可しました`; }
  }
  save(log({ ...st, members: st.members.map((x) => (x.id === memberId ? { ...x, extra: [...extra], deny: [...deny] } : x)) }, text));
}
export function clearMemberOverrides(memberId: string) {
  const st = load();
  const m = st.members.find((x) => x.id === memberId);
  save(log({ ...st, members: st.members.map((x) => (x.id === memberId ? { ...x, extra: [], deny: [] } : x)) }, `${m?.name}：個別の設定をすべて外し、役割どおりに戻しました`));
}
export function addRole(name: string, desc: string, copyFrom?: string) {
  const st = load();
  const src = st.roles.find((r) => r.id === copyFrom);
  const id = `r-${Date.now().toString(36)}`;
  save(log({ ...st, roles: [...st.roles, { id, name, desc, perms: src && !src.locked ? [...src.perms] : [] }] }, `役割「${name}」を作りました`));
}
export function deleteRole(id: string) {
  const st = load();
  const r = st.roles.find((x) => x.id === id);
  if (!r || r.locked || st.members.some((m) => m.role === id)) return false;
  save(log({ ...st, roles: st.roles.filter((x) => x.id !== id) }, `役割「${r.name}」を削除しました`));
  return true;
}
