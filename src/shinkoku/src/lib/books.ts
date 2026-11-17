// 帳簿から、決算書と税金を計算する（決まった式だけで計算。AIは使わない）
// デモ版の決め方：税込みで記帳（税込経理）・入金した日を売上の日にする
import { ACCOUNTS, acc } from "./accounts";
import { validT } from "./seed";
import type { Asset, Entry, State } from "./store";
import * as R from "./rules2026";

export const live = (s: State) => s.entries.filter((e) => !e.voided && e.status === "ok");
export const yen = (n: number) => `${Math.round(n).toLocaleString("ja-JP")}円`;
export const man = (n: number) => (Math.abs(n) >= 10_000 ? `${(Math.round(n / 1000) / 10).toLocaleString("ja-JP")}万円` : yen(n));

// 長く使う物の、今年の費用（減価償却）
export function depreciation(a: Asset, blue: boolean) {
  const months = 12 - Number(a.date.slice(5, 7)) + 1;
  const life = R.USEFUL_LIFE[a.kind];
  let full: number, how: string;
  if (a.method === "small" && blue && a.price < R.SMALL_ASSET_LIMIT) { full = a.price; how = "30万円未満の特例で、全額を今年の費用に"; }
  else { full = Math.floor(a.price * life.rate * months / 12); how = `${life.years}年に分けて（今年は${months}か月分）`; }
  return { full, biz: Math.floor(full * a.bizPct / 100), how };
}

export type Calc = ReturnType<typeof compute>;
export function compute(s: State, opt: { project?: boolean } = {}) {
  const L = live(s);
  const months = Math.max(1, ...L.map((e) => Number(e.date.slice(5, 7))));
  const k = opt.project ? 12 / months : 1; // 12月までの見込み（今のペースが続いたら）
  const blue = s.profile.blue !== "white";
  const sum = (f: (e: Entry) => boolean, g: (e: Entry) => number = (e) => e.amount) => L.filter(f).reduce((a, e) => a + g(e), 0);

  const sales = sum((e) => e.credit === "sales") * k;
  const miscIncome = sum((e) => e.credit === "misc_income") * k;
  const byAcc: Record<string, number> = {};
  let personalFromBiz = 0;
  for (const e of L) {
    const a = acc(e.debit);
    if (a.kind !== "expense") continue;
    const biz = Math.floor(e.amount * e.bizPct / 100);
    const key = e.debit === "software" ? "comm" : e.debit; // ソフトの利用料は「通信費」にまとめる
    byAcc[key] = (byAcc[key] ?? 0) + biz * k;
    personalFromBiz += (e.amount - biz) * k;
  }
  const deps = s.assets.map((a) => ({ a, ...depreciation(a, blue) }));
  const dep = deps.reduce((x, d) => x + d.biz, 0);
  if (dep) byAcc.depreciation = dep;
  const expenses = Object.values(byAcc).reduce((a, b) => a + b, 0);
  const inv = s.inventory.start - s.inventory.end; // 棚卸の増減
  const beforeBlue = Math.floor(sales + miscIncome - expenses - inv);
  const blueMax = s.profile.blue === "etax" ? R.BLUE.etax : s.profile.blue === "paper" ? R.BLUE.paper : 0;
  const blueDed = Math.max(0, Math.min(blueMax, beforeBlue));
  const income = Math.max(0, beforeBlue - blueDed); // 事業所得（＝合計所得）

  // 生活費の中で、申告に使うもの
  // 毎月はらうもの（年金・保険など）は12月まで見込み、1回きりのもの（医療費・ふるさと納税）は今の金額のまま
  const tag = (t: string, monthly = true) => sum((e) => e.personal === t) * (monthly ? k : 1);
  const social = Math.round(tag("pension") + tag("health")) + s.answers.extraSocial;
  const ideco = Math.round(tag("ideco"));
  const lifePaid = Math.round(tag("life")) + s.answers.lifePaid;
  const medicalPaid = Math.max(0, tag("medical", false) + s.answers.medicalPaid - s.answers.medicalRefund);
  const furusato = tag("furusato", false);

  const ded = [
    { id: "basic", label: "基礎控除（だれでも）", amount: R.basicDeduction(income) },
    { id: "social", label: "社会保険料控除（国民年金・国民健康保険）", amount: social },
    { id: "ideco", label: "小規模企業共済等掛金控除（iDeCo）", amount: ideco },
    { id: "life", label: "生命保険料控除", amount: R.lifeInsurance(lifePaid) },
    { id: "earthquake", label: "地震保険料控除", amount: Math.min(50_000, s.answers.earthquake) },
    { id: "medical", label: "医療費控除", amount: R.medicalDeduction(medicalPaid, income) },
    { id: "furusato", label: "寄附金控除（ふるさと納税）", amount: R.donationDeduction(furusato, income) },
  ];
  const dedTotal = ded.reduce((a, d) => a + d.amount, 0);
  const it = R.incomeTaxOn(Math.max(0, income - dedTotal));
  const recon = Math.floor(it.base * R.RECONSTRUCTION);
  const incomeTax = Math.floor((it.base + recon) / 100) * 100;

  // 住民税（おおよそ）：基礎控除43万円。ふるさと納税の住民税の分は、差し引く前の目安
  const resTaxable = Math.max(0, income - (dedTotal - R.basicDeduction(income) - ded.find((d) => d.id === "furusato")!.amount) - R.RESIDENT.basic);
  const resident = Math.floor(resTaxable / 1000) * 1000 * R.RESIDENT.rate + R.RESIDENT.flat;
  // 個人事業税（おおよそ）：青色申告特別控除は差し引かない
  const bizTax = Math.floor(Math.max(0, beforeBlue - R.BIZTAX.exempt) * s.profile.bizTaxRate / 100) * 100;

  return { months, k, sales, miscIncome, byAcc, expenses, dep, deps, inv, beforeBlue, blueDed, income, personalFromBiz, ded, dedTotal, it, recon, incomeTax, resident, bizTax, furusato, medicalPaid, lifePaid, social, ideco };
}

