"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Lightbulb } from "lucide-react";
import { PROD_STEPS } from "@/lib/cms";
import { Card } from "@/components/cms/ui";

// 工場向けマニュアル（タイ語・英語）。※サンプルの翻訳。本番前にネイティブの確認が必要
const C = {
  th: {
    hello: (n: string) => `สวัสดี ${n}`,
    lead: "คู่มือนี้อธิบายวิธีใช้หน้าจอโรงงาน อ่านจากบนลงล่างได้เลย",
    open: "เปิดหน้าจอโรงงาน",
    s: [
      { h: "หน้าจอนี้คืออะไร", p: ["หน้าจอนี้แสดงเฉพาะงานที่โรงงานของคุณต้องผลิต", "ไม่แสดงชื่อลูกค้า ข้อมูลติดต่อ และราคาขาย", "ข้อมูลที่คุณกดบันทึก จะแจ้งไปที่ทีมญี่ปุ่นทันที"] },
      { h: "ขั้นตอนการทำงาน", steps: ["เปิด “ใบสั่งผลิต” เพื่อตรวจรุ่น จำนวน สีหนัง และตำแหน่งโลโก้", "เมื่อเสร็จแต่ละขั้นตอน ให้กด “เสร็จแล้ว” แล้วกด “ยืนยัน”", "อัปโหลดรูปของแต่ละขั้นตอน", "เมื่อเสร็จครบ 4 ขั้นตอน ให้กด “ส่งไปญี่ปุ่น”"], tip: "หากกด “เสร็จแล้ว” ผิด ให้แตะเครื่องหมาย ✓ ของขั้นตอนล่าสุดเพื่อยกเลิก (ทำได้ก่อนส่งของเท่านั้น)" },
      { h: "ส่งข้อความถึงญี่ปุ่น", steps: ["กด “ส่งข้อความถึงญี่ปุ่น” ที่ด้านล่างของแต่ละงาน", "เลือก “ข้อความด่วน” หรือพิมพ์ข้อความเป็นภาษาไทย", "ทีมญี่ปุ่นจะได้รับเป็นภาษาญี่ปุ่น", "คำตอบจากญี่ปุ่นจะแสดงเป็นภาษาไทยในที่เดียวกัน (มีตัวเลขสีแดงเมื่อมีข้อความใหม่)"], tip: "ข้อความด่วนจะถูกส่งเป็นภาษาญี่ปุ่นที่ถูกต้องเสมอ ใช้เมื่อต้องการแจ้งเรื่องสำคัญ เช่น งานล่าช้า" },
      { h: "ภาษา", p: ["หน้าจอจะแสดงเป็นภาษาไทยโดยอัตโนมัติ", "หากต้องการดูภาษาอื่นชั่วคราว ให้เลือกที่ “ภาษา” ในเมนู"] },
    ],
    faq: "คำถามที่พบบ่อย",
    q: [
      ["ไม่เห็นงานที่ต้องผลิต", "งานจะแสดงหลังจากลูกค้าอนุมัติตำแหน่งโลโก้แล้ว หากยังไม่เห็น กรุณาส่งข้อความถึงญี่ปุ่น"],
      ["ปุ่ม “ส่งไปญี่ปุ่น” กดไม่ได้", "ต้องกด “เสร็จแล้ว” ครบทั้ง 4 ขั้นตอนก่อน"],
      ["กดผิด", "แตะเครื่องหมาย ✓ ของขั้นตอนล่าสุดเพื่อยกเลิก หลังส่งของแล้วกรุณาติดต่อทีมญี่ปุ่น"],
    ],
    words: "คำศัพท์",
    w: [["ใบสั่งผลิต", "เอกสารที่บอกรุ่น จำนวน สี และตำแหน่งโลโก้"], ["ฟอยล์ทอง / ฟอยล์เงิน", "ปั๊มโลโก้ด้วยฟอยล์สีทองหรือสีเงิน"], ["ปั๊มจม", "ปั๊มโลโก้ลงบนหนังโดยไม่ใช้ฟอยล์"], ["ส่งภายใน", "วันที่ต้องส่งของออกจากโรงงาน"]],
    stepsTitle: "4 ขั้นตอนการผลิต",
  },
  en: {
    hello: (n: string) => `Hello, ${n}`,
    lead: "This guide explains how to use the factory screen. Read it from top to bottom.",
    open: "Open the factory screen",
    s: [
      { h: "What is this screen?", p: ["It shows only the orders your factory needs to make.", "Customer names, contacts and selling prices are not shown.", "Everything you record is sent to the Japan team right away."] },
      { h: "How to work", steps: ["Open the “Production order” to check the model, quantity, leather color and logo position.", "When a step is finished, tap “Mark as done”, then “Yes”.", "Upload a photo of each step.", "When all 4 steps are done, tap “Ship to Japan”."], tip: "If you marked a step by mistake, tap the ✓ of the latest step to undo it (before shipping only)." },
      { h: "Message to Japan", steps: ["Tap “Message to Japan” at the bottom of an order.", "Choose a quick message, or write your own.", "The Japan team receives it in Japanese.", "Replies from Japan appear in the same place, in your language (a red number shows new replies)."], tip: "Quick messages always arrive in correct Japanese. Use them for important news such as delays." },
      { h: "Language", p: ["The screen is shown in your language automatically.", "To view another language for a moment, choose it under “Language” in the menu."] },
    ],
    faq: "FAQ",
    q: [
      ["I can't see any orders", "Orders appear after the customer approves the logo position. If you still see nothing, send a message to Japan."],
      ["I can't tap “Ship to Japan”", "All 4 steps must be marked as done first."],
      ["I tapped by mistake", "Tap the ✓ of the latest step to undo. After shipping, please contact the Japan team."],
    ],
    words: "Words",
    w: [["Production order", "The sheet with the model, quantity, color and logo position"], ["Gold / silver foil", "Stamping the logo with gold or silver foil"], ["Blind deboss", "Pressing the logo into the leather without foil"], ["Ship by", "The date the goods must leave the factory"]],
    stepsTitle: "4 production steps",
  },
};

