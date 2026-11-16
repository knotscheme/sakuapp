"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import type { Deal, Msg } from "@/lib/cms";
import { markRead, sendMsg } from "./store";
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
export function MsgThread({ d, side, lang, who }: { d: Deal; side: Msg["from"]; lang: Lang; who: string }) {
  const t = T[lang];
  const other: Msg["from"] = side === "japan" ? "factory" : "japan";
  const [text, setText] = useState("");
  // 開いたときに未読だったものに「新着」を付けてから、既読にする
  const [fresh] = useState(() => new Set((d.msgs ?? []).filter((m) => m.from === other && !m.read).map((m) => m.id)));
  useEffect(() => { markRead(d.id, other); }, [d.id, other, d.msgs?.length]);
  const quick = side === "japan" ? JAPAN_QUICK : FACTORY_QUICK;
  const msgs = d.msgs ?? [];

  return (
    <div>
      <ul className="max-h-[22rem] space-y-2.5 overflow-y-auto pr-1">
        {!msgs.length && <li className="text-[12.5px] text-mute">{t.empty}</li>}
        {msgs.map((m) => {
          const mine = m.from === side;
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
      <div className="mt-4 border-t border-line pt-3.5">
        <p className="text-[11px] text-mute">{t.quick}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {quick.map((q) => (
            <button key={q.ja} type="button" onClick={() => sendMsg(d.id, { from: side, who, t: q })} className="rounded-full border border-line px-3.5 py-2.5 text-left text-[12.5px] hover:border-ink">{q[lang]}</button>
          ))}
        </div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = text.trim(); if (!v) return; sendMsg(d.id, { from: side, who, raw: v }); setText(""); }}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t.ph} maxLength={300} className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2.5 text-[13px] outline-none focus:border-ink" />
          <button type="submit" className="cms-btn flex shrink-0 items-center gap-1.5 bg-ink px-4 py-2.5 text-[12.5px] text-white"><Send size={13} />{t.send}</button>
        </form>
        <TechNote className="mt-2.5">{t.note}</TechNote>
      </div>
    </div>
  );
}
