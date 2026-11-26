"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ClipboardList, FileText, HelpCircle, Send } from "lucide-react";
import { PO_ASK, hasLogo, trLeather, trTan, modelOf, trColor, trFinish, trModel, trPos, type Deal, type Msg, type Po } from "@/lib/cms";
import { asset } from "@/lib/asset";
import { ackPo, markRead, sendMsg } from "./store";
import { ProofView, logoSize } from "./Proof";
export { unreadOf } from "./store";
import { TechNote } from "./ui";

type Lang = "ja" | "en" | "th";
type L3 = { ja: string; en: string; th: string };

// 工場から日本へ：よく使う連絡
export const FACTORY_QUICK: L3[] = [
  { ja: "予定どおり進んでいます", en: "On schedule", th: "เป็นไปตามกำหนด" },
  { ja: "革の入荷が遅れています（2日ほど）", en: "Leather delivery is delayed (about 2 days)", th: "หนังมาส่งล่าช้า (ประมาณ 2 วัน)" },
  { ja: "確認したいことがあります。連絡をください", en: "I have a question. Please contact me", th: "มีเรื่องต้องการสอบถาม กรุณาติดต่อกลับ" },
  { ja: "ロゴの位置を確認してください（写真あり）", en: "Please check the logo position (photo attached)", th: "กรุณาตรวจสอบตำแหน่งโลโก้ (มีรูปแนบ)" },
];
// 日本から工場へ：よく使う返信（工場の人にはタイ語で届く）
export const JAPAN_QUICK: L3[] = [
  { ja: "確認しました。ありがとうございます", en: "Noted. Thank you", th: "รับทราบแล้ว ขอบคุณครับ" },
  { ja: "その遅れで大丈夫です", en: "That delay is OK", th: "ล่าช้าเท่านั้นไม่เป็นไร" },
  { ja: "写真を確認しました。その位置で大丈夫です", en: "We checked the photo. That position is fine", th: "ตรวจสอบรูปแล้ว ตำแหน่งนั้นใช้ได้" },
  { ja: "後ほど詳しく連絡します", en: "We will contact you with details later", th: "จะติดต่อกลับพร้อมรายละเอียดภายหลัง" },
];

const T = {
  ja: { quick: "よく使う文", ph: "メッセージを入力", send: "送る", empty: "まだ連絡はありません。", orig: "原文（本番では自動翻訳）", note: "連絡は messages テーブルに保存し、相手に LINE・メールで通知。自由に書いた文は Google 翻訳 API などで相手の言葉に自動翻訳", newMark: "新着", read: "既読" },
  en: { quick: "Quick messages", ph: "Write a message", send: "Send", empty: "No messages yet.", orig: "Original (auto-translated in production)", note: "Messages are stored and notified via LINE / email. Free text is auto-translated (e.g. Google Translation API)", newMark: "New", read: "Read" },
  th: { quick: "ข้อความด่วน", ph: "พิมพ์ข้อความ", send: "ส่ง", empty: "ยังไม่มีข้อความ", orig: "ข้อความต้นฉบับ (ระบบจริงจะแปลอัตโนมัติ)", note: "ข้อความจะถูกบันทึกและแจ้งเตือนทาง LINE / อีเมล ข้อความที่พิมพ์เองจะแปลอัตโนมัติ (เช่น Google Translation API)", newMark: "ใหม่", read: "อ่านแล้ว" },
};

const time = (iso: string) => { const d = new Date(iso); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };

