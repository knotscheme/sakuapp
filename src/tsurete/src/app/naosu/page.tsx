"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, Clock, FileText, Mail, Zap } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { toast } from "@/components/Confirm";
import { FIXES, fmt, shelf, type Fix } from "@/lib/demo";
import { update, useStore } from "@/lib/store";

const HOW = { auto: { icon: Zap, l: "自動で反映" }, draft: { icon: FileText, l: "AIが下書き" }, ask: { icon: Mail, l: "依頼文を作る" } };

function Card({ f, done, gain }: { f: Fix; done: boolean; gain: number }) {
  const [open, setOpen] = useState(false);
  const H = HOW[f.how];
  const set = (on: boolean) => { update((x) => ({ ...x, applied: on ? [...x.applied, f.id] : x.applied.filter((y) => y !== f.id) })); toast(on ? "ショップに反映しました（デモ）" : "もとに戻しました"); };
  return (
    <li className={`card p-5 ${done ? "border-ok/40" : ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <b className="block text-[1.02rem] leading-[1.6]">{f.title}</b>
          <p className="mt-1 text-[0.86rem] leading-[1.75] text-sub">{f.why}</p>
          <p className="mt-2 flex flex-wrap gap-1.5">
            <span className="chip bg-ai-2 text-ai"><H.icon size={12} />{H.l}</span>
            <span className="chip bg-deep text-sub"><Clock size={12} />{f.effort}</span>
            {!done && gain > 0 && <span className="chip bg-ai/15 text-ai">出る回数 +{fmt(gain)}回</span>}
            {f.note && <span className="chip bg-warn/15 text-warn">{f.note}</span>}
          </p>
        </div>
        {done ? <span className="chip shrink-0 self-start bg-ok text-[#03140f]"><Check size={13} />反映しました</span>
          : <button type="button" onClick={() => set(true)} className="btn btn-ai shrink-0">反映する</button>}
      </div>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="mt-3 flex items-center gap-1 text-[0.85rem] font-bold text-sub hover:text-ink"><ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />前と後をくらべる</button>
      {open && (
        <div className="fade-in mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-paper p-3"><p className="text-[0.75rem] font-bold text-sub">いま</p><p className="mt-1 whitespace-pre-line text-[0.86rem] leading-[1.8] text-sub">{f.before}</p></div>
          <div className="rounded-xl border border-ai/50 bg-ai/10 p-3"><p className="text-[0.75rem] font-bold text-ai">直したあと</p><p className="mt-1 whitespace-pre-line text-[0.86rem] leading-[1.8]">{f.after}</p></div>
        </div>
      )}
      {done && <button type="button" onClick={() => set(false)} className="mt-2 text-[0.8rem] text-sub underline">もとに戻す</button>}
    </li>
  );
}

function Naosu() {
  const s = useStore();
  const now = shelf(s.applied).total;
  const list = FIXES.map((f) => ({ f, done: s.applied.includes(f.id), gain: s.applied.includes(f.id) ? 0 : shelf([...s.applied, f.id]).total - now }))
    .sort((a, b) => Number(a.done) - Number(b.done) || b.gain - a.gain);
  const n = s.applied.length;
  return (
    <>
      <Title n="3" title="直す" lead="出ない理由から、やることを効き目の大きい順に並べました。文章はAIが下書きします。" />
      <div className="card mb-5 flex flex-wrap items-center gap-4 p-5">
        <p className="text-[0.95rem]"><b className="num text-[1.8rem] text-ai">{n}</b><span className="text-sub"> / {FIXES.length} 反映</span></p>
        <div className="flex flex-1 gap-1" aria-hidden>{FIXES.map((f, i) => <i key={f.id} className={`h-2 flex-1 rounded-sm ${i < n ? "bg-ai" : "bg-deep"}`} />)}</div>
        <Link href="/ai/" className="flex items-center gap-1 text-[0.88rem] font-bold text-ai">AIの答えを見る<ArrowRight size={16} /></Link>
      </div>
      <ul className="space-y-3">{list.map((x) => <Card key={x.f.id} {...x} />)}</ul>
    </>
  );
}

export default function Page() { return <Shell><Ready><Naosu /></Ready></Shell>; }
