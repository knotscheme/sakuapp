// デモの最初のデータ：フリーのWebデザイナー「佐藤さん」の、2026年1月〜10月の帳簿（架空）
import type { Entry, Rule, State } from "./store";

// 登録番号（T＋13桁）のチェック数字を計算する（法人番号と同じ決まり）
export function checkDigit(base12: string) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const q = Number(base12[11 - i]);
    sum += q * (i % 2 === 0 ? 1 : 2);
  }
  return 9 - (sum % 9);
}
export const makeT = (base12: string) => `T${checkDigit(base12)}${base12}`;
export function validT(t: string) {
  const m = t.replace(/[\s-]/g, "").toUpperCase().match(/^T(\d)(\d{12})$/);
  return !!m && Number(m[1]) === checkDigit(m[2]);
}

const T = {
  ab: makeT("401234567890"), docomo: makeT("101000000001"), adobe: makeT("501234500012"), jr: makeT("901000000002"),
  denki: makeT("301000000003"), net: makeT("701000000004"), cafe: makeT("201000000005"), book: makeT("601000000006"),
  amazon: makeT("801000000007"), raksul: makeT("111000000008"), bdesign: makeT("231234567801"),
};
export const PARTNER_T = T;

let n = 0;
const id = () => `s${(++n).toString(36)}`;
function e(date: string, debit: string, credit: string, amount: number, partner: string, memo = "", o: Partial<Entry> = {}): Entry {
  return { id: id(), date, debit, credit, amount, partner, memo, taxRate: 10, invoice: "", bizPct: 100, personal: "", source: "bank", status: "ok", history: [{ at: "2026/" + date.slice(5).replace("-", "/") + " 10:00", what: "登録しました" }], ...o };
}

