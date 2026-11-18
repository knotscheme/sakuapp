"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import Fold from "@/components/Fold";
import J from "@/components/J";
import { ITEMS, healthAll } from "@/lib/health";
import { useStore } from "@/lib/store";

const tone = (n: number) => (n >= 75 ? "text-ai" : n >= 50 ? "text-ink" : "text-warn");
const bar = (n: number) => (n >= 75 ? "bg-ai" : n >= 50 ? "bg-[#7c8aa5]" : "bg-warn");

// 診断：全商品のページを、AIを使わずに点検する（健康診断）
function Kenko() {
  const s = useStore();
  const { all, avg } = healthAll(s.applied);
  const sorted = [...all].sort((a, b) => a.score - b.score);
  return (
    <>
      <Title n="1" title="診断" lead="AIに選ばれるための8つの項目で、商品ページを点検しました。" />

      <div className="flex items-end gap-3"><b className={`num text-[3.6rem] leading-none ${tone(avg)}`}>{avg}</b><span className="pb-1 text-sub">点</span><span className="pb-1.5 text-[0.85rem] text-sub">（{all.length}商品の平均）</span></div>

      <ul className="mt-10 border-t hair">
        {sorted.map(({ p, items, score, ok }) => (
          <li key={p.id} className="border-b hair">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-4 py-5 [&::-webkit-details-marker]:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/sakuapp/works/tsurete/img/products/${p.id}.webp`} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0 flex-1">
                  <b className="block text-[0.95rem] leading-[1.5]"><J>{p.name}</J></b>
                  <span className="mt-1.5 flex items-center gap-3"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[.06]"><span className={`block h-full rounded-full transition-all duration-700 ${bar(score)}`} style={{ width: `${score}%` }} /></span><span className="shrink-0 text-[0.78rem] text-sub">足りない {ITEMS.length - ok}か所</span></span>
                </span>
                <b className={`num shrink-0 text-[1.1rem] ${tone(score)}`}>{score}<span className="text-[0.75rem] font-normal">点</span></b>
                <ChevronDown size={18} className="shrink-0 text-sub transition group-open:rotate-180" />
              </summary>
              <div className="pb-6 sm:pl-16">
                <ul className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6">
                  {items.map((it) => <li key={it.id} className="flex items-center gap-2 text-[0.88rem]">{it.ok ? <Check size={16} className="shrink-0 text-ai" /> : <X size={16} className="shrink-0 text-warn" />}<span className={it.ok ? "text-sub" : "font-bold"}>{it.label}</span></li>)}
                </ul>
                {ok < ITEMS.length && <Link href={`/naosu/?p=${p.id}`} className="btn btn-ai mt-5 px-5">直す<ArrowRight size={17} /></Link>}
              </div>
            </details>
          </li>
        ))}
      </ul>

      <div className="mt-14">
        <Fold title="8つの項目とは？" sub="AIに選ばれるために、ページにあるとよいもの">
          <ul className="space-y-3">{ITEMS.map((it) => <li key={it.id} className="text-[0.88rem] leading-[1.7]"><b className="block">{it.label}</b><span className="text-sub"><J>{it.why}</J></span></li>)}</ul>
          <p className="mt-5 text-[0.8rem] leading-[1.8] text-sub"><J>点検にAIは使わないので、AIの利用料はかかりません。毎週月曜に、自動で点検しなおします。</J></p>
        </Fold>
        <Fold title="ほかの商品を診断する" sub="URLやCSVで、まだ登録していない商品も">
          <div className="flex flex-wrap gap-3"><Link href="/shindan/" className="btn btn-line">URLで診断</Link><Link href="/shindan/?csv=1" className="btn btn-line">CSVでまとめて</Link></div>
        </Fold>
      </div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Kenko /></Ready></Shell>; }
