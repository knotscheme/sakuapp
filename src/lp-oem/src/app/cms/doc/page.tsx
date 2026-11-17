"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { CHECKS, DOCS, FACTORY, PROD_STEPS, amounts, modelOf, today, colorLines, quoteLines, trColor, trFinish, trModel, trPos, yenOf, type DocId, type LangId } from "@/lib/cms";
import { asset } from "@/lib/asset";
import { useDeals } from "@/components/cms/store";
import { NoAccess, Shell, useQuery } from "@/components/cms/ui";
import { useAuth } from "@/components/cms/perm";
import { useLang } from "@/components/cms/i18n";
import { ProofView, logoSize } from "@/components/cms/Proof";

const BACK_F = { ja: "工場の画面に戻る", en: "Back to factory", th: "กลับไปหน้าจอโรงงาน" };
const LOADING = { ja: "読み込み中…", en: "Loading…", th: "กำลังโหลด…" };
const DOC_NO = { ja: "書類", en: "Document", th: "เอกสาร" };
const PRINT = { ja: "印刷・PDFで保存", en: "Print / Save as PDF", th: "พิมพ์ / บันทึกเป็น PDF" };

// 製造指示書の値：日本語のあとに英語・タイ語を小さく添える
const tri = (f: (l: LangId) => string) => (<>{f("ja")}<span className="block text-[11px] text-mute">{f("en")} / {f("th")}</span></>);

