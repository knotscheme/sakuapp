"use client";

import { Ph } from "@/components/cms/Ph";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList, MessageSquare } from "lucide-react";
import { MsgThread, unreadOf } from "@/components/cms/Messages";
import { Camera, Check, FileText, Truck } from "lucide-react";
import { useCatalog } from "@/components/cms/catalog";
import { kindInfo, kindOf, daysLeft, FACTORY, PROD_STEPS, colorLines, trLeather, stageIndex, trColor, trFinish, trModel } from "@/lib/cms";
import { ProofView } from "@/components/cms/Proof";
import { addLog, advance, updateDeal, useDeals } from "@/components/cms/store";
import { Card, NoAccess, Shell, TechNote } from "@/components/cms/ui";
import { useAuth } from "@/components/cms/perm";
import { askConfirm } from "@/components/cms/Confirm";
import { LANGS, setViewLang, useLang } from "@/components/cms/i18n";

// 工場の画面：担当の注文だけ。お客様の名前・連絡先・販売価格は見せない。英語・タイ語に切り替えられる
const T = {
  en: { newPo: "New production order. Please check it and tap “Received”", q: (s: string) => `Mark "${s}" as done?`, qb: "Tap the step again if you need to undo it.", undo: (s: string) => `Undo "${s}"?`, qShip: "Ship this order to Japan?", qShipB: "The order moves to “In transit” and Japan is notified.", ok: "Yes", cancel: "Cancel", title: "Production orders", ship: "Ship by", qty: "Qty", done: "Mark as done", shipBtn: "Ship to Japan", photo: "Upload photo", order: "Production order", empty: "No orders in production.", shipped: "Shipped", intro: "Your production orders. Customer names, contacts and prices are not shown.", note: "Factory accounts only see their own orders (row-level security). LINE notifications on updates are also possible", photoNote: "Photos are stored in Supabase Storage", undoAria: "Undo", msg: "Message to Japan", msgPh: "Write a message (any language)", send: "Send", sent: "Sent to the Japan team", msgNote: "Free text is auto-translated into Japanese (e.g. Google Translation API)", quick: "Quick messages" },
  th: { newPo: "มีใบสั่งผลิตใหม่ กรุณาตรวจสอบแล้วกด “รับทราบแล้ว”", q: (s: string) => `ยืนยันว่า "${s}" เสร็จแล้ว?`, qb: "หากกดผิด แตะขั้นตอนนั้นอีกครั้งเพื่อยกเลิก", undo: (s: string) => `ยกเลิก "${s}"?`, qShip: "ส่งคำสั่งนี้ไปญี่ปุ่น?", qShipB: "สถานะจะเปลี่ยนเป็น “กำลังขนส่ง” และแจ้งไปที่ญี่ปุ่น", ok: "ยืนยัน", cancel: "ยกเลิก", title: "รายการสั่งผลิต", ship: "ส่งภายใน", qty: "จำนวน", done: "เสร็จแล้ว", shipBtn: "ส่งไปญี่ปุ่น", photo: "อัปโหลดรูป", order: "ใบสั่งผลิต", empty: "ไม่มีงานที่กำลังผลิต", shipped: "ส่งแล้ว", intro: "รายการสั่งผลิตของคุณ ไม่แสดงชื่อลูกค้า ข้อมูลติดต่อ และราคาขาย", note: "บัญชีโรงงานจะเห็นเฉพาะงานของตัวเอง (ควบคุมสิทธิ์ระดับแถว) และแจ้งเตือนทาง LINE เมื่อมีการอัปเดตได้", photoNote: "รูปภาพจัดเก็บใน Supabase Storage", undoAria: "ยกเลิก", msg: "ส่งข้อความถึงญี่ปุ่น", msgPh: "พิมพ์ข้อความ (ภาษาไทยได้)", send: "ส่ง", sent: "ส่งถึงทีมญี่ปุ่นแล้ว", msgNote: "ข้อความที่พิมพ์เองจะแปลเป็นภาษาญี่ปุ่นอัตโนมัติ (เช่น Google Translation API)", quick: "ข้อความด่วน" },
  ja: { newPo: "新しい発注が届いています。確認して「受けました」を押してください", q: (s: string) => `「${s}」を完了にしますか？`, qb: "間違えたときは、その工程をもう一度押すと取り消せます。", undo: (s: string) => `「${s}」の完了を取り消しますか？`, qShip: "この注文を日本へ出荷しますか？", qShipB: "段階が「輸送中」に進み、日本側に通知されます。", ok: "はい", cancel: "キャンセル", title: "製造中の注文", ship: "出荷期限", qty: "数量", done: "完了にする", shipBtn: "日本へ出荷", photo: "写真を登録", order: "製造指示書", empty: "製造中の注文はありません。", shipped: "出荷済み", intro: "工場の人が見る画面です。お客様の名前・連絡先・販売価格は表示されません。", note: "工場用アカウントは行レベルの権限（RLS）で、担当の注文だけ見える。更新時に LINE 通知も可能", photoNote: "写真は Supabase Storage に保存", undoAria: "取り消す", msg: "日本への連絡", msgPh: "メッセージを入力（タイ語でも可）", send: "送る", sent: "日本側に送りました", msgNote: "自由に書いた文は、日本語に自動翻訳して届ける（Google 翻訳 API など）", quick: "よく使う連絡" },
};

