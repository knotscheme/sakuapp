"use client";

import { Ph } from "@/components/cms/Ph";

import Link from "next/link";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { MsgThread, unreadOf } from "@/components/cms/Messages";
import { Camera, Check, FileText, Truck } from "lucide-react";
import { FACTORY, PROD_STEPS, colorLines, stageIndex, trColor, trFinish, trModel } from "@/lib/cms";
import { ProofView } from "@/components/cms/Proof";
import { addLog, advance, updateDeal, useDeals } from "@/components/cms/store";
import { Card, NoAccess, Shell, TechNote } from "@/components/cms/ui";
import { useAuth } from "@/components/cms/perm";
import { askConfirm } from "@/components/cms/Confirm";
import { LANGS, setViewLang, useLang } from "@/components/cms/i18n";

// 工場の画面：担当の注文だけ。お客様の名前・連絡先・販売価格は見せない。英語・タイ語に切り替えられる
const T = {
  en: { q: (s: string) => `Mark "${s}" as done?`, qb: "Tap the step again if you need to undo it.", undo: (s: string) => `Undo "${s}"?`, qShip: "Ship this order to Japan?", qShipB: "The order moves to “In transit” and Japan is notified.", ok: "Yes", cancel: "Cancel", title: "Production orders", ship: "Ship by", qty: "Qty", done: "Mark as done", shipBtn: "Ship to Japan", photo: "Upload photo", order: "Production order", empty: "No orders in production.", shipped: "Shipped", intro: "Your production orders. Customer names, contacts and prices are not shown.", note: "Factory accounts only see their own orders (row-level security). LINE notifications on updates are also possible", photoNote: "Photos are stored in Supabase Storage", undoAria: "Undo", msg: "Message to Japan", msgPh: "Write a message (any language)", send: "Send", sent: "Sent to the Japan team", msgNote: "Free text is auto-translated into Japanese (e.g. Google Translation API)", quick: "Quick messages" },
  th: { q: (s: string) => `ยืนยันว่า "${s}" เสร็จแล้ว?`, qb: "หากกดผิด แตะขั้นตอนนั้นอีกครั้งเพื่อยกเลิก", undo: (s: string) => `ยกเลิก "${s}"?`, qShip: "ส่งคำสั่งนี้ไปญี่ปุ่น?", qShipB: "สถานะจะเปลี่ยนเป็น “กำลังขนส่ง” และแจ้งไปที่ญี่ปุ่น", ok: "ยืนยัน", cancel: "ยกเลิก", title: "รายการสั่งผลิต", ship: "ส่งภายใน", qty: "จำนวน", done: "เสร็จแล้ว", shipBtn: "ส่งไปญี่ปุ่น", photo: "อัปโหลดรูป", order: "ใบสั่งผลิต", empty: "ไม่มีงานที่กำลังผลิต", shipped: "ส่งแล้ว", intro: "รายการสั่งผลิตของคุณ ไม่แสดงชื่อลูกค้า ข้อมูลติดต่อ และราคาขาย", note: "บัญชีโรงงานจะเห็นเฉพาะงานของตัวเอง (ควบคุมสิทธิ์ระดับแถว) และแจ้งเตือนทาง LINE เมื่อมีการอัปเดตได้", photoNote: "รูปภาพจัดเก็บใน Supabase Storage", undoAria: "ยกเลิก", msg: "ส่งข้อความถึงญี่ปุ่น", msgPh: "พิมพ์ข้อความ (ภาษาไทยได้)", send: "ส่ง", sent: "ส่งถึงทีมญี่ปุ่นแล้ว", msgNote: "ข้อความที่พิมพ์เองจะแปลเป็นภาษาญี่ปุ่นอัตโนมัติ (เช่น Google Translation API)", quick: "ข้อความด่วน" },
  ja: { q: (s: string) => `「${s}」を完了にしますか？`, qb: "間違えたときは、その工程をもう一度押すと取り消せます。", undo: (s: string) => `「${s}」の完了を取り消しますか？`, qShip: "この注文を日本へ出荷しますか？", qShipB: "段階が「輸送中」に進み、日本側に通知されます。", ok: "はい", cancel: "キャンセル", title: "製造中の注文", ship: "出荷期限", qty: "数量", done: "完了にする", shipBtn: "日本へ出荷", photo: "写真を登録", order: "製造指示書", empty: "製造中の注文はありません。", shipped: "出荷済み", intro: "工場の人が見る画面です。お客様の名前・連絡先・販売価格は表示されません。", note: "工場用アカウントは行レベルの権限（RLS）で、担当の注文だけ見える。更新時に LINE 通知も可能", photoNote: "写真は Supabase Storage に保存", undoAria: "取り消す", msg: "日本への連絡", msgPh: "メッセージを入力（タイ語でも可）", send: "送る", sent: "日本側に送りました", msgNote: "自由に書いた文は、日本語に自動翻訳して届ける（Google 翻訳 API など）", quick: "よく使う連絡" },
};

export default function FactoryPage() {
  const deals = useDeals();
  const { lang, home } = useLang();
  const t = T[lang];
  const { can, me } = useAuth();
  const [open, setOpen] = useState<string | null>(null);
  const list = deals.filter((d) => d.stage === "production" || d.stage === "transit");
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
      <p className="mb-6 text-[13px] text-mute">{t.intro}</p>
      {!list.length && <p className="text-[13px] text-mute">{t.empty}</p>}
      <div className="grid gap-5 lg:grid-cols-2">
        {list.map((d) => {
          const shipped = stageIndex(d.stage) >= 5;
          return (
            <Card key={d.id}>
              <div className="flex gap-4 p-5">
                <div className="w-32 shrink-0 self-start"><ProofView d={d} label={false} /></div>
                <div className="min-w-0 flex-1 text-[13px]">
                  <p className="text-[11.5px] text-mute">PO-{d.id.slice(2)}</p>
                  <p className="font-medium"><Ph>{trModel(d.model, lang)}</Ph></p>
                  <p className="mt-1 text-ink/80">{t.qty}: {d.lot}・{trFinish(d.finish, lang)}</p>
                  <p className="text-ink/80"><Ph>{colorLines(d).map((x) => `${trColor(x.color, lang)} ${x.qty}`).join(" / ")}</Ph></p>
                  <p className="text-ink/80">{t.ship}: {d.due}</p>
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
                <button type="button" onClick={() => setOpen(open === d.id ? null : d.id)} aria-expanded={open === d.id} className="tap flex items-center gap-1.5 text-[12px] text-mute hover:text-ink">
                  <MessageSquare size={14} />{t.msg}{(d.msgs?.length ?? 0) > 0 && <span className="text-mute">（{d.msgs!.length}）</span>}
                  {unreadOf(d, "japan") > 0 && <span className="ml-1 rounded-full bg-red-600 px-1.5 py-px text-[10.5px] text-white">{unreadOf(d, "japan")}</span>}
                </button>
                {open === d.id && <div className="mt-3"><MsgThread d={d} side="factory" lang={lang} who={me?.name ?? "工場"} /></div>}
              </div>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}