// 会話の画面。side は自分の側（日本 or 工場）
export function MsgThread({ d, side, lang, who, listClass = "max-h-[30rem]", compact = false }: { d: Deal; side: Msg["from"]; lang: Lang; who: string; listClass?: string; compact?: boolean }) {
  const t = T[lang];
  const other: Msg["from"] = side === "japan" ? "factory" : "japan";
  const [text, setText] = useState("");
  // よく使う文は、押すと入力欄に入るだけ（すぐには送らない）。文を変えずに送れば、3か国語そろった文として届く
  const [pick, setPick] = useState<L3 | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // 開いたときに未読だったものに「新着」を付けてから、既読にする
  const [fresh] = useState(() => new Set((d.msgs ?? []).filter((m) => m.from === other && !m.read).map((m) => m.id)));
  useEffect(() => { markRead(d.id, other); }, [d.id, other, d.msgs?.length]);
  const quick = side === "japan" ? JAPAN_QUICK : FACTORY_QUICK;
  // 新しい連絡が下に来るので、いちばん下まで送る（LINEと同じ）
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => { const el = listRef.current; if (el) el.scrollTop = el.scrollHeight; }, [d.msgs?.length, d.id]);
  const msgs = d.msgs ?? [];

  return (
    <div>
      <ul ref={listRef} className={`${listClass} space-y-2.5 overflow-y-auto pr-1`}>
        {!msgs.length && <li className="text-[12.5px] text-mute">{t.empty}</li>}
        {msgs.map((m) => {
          const mine = m.from === side;
          if (m.po) return (
            <li key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <PoCard d={d} m={m} po={m.po} side={side} lang={lang} who={who} onAsk={() => { setText(PO_ASK[lang]); setPick(null); inputRef.current?.focus(); }} />
              <span className="mt-1 px-1 text-[10.5px] text-mute">{m.who}・{time(m.at)}{!mine && fresh.has(m.id) && <b className="ml-1.5 rounded bg-[#fbe4e4] px-1.5 py-px font-medium text-red-700">{t.newMark}</b>}</span>
            </li>
          );
          return (
            <li key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${mine ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-[#f1f1f0] text-ink"}`}>
                {m.t ? m.t[lang] : m.raw}
                {!m.t && <span className={`mt-1 block text-[10.5px] ${mine ? "text-white/60" : "text-mute"}`}>{t.orig}</span>}
              </div>
              <span className="mt-1 px-1 text-[10.5px] text-mute">
                {m.who}・{time(m.at)}
                {!mine && fresh.has(m.id) && <b className="ml-1.5 rounded bg-[#fbe4e4] px-1.5 py-px font-medium text-red-700">{t.newMark}</b>}
                {mine && m.read && <span className="ml-1.5">{t.read}</span>}
              </span>
            </li>
          );
        })}
      </ul>
      <div className={compact ? "mt-2 pt-1" : "mt-3 border-t border-line pt-2.5"}>
        {/* よく使う文：LINEのように、小さめのボタンを横にスクロールする1列に（その分、会話を広く見せる） */}
        <div className={`${compact ? "-mx-3 px-3" : "-mx-1 px-1"} flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]`} aria-label={t.quick}>
          {quick.map((q) => (
            <button key={q.ja} type="button" onClick={() => { setText(q[lang]); setPick(q); inputRef.current?.focus(); }} className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-[11.5px] whitespace-nowrap hover:border-ink">{q[lang]}</button>
          ))}
        </div>
        <form className="mt-1.5 flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = text.trim(); if (!v) return; sendMsg(d.id, pick && pick[lang] === v ? { from: side, who, t: pick } : { from: side, who, raw: v }); setText(""); setPick(null); }}>
          <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.ph} maxLength={300} className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2.5 text-[13px] outline-none focus:border-ink" />
          <button type="submit" className="cms-btn flex shrink-0 items-center gap-1.5 bg-ink px-4 py-2.5 text-[12.5px] text-white"><Send size={13} />{t.send}</button>
        </form>
        {!compact && <TechNote className="mt-2.5">{t.note}</TechNote>}
      </div>
    </div>
  );
}

