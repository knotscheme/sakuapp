// 銀行・カードの明細（CSV）を読みこみ、仕訳の「提案」を作る
// 決め方の順番：①前に自分で決めたルール ②よくある店の決まり ③わからなければ「その他」で確認待ち
import type { PersonalTag } from "./accounts";
import { PARTNER_T } from "./seed";
import type { Entry, Rule } from "./store";
import { uid } from "./store";

type Guess = { account: string; bizPct: number; personal: PersonalTag; taxRate: 10 | 8 | 0; partner: string; invoice?: string; why: string };

// 半角カナ・全角英数をそろえて、照らし合わせやすくする
export const norm = (s: string) => s.normalize("NFKC").toUpperCase().replace(/\s+/g, " ").trim();

// パターンも NFKC でそろえる（銀行の明細は半角カナが多いため）
const R = (re: RegExp) => new RegExp(re.source.normalize("NFKC"), re.flags);
const BUILTIN: { re: RegExp; g: Omit<Guess, "why"> }[] = ([
  { re: /SUICA|JR|ﾒﾄﾛ|メトロ|タクシー|TAXI|PASMO/, g: { account: "travel", bizPct: 80, personal: "", taxRate: 10, partner: "交通機関", invoice: PARTNER_T.jr } },
  { re: /ドコモ|DOCOMO|AU |SOFTBANK|ソフトバンク|楽天モバイル/, g: { account: "comm", bizPct: 50, personal: "", taxRate: 10, partner: "ドコモ", invoice: PARTNER_T.docomo } },
  { re: /ADOBE|CANVA|GOOGLE|MICROSOFT|NOTION|FIGMA/, g: { account: "software", bizPct: 100, personal: "", taxRate: 10, partner: "Adobe", invoice: PARTNER_T.adobe } },
  { re: /スターバックス|ドトール|タリーズ|CAFE|カフェ/, g: { account: "meeting", bizPct: 100, personal: "", taxRate: 10, partner: "カフェ", invoice: PARTNER_T.cafe } },
  { re: /書店|ブックス|BOOK|紀伊國屋|ジュンク/, g: { account: "books", bizPct: 100, personal: "", taxRate: 10, partner: "書店", invoice: PARTNER_T.book } },
  { re: /AMAZON|アマゾン|ヨドバシ|ビックカメラ/, g: { account: "supplies", bizPct: 100, personal: "", taxRate: 10, partner: "Amazon", invoice: PARTNER_T.amazon } },
  { re: /文具|文房具|インク|用紙|ホームセンター|ダイソー|100円/, g: { account: "supplies", bizPct: 100, personal: "", taxRate: 10, partner: "" } },
  { re: /ラクスル|印刷|プリントパック/, g: { account: "ads", bizPct: 100, personal: "", taxRate: 10, partner: "ラクスル", invoice: PARTNER_T.raksul } },
  { re: /ﾃｽｳﾘﾖｳ|ﾃｽｳﾘｮｳ|手数料/, g: { account: "fee", bizPct: 100, personal: "", taxRate: 10, partner: "銀行" } },
  { re: /ﾃﾞﾝｷ|電気|ｶﾞｽ|ガス|ｽｲﾄﾞｳ|水道/, g: { account: "utility", bizPct: 30, personal: "", taxRate: 10, partner: "電力会社", invoice: PARTNER_T.denki } },
  { re: /ﾔﾁﾝ|家賃/, g: { account: "rent", bizPct: 30, personal: "", taxRate: 0, partner: "家賃（自宅兼仕事場）" } },
  { re: /ﾈﾝｷﾝ|年金/, g: { account: "ownerOut", bizPct: 0, personal: "pension", taxRate: 0, partner: "日本年金機構" } },
  { re: /ｲﾃﾞｺ|IDECO|イデコ/, g: { account: "ownerOut", bizPct: 0, personal: "ideco", taxRate: 0, partner: "iDeCo" } },
  { re: /ATM/, g: { account: "ownerOut", bizPct: 0, personal: "living", taxRate: 0, partner: "ATM" } },
  { re: /ユニクロ|GU|しまむら|スーパー|コンビニ|セブン|ローソン|ファミリーマート/, g: { account: "ownerOut", bizPct: 0, personal: "living", taxRate: 10, partner: "お店" } },
] as { re: RegExp; g: Omit<Guess, "why"> }[]).map((x) => ({ ...x, re: R(x.re) }));

