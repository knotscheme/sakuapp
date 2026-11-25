// CRAFT OEM の管理画面（CMS）のデモ用データと仕組み
// ※すべて架空のデータです。操作した内容は、見ている人のブラウザ（localStorage）にだけ保存されます。
import { ALL_MODELS, type ModelId } from "./models";
import { allTiers, getPricing, rateFor } from "./pricing";

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

// 工場との連絡。t は決まった文（日本語・英語・タイ語がそろっている）、raw は自由に書いた文（本番では自動翻訳）
export type Msg = { id: string; at: string; from: "factory" | "japan"; who: string; t?: { ja: string; en: string; th: string }; raw?: string; read?: boolean; po?: Po };
// 工場への発注（チャットに「発注カード」として流す）。ackAt があれば、工場が「受けました」を押した
export type Po = { no: string; items: { color: string; qty: number }[]; lot: number; shipBy: string; ackAt?: string; ackBy?: string };
// 自動で作る下書き。reply：返信と見積、proof：ロゴ配置案、factory：タイの工場への発注、remind：入金のお願い
export type DraftKind = "reply" | "proof" | "factory" | "remind";
export type Draft = { id: string; kind: DraftKind; to: "お客様" | "工場"; subject: string; body: string; at: string; status: "draft" | "sent" | "discarded"; sentBy?: string; sentAt?: string };
export const DRAFT_LABEL: Record<DraftKind, string> = { reply: "返信と見積", proof: "ロゴ配置案の送付", factory: "工場への発注", remind: "入金のお願い" };
// その段階で、どの下書きを送れば次に進むか
export const STAGE_DRAFT: Partial<Record<StageId, DraftKind>> = { inquiry: "reply", order: "proof", proof: "factory" };
export type Log = { at: string; who: string; text: string; kind?: "mail" | "doc" | "factory" | "system" };
export type Deal = {
  id: string;
  brand: string;
  person: string;
  email: string;
  model: ModelId;
  lot: number;
  finish: "金箔" | "銀箔" | "素押し" | "ロゴなし";
  leather?: { name: string; code?: string; add: number; img?: string }; // 革素材（add：お客様の単価への上乗せ・1個）。無ければ標準の革 // ロゴなし：無地のまま（版代はかからない）
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
  // ロゴ配置イメージ：お客様のロゴ（透明PNG）と、写真の上の位置・大きさ（%）
  logo?: string;
  logoAspect?: number; // ロゴの横÷縦
  place?: { x: number; y: number; w: number };
  proofVer?: number; // お客様に送った版（第1版・第2版…）
  proofReq?: string; // お客様からの修正の依頼
  msgs?: Msg[]; // 工場との連絡
  items?: { color: string; qty: number }[]; // カラーごとの数量（合計が lot。合計で数量割引が決まる）
  drafts?: Draft[]; // 自動で作った下書き（人が確認して送る）
  paid?: { at: string; amount: number; via: string }; // 前金の入金（自動で確認）
  lock?: { base: number; unit: number; plate: number; rate: number }; // 見積を送った時点の価格（固定）
  proofOk?: boolean; // お客様がロゴ配置を承認した
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

export function unitPriceOf(model: ModelId, lot: number, add = 0) {
  const base = (ALL_MODELS.find((m) => m.id === model)?.unitPrice ?? 0) + add;
  return Math.round((base * (1 - rateFor(lot))) / 10) * 10;
}
export const hasLogo = (x: Pick<Deal, "finish">) => x.finish !== "ロゴなし";
export function amounts(x: Pick<Deal, "model" | "lot"> & { finish?: Deal["finish"]; leather?: Deal["leather"]; lock?: Deal["lock"] }) {
  // 見積を送ったあとは、そのときの単価・版代で固定（あとで割引率を変えても変わらない）
  const unit = x.lock?.unit ?? unitPriceOf(x.model, x.lot, x.leather?.add);
  const plate = x.finish === "ロゴなし" ? 0 : x.lock?.plate ?? getPricing().plate;
  const sub = unit * x.lot + plate;
  const tax = Math.round(sub * 0.1);
  return { unit, items: unit * x.lot, plate, sub, tax, total: sub + tax, deposit: Math.round((sub + tax) * 0.5) };
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

// カラーごとの数量の例（合計が数量）
const SEED_ITEMS: Record<number, { color: string; qty: number }[]> = {
  0: [{ color: "ダークブラウン", qty: 60 }, { color: "ブラック", qty: 40 }],
  2: [{ color: "ネイビー", qty: 150 }, { color: "ブラック", qty: 100 }, { color: "ダークブラウン", qty: 50 }],
  6: [{ color: "ブラック", qty: 200 }, { color: "ダークブラウン", qty: 100 }],
};

function seedMsgs(i: number): Msg[] | undefined {
  const at = (h: number) => { const t = new Date(); t.setHours(t.getHours() - h, 0, 0, 0); return t.toISOString(); };
  if (i === 5) return [{ id: "m1", at: at(3), from: "factory", who: "Somchai", t: { ja: "革の入荷が遅れています（2日ほど）", en: "Leather delivery is delayed (about 2 days)", th: "หนังมาส่งล่าช้า (ประมาณ 2 วัน)" } }];
  if (i === 6) return [
    { id: "m2", at: at(30), from: "factory", who: "Somchai", t: { ja: "ロゴの位置を確認してください（写真あり）", en: "Please check the logo position (photo attached)", th: "กรุณาตรวจสอบตำแหน่งโลโก้ (มีรูปแนบ)" }, read: true },
    { id: "m3", at: at(28), from: "japan", who: "佐藤", t: { ja: "写真を確認しました。その位置で大丈夫です", en: "We checked the photo. That position is fine", th: "ตรวจสอบรูปแล้ว ตำแหน่งนั้นใช้ได้" }, read: true },
  ];
  return undefined;
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
      proofVer: si >= 3 ? 1 : undefined,
      tracking: si >= 5 ? `TH${880000 + i * 137}JP` : undefined,
      thbCost: Math.round(unitPriceOf(model, lot) / RATE / 1.6),
      message: i === 0 ? "ギフト向けに金箔でロゴを入れたいです。化粧箱も検討しています。" : undefined,
      msgs: seedMsgs(i),
      items: SEED_ITEMS[i],
      logs: seedLogs(stage, brand),
      // 入金・ロゴ承認・自動で作った下書き（例）
      paid: si >= 3 || i === 3 ? { at: d(-14), amount: 0, via: "銀行振込（自動照合）" } : undefined,
      proofOk: si >= 4 || i === 4 ? true : undefined,
    } as Deal;
  }).map((x) => {
    const si = stageIndex(x.stage);
    if (si >= 1) x.lock = priceLock(x);
    if (x.paid) x.paid.amount = amounts(x).deposit;
    if (si >= stageIndex("production")) {
      const at = (h: number) => { const t = new Date(); t.setHours(t.getHours() - h, 0, 0, 0); return t.toISOString(); };
      const po = { ...poOf(x), shipBy: d(10), ackAt: at(24 * 9), ackBy: "Somchai" };
      x.msgs = [
        { id: "po1", at: at(24 * 10), from: "japan", who: x.owner, t: poText(po), po, read: true },
        { id: "po2", at: at(24 * 9), from: "factory", who: "Somchai", t: PO_ACK, read: true },
        ...(x.msgs ?? []),
      ];
    }
    const pending: DraftKind | undefined = x.stage === "inquiry" ? "reply" : x.stage === "order" && x.paid ? "proof" : x.stage === "proof" && x.proofOk ? "factory" : undefined;
    const sent: DraftKind[] = (["reply", "proof", "factory"] as DraftKind[]).filter((k) => stageIndex(k === "reply" ? "quote" : k === "proof" ? "proof" : "production") <= si);
    x.drafts = [
      ...sent.map((k, j) => ({ ...makeDraft(k, x), id: `d-${x.id}-${k}`, status: "sent" as const, sentBy: x.owner, sentAt: d(-18 + j * 4) })),
      ...(pending ? [{ ...makeDraft(pending, x), id: `d-${x.id}-${pending}` }] : []),
    ];
    return x;
  });
}

