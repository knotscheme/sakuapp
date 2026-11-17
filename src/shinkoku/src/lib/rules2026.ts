// 令和8年分（2026年1月〜12月）の税のルール。毎年の改正は、この表を書きかえて対応する
// 税額の計算はAIにさせず、ここの表と決まった式だけで行う
// ※デモ版です。2026年11月時点の公表情報をもとにしています（国税庁 No.1199 基礎控除 ほか）

export const YEAR = 2026;
export const YEAR_JA = "令和8年分";

// 基礎控除（所得税）：令和8年分・令和9年分
export function basicDeduction(totalIncome: number) {
  if (totalIncome <= 4_890_000) return 1_040_000;
  if (totalIncome <= 6_550_000) return 670_000;
  if (totalIncome <= 23_500_000) return 620_000;
  if (totalIncome <= 24_000_000) return 480_000;
  if (totalIncome <= 24_500_000) return 320_000;
  if (totalIncome <= 25_000_000) return 160_000;
  return 0;
}

// 所得税の速算表
const BRACKETS: [number, number, number][] = [
  [1_950_000, 0.05, 0],
  [3_300_000, 0.1, 97_500],
  [6_950_000, 0.2, 427_500],
  [9_000_000, 0.23, 636_000],
  [18_000_000, 0.33, 1_536_000],
  [40_000_000, 0.4, 2_796_000],
  [Infinity, 0.45, 4_796_000],
];
export function incomeTaxOn(taxable: number) {
  const t = Math.floor(taxable / 1000) * 1000; // 1,000円未満は切り捨て
  const [, rate, minus] = BRACKETS.find(([max]) => t <= max)!;
  return { taxableRounded: t, rate, base: Math.max(0, Math.floor(t * rate - minus)) };
}
export const RECONSTRUCTION = 0.021; // 復興特別所得税（2037年まで）

// 青色申告特別控除
export const BLUE = { etax: 650_000, paper: 550_000, simple: 100_000 };

// 生命保険料控除（新制度・一般の生命保険料の1区分として計算）
export function lifeInsurance(paid: number) {
  if (paid <= 20_000) return paid;
  if (paid <= 40_000) return Math.floor(paid / 2 + 10_000);
  if (paid <= 80_000) return Math.floor(paid / 4 + 20_000);
  return 40_000;
}

// 医療費控除：支払った額 −（10万円 か 所得の5% の少ない方）。上限200万円
export const medicalDeduction = (paid: number, totalIncome: number) => Math.min(2_000_000, Math.max(0, paid - Math.min(100_000, Math.floor(totalIncome * 0.05))));

// 寄附金控除（ふるさと納税）：寄附 − 2,000円。所得の40%まで
export const donationDeduction = (paid: number, totalIncome: number) => Math.max(0, Math.min(paid, Math.floor(totalIncome * 0.4)) - 2_000);

// 住民税（おおよそ）：所得割10%・均等割5,000円（森林環境税1,000円を含む）。基礎控除は43万円
export const RESIDENT = { rate: 0.1, flat: 5_000, basic: 430_000 };

// 個人事業税：事業主控除290万円、税率5%（デザイン業など多くの業種）。青色申告特別控除は差し引かない
export const BIZTAX = { exempt: 2_900_000, rate: 0.05 };

// 消費税
export const CONSUMPTION = {
  national: 0.078, // 国の消費税（10%のうち7.8%）
  localRatio: 22 / 78, // 地方消費税
  twoWari: 0.2, // 2割特例（個人は令和8年分が最後。令和9・10年分は3割特例）
  simpleRates: { 1: 0.9, 2: 0.8, 3: 0.7, 4: 0.6, 5: 0.5, 6: 0.4 } as Record<number, number>, // 簡易課税のみなし仕入率（第5種：サービス業など）
  transition: [{ until: "2026-09-30", rate: 0.8 }, { until: "2029-09-30", rate: 0.7 }], // 免税事業者からの仕入れの経過措置
};

// 減価償却（定額法）の償却率
export const USEFUL_LIFE: Record<string, { years: number; rate: number }> = {
  pc: { years: 4, rate: 0.25 },
  furniture: { years: 8, rate: 0.125 },
  car: { years: 6, rate: 0.167 },
};
export const SMALL_ASSET_LIMIT = 300_000; // 少額減価償却資産の特例（青色申告・1つ30万円未満・年300万円まで）

// 期限（令和8年分の申告に関わるもの）
export const DEADLINES = [
  { date: "2026-11-30", label: "予定納税（第2期）の支払い", note: "去年の所得税が15万円以上だった人だけ" },
  { date: "2027-01-20", label: "源泉所得税（納期の特例）の支払い", note: "人を雇っている人だけ" },
  { date: "2027-02-16", label: "確定申告の受付が始まる", note: "e-Taxなら1月から出せます" },
  { date: "2027-03-15", label: "確定申告・所得税の支払いの期限", note: "振替納税なら4月に引き落とし" },
  { date: "2027-03-31", label: "消費税の申告・支払いの期限", note: "インボイス登録している人" },
];
