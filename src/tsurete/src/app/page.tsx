"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Check, TrendingUp, Wand2, X } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import { BRAND, FIXES, PAGES, fmt, sales, shelf } from "@/lib/demo";
import { useStore } from "@/lib/store";

const ALL = FIXES.map((f) => f.id);

function Home() {
  const s = useStore();
  const base = shelf([]), full = shelf(ALL), sh = shelf(s.applied);
  const m = sales(sh.pct);
  const done = s.applied.length;
  const pg = PAGES.lotion;
  return (
    <>
      <Link href="/guide/" className="card mb-4 flex items-center gap-3 border-ai/40 p-3.5 hover:border-ai">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ai-2 text-ai"><BookOpen size={18} /></span>
        <span className="min-w-0 flex-1 text-[0.92rem] leading-[1.6]"><b>はじめての方へ</b><span className="text-sub">　ネットショップの人が使うツールのデモです。使い方を見る</span></span>
        <ArrowRight size={18} className="shrink-0 text-ai" />
      </Link>

      <section className="glow relative overflow-hidden rounded-[24px] px-5 py-8 text-white sm:px-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-x-10">
          <div className="min-w-0 self-center">
            <p className="text-[0.85rem] font-bold tracking-[.06em] text-lime">ネットショップのための AI集客ツール</p>
            <h1 className="mt-3 text-[1.85rem] font-bold leading-[1.4] sm:text-[2.5rem]"><span className="inline-block">AIにすすめられる</span><span className="inline-block">商品ページに、</span><span className="inline-block">AIが書き直す。</span></h1>
            <p className="mt-4 text-[0.98rem] leading-[1.95] text-white/75">お客様は、ChatGPTなどに「おすすめの化粧水は？」と聞いて買い物をし始めています。TSURETEは、<b className="text-white">あなたの商品ページを、AIに選ばれる形に書き直す</b>ツールです。案を見て、押すだけでショップに反映されます。</p>
            <Link href="/naosu/" className="btn mt-6 bg-lime px-6 text-[#03140f] hover:brightness-95"><Wand2 size={18} />商品ページを書き直す</Link>
          </div>

          {/* 書き直す前と後の商品ページを並べる */}
          <div className="grid min-w-0 gap-3 sm:grid-cols-2" aria-label="書き直す前と後">
            <div className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="flex items-center gap-1.5 text-[0.75rem] font-bold text-white/55"><X size={14} />書き直す前</p>
              <b className="mt-2 block text-[0.9rem]">SORAE 化粧水 しっとり</b>
              <p className="mt-1.5 text-[0.82rem] leading-[1.75] text-white/60">{pg.target[0]}</p>
              <p className="mt-2 text-[0.75rem] text-white/35">成分の説明なし・よくある質問なし</p>
              <p className="mt-4 border-t border-white/10 pt-3 text-[0.78rem] text-white/55">AIのおすすめに出る<b className="num ml-2 text-[1.5rem] text-warn">{base.pct}%</b></p>
            </div>
            <div className="min-w-0 rounded-2xl border border-ai/50 bg-ai/10 p-4">
              <p className="flex items-center gap-1.5 text-[0.75rem] font-bold text-lime"><Check size={14} />AIが書き直した後</p>
              <b className="mt-2 block text-[0.9rem]">SORAE 化粧水 しっとり</b>
              <p className="mt-1.5 text-[0.82rem] leading-[1.75] text-white/85">{pg.target[1]}</p>
              <p className="mt-2 flex flex-wrap gap-1">{["無香料", "アルコールフリー", "1日約55円", "よくある質問"].map((t) => <span key={t} className="rounded-full bg-ai/20 px-2 py-0.5 text-[0.7rem] font-bold text-lime">{t}</span>)}</p>
              <p className="mt-4 border-t border-ai/30 pt-3 text-[0.78rem] text-white/70">AIのおすすめに出る<b className="num ml-2 text-[1.5rem] text-lime">{full.pct}%</b></p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="いまの状態">
        <Link href="/naosu/" className="card p-5 hover:border-ai"><p className="text-[0.85rem] text-sub">書き直し</p><p className="num mt-1 text-[2rem] font-bold">{done}<span className="text-[1rem] text-sub"> / {FIXES.length} 反映</span></p><p className="text-[0.8rem] text-ai">{done < FIXES.length ? "書き直し案を見る →" : "すべて反映しました"}</p></Link>
        <Link href="/kouka/" className="card p-5 hover:border-ai"><p className="text-[0.85rem] text-sub">AIのおすすめに出る</p><p className="num mt-1 text-[2rem] font-bold text-ai">{sh.pct}%</p><p className="text-[0.8rem] text-sub">書き直す前は {base.pct}%</p></Link>
        <Link href="/kouka/" className="card p-5 hover:border-ai"><p className="text-[0.85rem] text-sub">AI経由の売上（今月の見込み）</p><p className="num mt-1 text-[2rem] font-bold">{fmt(m.yen + s.orders.reduce((a, o) => a + o.price, 0))}<span className="text-[1rem]"> 円</span></p><p className="text-[0.8rem] text-sub">注文 {m.orders + s.orders.length}件</p></Link>
      </section>

      <section className="mt-8" aria-labelledby="st">
        <h2 id="st" className="text-[1.15rem] font-bold">使い方は2つだけ</h2>
        <ol className="mt-3 grid gap-3 md:grid-cols-2">
          <li><Link href="/naosu/" className="card group flex h-full items-start gap-4 p-5 hover:border-ai"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ai text-[#03140f]"><Wand2 size={22} /></span><span className="min-w-0 flex-1"><b className="block text-[1.05rem]">1. 商品ページを書き直す</b><span className="mt-1 block text-[0.88rem] leading-[1.75] text-sub">AIが書き直し案を出します。見て「反映する」を押すと、ネットショップの商品ページが書きかわります。</span></span><ArrowRight size={18} className="mt-1 shrink-0 text-ai transition group-hover:translate-x-1" /></Link></li>
          <li><Link href="/kouka/" className="card group flex h-full items-start gap-4 p-5 hover:border-ai"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ai-2 text-ai"><TrendingUp size={22} /></span><span className="min-w-0 flex-1"><b className="block text-[1.05rem]">2. 効果を見る</b><span className="mt-1 block text-[0.88rem] leading-[1.75] text-sub">お客様がAIに聞いたときに、商品がすすめられるようになったか。売上がどう変わったか。</span></span><ArrowRight size={18} className="mt-1 shrink-0 text-ai transition group-hover:translate-x-1" /></Link></li>
        </ol>
      </section>
      <p className="mt-6 text-[0.78rem] leading-[1.9] text-sub">※架空のブランド「{BRAND.name}」（代表 {BRAND.owner}さん）のデモです。数字は模擬の結果です。AIにすすめられることは保証できません。</p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Home /></Ready></Shell>; }