export function guess(text: string, income: boolean, rules: Rule[]): Guess {
  const t = norm(text);
  const learned = rules.find((r) => t.includes(norm(r.key)));
  if (learned) return { account: learned.account, bizPct: learned.bizPct, personal: learned.personal, taxRate: learned.taxRate, partner: learned.partner ?? "", invoice: learned.invoice, why: `前に「${learned.key}」をこの内容にしたので、同じにしました` };
  if (income) {
    if (R(/ﾌﾘｺﾐ|振込/).test(t)) {
      const ab = R(/ｴｲﾋﾞ|AB/).test(t), bd = R(/ﾋﾞ-ﾃﾞｻﾞｲﾝ|ﾋﾞｰﾃﾞｻﾞｲﾝ|Bデザイン/).test(t);
      return { account: "sales", bizPct: 100, personal: "", taxRate: 10, partner: ab ? "AB商事 株式会社" : bd ? "Bデザイン 合同会社" : "", invoice: ab ? PARTNER_T.ab : bd ? PARTNER_T.bdesign : undefined, why: "振込の入金なので、売上だと考えました" };
    }
    return { account: "misc_income", bizPct: 100, personal: "", taxRate: 10, partner: "", why: "入金ですが、何のお金かわかりませんでした" };
  }
  const b = BUILTIN.find((x) => x.re.test(t));
  if (b) return { ...b.g, why: "よくあるお店の名前から考えました" };
  return { account: "misc", bizPct: 100, personal: "", taxRate: 10, partner: "", why: "わかりませんでした。内容を教えてください" };
}

// CSV を行ごとに分ける（" " で囲まれた , にも対応）
function rows(text: string) {
  const out: string[][] = [];
  for (const line of text.replace(/^﻿/, "").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells: string[] = []; let cur = "", q = false;
    for (const ch of line) {
      if (ch === '"') q = !q; else if (ch === "," && !q) { cells.push(cur); cur = ""; } else cur += ch;
    }
    cells.push(cur);
    out.push(cells.map((c) => c.trim()));
  }
  return out;
}
const toDate = (s: string) => { const m = s.normalize("NFKC").match(/(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})/); return m ? `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}` : ""; };
const toNum = (s: string) => Number((s || "").normalize("NFKC").replace(/[,円¥\s]/g, "")) || 0;

export type Kind = "bank" | "card";
// 1行目（見出し）から、どの列が何かを見つける
export function parseStatement(text: string, kind: Kind, rules: Rule[], existing: Entry[]) {
  const r = rows(text);
  if (r.length < 2) throw new Error("明細が見つかりませんでした。CSVファイルか、中身をそのまま貼り付けてください");
  const h = r[0].map((x) => x.normalize("NFKC"));
  const col = (re: RegExp) => h.findIndex((x) => re.test(x));
  const cDate = col(/日付|利用日|取引日|年月日/), cDesc = col(/摘要|内容|利用店|店名|お取引内容|ご利用先/);
  const cOut = col(/支払|出金|引出|利用金額|金額/), cIn = col(/預り|入金|預入/);
  if (cDate < 0 || cDesc < 0 || cOut < 0) throw new Error("「日付」「内容」「金額」の列が見つかりませんでした。1行目に見出しがあるCSVを使ってください");
  const seen = new Set(existing.map((e) => e.raw).filter(Boolean));
  const out: Entry[] = []; let dup = 0;
  for (const line of r.slice(1)) {
    const date = toDate(line[cDate] ?? ""); if (!date) continue;
    const desc = line[cDesc] ?? "";
    const outAmt = toNum(line[cOut]), inAmt = cIn >= 0 ? toNum(line[cIn]) : 0;
    const amount = outAmt || inAmt; if (!amount) continue;
    const raw = `${kind}|${date}|${desc}|${outAmt}|${inAmt}`;
    if (seen.has(raw)) { dup++; continue; } // 同じ明細を2回入れない
    seen.add(raw);
    const income = kind === "bank" && inAmt > 0 && !outAmt;
    const g = guess(desc, income, rules);
    const money = kind === "bank" ? "bank" : "card";
    out.push({
      id: uid(), date, amount, partner: g.partner || desc.normalize("NFKC"), memo: desc.normalize("NFKC"),
      debit: income ? "bank" : g.account, credit: income ? g.account : money,
      taxRate: g.taxRate, invoice: g.invoice ?? "", bizPct: g.bizPct, personal: g.personal,
      source: kind, status: "check", raw, history: [{ at: new Date().toLocaleString("ja-JP"), what: `明細から取り込み：${g.why}` }],
    });
  }
  return { entries: out, dup };
}
