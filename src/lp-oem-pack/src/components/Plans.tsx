"use client";

import { ArrowRight, Check } from "lucide-react";
import { OEM_ONLY, PLANS, PLAN_EVENT, PLAN_OPTIONS, yen, type PlanId } from "@/lib/packs";
import { scrollToId } from "./LpContext";
import SectionTitle from "./SectionTitle";

// 料金プラン：3つのパッケージ＋OEMのみ＋オプション（金額は例）
export default function Plans() {
  const choose = (id: PlanId) => {
    dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: id }));
    scrollToId("contact");
  };
  return (
    <section id="plans" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Plans" ja="料金は、|パッケージで|明確に。" sub="何度も見積もりを|往復しなくて大丈夫です。|すべて税込・本生産50個を含みます。" />
        <div className="grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <article key={p.id} className={`reveal relative flex flex-col border p-7 md:p-8 ${p.best ? "border-ink bg-ink text-white" : "border-line bg-white"}`} style={{ transitionDelay: `${i * 0.1}s` }}>
              {p.best && <span className="absolute -top-3 left-7 bg-gold px-3 py-1 text-[11px] tracking-[0.1em] text-white">いちばん人気</span>}
              <p className={`font-display text-[12px] tracking-[0.3em] uppercase ${p.best ? "text-white/60" : "text-mute"}`}>{p.en}</p>
              <h3 className="mt-1.5 text-[20px] font-medium">{p.name}</h3>
              <p className="mt-4 font-num text-[32px] leading-none font-medium tabular-nums">{(p.price! / 10000).toLocaleString()}<span className="ml-1 text-[14px] font-normal">万円</span></p>
              <p className={`mt-1 text-[11px] ${p.best ? "text-white/60" : "text-mute"}`}>税込 {yen(p.price!)}</p>
              <p className={`mt-5 text-[13px] leading-relaxed ${p.best ? "text-white/80" : "text-ink/80"}`}>{p.lead}</p>
              <ul className={`mt-5 flex-1 space-y-2.5 border-t pt-5 text-[13.5px] ${p.best ? "border-white/15" : "border-line"}`}>
                {p.items.map((x) => <li key={x} className="flex gap-2.5"><Check size={16} className="mt-0.5 shrink-0 text-gold" />{x}</li>)}
              </ul>
              <button type="button" onClick={() => choose(p.id)} className={`group mt-7 inline-flex w-full items-center justify-center gap-2 py-3.5 text-[13.5px] tracking-[0.08em] transition ${p.best ? "bg-white text-ink hover:bg-gold hover:text-white" : "border border-ink text-ink hover:bg-ink hover:text-white"}`}>
                このプランで相談 <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </button>
            </article>
          ))}
        </div>

        {/* OEMのみ */}
        <div className="reveal mt-5 flex flex-col gap-4 border border-line bg-paper p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
          <div>
            <p className="text-[16px] font-medium">{OEM_ONLY.name}</p>
            <p className="mt-1 text-[13px] text-mute">{OEM_ONLY.lead}<span className="ml-1 inline-block text-ink">{OEM_ONLY.priceNote}</span></p>
          </div>
          <button type="button" onClick={() => choose("oem")} className="shrink-0 border-b border-ink/40 pb-0.5 text-[13px] text-ink transition hover:border-gold hover:text-gold">OEMのみで相談する →</button>
        </div>

        {/* オプション */}
        <h3 className="reveal mt-16 text-center text-[17px] font-medium">オプション</h3>
        <ul className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {PLAN_OPTIONS.map((o) => (
            <li key={o.name} className="reveal bg-white p-6">
              <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><span className="text-[14.5px] font-medium">{o.name}</span><span className="font-num text-[14px] text-gold">{o.price}</span></p>
              <p className="mt-2 text-[13px] leading-relaxed text-mute">{o.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-[11.5px] text-mute">※金額は例です（デモ版）。革のアップグレードや個数の追加は、革素材・数量に合わせてお見積もりします。</p>
      </div>
    </section>
  );
}