// カラーごとの内訳（無ければ、1色で全部）
export const colorLines = (d: Pick<Deal, "items" | "color" | "lot">) => (d.items?.length ? d.items : [{ color: d.color, qty: d.lot }]);
export const colorText = (d: Pick<Deal, "items" | "color" | "lot">) => colorLines(d).map((x) => (d.items?.length ? `${x.color} ${x.qty}個` : x.color)).join("・");
// 数量割引：合計の数で段階が決まる（30・50・100・300個以上）
export function tierInfo(total: number) {
  const tiers = allTiers();
  const cur = [...tiers].reverse().find((t) => total >= t.at);
  const next = tiers.find((t) => total < t.at && t.rate > (cur?.rate ?? -1));
  return { cur, next, need: next ? next.at - total : 0 };
}

// 見積の明細：カラーごとの行（通常の単価）と、合計の数で決まる数量割引の行。合計は amounts().items と同じ
export function quoteLines(d: Pick<Deal, "items" | "color" | "lot" | "model"> & { leather?: Deal["leather"]; lock?: Deal["lock"] }) {
  const base = d.lock?.base ?? unitPriceOf(d.model, 0, d.leather?.add);
  const unit = d.lock?.unit ?? unitPriceOf(d.model, d.lot, d.leather?.add);
  const lines = colorLines(d).map((x) => ({ color: x.color, qty: x.qty, unit: base, sum: base * x.qty }));
  const t = tierInfo(d.lot);
  const off = (base - unit) * d.lot;
  return { base, unit, lines, discount: off > 0 ? { rate: d.lock?.rate ?? t.cur?.rate ?? 0, at: t.cur?.at ?? 0, amount: off } : null, tier: t };
}

