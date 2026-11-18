"use client";

import Link from "next/link";
import { ArrowRight, Check, ScanSearch, X } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
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
      <Title n="1" title="診断" lead="全商品のページを、AIに選ばれるための8つの項目で点検しました。足りないところは「直す」で処方箋（書き直し案）を出します。点検にAIは使わないので、AIの利用料はかかりません。" />

      <section className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="診断のまとめ">
        {[{ l: "ページの健康スコア", v: `${avg}`, u: "点", c: tone(avg) }, { l: "点検した商品", v: `${all.length}`, u: "商品" }, { l: "足りない項目", v: `${all.reduce((a, x) => a + ITEMS.length - x.ok, 0)}`, u: "か所", c: "text-warn" }].map((k) => (
          <div key={k.l} className="card min-w-0 p-3.5 sm:p-7">
            <p className="text-[0.68rem] leading-[1.5] text-sub sm:text-[0.82rem]"><J>{k.l}</J></p>
            <p className="mt-2 whitespace-nowrap sm:mt-3"><b className={`num text-[1.2rem] leading-none sm:text-[2.4rem] ${k.c ?? ""}`}>{k.v}</b><span className="ml-0.5 text-[0.75rem] text-sub sm:ml-1 sm:text-base">{k.u}</span></p>
          </div>
        ))}
      </section>

      <section className="mt-16" aria-labelledby="pl">
        <div className="flex items-end justify-between gap-4"><h2 id="pl" className="text-[1.1rem] font-bold">商品ごとの結果</h2><p className="text-[0.78rem] text-sub">点数の低い順</p></div>
        <ul className="mt-5 grid gap-4">
          {sorted.map(({ p, items, score, ok }) => (
            <li key={p.id} className="card p-4 sm:p-6">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/sakuapp/works/tsurete/img/products/${p.id}.webp`} alt="" width={64} height={64} className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16" />
                <div className="min-w-0 flex-1">
                  <b className="block text-[0.95rem] leading-[1.5]"><J>{p.name}</J></b>
                  <div className="mt-2 flex items-center gap-3"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[.06]"><span className={`block h-full rounded-full transition-all duration-700 ${bar(score)}`} style={{ width: `${score}%` }} /></span><span className={`num shrink-0 text-[0.9rem] font-bold ${tone(score)}`}>{score}点</span></div>
                </div>
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {items.map((it) => (
                  <li key={it.id} className="flex items-start gap-2 text-[0.84rem] leading-[1.6]">
                    {it.ok ? <Check size={16} className="mt-0.5 shrink-0 text-ai" /> : <X size={16} className="mt-0.5 shrink-0 text-warn" />}
                    <span className="min-w-0"><span className={it.ok ? "text-sub" : "font-bold"}>{it.label}</span>{!it.ok && <span className="block text-[0.75rem] text-sub"><J>{it.why}</J></span>}</span>
                  </li>
                ))}
              </ul>
              {ok < ITEMS.length
                ? <Link href={`/naosu/?p=${p.id}`} className="btn btn-ai mt-5 px-5">処方箋を見る<ArrowRight size={17} /></Link>
                : <p className="mt-5 text-[0.86rem] text-ai">すべての項目がそろっています。</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-[24px] bg-white/[.03] p-6 sm:p-8">
        <p className="flex items-center gap-2 text-[0.95rem] font-bold"><ScanSearch size={18} className="text-ai" />ほかのページも診断する</p>
        <p className="mt-1 text-[0.84rem] leading-[1.8] text-sub"><J>まだ登録していない商品は、URLかCSVで点検できます。</J></p>
        <div className="mt-4 flex flex-wrap gap-3"><Link href="/shindan/" className="btn btn-line">URLで診断</Link><Link href="/shindan/?csv=1" className="btn btn-line">CSVでまとめて診断</Link></div>
      </section>
      <p className="mt-8 text-[0.78rem] leading-[1.8] text-sub"><J>次の自動の点検：11月24日（月）。毎週、全商品のページを点検しなおします。</J></p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Kenko /></Ready></Shell>; }