export function buildSeed(): State {
  n = 0;
  const L: Entry[] = [];
  L.push(e("2026-01-01", "bank", "capital", 1_200_000, "", "年のはじめの口座残高", { source: "start", taxRate: 0 }));
  const bSales = [165_000, 220_000, 110_000, 165_000, 220_000, 165_000, 110_000, 275_000, 165_000, 220_000];
  for (let m = 1; m <= 10; m++) {
    const mm = String(m).padStart(2, "0");
    L.push(e(`2026-${mm}-05`, "bank", "sales", 330_000, "AB商事 株式会社", `${m}月分 Webサイト運用`, { invoice: T.ab }));
    L.push(e(`2026-${mm}-15`, "bank", "sales", bSales[m - 1], "Bデザイン 合同会社", "デザイン制作", { invoice: T.bdesign }));
    L.push(e(`2026-${mm}-06`, "rent", "bank", 120_000, "家賃（自宅兼仕事場）", "自宅の一部を仕事場に", { taxRate: 0, bizPct: 30 }));
    L.push(e(`2026-${mm}-12`, "utility", "bank", 8_000 + (m % 4) * 600, "電力会社", "電気代", { bizPct: 30, invoice: T.denki }));
    L.push(e(`2026-${mm}-27`, "comm", "bank", 5_500, "光回線", "ネット回線", { bizPct: 50, invoice: T.net }));
    L.push(e(`2026-${mm}-20`, "fee", "bank", 145, "銀行", "振込手数料"));
    L.push(e(`2026-${mm}-06`, "comm", "card", 8_800, "ドコモ", "スマホ代", { bizPct: 50, invoice: T.docomo, source: "card" }));
    L.push(e(`2026-${mm}-08`, "software", "card", 7_780, "Adobe", "Creative Cloud", { invoice: T.adobe, source: "card" }));
    L.push(e(`2026-${mm}-02`, "travel", "card", 3_000, "JR東日本", "モバイルSuicaのチャージ", { invoice: T.jr, source: "card", bizPct: 80 }));
    L.push(e(`2026-${mm}-10`, "ownerOut", "bank", 17_510, "日本年金機構", "国民年金", { taxRate: 0, personal: "pension" }));
    L.push(e(`2026-${mm}-25`, "ownerOut", "bank", 20_000, "iDeCo", "個人型確定拠出年金", { taxRate: 0, personal: "ideco" }));
    L.push(e(`2026-${mm}-27`, "ownerOut", "bank", 5_000, "生命保険会社", "生命保険料", { taxRate: 0, personal: "life" }));
    L.push(e(`2026-${mm}-16`, "ownerOut", "bank", 100_000, "ATM", "生活費の引き出し", { taxRate: 0, personal: "living" }));
    L.push(e(`2026-${mm}-28`, "card", "bank", 0, "カード会社", "カードの引き落とし", { taxRate: 0 })); // 金額は下で合わせる
    if (m >= 6) L.push(e(`2026-${mm}-30`, "ownerOut", "bank", 28_000, "市役所", "国民健康保険", { taxRate: 0, personal: "health" }));
    if (m % 2 === 1) L.push(e(`2026-${mm}-14`, "meeting", "card", 1_240, "カフェ", "打ち合わせ", { invoice: T.cafe, source: "card" }));
    if (m % 3 === 0) L.push(e(`2026-${mm}-18`, "books", "card", 2_970, "書店", "デザインの本", { invoice: T.book, source: "card" }));
  }
  L.push(e("2026-03-20", "misc_income", "bank", 0, "", "", { voided: true })); // ダミー（使わない）
  L.push(e("2026-04-10", "equipment", "card", 264_000, "Apple", "MacBook Air（仕事用）", { invoice: makeT("901234567800"), source: "card" }));
  L.push(e("2026-05-22", "outsource", "bank", 110_000, "山田 太郎（個人）", "イラスト制作の外注", {}));
  L.push(e("2026-07-03", "ads", "card", 3_300, "ラクスル", "名刺の印刷", { invoice: T.raksul, source: "card" }));
  L.push(e("2026-08-19", "ownerOut", "bank", 45_000, "○○クリニック", "通院（年の合計）", { taxRate: 0, personal: "medical" }));
  L.push(e("2026-10-12", "ownerOut", "card", 60_000, "ふるさとチョイス", "ふるさと納税（3つの自治体）", { taxRate: 0, personal: "furusato", source: "card" }));
  // カードの引き落とし額＝その月のカード利用の合計
  for (const x of L) {
    if (x.debit === "card" && x.credit === "bank") {
      const ym = x.date.slice(0, 7);
      x.amount = L.filter((y) => y.credit === "card" && y.date.slice(0, 7) === ym && !y.voided).reduce((a, y) => a + y.amount, 0);
    }
  }
  const entries = L.filter((x) => !x.voided && x.amount > 0);
  const rules: Rule[] = [
    { key: "ﾔﾁﾝ", account: "rent", bizPct: 30, personal: "", taxRate: 0, partner: "家賃（自宅兼仕事場）" },
    { key: "ﾃﾞﾝｷ", account: "utility", bizPct: 30, personal: "", taxRate: 10, partner: "電力会社", invoice: T.denki },
    { key: "ｺｸﾐﾝﾈﾝｷﾝ", account: "ownerOut", bizPct: 0, personal: "pension", taxRate: 0, partner: "日本年金機構" },
    { key: "ADOBE", account: "software", bizPct: 100, personal: "", taxRate: 10, partner: "Adobe", invoice: T.adobe },
    { key: "ドコモ", account: "comm", bizPct: 50, personal: "", taxRate: 10, partner: "ドコモ", invoice: T.docomo },
  ];
  return {
    v: 1,
    profile: { name: "佐藤", shop: "さとうデザイン室", job: "Webデザイン", blue: "etax", invoiceNo: makeT("561234567890"), ctax: "twoWari", simpleType: 5, bizTaxRate: 0.05 },
    entries,
    rules,
    assets: [{ id: "a1", name: "MacBook Air（仕事用）", date: "2026-04-10", price: 264_000, kind: "pc", method: "small", bizPct: 90 }],
    inventory: { start: 0, end: 0 },
    answers: { spouse: false, dependents: 0, lifePaid: 0, medicalPaid: 0, medicalRefund: 0, earthquake: 0, extraSocial: 0 },
    done: [],
  };
}

// 取り込みの見本（11月分の明細）。銀行とカードのCSV
export const SAMPLE_BANK_CSV = `日付,摘要,お支払金額,お預り金額
2026/11/04,ﾌﾘｺﾐ ｴｲﾋﾞｰｼﾖｳｼﾞ(ｶ,,330000
2026/11/05,ﾔﾁﾝ ﾌﾘｺﾐ,120000,
2026/11/10,ｺｸﾐﾝﾈﾝｷﾝ,17510,
2026/11/12,ﾃﾞﾝｷﾘﾖｳ,9240,
2026/11/15,ﾌﾘｺﾐ ﾋﾞ-ﾃﾞｻﾞｲﾝ(ﾄﾞ,,165000
2026/11/16,ATM ｼﾊﾗｲ,50000,
2026/11/20,ﾃｽｳﾘﾖｳ,145,
2026/11/25,ｲﾃﾞｺ ｶｹｷﾝ,20000,`;

export const SAMPLE_CARD_CSV = `利用日,利用店名,利用金額
2026/11/02,ＪＲ東日本 モバイルＳｕｉｃａ,3000
2026/11/06,ドコモ ご利用料金,8800
2026/11/08,ADOBE *CREATIVE CLOUD,7780
2026/11/11,スターバックス 渋谷店,1240
2026/11/14,紀伊國屋書店,2970
2026/11/18,AMAZON.CO.JP,4380
2026/11/21,ユニクロ,5990
2026/11/27,ラクスル 印刷,3300`;