export const yenOf = (n: number) => `${Math.round(n).toLocaleString("ja-JP")}円`;
export const modelOf = (id: ModelId) => ALL_MODELS.find((m) => m.id === id)!;
export const today = () => new Date().toISOString().slice(0, 10);
export const daysLeft = (due: string) => Math.round((new Date(due).getTime() - new Date(today()).getTime()) / 86400000);

// 工場向けの言葉（製品名・革の色・ロゴ加工・ロゴ位置）。※タイ語・英語はサンプルの翻訳
type L3 = { ja: string; en: string; th: string };
export const MODEL_I18N: Record<ModelId, L3> = {
  long: { ja: "本革ラウンドファスナー長財布", en: "Leather zip-around long wallet", th: "กระเป๋าสตางค์ใบยาวซิปรอบ หนังแท้" },
  bifold: { ja: "キャッシュレス二つ折り財布", en: "Slim bifold wallet", th: "กระเป๋าสตางค์พับสองทบ แบบบาง" },
  trifold: { ja: "コンパクト三つ折りミニ財布", en: "Compact trifold mini wallet", th: "กระเป๋าสตางค์ใบเล็กพับสามทบ" },
  fragment: { ja: "スリムフラグメントケース", en: "Slim fragment case", th: "เคสใส่บัตรแบบบาง" },
  tote: { ja: "本革トートバッグ", en: "Leather tote bag", th: "กระเป๋าโท้ทหนังแท้" },
  phone: { ja: "本革スマホショルダー", en: "Leather phone shoulder bag", th: "กระเป๋าสะพายใส่โทรศัพท์ หนังแท้" },
};
const COLOR_I18N: Record<string, L3> = {
  ブラック: { ja: "ブラック", en: "Black", th: "ดำ" },
  ダークブラウン: { ja: "ダークブラウン", en: "Dark brown", th: "น้ำตาลเข้ม" },
  キャメル: { ja: "キャメル", en: "Camel", th: "น้ำตาลอ่อน (คาเมล)" },
  ネイビー: { ja: "ネイビー", en: "Navy", th: "กรมท่า" },
};
const FINISH_I18N: Record<string, L3> = {
  金箔: { ja: "金箔", en: "Gold foil", th: "ฟอยล์ทอง" },
  銀箔: { ja: "銀箔", en: "Silver foil", th: "ฟอยล์เงิน" },
  素押し: { ja: "素押し", en: "Blind deboss", th: "ปั๊มจม (ไม่ใช้ฟอยล์)" },
  ロゴなし: { ja: "ロゴなし", en: "No logo (plain)", th: "ไม่ใส่โลโก้" },
};
const POS_I18N: Record<string, L3> = {
  表面右下: { ja: "表面右下", en: "front, bottom right", th: "ด้านหน้า มุมขวาล่าง" },
  内装中央: { ja: "内装中央", en: "inside, center", th: "ด้านใน ตรงกลาง" },
  表面左下: { ja: "表面左下", en: "front, bottom left", th: "ด้านหน้า มุมซ้ายล่าง" },
  札入れ内側: { ja: "札入れ内側", en: "inside the bill pocket", th: "ด้านในช่องใส่ธนบัตร" },
  フラップ中央: { ja: "フラップ中央", en: "flap, center", th: "ฝาปิด ตรงกลาง" },
  表面中央: { ja: "表面中央", en: "front, center", th: "ด้านหน้า ตรงกลาง" },
  前面中央: { ja: "前面中央", en: "front, center", th: "ด้านหน้า ตรงกลาง" },
  内ポケット: { ja: "内ポケット", en: "inner pocket", th: "ช่องด้านใน" },
  前面下部: { ja: "前面下部", en: "front, lower part", th: "ด้านหน้า ส่วนล่าง" },
};
export type LangId = "ja" | "en" | "th";
export const trModel = (id: ModelId, l: LangId) => MODEL_I18N[id]?.[l] ?? modelOf(id).name;
export const trColor = (c: string, l: LangId) => COLOR_I18N[c]?.[l] ?? c;
export const trFinish = (f: string, l: LangId) => FINISH_I18N[f]?.[l] ?? f;
export const trPos = (p: string, l: LangId) => p.split(" / ").map((x) => POS_I18N[x]?.[l] ?? x).join(" / ");