// 並び替え：優先（急ぎ→納期が近い順、出荷済みは最後）・納期・カテゴリ（製品の分類ごと）・進み具合（遅れている工程から）
type SortId = "priority" | "due" | "cat" | "step";
const S = {
  ja: { sort: "並び順", priority: "優先", due: "納期", cat: "カテゴリ", step: "進み具合", urgent: "急ぎ", left: (n: number) => (n < 0 ? `${-n}日遅れ` : n === 0 ? "今日まで" : `あと${n}日`), other: "その他" },
  th: { sort: "เรียงตาม", priority: "ลำดับความสำคัญ", due: "กำหนดส่ง", cat: "หมวดหมู่", step: "ความคืบหน้า", urgent: "ด่วน", left: (n: number) => (n < 0 ? `เลยกำหนด ${-n} วัน` : n === 0 ? "ภายในวันนี้" : `อีก ${n} วัน`), other: "อื่นๆ" },
  en: { sort: "Sort", priority: "Priority", due: "Due date", cat: "Category", step: "Progress", urgent: "Urgent", left: (n: number) => (n < 0 ? `${-n} days late` : n === 0 ? "Due today" : `${n} days left`), other: "Other" },
};
// カテゴリ名（工場の人向けに、初期のカテゴリだけ英語・タイ語を用意）
const CAT_I18N: Record<string, { en: string; th: string }> = { "財布・小物": { en: "Wallets & small goods", th: "กระเป๋าสตางค์และของชิ้นเล็ก" }, "バッグ": { en: "Bags", th: "กระเป๋า" } };
const SORT_KEY = "craft-factory-sort";