export function FactoryManual({ lang, name, canFactory }: { lang: "th" | "en"; name: string; canFactory: boolean }) {
  const c = C[lang];
  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <Card className="px-6 py-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white"><BookOpen size={19} /></span>
          <div>
            <p className="text-[15px] font-semibold">{c.hello(name)}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-mute">{c.lead}</p>
            {canFactory && <Link href="/cms/factory/" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium underline underline-offset-4 hover:text-gold">{c.open} <ArrowRight size={14} /></Link>}
          </div>
        </div>
      </Card>

      <Card className="px-6 py-6">
        <h2 className="text-[17px] font-semibold">{c.stepsTitle}</h2>
        <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PROD_STEPS.map((p, i) => <li key={p.en} className="rounded-lg border border-line px-3.5 py-3"><p className="text-[11px] text-mute">{i + 1}</p><p className="text-[13.5px] font-semibold">{p[lang]}</p></li>)}
        </ol>
      </Card>

      {c.s.map((x, i) => (
        <Card key={x.h} className="px-6 py-6">
          <h2 className="text-[17px] font-semibold"><span className="mr-2 text-[12px] font-normal text-mute">{String(i + 1).padStart(2, "0")}</span>{x.h}</h2>
          {"p" in x && x.p && <div className="mt-3 space-y-1.5">{x.p.map((t) => <p key={t} className="text-[14px] leading-[1.9] text-ink/85">{t}</p>)}</div>}
          {"steps" in x && x.steps && (
            <ol className="mt-3 space-y-2.5">
              {x.steps.map((t, k) => <li key={t} className="flex gap-3 text-[14px] leading-relaxed"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11.5px] text-white">{k + 1}</span><span className="pt-0.5">{t}</span></li>)}
            </ol>
          )}
          {"tip" in x && x.tip && <p className="mt-4 flex gap-2.5 rounded-lg bg-[#fbf7ee] px-4 py-3 text-[13px] leading-relaxed text-ink/85"><Lightbulb size={15} className="mt-0.5 shrink-0 text-gold" /><span>{x.tip}</span></p>}
        </Card>
      ))}

      <Card className="px-6 py-6">
        <h2 className="text-[17px] font-semibold">{c.faq}</h2>
        <dl className="mt-3 divide-y divide-line border-y border-line">
          {c.q.map(([q, a]) => <div key={q} className="py-3.5"><dt className="text-[14px] font-medium">{q}</dt><dd className="mt-1 text-[13.5px] leading-relaxed text-ink/80">{a}</dd></div>)}
        </dl>
      </Card>

      <Card className="px-6 py-6">
        <h2 className="text-[17px] font-semibold">{c.words}</h2>
        <dl className="mt-3 divide-y divide-line border-y border-line text-[13.5px]">
          {c.w.map(([k, v]) => <div key={k} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4"><dt className="shrink-0 font-semibold sm:w-40">{k}</dt><dd className="leading-relaxed text-ink/80">{v}</dd></div>)}
        </dl>
      </Card>
    </div>
  );
}
