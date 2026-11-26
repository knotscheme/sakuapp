// 価格と割引の設定（オーナーが管理画面の「価格と割引」で変える）
// LP（見積もりフォーム・シミュレーター・製品一覧）と管理画面（見積・書類・下書き）は、すべてここを見る
// デモ：見ている人のブラウザ（localStorage）に保存。本番では Supabase の price_rules テーブル（変更は履歴つき）
import { useSyncExternalStore } from "react";

export type Tier = { at: number; rate: number }; // at 個以上で rate（0.04 = 4%引き）
export type PriceLog = { at: string; by: string; text: string };
export type Pricing = { minLot: number; plate: number; tiers: Tier[]; logs: PriceLog[] };

export const DEFAULT_PRICING: Pricing = {
  minLot: 30,
  plate: 10000,
  tiers: [{ at: 50, rate: 0.04 }, { at: 100, rate: 0.08 }, { at: 300, rate: 0.14 }],
  logs: [],
};

const KEY = "craftpack-oem-pricing-v1";
// 最初の表示（サーバーで作ったHTML）と合わせるため、読み込むまでは初期値を使う
let active: Pricing = DEFAULT_PRICING;
let loaded = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function read(): Pricing {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...DEFAULT_PRICING, ...JSON.parse(raw) }; } catch {}
  return DEFAULT_PRICING;
}
// 画面を表示したあとで、保存してある設定に切り替える（PricingSync から呼ぶ）
export function loadPricing() {
  if (loaded) return false;
  loaded = true;
  const p = read();
  const changed = JSON.stringify({ ...p, logs: [] }) !== JSON.stringify({ ...DEFAULT_PRICING, logs: [] });
  active = p;
  if (changed) emit();
  return changed;
}
export const getPricing = () => active;
export function usePricing(): Pricing {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => active, () => DEFAULT_PRICING);
}
export function subscribePricing(f: () => void) { subs.add(f); return () => { subs.delete(f); }; }

function save(next: Pricing) {
  active = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  emit();
}
const nowStr = () => new Date().toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const desc = (p: Pick<Pricing, "minLot" | "plate" | "tiers">) => `最小${p.minLot}個・版代${p.plate.toLocaleString()}円・${p.tiers.map((t) => `${t.at}個〜${pct(t.rate)}`).join("、")}`;

export function savePricing(next: Pick<Pricing, "minLot" | "plate" | "tiers">, by: string) {
  const tiers = [...next.tiers].filter((t) => t.at > next.minLot).sort((a, b) => a.at - b.at);
  save({ ...active, ...next, tiers, logs: [{ at: nowStr(), by, text: `変更：${desc({ ...next, tiers })}` }, ...active.logs].slice(0, 30) });
}
export function resetPricing(by: string) {
  save({ ...DEFAULT_PRICING, logs: [{ at: nowStr(), by, text: `初期の設定に戻しました（${desc(DEFAULT_PRICING)}）` }, ...active.logs].slice(0, 30) });
}

// 数量ごとの割引率（その数以上で一番大きい段階）
export function rateFor(qty: number, p: Pricing = active) {
  return [...p.tiers].sort((a, b) => b.at - a.at).find((t) => qty >= t.at)?.rate ?? 0;
}
// ロット数のボタン（最小ロット＋各段階）
export const lotChoices = (p: Pricing = active) => [p.minLot, ...p.tiers.map((t) => t.at).filter((x) => x > p.minLot)];
// 段階の一覧（最小ロットは割引なし）
export const allTiers = (p: Pricing = active): Tier[] => [{ at: p.minLot, rate: 0 }, ...p.tiers.filter((t) => t.at > p.minLot)];
