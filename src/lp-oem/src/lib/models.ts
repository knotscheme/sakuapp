// ベースモデルと価格の計算ロジック（制作サンプル用の架空の数値）

export type ModelId = "long" | "bifold" | "trifold" | "fragment";

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
};

export const MODELS: BaseModel[] = [
  { id: "long", name: "本革ラウンドファスナー長財布", short: "ラウンド長財布", feature: "カード12枚・小銭入れ・札入れ2層。ギフト需要が最も高い定番型。", size: "W19.5 × H10 × D2.5 cm", logo: "表面右下 / 内装中央", unitPrice: 3500, leather: "#2b1d16", img: "/images/model-long.webp" },
  { id: "bifold", name: "キャッシュレス二つ折り財布", short: "二つ折り財布", feature: "カード6枚と札入れに絞った薄型設計。メンズ・ユニセックスに人気。", size: "W11 × H9.5 × D1.5 cm", logo: "表面左下 / 札入れ内側", unitPrice: 2800, leather: "#1c2230", img: "/images/model-bifold.webp" },
  { id: "trifold", name: "コンパクト三つ折りミニ財布", short: "三つ折りミニ財布", feature: "手のひらサイズに必要十分を収納。小さいバッグ派の女性に支持。", size: "W10 × H7.5 × D2.8 cm", logo: "フラップ中央", unitPrice: 2400, leather: "#8a5a36", img: "/images/model-trifold.webp" },
  { id: "fragment", name: "スリムフラグメントケース", short: "フラグメントケース", feature: "カード・紙幣・鍵まで入る極薄ケース。名入れノベルティにも最適。", size: "W10.5 × H7.5 × D0.8 cm", logo: "表面中央", unitPrice: 1800, leather: "#3d3f2e", img: "/images/model-fragment.webp" },
];

export const LOTS = [30, 50, 100, 300] as const;
export type Lot = (typeof LOTS)[number];

// ロットが増えるほど単価を割り引く
export const LOT_DISCOUNT: Record<Lot, number> = { 30: 0, 50: 0.04, 100: 0.08, 300: 0.14 };

export const PRICE_MIN = 8000;
export const PRICE_MAX = 35000;
export const PRICE_STEP = 500;
export const PRICE_DEFAULT = 18000;
export const NORMAL_DIE_COST = 300000; // 通常のフルオーダー時の型代（目安）

export function getModel(id: ModelId): BaseModel {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

export function calcProfit(id: ModelId, lot: Lot, sellPrice: number) {
  const base = getModel(id).unitPrice;
  const unit = Math.round((base * (1 - LOT_DISCOUNT[lot])) / 10) * 10;
  const total = unit * lot;
  const grossPerItem = sellPrice - unit;
  const margin = sellPrice > 0 ? grossPerItem / sellPrice : 0;
  const grossTotal = grossPerItem * lot;
  return { unit, total, grossPerItem, margin, grossTotal, discount: LOT_DISCOUNT[lot] };
}

export const yen = (n: number) => `${Math.round(n).toLocaleString("ja-JP")}円`;
