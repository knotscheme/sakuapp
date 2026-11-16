"use client";

// デモ用のデータ置き場（ブラウザの localStorage に保存）
import { useSyncExternalStore } from "react";
import { DOCS, DRAFT_LABEL, RATE, STAGES, STAGE_DRAFT, amounts, makeDraft, seedDeals, stageIndex, today, unitPriceOf, yenOf, type Deal, type Draft, type DraftKind, type Log, type Msg, type StageId } from "@/lib/cms";

const KEY = "craft-oem-cms-v5";
let cache: Deal[] | null = null;
const subs = new Set<() => void>();

function load(): Deal[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? JSON.parse(raw) : seedDeals();
  } catch {
    cache = seedDeals();
  }
  return cache!;
}
function save(next: Deal[]) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  subs.forEach((f) => f());
}

const EMPTY: Deal[] = [];
export function useDeals(): Deal[] {
  return useSyncExternalStore(
    (f) => { subs.add(f); return () => subs.delete(f); },
    () => load(),
    () => EMPTY,
  );
}

export function updateDeal(id: string, fn: (d: Deal) => Deal) {
  save(load().map((d) => (d.id === id ? fn(d) : d)));
}
export function addLog(d: Deal, who: string, text: string, kind?: Log["kind"]): Deal {
  return { ...d, logs: [{ at: today(), who, text, kind }, ...d.logs] };
}

// 次の段階へ進める（書類の作成・メール送信は、ここで自動で起きる想定）
export function advance(id: string, who = "佐藤") {
  updateDeal(id, (d) => {
    const i = stageIndex(d.stage);
    if (i >= STAGES.length - 1) return d;
    const next = STAGES[i + 1].id as StageId;
    let x: Deal = { ...d, stage: next };
    // この段階で送るはずだった下書きは、対応済み（ボタンで直接進めたとき）
    const k = STAGE_DRAFT[d.stage];
    if (k) x.drafts = x.drafts?.map((dr) => (dr.kind === k && dr.status === "draft" ? { ...dr, status: "sent", sentBy: who, sentAt: today() } : dr));
    const docs = DOCS.filter((k) => k.at === next).map((k) => k.ja);
    if (docs.length) x = addLog(x, "システム", `${docs.join("・")}を自動で作成しました`, "doc");
    const mail: Partial<Record<StageId, string>> = {
      quote: "見積書をお客様にメールで送りました",
      order: "発注依頼書と前金の請求書をお客様に送りました",
      proof: "ロゴ配置イメージを送り、承認をお願いしました",
      production: "製造指示書を工場の画面に送りました（英語・タイ語）",
      transit: "出荷のお知らせと到着予定をお客様に送りました",
      inspection: "日本に到着しました。検品の担当に通知しました",
      shipping: "発送のお知らせ（追跡番号つき）をお客様に送りました",
      done: "完了しました。お礼のメールを送りました",
    };
    if (mail[next]) x = addLog(x, who, mail[next]!, next === "production" ? "factory" : "mail");
    if (next === "proof") { x.proofVer = (x.proofVer ?? 0) + 1; x.proofReq = undefined; }
    if (next === "production") x.prodStep = 0;
    if (next === "transit") x.tracking = x.tracking ?? `TH${Math.floor(100000 + Math.random() * 899999)}JP`;
    const due = new Date(); due.setDate(due.getDate() + ({ quote: 3, order: 5, proof: 3, production: 21, transit: 7, inspection: 2, shipping: 3, done: 0 } as Record<string, number>)[next]);
    x.due = due.toISOString().slice(0, 10);
    return x;
  });
}

// 1つ前の段階に戻す（押し間違いの取り消し用）
export function revert(id: string, who = "佐藤") {
  updateDeal(id, (d) => {
    const i = stageIndex(d.stage);
    if (i <= 0) return d;
    const prev = STAGES[i - 1].id as StageId;
    let x: Deal = { ...d, stage: prev };
    if (prev === "production") x.prodStep = 4;
    x = addLog(x, who, `「${STAGES[i].ja}」から「${STAGES[i - 1].ja}」に戻しました`, "system");
    return x;
  });
}

export function addInquiry(p: { brand: string; email: string; model: Deal["model"]; lot: number; message?: string; logo?: string; logoAspect?: number; items?: Deal["items"] }) {
  const list = load();
  const n = Math.max(1023, ...list.map((d) => Number(d.id.slice(2)))) + 1;
  const deal: Deal = {
    id: `C-${n}`, brand: p.brand, person: p.brand, email: p.email, model: p.model, lot: p.lot,
    finish: "金箔", color: p.items?.[0]?.color ?? "ダークブラウン", sellPrice: 18000, stage: "inquiry", owner: "佐藤",
    createdAt: today(), due: today(), prodStep: 0, defects: 0, checks: [false, false, false, false, false, false],
    thbCost: Math.round(unitPriceOf(p.model, p.lot) / RATE / 1.6),
    message: p.message, logo: p.logo, logoAspect: p.logoAspect, items: p.items?.length ? p.items : undefined,
    logs: [{ at: today(), who: "システム", text: p.logo ? "LPのフォームから問い合わせが届きました（ロゴデータあり）" : "LPのフォームから問い合わせが届きました", kind: "system" }],
  };
  // 届いたらすぐ、返信と見積の下書きを自動で作る（人が確認して送るだけ）
  save([withDraft(deal, "reply"), ...list]);
}

