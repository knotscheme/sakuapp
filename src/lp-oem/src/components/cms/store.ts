"use client";

// デモ用のデータ置き場（ブラウザの localStorage に保存）
import { useSyncExternalStore } from "react";
import { DOCS, RATE, STAGES, seedDeals, stageIndex, today, unitPriceOf, type Deal, type Log, type StageId } from "@/lib/cms";

const KEY = "craft-oem-cms-v1";
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
export function advance(id: string, who = "白川") {
  updateDeal(id, (d) => {
    const i = stageIndex(d.stage);
    if (i >= STAGES.length - 1) return d;
    const next = STAGES[i + 1].id as StageId;
    let x: Deal = { ...d, stage: next };
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
    if (next === "production") x.prodStep = 0;
    if (next === "transit") x.tracking = x.tracking ?? `TH${Math.floor(100000 + Math.random() * 899999)}JP`;
    const due = new Date(); due.setDate(due.getDate() + ({ quote: 3, order: 5, proof: 3, production: 21, transit: 7, inspection: 2, shipping: 3, done: 0 } as Record<string, number>)[next]);
    x.due = due.toISOString().slice(0, 10);
    return x;
  });
}

export function addInquiry(p: { brand: string; email: string; model: Deal["model"]; lot: number; message?: string }) {
  const list = load();
  const n = Math.max(1023, ...list.map((d) => Number(d.id.slice(2)))) + 1;
  const deal: Deal = {
    id: `C-${n}`, brand: p.brand, person: p.brand, email: p.email, model: p.model, lot: p.lot,
    finish: "金箔", color: "ダークブラウン", sellPrice: 18000, stage: "inquiry", owner: "白川",
    createdAt: today(), due: today(), prodStep: 0, defects: 0, checks: [false, false, false, false, false, false],
    thbCost: Math.round(unitPriceOf(p.model, p.lot) / RATE / 1.6),
    message: p.message, logs: [{ at: today(), who: "システム", text: "LPのフォームから問い合わせが届きました", kind: "system" }],
  };
  save([deal, ...list]);
}

export function resetDemo() {
  save(seedDeals());
}