// 消費税：2割特例・簡易課税・本則の3つを比べる
export function consumption(s: State, opt: { project?: boolean } = {}) {
  const L = live(s);
  const months = Math.max(1, ...L.map((e) => Number(e.date.slice(5, 7))));
  const k = opt.project ? 12 / months : 1;
  const salesIncl = L.filter((e) => (e.credit === "sales" || e.credit === "misc_income") && e.taxRate === 10).reduce((a, e) => a + e.amount, 0) * k;
  const base = Math.floor(salesIncl * 100 / 110 / 1000) * 1000;
  const out = Math.floor(base * R.CONSUMPTION.national);
  // 本則：仕入れの消費税（インボイスがある分は全額、無い分は経過措置の割合）
  let inTax = 0, noInvoice = 0;
  for (const e of L) {
    const a = acc(e.debit);
    const isAsset = e.debit === "equipment";
    if (!(a.kind === "expense" && a.tax === "taxable" && e.taxRate === 10) && !isAsset) continue;
    const biz = Math.floor(e.amount * e.bizPct / 100) * k;
    const t = biz * 7.8 / 110;
    if (validT(e.invoice)) inTax += t;
    else { noInvoice += biz; inTax += t * (e.date <= R.CONSUMPTION.transition[0].until ? 0.8 : 0.7); }
  }
  const r100 = (n: number) => Math.floor(Math.max(0, n) / 100) * 100;
  const make = (nat: number) => { const n = r100(nat); return { national: n, local: r100(n * R.CONSUMPTION.localRatio), total: n + r100(n * R.CONSUMPTION.localRatio) }; };
  return {
    salesIncl, base, out, noInvoice,
    twoWari: make(out * R.CONSUMPTION.twoWari),
    simple: make(out - out * (R.CONSUMPTION.simpleRates[s.profile.simpleType] ?? 0.5)),
    general: make(out - inTax),
  };
}

// 勘定科目ごとの残高（帳簿の画面・貸借対照表で使う）
export function balances(s: State) {
  const b: Record<string, number> = {};
  for (const e of live(s)) {
    b[e.debit] = (b[e.debit] ?? 0) + e.amount;
    b[e.credit] = (b[e.credit] ?? 0) - e.amount;
  }
  return ACCOUNTS.map((a) => ({ a, v: (a.kind === "asset" || a.kind === "expense" ? 1 : -1) * (b[a.id] ?? 0) })).filter((x) => x.v);
}