// ===== 自動で作る下書き（本番では、AIで文面を整え、送信は Resend・工場へは LINE でも通知） =====
export const shipBy = () => { const t = new Date(); t.setDate(t.getDate() + 21); return t.toISOString().slice(0, 10); };
export function makeDraft(kind: DraftKind, d: Deal): Draft {
  const m = modelOf(d.model);
  const a = amounts(d);
  const q = quoteLines(d);
  const base = { id: `d-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, kind, at: new Date().toISOString(), status: "draft" as const };
  const sign = "\n\n――――――――\nCRAFT OEM（デモ版）\n担当：" + d.owner;
  const link = `専用ページ：https://craft-oem.example/p/${d.id}（ログイン不要・あなたの案件だけが表示されます）`;
  if (kind === "reply") {
    const t = q.tier;
    return { ...base, to: "お客様", subject: `【CRAFT OEM】お見積りのご案内（${d.id}）`, body:
`${d.person} 様

このたびは CRAFT OEM にお問い合わせいただき、ありがとうございます。
いただいた内容で、お見積りをお作りしました。

■ 製品：${m.name}
■ 革素材：${leatherName(d)}
■ カラーと数量：${colorText(d)}（合計${d.lot}個）
■ ロゴ加工：${d.finish}

【お見積り】
・製品代：${q.lines.map((x) => `${x.color} ${x.qty}個`).join("、")}
　単価 ${yenOf(q.unit)}${q.discount ? `（合計${d.lot}個で${Math.round(q.discount.rate * 100)}%の数量割引）` : ""} × ${d.lot}個 ＝ ${yenOf(a.items)}
${hasLogo(d) ? `・ロゴの版代（初回のみ）：${yenOf(a.plate)}\n` : ""}・消費税：${yenOf(a.tax)}
・合計（税込）：${yenOf(a.total)}
${t.next ? `\n※あと${t.need}個（合計${t.next.at}個）で、単価が${Math.round(t.next.rate * 100)}%引きになります。\n` : ""}
${!hasLogo(d) ? "ロゴ：なし（無地のまま）でお作りします。あとからロゴを入れたくなった場合も、ご相談ください。" : `ロゴデータ：${d.logo ? "受け取りました。配置のイメージは、ご注文のあとにお送りします。" : "まだ届いていません。ai・pdf・png などでお送りください。"}`}

見積書のご確認と承諾は、下の専用ページからできます。
${link}${sign}` };
  }
  if (kind === "proof") return { ...base, to: "お客様", subject: `【CRAFT OEM】ロゴ配置のご確認のお願い（${d.id}）`, body:
`${d.person} 様

前金のお支払いを確認しました。ありがとうございます。
ロゴの配置イメージをお作りしましたので、ご確認をお願いします。

■ 製品：${m.name}（${colorText(d)}）
■ ロゴ加工：${d.finish}

実物の写真にロゴを重ねたイメージを、専用ページでご覧いただけます。
問題なければ「この配置で承認する」を、変えたい場合は「修正をお願いする」を押してください。
承認いただくと、製造の手配に進みます。

${link}${sign}` };
  if (kind === "factory") return { ...base, to: "工場", subject: `PO-${d.id.slice(2)}・製造の発注（工場とのチャットに発注カードで送ります）`, body:
`Dear ${FACTORY.replace("（仮）", "")},

Please start production of the following order.
กรุณาเริ่มผลิตตามรายการต่อไปนี้

Model / รุ่น: ${trModel(d.model, "en")} / ${trModel(d.model, "th")}
Colors & qty / สีและจำนวน:
${colorLines(d).map((x) => `  - ${trColor(x.color, "en")} / ${trColor(x.color, "th")}: ${x.qty} pcs`).join("\n")}
Total / รวม: ${d.lot} pcs
Logo / โลโก้: ${trFinish(d.finish, "en")} / ${trFinish(d.finish, "th")} ${hasLogo(d) ? " (approved placement attached)" : ""}
Ship by / ส่งภายใน: ${shipBy()}

The production order (EN/TH) is on your factory screen.
ใบสั่งผลิต (อังกฤษ/ไทย) อยู่ในหน้าจอโรงงานแล้ว

Thank you / ขอบคุณครับ
CRAFT OEM` };
  return { ...base, to: "お客様", subject: `【CRAFT OEM】前金のお支払いのお願い（${d.id}）`, body:
`${d.person} 様

ご注文ありがとうございます。
前金（ご注文金額の50%）のお支払いが、まだ確認できていません。

■ 前金：${yenOf(a.deposit)}（税込）
■ お支払い方法：カード・銀行振込（専用ページから）

お支払いが確認でき次第、ロゴの配置イメージをお送りします。
すでにお支払い済みの場合は、行き違いですのでご容赦ください。

${link}${sign}` };
}

// 見積を送る時点の価格を固定する
export function priceLock(d: Pick<Deal, "model" | "lot"> & { finish?: Deal["finish"]; leather?: Deal["leather"] }) {
  return { base: unitPriceOf(d.model, 0, d.leather?.add), unit: unitPriceOf(d.model, d.lot, d.leather?.add), plate: d.finish === "ロゴなし" ? 0 : getPricing().plate, rate: rateFor(d.lot) };
}

// 革素材の名前（登録が無い古い案件は標準の革）
export const leatherName = (d: Pick<Deal, "leather">) => d.leather?.name ?? "牛革スムース（標準）";

// ===== 工場への発注カード =====
export const poOf = (d: Deal): Po => ({ no: `PO-${d.id.slice(2)}`, items: colorLines(d), lot: d.lot, shipBy: shipBy() });
export const poText = (p: Pick<Po, "no" | "lot">) => ({ ja: `製造の発注 ${p.no}（${p.lot}個）`, en: `Production order ${p.no} (${p.lot} pcs)`, th: `ใบสั่งผลิต ${p.no} (${p.lot} ชิ้น)` });
export const PO_ACK = { ja: "発注を受けました。製造を始めます", en: "Order received. We will start production", th: "ได้รับใบสั่งผลิตแล้ว จะเริ่มผลิต" };
export const PO_ASK = { ja: "発注について確認したいことがあります：", en: "I have a question about the order: ", th: "มีคำถามเกี่ยวกับใบสั่งผลิต: " };
