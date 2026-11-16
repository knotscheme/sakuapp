// CRAFT OEM の管理画面（CMS）のデモ用データと仕組み
// ※すべて架空のデータです。操作した内容は、見ている人のブラウザ（localStorage）にだけ保存されます。
import { ALL_MODELS, LOT_DISCOUNT, PLATE_COST, type Lot, type ModelId } from "./models";

export const STAGES = [
  { id: "inquiry", ja: "問い合わせ", en: "Inquiry", next: "見積を作成して送る" },
  { id: "quote", ja: "見積送付", en: "Quote sent", next: "承諾を受けて発注依頼書を作る" },
  { id: "order", ja: "発注・入金", en: "Ordered", next: "ロゴ配置イメージを送る" },
  { id: "proof", ja: "ロゴ配置確認", en: "Logo proof", next: "製造指示書を工場へ送る" },
  { id: "production", ja: "製造中", en: "Production", next: "工場から出荷する" },
  { id: "transit", ja: "タイ→日本 輸送", en: "In transit", next: "日本に到着、検品を始める" },
  { id: "inspection", ja: "国内検品", en: "Inspection", next: "検品OK、お客様へ発送する" },
  { id: "shipping", ja: "発送済み", en: "Shipped", next: "受け取りを確認して完了にする" },
  { id: "done", ja: "完了", en: "Done", next: "" },
] as const;
export type StageId = (typeof STAGES)[number]["id"];
export const stageIndex = (s: StageId) => STAGES.findIndex((x) => x.id === s);

// 工場での工程（工場の画面で、英語・タイ語でも表示）
export const PROD_STEPS = [
  { ja: "裁断", en: "Cutting", th: "ตัดหนัง" },
  { ja: "縫製", en: "Sewing", th: "เย็บ" },
  { ja: "箔押し", en: "Logo stamping", th: "ปั๊มโลโก้" },
  { ja: "仕上げ・梱包", en: "Finishing & packing", th: "เก็บงานและแพ็ค" },
];

// 国内検品のチェック項目
export const CHECKS = ["ロゴのかすれ・にじみ", "ロゴの位置ズレ", "縫製のほつれ・目飛び", "革のキズ・汚れ", "金具・ファスナーの動き", "数量・梱包"];

// 書類の種類と、作られる段階
export const DOCS = [
  { id: "quote", ja: "見積書", at: "quote" },
  { id: "po", ja: "発注依頼書（注文請書）", at: "order" },
  { id: "deposit", ja: "前金の請求書", at: "order" },
  { id: "work", ja: "製造指示書（英語・タイ語）", at: "production" },
  { id: "inspect", ja: "検品報告書", at: "shipping" },
  { id: "delivery", ja: "納品書・請求書", at: "shipping" },
] as const;
export type DocId = (typeof DOCS)[number]["id"];

export type Log = { at: string; who: string; text: string; kind?: "mail" | "doc" | "factory" | "system" };
export type Deal = {
  id: string;
  brand: string;
  person: string;
  email: string;
  model: ModelId;
  lot: number;
  finish: "金箔" | "銀箔" | "素押し";
  color: string;
  sellPrice: number; // お客様の想定販売価格（参考）
  stage: StageId;
  owner: string;
  createdAt: string;
  due: string; // 次の期日
  prodStep: number; // 工場の工程（0〜4）
  defects: number;
  checks: boolean[];
  tracking?: string;
  thbCost?: number; // 工場の原価（1個・バーツ）
  message?: string;
  logs: Log[];
};

export const OWNERS = ["佐藤", "田中", "小川"];
export const FACTORY = "Bangkok Leather Factory（仮）";
export const RATE = 4.3; // 1バーツ＝4.3円（仮）

const d = (offset: number) => {
  const t = new Date();
  t.setDate(t.getDate() + offset);
  return t.toISOString().slice(0, 10);
};

export function unitPriceOf(model: ModelId, lot: number) {
  const base = ALL_MODELS.find((m) => m.id === model)?.unitPrice ?? 0;
  const key = ([300, 100, 50, 30] as Lot[]).find((l) => lot >= l) ?? 30;
  return Math.round((base * (1 - LOT_DISCOUNT[key])) / 10) * 10;
}
export function amounts(x: Pick<Deal, "model" | "lot">) {
  const unit = unitPriceOf(x.model, x.lot);
  const sub = unit * x.lot + PLATE_COST;
  const tax = Math.round(sub * 0.1);
  return { unit, items: unit * x.lot, plate: PLATE_COST, sub, tax, total: sub + tax, deposit: Math.round((sub + tax) * 0.5) };
}