export default function FactoryPage() {
  const deals = useDeals();
  const { lang, home } = useLang();
  const t = T[lang];
  const { can, me } = useAuth();
  const [open, setOpen] = useState<string | null>(null);
  const s2 = S[lang];
  const { products, cats } = useCatalog();
  const [sort, setSort] = useState<SortId>("priority");
  // 選んだ並び順は、この端末で覚えておく
  useEffect(() => { try { const v = localStorage.getItem(SORT_KEY) as SortId | null; if (v && v in S.ja) setSort(v); } catch {} }, []); // eslint-disable-line react-hooks/set-state-in-effect
  const choose = (v: SortId) => { setSort(v); try { localStorage.setItem(SORT_KEY, v); } catch {} };
  const catOf = (d: (typeof deals)[number]) => { const c = cats.find((x) => x.id === products.find((p) => p.id === d.model)?.cat)?.name; return c ?? ""; };
  // カテゴリは商品管理の並び順で（分類なしは最後）
  const catRank = (d: (typeof deals)[number]) => { const i = cats.findIndex((c) => c.name === catOf(d)); return i < 0 ? cats.length : i; };
  const catLabel = (name: string) => (!name ? s2.other : lang === "ja" ? name : CAT_I18N[name]?.[lang] ?? name);
  const shippedOf = (d: (typeof deals)[number]) => stageIndex(d.stage) >= 5;
  const byDue = (a: (typeof deals)[number], b: (typeof deals)[number]) => a.due.localeCompare(b.due);
  const list = deals.filter((d) => d.stage === "production" || d.stage === "transit").sort((a, b) =>
    sort === "due" ? byDue(a, b)
    : sort === "step" ? Number(shippedOf(a)) - Number(shippedOf(b)) || a.prodStep - b.prodStep || byDue(a, b)
    : sort === "cat" ? catRank(a) - catRank(b) || byDue(a, b)
    : Number(shippedOf(a)) - Number(shippedOf(b)) || Number(!!b.urgent) - Number(!!a.urgent) || byDue(a, b));
  const stepName = (i: number) => (lang === "ja" ? PROD_STEPS[i].ja : lang === "th" ? PROD_STEPS[i].th : PROD_STEPS[i].en);
  const finishStep = async (id: string, i: number) => {
    if (await askConfirm({ title: t.q(stepName(i)), body: t.qb, ok: t.ok, cancel: t.cancel })) updateDeal(id, (x) => addLog({ ...x, prodStep: i + 1 }, "工場", `「${PROD_STEPS[i].ja}」が完了しました（写真あり）`, "factory"));
  };
  const undoStep = async (id: string, i: number) => {
    if (await askConfirm({ title: t.undo(stepName(i)), ok: t.ok, cancel: t.cancel, danger: true })) updateDeal(id, (x) => addLog({ ...x, prodStep: i }, "工場", `「${PROD_STEPS[i].ja}」の完了を取り消しました`, "factory"));
  };
  const ship = async (id: string) => {
    if (await askConfirm({ title: t.qShip, body: t.qShipB, ok: t.ok, cancel: t.cancel })) advance(id, "工場");
  };

  if (!can("factory.use")) return <Shell title={t.title}><NoAccess /></Shell>;
  const langs = (
    <div className="flex overflow-hidden rounded-lg border border-line bg-white text-[12px]">
      {LANGS.map((l) => (
        <button key={l.id} type="button" onClick={() => setViewLang(me?.id ?? "", l.id === home ? null : l.id)} className={`px-3.5 py-2 ${lang === l.id ? "bg-ink text-white" : "text-mute"}`}>{l.label}</button>
      ))}
    </div>
  );

  return (
    <Shell title={`${t.title}｜${lang === "ja" ? FACTORY : FACTORY.replace("（仮）", "")}`} actions={langs} note={t.note}>
      <p className="mb-4 text-[13px] text-mute">{t.intro}</p>
      {/* 並び順：途中で折り返さないように、1列の横スクロールにする */}
      <div className="-mx-4 mb-5 flex items-center gap-1.5 overflow-x-auto px-4 pb-1 text-[11.5px] whitespace-nowrap [scrollbar-width:none] sm:mx-0 sm:px-0" role="radiogroup" aria-label={s2.sort}>
        <span className="mr-0.5 shrink-0 text-mute">{s2.sort}</span>
        {(["priority", "due", "cat", "step"] as SortId[]).map((k) => (
          <button key={k} type="button" role="radio" aria-checked={sort === k} onClick={() => choose(k)} className={`shrink-0 rounded-full border px-3 py-1.5 ${sort === k ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/80 hover:border-ink"}`}>{s2[k]}</button>
        ))}
      </div>
      {!list.length && <p className="text-[13px] text-mute">{t.empty}</p>}
      <div className="grid gap-5 lg:grid-cols-2">
        {list.map((d, k) => {
          const shipped = stageIndex(d.stage) >= 5;
          const left = daysLeft(d.due);
          const head = sort === "cat" && (k === 0 || catOf(list[k - 1]) !== catOf(d));
          return (
            <div key={d.id} className="contents">
            {head && <h2 className="mt-2 text-[13px] font-semibold lg:col-span-2">{catLabel(catOf(d))}</h2>}
            <Card>
              <div className="flex gap-4 p-5">
                <div className="w-32 shrink-0 self-start"><ProofView d={d} label={false} /></div>
                <div className="min-w-0 flex-1 text-[13px]">
                  <p className="flex items-center gap-1.5 text-[11.5px] text-mute">PO-{d.id.slice(2)}<span className={`rounded px-1.5 py-px text-[10.5px] font-medium ${kindOf(d) === "odm" ? "bg-[#2a4f9e] text-white" : "border border-line text-ink/70"}`}>{kindInfo(d)[lang === "ja" ? "short" : lang]}</span>{d.urgent && !shipped && <span className="rounded bg-[#9b2c2c] px-1.5 py-px text-[10.5px] font-medium text-white">{s2.urgent}</span>}</p>
                  <p className="font-medium"><Ph>{trModel(d.model, lang)}</Ph></p>
                  <p className="mt-1 text-ink/80">{t.qty}: {d.lot}・{trFinish(d.finish, lang)}</p>
                  <p className="text-ink/80"><Ph>{trLeather(d, lang)}</Ph></p>
                  <p className="text-ink/80"><Ph>{colorLines(d).map((x) => `${trColor(x.color, lang)} ${x.qty}`).join(" / ")}</Ph></p>
                  <p className="text-ink/80">{t.ship}: {d.due}{!shipped && <span className={`ml-1.5 inline-block whitespace-nowrap text-[11.5px] ${left < 0 ? "font-medium text-red-600" : left <= 3 ? "text-[#8a650c]" : "text-mute"}`}>（{s2.left(left)}）</span>}</p>
                  <Link href={`/cms/doc/?id=${d.id}&type=work`} className="tap mt-1.5 inline-flex items-center gap-1 text-[12px] underline underline-offset-4"><FileText size={13} />{t.order}</Link>
                </div>
              </div>
              <ol className="grid grid-cols-4 gap-px border-t border-line bg-line">
                {PROD_STEPS.map((p, i) => {
                  const done = shipped || d.prodStep > i;
                  const cur = !shipped && d.prodStep === i;
                  return (
                    <li key={p.en} className="bg-white p-3 text-center text-[11.5px]">
                      {/* 完了済みの最後の工程は、押すと取り消せる（出荷前のみ） */}
                      {done && !shipped && d.prodStep === i + 1 ? (
                        <button type="button" onClick={() => undoStep(d.id, i)} aria-label={t.undoAria} className="mx-auto mb-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-ink bg-ink text-white relative after:absolute after:-inset-3 after:content-['']"><Check size={12} /></button>
                      ) : (
                        <span className={`mx-auto mb-1.5 flex h-6 w-6 items-center justify-center rounded-full border ${done ? "border-ink bg-ink text-white" : cur ? "border-ink" : "border-line text-mute"}`}>{done ? <Check size={12} /> : i + 1}</span>
                      )}
                      <span className={done || cur ? "" : "text-mute"}><Ph>{lang === "ja" ? p.ja : lang === "th" ? p.th : p.en}</Ph></span>
                      {cur && (
                        <button type="button" onClick={() => finishStep(d.id, i)}
                          className="cms-btn mt-2 block w-full bg-ink py-2.5 text-[11px] text-white">{t.done}</button>
                      )}
                    </li>
                  );
                })}
              </ol>
              <div className="flex items-center justify-between border-t border-line px-5 py-3">
                <span><button type="button" onClick={() => updateDeal(d.id, (x) => addLog(x, "工場", "写真を登録しました", "factory"))} className="tap flex items-center gap-1.5 text-[12px] text-mute hover:text-ink"><Camera size={14} />{t.photo}</button><TechNote className="mt-1">{t.photoNote}</TechNote></span>
                {shipped ? (
                  <span className="flex items-center gap-1.5 text-[12px] text-mute"><Truck size={14} />{t.shipped}・{d.tracking}</span>
                ) : (
                  <button type="button" disabled={d.prodStep < 4} onClick={() => ship(d.id)} className="flex shrink-0 items-center gap-1.5 cms-btn border border-ink px-3 py-2 text-[12px] whitespace-nowrap disabled:border-line disabled:text-mute"><Truck size={14} />{t.shipBtn}</button>
                )}
              </div>
              <div className="border-t border-line px-5 py-3">
                {d.msgs?.some((m) => m.po && !m.po.ackAt) && open !== d.id && (
                  <button type="button" onClick={() => setOpen(d.id)} className="mb-2.5 flex w-full items-center gap-2 rounded-lg bg-[#fde8e8] px-3.5 py-2.5 text-left text-[12.5px] font-medium text-[#9b2c2c]"><ClipboardList size={15} className="shrink-0" />{t.newPo}<span className="ml-auto">›</span></button>
                )}
                <button type="button" onClick={() => setOpen(open === d.id ? null : d.id)} aria-expanded={open === d.id} className="tap flex items-center gap-1.5 text-[12px] text-mute hover:text-ink">
                  <MessageSquare size={14} />{t.msg}{(d.msgs?.length ?? 0) > 0 && <span className="text-mute">（{d.msgs!.length}）</span>}
                  {unreadOf(d, "japan") > 0 && <span className="ml-1 rounded-full bg-red-600 px-1.5 py-px text-[10.5px] text-white">{unreadOf(d, "japan")}</span>}
                </button>
                {open === d.id && <div className="mt-3"><MsgThread d={d} side="factory" lang={lang} who={me?.name ?? "工場"} /></div>}
              </div>
            </Card>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
