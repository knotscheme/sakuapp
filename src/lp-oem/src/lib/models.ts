// ベースモデルと価格の計算ロジック（制作サンプル用の架空の数値）

export type ModelId = "long" | "bifold" | "trifold" | "fragment" | "tote" | "phone";

export type BaseModel = {
  id: ModelId;
  name: string;
  short: string;
  feature: string;
  size: string;
  logo: string;
  unitPrice: number; // 30個時点の参考仕入れ単価（ロゴ加工込み）
  leather: string;
  img: string; // カード用の写真
  soon?: boolean; // 写真が届くまで表示しない
  cat: "wallet" | "bag"; // 製品一覧の分類
};

export const CATEGORIES = [
  { id: "all", name: "すべて" },
  { id: "wallet", name: "財布・小物" },
  { id: "bag", name: "バッグ" },
] as const;
export const COLORS = "ブラック・ダークブラウン・キャメル・ネイビー";
export const MIN_LOT = 30;

// モデルを増やすときは、ここに1件足すだけ（カード・シミュレーター・フォームに自動で出ます）
export const ALL_MODELS: BaseModel[] = [
  { id: "long", name: "本革ラウンドファスナー長財布", short: "ラウンド長財布", feature: "カード12枚・小銭入れ・札入れ2層。ギフト需要が最も高い定番型。", size: "W19.5 × H10 × D2.5 cm", logo: "表面右下 / 内装中央", unitPrice: 3500, leather: "#2b1d16", img: "/images/model-long.webp", cat: "wallet" },
  { id: "bifold", name: "キャッシュレス二つ折り財布", short: "二つ折り財布", feature: "カード6枚と札入れに絞った薄型設計。メンズ・ユニセックスに人気。", size: "W11 × H9.5 × D1.5 cm", logo: "表面左下 / 札入れ内側", unitPrice: 2800, leather: "#1c2230", img: "/images/model-bifold.webp", cat: "wallet" },
  { id: "trifold", name: "コンパクト三つ折りミニ財布", short: "三つ折りミニ財布", feature: "手のひらサイズに必要十分を収納。小さいバッグ派の女性に支持。", size: "W10 × H7.5 × D2.8 cm", logo: "フラップ中央", unitPrice: 2400, leather: "#8a5a36", img: "/images/model-trifold.webp", cat: "wallet" },
  { id: "fragment", name: "スリムフラグメントケース", short: "フラグメントケース", feature: "カード・紙幣・鍵まで入る極薄ケース。名入れノベルティにも最適。", size: "W10.5 × H7.5 × D0.8 cm", logo: "表面中央", unitPrice: 1800, leather: "#3d3f2e", img: "/images/model-fragment.webp", cat: "wallet" },
  { id: "tote", name: "本革トートバッグ", short: "トートバッグ", feature: "A4が入る、仕事にも休日にも使える定番トート。大きめのロゴも映えます。", size: "W38 × H30 × D12 cm", logo: "前面中央 / 内ポケット", unitPrice: 6800, leather: "#2b1d16", img: "/images/model-tote.webp", cat: "bag" },
  { id: "phone", name: "本革スマホショルダー", short: "スマホショルダー", feature: "スマホとカードを入れて斜めがけできる、小さなバッグ。若い世代に人気の型。", size: "W11 × H18 × D3 cm", logo: "前面下部", unitPrice: 3200, leather: "#1c2230", img: "/images/model-phone.webp", cat: "bag" },
];

// 表示するモデル（写真がそろったものだけ）
export const MODELS: BaseModel[] = ALL_MODELS.filter((m) => !m.soon);

export const LOTS = [30, 50, 100, 300] as const;
export type Lot = (typeof LOTS)[number];

// ロットが増えるほど単価を割り引く
export const LOT_DISCOUNT: Record<Lot, number> = { 30: 0, 50: 0.04, 100: 0.08, 300: 0.14 };

export const PRICE_MIN = 8000;
export const PRICE_MAX = 35000;
export const PRICE_STEP = 500;
export const PRICE_DEFAULT = 18000;
export const NORMAL_DIE_COST = 300000; // 通常のフルオーダー時の型代（目安）
export const PLATE_COST = 10000; // ロゴの版代（初回のみ・1デザインにつき）

export function getModel(id: ModelId): BaseModel {
  return ALL_MODELS.find((m) => m.id === id) ?? MODELS[0];
}

export function calcProfit(id: ModelId, lot: Lot, sellPrice: number) {
  const base = getModel(id).unitPrice;
  const unit = Math.round((base * (1 - LOT_DISCOUNT[lot])) / 10) * 10;
  const total = unit * lot;
  const grossPerItem = sellPrice - unit;
  const margin = sellPrice > 0 ? grossPerItem / sellPrice : 0;
  // 手元に残る利益＝粗利の合計から、初回の版代を引いたもの
  const grossTotal = grossPerItem * lot - PLATE_COST;
  return { unit, total, grossPerItem, margin, grossTotal, discount: LOT_DISCOUNT[lot] };
}

export const yen = (n: number) => `${Math.round(n).toLocaleString("ja-JP")}円`;