type Seed = [string, string, ModelId, number, Deal["finish"], string, StageId, number, number];
const SEEDS: Seed[] = [
  ["MAISON NOIR", "山田 花子", "long", 100, "金箔", "ダークブラウン", "inquiry", 1, 0],
  ["atelier hinata", "佐々木 結", "trifold", 50, "素押し", "キャメル", "inquiry", 0, 0],
  ["KURO STANDARD", "高橋 誠", "bifold", 300, "銀箔", "ネイビー", "quote", 2, 0],
  ["Lumière Tokyo", "伊藤 美咲", "tote", 50, "金箔", "ダークブラウン", "order", 3, 0],
  ["NORTH & CO.", "中村 健", "fragment", 100, "素押し", "ブラック", "proof", -1, 0],
  ["SOLA beauty", "小林 愛", "phone", 100, "金箔", "ネイビー", "production", 9, 2],
  ["ARCH WORKS", "加藤 翔", "long", 300, "銀箔", "ブラック", "production", 14, 1],
  ["hanare", "松本 杏", "trifold", 50, "金箔", "キャメル", "transit", 4, 4],
  ["GRAIN SUPPLY", "井上 大輔", "bifold", 100, "素押し", "ダークブラウン", "inspection", 1, 4],
  ["Petit Lune", "木村 彩", "fragment", 30, "金箔", "ネイビー", "done", -12, 4],
];

function seedLogs(stage: StageId, brand: string): Log[] {
  const out: Log[] = [{ at: d(-20), who: "システム", text: `LPのフォームから問い合わせが届きました（${brand}）`, kind: "system" }];
  const i = stageIndex(stage);
  if (i >= 1) out.push({ at: d(-18), who: "佐藤", text: "見積書を作成し、お客様にメールで送りました", kind: "mail" });
  if (i >= 2) out.push({ at: d(-15), who: "お客様", text: "見積を承諾しました。発注依頼書と前金の請求書を作成しました", kind: "doc" });
  if (i >= 3) out.push({ at: d(-13), who: "佐藤", text: "ロゴ配置イメージを送りました", kind: "mail" });
  if (i >= 4) out.push({ at: d(-11), who: "お客様", text: "ロゴ配置を承認しました。製造指示書を工場へ送りました", kind: "factory" });
  if (i >= 5) out.push({ at: d(-4), who: "工場", text: "出荷しました（タイ→日本）", kind: "factory" });
  if (i >= 6) out.push({ at: d(-1), who: "検品", text: "日本に到着しました。検品を始めます", kind: "system" });
  if (i >= 8) out.push({ at: d(-12), who: "田中", text: "受け取りを確認し、完了にしました", kind: "system" });
  return out.reverse();
}

export function seedDeals(): Deal[] {
  return SEEDS.map(([brand, person, model, lot, finish, color, stage, due, prodStep], i) => {
    const si = stageIndex(stage);
    return {
      id: `C-${1024 + i}`,
      brand, person,
      email: `info@${brand.toLowerCase().replace(/[^a-z]/g, "") || "brand"}.example`,
      model, lot, finish, color,
      sellPrice: [18000, 9800, 12800, 16800, 7800, 8800, 21000, 9800, 12800, 7800][i],
      stage,
      owner: OWNERS[i % 3],
      createdAt: d(-20 + i),
      due: d(due),
      prodStep,
      defects: stage === "inspection" ? 2 : 0,
      checks: CHECKS.map((_, k) => stage === "done" || (stage === "inspection" && k < 3)),
      tracking: si >= 5 ? `TH${880000 + i * 137}JP` : undefined,
      thbCost: Math.round(unitPriceOf(model, lot) / RATE / 1.6),
      message: i === 0 ? "ギフト向けに金箔でロゴを入れたいです。化粧箱も検討しています。" : undefined,
      logs: seedLogs(stage, brand),
    };
  });
}

export const yenOf = (n: number) => `${Math.round(n).toLocaleString("ja-JP")}円`;
export const modelOf = (id: ModelId) => ALL_MODELS.find((m) => m.id === id)!;
export const today = () => new Date().toISOString().slice(0, 10);
export const daysLeft = (due: string) => Math.round((new Date(due).getTime() - new Date(today()).getTime()) / 86400000);