// 自動で作られる書類のプレビュー（A4・印刷やPDF保存ができる）
export default function DocPage() {
  const id = useQuery("id");
  const type = useQuery("type") as DocId | null;
  const d = useDeals().find((x) => x.id === id);
  const { can } = useAuth();
  const { lang } = useLang();
  if (!d || !type) return <p className="p-8 text-[13px] text-mute">{LOADING[lang]}</p>;
  // 製造指示書は工場の人も見られる。それ以外の書類（金額・お客様の情報あり）は案件を見る権限が必要
  // ※本番では、書類の取得そのものをサーバー側の権限（RLS）でも止める
  if (!(type === "work" ? can("factory.use") || can("deals.view") : can("deals.view"))) return <Shell title={DOC_NO[lang]}><NoAccess /></Shell>;

  const m = modelOf(d.model);
  const a = amounts(d);
  const doc = DOCS.find((k) => k.id === type)!;
  const no = `${type.toUpperCase()}-${d.id.slice(2)}`;
  const isWork = type === "work";
  const isInspect = type === "inspect";

  // カラーごとの行＋数量割引（合計の数で決まる）＋版代
  const q = quoteLines(d);
  const rows: { name: string; qty?: number; unit?: number; sum: number; off?: boolean }[] = [
    ...q.lines.map((x) => ({ name: `${m.name}（${x.color}・ロゴ${d.finish}）`, qty: x.qty, unit: x.unit, sum: x.sum })),
    ...(q.discount ? [{ name: `数量割引（合計${d.lot}個・${Math.round(q.discount.rate * 100)}%引き）`, sum: -q.discount.amount, off: true }] : []),
    { name: "ロゴの版代（初回のみ）", qty: 1, unit: a.plate, sum: a.plate },
  ];

  return (
    <div className="min-h-[100svh] bg-[#e9e9e7] py-6 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[794px] items-center justify-between px-4 print:hidden">
        {isWork && !can("deals.view") ? (
          <Link href="/cms/factory/" className="tap flex items-center gap-1.5 text-[13px] text-mute hover:text-ink"><ArrowLeft size={14} /> {BACK_F[lang]}</Link>
        ) : (
          <Link href={`/cms/deal/?id=${d.id}`} className="tap flex items-center gap-1.5 text-[13px] text-mute hover:text-ink"><ArrowLeft size={14} /> 案件に戻る</Link>
        )}
        <button type="button" onClick={() => print()} className="flex items-center gap-2 bg-ink px-4 py-2 text-[12.5px] text-white"><Printer size={14} /> {PRINT[lang]}</button>
      </div>

      <article className="mx-auto max-w-[794px] bg-white px-8 py-10 text-[12.5px] leading-relaxed text-ink shadow-sm sm:px-14 sm:py-14 print:shadow-none">
        <header className="flex items-start justify-between border-b border-ink pb-5">
          <div>
            <h1 className="text-[22px] font-medium tracking-[0.2em]">{isWork ? "製造指示書" : doc.ja.replace(/（.*）/, "")}</h1>
            {isWork && <p className="mt-1 text-[12px] text-mute">Production Order / ใบสั่งผลิต</p>}
          </div>
          <div className="text-right text-[11.5px] text-mute">
            <p>No. {no}</p>
            <p>{isWork ? "発行日 / Date / วันที่" : "発行日"}　{today()}</p>
          </div>
        </header>

        <section className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:gap-6">
          <div>
            {isWork ? (
              <>
                <p className="text-[15px]">{FACTORY}　御中</p>
                <p className="mt-1 text-[11.5px] text-mute">To: {FACTORY}</p>
              </>
            ) : (
              <>
                <p className="text-[15px]">{d.brand}　御中</p>
                <p className="mt-1 text-[11.5px] text-mute">{d.person} 様</p>
              </>
            )}
          </div>
          <div className="text-[11.5px] sm:text-right">
            <p className="font-display text-[15px] tracking-[0.3em]">CRAFT OEM</p>
            <p className="text-mute">（デモ版）</p>
          </div>
        </section>

        {isWork ? (
          <>
            {/* 製造指示書：英語・タイ語を併記。お客様の連絡先と販売価格は載せない */}
            <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_170px]">
              <table className="w-full border border-line">
                <tbody className="divide-y divide-line">
                  {[
                    ["製品 / Model / รุ่น", tri((l) => trModel(d.model, l))],
                    ["数量 / Qty / จำนวน", `${d.lot} pcs`],
                    ["革の色と数量 / Color & qty / สีและจำนวน", <>{colorLines(d).map((x) => <span key={x.color} className="block">{trColor(x.color, "ja")} {x.qty}<span className="text-[11px] text-mute">　{trColor(x.color, "en")} / {trColor(x.color, "th")}</span></span>)}</>],
                    ["ロゴ加工 / Logo / โลโก้", tri((l) => trFinish(d.finish, l))],
                    ["ロゴ位置 / Position / ตำแหน่ง", tri((l) => trPos(m.logo, l))],
                    ["ロゴの大きさ / Logo size / ขนาดโลโก้", `${logoSize(d).w.toFixed(1)} × ${logoSize(d).h.toFixed(1)} cm（W×H）`],
                    ["サイズ / Size / ขนาด", m.size],
                    ["工場出荷期限 / Ship by / ส่งภายใน", d.due],
                  ].map(([k, v]) => (
                    <tr key={String(k)}><th className="w-[46%] bg-paper px-3 py-2 text-left align-top font-normal text-mute">{k}</th><td className="px-3 py-2">{v}</td></tr>
                  ))}
                </tbody>
              </table>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(m.img)} alt="" className="aspect-[4/3] w-full border border-line object-cover" />
            </section>
            <section className="mt-6 break-inside-avoid">
              <p className="font-medium">ロゴ配置（お客様が承認済み・第{d.proofVer ?? 1}版） / Approved logo placement / ตำแหน่งโลโก้ที่อนุมัติแล้ว</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-[1.6fr_1fr]">
                <ProofView d={d} label={false} className="border border-line" />
                <ProofView d={d} label={false} zoom className="border border-line" />
              </div>
              <p className="mt-1 text-[11px] text-mute">ロゴの大きさ 幅{logoSize(d).w.toFixed(1)}×高さ{logoSize(d).h.toFixed(1)}cm / Logo size {logoSize(d).w.toFixed(1)} × {logoSize(d).h.toFixed(1)} cm / ขนาดโลโก้ {logoSize(d).w.toFixed(1)} × {logoSize(d).h.toFixed(1)} ซม.</p>
            </section>
            <section className="mt-6">
              <p className="font-medium">工程 / Process / ขั้นตอน</p>
              <ol className="mt-2 grid grid-cols-2 border border-line sm:grid-cols-4">
                {PROD_STEPS.map((p, i) => <li key={p.ja} className="border-r border-b border-line px-3 py-2 even:border-r-0 sm:border-b-0 sm:even:border-r sm:last:border-r-0">{i + 1}. {p.ja}<br /><span className="text-[11px] text-mute">{p.en} / {p.th}</span></li>)}
              </ol>
            </section>
            <section className="mt-6 border border-line p-4">
              <p className="font-medium">注意事項 / Notes / หมายเหตุ</p>
              <ul className="mt-1 list-disc pl-5 text-ink/80">
                <li>ロゴは配置確認済みのデータ通りに押してください。 / Stamp the logo exactly as the approved proof. / ปั๊มโลโก้ให้ตรงตามแบบที่ได้รับอนุมัติ</li>
                <li>各工程の写真を、工場の画面から登録してください。 / Upload photos for each step. / อัปโหลดรูปของแต่ละขั้นตอนจากหน้าจอโรงงาน</li>
                <li>不良品は別にして、数を報告してください。 / Separate defects and report the quantity. / แยกสินค้าที่มีตำหนิ และรายงานจำนวน</li>
              </ul>
            </section>
          </>
        ) : isInspect ? (
          <section className="mt-8">
            <p>{m.name}　{d.lot}個（{d.color}・ロゴ{d.finish}）の国内検品の結果をご報告します。</p>
            <table className="mt-4 w-full border border-line">
              <tbody className="divide-y divide-line">
                {CHECKS.map((c, i) => <tr key={c}><td className="px-3 py-2">{c}</td><td className="w-24 px-3 py-2 text-right">{d.checks[i] ? "合格" : "—"}</td></tr>)}
                <tr className="bg-paper"><td className="px-3 py-2 font-medium">良品 / 不良</td><td className="px-3 py-2 text-right font-medium">{d.lot - d.defects} / {d.defects}</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-ink/80">不良品は工場へ返品し、良品のみを出荷いたします。</p>
          </section>
        ) : (
          <>
            <section className="mt-8 flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
              <p>{type === "quote" ? "下記のとおりお見積り申し上げます。" : type === "po" ? "下記のとおりご注文を承りました。" : type === "deposit" ? "製造開始にあたり、前金（50%）をご請求いたします。" : "下記のとおり納品・ご請求いたします。"}</p>
              <p className="sm:text-right"><span className="text-mute">{type === "deposit" ? "ご請求金額" : "合計金額（税込）"}</span><br /><span className="text-[22px] font-medium">{yenOf(type === "deposit" ? a.deposit : a.total)}</span></p>
            </section>
            {/* スマホ：品目を縦に並べる */}
            <ul className="mt-5 divide-y divide-line border-y border-ink sm:hidden">
              {rows.map((r) => (
                <li key={r.name} className="py-3">
                  <p>{r.name}</p>
                  <p className="mt-1 flex justify-between text-ink/80"><span className="whitespace-nowrap">{r.off ? "" : `${yenOf(r.unit!)} × ${r.qty}`}</span><span className="font-medium whitespace-nowrap text-ink">{r.sum < 0 ? `−${yenOf(-r.sum)}` : yenOf(r.sum)}</span></p>
                </li>
              ))}
            </ul>
            <table className="mt-5 hidden w-full sm:table">
              <thead className="border-y border-ink text-left text-[11.5px]"><tr><th className="py-2 font-normal">品名</th><th className="py-2 pl-3 text-right font-normal whitespace-nowrap">数量</th><th className="py-2 pl-3 text-right font-normal whitespace-nowrap">単価</th><th className="py-2 pl-3 text-right font-normal whitespace-nowrap">金額</th></tr></thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => <tr key={r.name}><td className="py-2.5">{r.name}</td><td className="py-2.5 pl-3 text-right whitespace-nowrap">{r.qty ?? ""}</td><td className="py-2.5 pl-3 text-right whitespace-nowrap">{r.unit !== undefined ? yenOf(r.unit) : ""}</td><td className="py-2.5 pl-3 text-right whitespace-nowrap">{r.sum < 0 ? `−${yenOf(-r.sum)}` : yenOf(r.sum)}</td></tr>)}
              </tbody>
            </table>
            <div className="mt-4 ml-auto w-full text-[12.5px] sm:w-64">
              <div className="flex justify-between py-1"><span className="text-mute">小計</span><span>{yenOf(a.sub)}</span></div>
              <div className="flex justify-between py-1"><span className="text-mute">消費税（10%）</span><span>{yenOf(a.tax)}</span></div>
              <div className="flex justify-between border-t border-ink py-1.5 font-medium"><span>合計</span><span>{yenOf(a.total)}</span></div>
              {type === "deposit" && <div className="flex justify-between py-1 font-medium"><span>今回のご請求（50%）</span><span>{yenOf(a.deposit)}</span></div>}
            </div>
            <section className="mt-8 border border-line p-4 text-ink/80">
              <p className="font-medium text-ink">備考</p>
              <ul className="mt-1 list-disc pl-5">
                <li>型代・設計費は0円です。ロゴの版代は初回のみかかります。</li>
                <li>納期：ロゴ配置のご確認後、最短30日</li>
                {type === "quote" && <li>有効期限：発行日から30日</li>}
                {(type === "deposit" || type === "delivery") && <li>お振込先：〇〇銀行 〇〇支店 普通 0000000（デモ）</li>}
              </ul>
            </section>
          </>
        )}

        <p className="mt-10 text-center text-[10.5px] text-mute">※デモ版です。{isWork && <span className="block">※Demo version. / เวอร์ชันเดโม</span>}</p>
      </article>
    </div>
  );
}