export function resetDemo() {
  save(seedDeals());
}

// 工場との連絡を送る（履歴にも日本語で残す）
export function sendMsg(id: string, m: Omit<Msg, "id" | "at">) {
  updateDeal(id, (d) => {
    const msg: Msg = { ...m, id: `m${Date.now().toString(36)}`, at: new Date().toISOString() };
    const text = m.t ? m.t.ja : `「${m.raw}」（本番では日本語に自動翻訳）`;
    return addLog({ ...d, msgs: [...(d.msgs ?? []), msg] }, m.who, m.from === "factory" ? `工場からの連絡：${text}` : `工場へ返信：${m.t ? m.t.ja : m.raw}`, "factory");
  });
}
// 相手からの連絡を読んだことにする
export function markRead(id: string, from: Msg["from"]) {
  const d = load().find((x) => x.id === id);
  if (!d?.msgs?.some((m) => m.from === from && !m.read)) return;
  updateDeal(id, (x) => ({ ...x, msgs: x.msgs?.map((m) => (m.from === from ? { ...m, read: true } : m)) }));
}
export const unreadOf = (d: Pick<Deal, "msgs">, from: Msg["from"]) => (d.msgs ?? []).filter((m) => m.from === from && !m.read).length;

// ===== 自動化：下書き・入金の確認・ロゴの承認 =====
// 下書きを足す（同じ種類の確認待ちがあれば作らない）
function withDraft(d: Deal, kind: DraftKind): Deal {
  if (d.drafts?.some((x) => x.kind === kind && x.status === "draft")) return d;
  return addLog({ ...d, drafts: [...(d.drafts ?? []), makeDraft(kind, d)] }, "システム", `「${DRAFT_LABEL[kind]}」の下書きを自動で作成しました（確認待ち）`, "system");
}
export const pendingDrafts = (deals: Deal[]) => deals.flatMap((d) => (d.drafts ?? []).filter((x) => x.status === "draft").map((x) => ({ d, x })));

// 下書きを確認して送る。送ると、次の段階へ自動で進む（工場への発注は、人の最終確認のあとだけ）
export function sendDraft(dealId: string, draftId: string, who: string, edit: { subject: string; body: string }) {
  const d = load().find((x) => x.id === dealId);
  const dr = d?.drafts?.find((x) => x.id === draftId);
  if (!d || !dr || dr.status !== "draft") return;
  updateDeal(dealId, (x) => addLog({ ...x, drafts: x.drafts?.map((y) => (y.id === draftId ? { ...y, ...edit, status: "sent", sentBy: who, sentAt: today() } : y)) }, who, `下書きを確認して送信しました：「${edit.subject}」`, dr.to === "工場" ? "factory" : "mail"));
  if (STAGE_DRAFT[d.stage] === dr.kind) advance(dealId, who);
  if (dr.kind === "factory") sendMsg(dealId, { from: "japan", who, t: { ja: "新しい製造指示書を送りました。確認をお願いします", en: "We sent a new production order. Please check it.", th: "ส่งใบสั่งผลิตใหม่แล้ว กรุณาตรวจสอบ" } });
}
export function discardDraft(dealId: string, draftId: string, who: string) {
  updateDeal(dealId, (x) => addLog({ ...x, drafts: x.drafts?.map((y) => (y.id === draftId ? { ...y, status: "discarded" } : y)) }, who, "下書きを破棄しました", "system"));
}
// 前金の入金：本番では Stripe の決済完了や、銀行の入金データとの照合で自動で確認する
export function confirmPayment(dealId: string, via: string) {
  updateDeal(dealId, (x) => {
    if (x.paid) return x;
    let y: Deal = { ...x, paid: { at: today(), amount: amounts(x).deposit, via } };
    y = addLog(y, "システム", `前金 ${yenOf(amounts(x).deposit)} の入金を自動で確認しました（${via}）`, "system");
    y = addLog(y, "システム", "領収のお知らせをお客様に自動で送りました", "mail");
    y = { ...y, drafts: y.drafts?.map((dr) => (dr.kind === "remind" && dr.status === "draft" ? { ...dr, status: "discarded" } : dr)) };
    return y.stage === "order" ? withDraft(y, "proof") : y;
  });
}
// お客様がロゴ配置を承認したら、工場への発注の下書きを作る（発注するかは人が決める）
export function approveProof(dealId: string) {
  updateDeal(dealId, (x) => withDraft(addLog({ ...x, proofOk: true, proofReq: undefined }, "お客様", `お客様の画面からロゴ配置（第${x.proofVer ?? 1}版）を承認しました`), "factory"));
}
// 入金が期日を過ぎても確認できない注文には、入金のお願いの下書きを作る（本番では毎朝の定期実行）
export function checkReminders() {
  const list = load();
  const late = list.filter((d) => d.stage === "order" && !d.paid && d.due < today() && !d.drafts?.some((x) => x.kind === "remind" && x.status === "draft"));
  late.forEach((d) => updateDeal(d.id, (x) => withDraft(x, "remind")));
}
export type { Draft };