// 発注カード：工場への発注を、チャットの中で一目で分かる形に。価格とお客様の名前は載せない
const PT = {
  ja: { title: "製造の発注", leather: "革", model: "製品", qty: "色と数量", total: "合計", logo: "ロゴ", noLogo: "ロゴなし（無地）", ship: "出荷期限", doc: "製造指示書を開く", ack: "受けました", ask: "質問がある", acked: (w: string, at: string) => `${w} が受けました・${at}`, wait: "工場の確認待ち", pcs: "個" },
  en: { title: "Production order", leather: "Leather", model: "Model", qty: "Colors & qty", total: "Total", logo: "Logo", noLogo: "No logo (plain)", ship: "Ship by", doc: "Open production sheet", ack: "Received", ask: "Ask a question", acked: (w: string, at: string) => `Received by ${w} · ${at}`, wait: "Waiting for the factory", pcs: "pcs" },
  th: { title: "ใบสั่งผลิต", leather: "หนัง", model: "รุ่น", qty: "สีและจำนวน", total: "รวม", logo: "โลโก้", noLogo: "ไม่ใส่โลโก้", ship: "ส่งภายใน", doc: "เปิดใบสั่งผลิต", ack: "รับทราบแล้ว", ask: "มีคำถาม", acked: (w: string, at: string) => `${w} รับทราบแล้ว · ${at}`, wait: "รอโรงงานยืนยัน", pcs: "ชิ้น" },
};
export function PoCard({ d, po, m, side, lang, who, onAsk }: { d: Deal; po: Po; m?: Msg; side?: Msg["from"]; lang: Lang; who?: string; onAsk?: () => void }) {
  const t = PT[lang];
  const md = modelOf(d.model);
  const z = logoSize(d);
  const canAck = side === "factory" && m && !po.ackAt;
  return (
    <div className="w-[min(100%,22rem)] overflow-hidden rounded-2xl border border-line bg-white text-[12.5px] shadow-sm">
      <div className="flex items-center justify-between gap-2 bg-[#9b2c2c] px-3.5 py-2 text-white">
        <span className="flex items-center gap-1.5 font-medium"><ClipboardList size={14} />{t.title}</span>
        <span className="tabular-nums text-white/80">{po.no}</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 p-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(md.img)} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
        {hasLogo(d) ? <div className="overflow-hidden rounded-lg"><ProofView d={d} label={false} zoom /></div> : <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-paper text-[11px] text-mute">{t.noLogo}</div>}
      </div>
      <dl className="grid grid-cols-[5.5em_1fr] gap-x-2 gap-y-1 px-3.5 pb-3">
        <dt className="text-mute">{t.model}</dt><dd>{trModel(d.model, lang)}</dd>
        <dt className="text-mute">{t.leather}</dt><dd className="flex items-center gap-1.5">{/* eslint-disable-next-line @next/next/no-img-element */}{d.leather?.img && <img src={d.leather.img.startsWith("data:") ? d.leather.img : asset(d.leather.img)} alt="" className="h-5 w-7 shrink-0 rounded-sm object-cover" />}<span>{trLeather(d, lang)}{d.leather?.code && <span className="ml-1 font-mono text-[11px] text-mute">{d.leather.code}</span>}<span className="block text-[11px] text-mute">{trTan(d, lang)}</span></span></dd>
        <dt className="text-mute">{t.qty}</dt>
        <dd>{po.items.map((x) => <span key={x.color} className="flex justify-between"><span>{trColor(x.color, lang)}</span><span className="tabular-nums">{x.qty}</span></span>)}
          <span className="mt-0.5 flex justify-between border-t border-line pt-0.5 font-medium"><span>{t.total}</span><span className="tabular-nums">{po.lot} {t.pcs}</span></span></dd>
        <dt className="text-mute">{t.logo}</dt><dd>{hasLogo(d) ? <>{trFinish(d.finish, lang)}・{trPos(md.logo, lang)}<span className="block text-mute tabular-nums">{z.w.toFixed(1)} × {z.h.toFixed(1)} cm</span></> : t.noLogo}</dd>
        <dt className="text-mute">{t.ship}</dt><dd className="tabular-nums">{po.shipBy}</dd>
      </dl>
      <Link href={`/cms/doc/?id=${d.id}&type=work`} className="mx-3.5 mb-3 flex items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-[12px] hover:border-ink"><FileText size={13} />{t.doc}</Link>
      <div className="border-t border-line px-3.5 py-2.5">
        {po.ackAt ? (
          <p className="flex items-center gap-1.5 text-[12px] text-[#2f7a4a]"><Check size={14} />{t.acked(po.ackBy ?? "", time(po.ackAt))}</p>
        ) : canAck ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => ackPo(d.id, m!.id, who ?? "工場")} className="cms-btn flex flex-1 items-center justify-center gap-1.5 bg-ink py-2.5 text-[13px] text-white"><Check size={14} />{t.ack}</button>
            <button type="button" onClick={onAsk} className="flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2.5 text-[12.5px] hover:border-ink"><HelpCircle size={14} />{t.ask}</button>
          </div>
        ) : (
          <p className="text-[12px] text-[#9b2c2c]">{t.wait}</p>
        )}
      </div>
    </div>
  );
}
