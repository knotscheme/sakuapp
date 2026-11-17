"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Bot, MessageSquare, Package, ScanSearch, TrendingUp, User, Wrench } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import { BRAND, FIXES, fmt, sales, shelf } from "@/lib/demo";
import { useStore } from "@/lib/store";

function Home() {
  const s = useStore();
  const sh = shelf(s.applied);
  const m = sales(sh.pct);
  const left = FIXES.length - s.applied.length;
  const steps = [
    { n: "1", href: "/ai/", icon: MessageSquare, t: "お客様のAI画面", b: "AIに商品を聞くと、どう答えるか" },
    { n: "2", href: "/tana/", icon: ScanSearch, t: "棚チェック", b: "何回聞いて、何回出たか。出ない理由" },
    { n: "3", href: "/naosu/", icon: Wrench, t: "直す", b: "AIが文章を下書き。押すとショップに反映" },
    { n: "4", href: "/uriage/", icon: TrendingUp, t: "売れたか", b: "AIから来たお客様と売上" },
  ];
  return (
    <>
      <Link href="/guide/" className="card mb-4 flex items-center gap-3 border-ai/40 p-3.5 hover:border-ai">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ai-2 text-ai"><BookOpen size={18} /></span>
        <span className="min-w-0 flex-1 text-[0.92rem] leading-[1.6]"><b>はじめての方へ</b><span className="text-sub">　お店の人が使うツールのデモです。使い方を見る</span></span>
        <ArrowRight size={18} className="shrink-0 text-ai" />
      </Link>

      <section className="glow relative overflow-hidden rounded-[24px] px-5 py-8 text-white sm:px-10 sm:py-12">
        <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr] lg:gap-x-8">
          <div className="min-w-0 self-center">
            <p className="text-[0.85rem] font-bold tracking-[.06em] text-lime">ネットショップのための AI集客ツール</p>
            <h1 className="mt-3 text-[1.9rem] font-bold leading-[1.4] sm:text-[2.6rem]"><span className="inline-block">AIに聞かれたら、</span><span className="inline-block">うちの商品が出てくる。</span></h1>
            <p className="mt-4 text-[0.98rem] leading-[1.95] text-white/75">お客様がChatGPTなどに「おすすめの化粧水は？」と聞いたとき、<b className="text-white">あなたの商品がすすめられ、そのまま買われる</b>ようにするツールです。</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/ai/" className="btn bg-lime px-6 text-[#03140f] hover:brightness-95">お客様のAI画面を見る<ArrowRight size={18} /></Link>
            </div>
          </div>
          <ol className="min-w-0 space-y-3" aria-label="TSURETEを入れると、こうなります">
            <li className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="flex items-center gap-2 text-[0.75rem] font-bold text-white/55"><User size={14} />お客様がAIに聞く</p>
              <p className="ml-auto mt-2 w-fit max-w-[92%] rounded-2xl rounded-br-md bg-white/10 px-3.5 py-2 text-[0.9rem] leading-[1.7]">敏感肌でも使える、3,000円台の化粧水は？</p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="flex items-center gap-2 text-[0.75rem] font-bold text-white/55"><Bot size={14} />AIがすすめる</p>
              <p className="mt-2 w-fit max-w-[92%] rounded-2xl rounded-tl-md border border-ai/40 bg-ai/10 px-3.5 py-2 text-[0.9rem] leading-[1.7]">1位 <b className="text-lime">{BRAND.name} 化粧水</b>　無香料・アルコールフリーで、敏感肌向けと書かれています。</p>
            </li>
            <li className="rounded-2xl border border-ai/50 bg-ai/10 p-4">
              <p className="flex items-center gap-2 text-[0.75rem] font-bold text-lime"><Package size={14} />ショップに注文が入る</p>
              <p className="mt-2 flex flex-wrap items-baseline gap-x-3 text-[0.92rem]"><b>化粧水 しっとり 150ml</b><span className="num">3,300円</span><span className="text-[0.78rem] text-white/55">ChatGPT経由</span></p>
            </li>
          </ol>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="いまの状態">
        <Link href="/tana/" className="card p-5 hover:border-ai"><p className="text-[0.85rem] text-sub">AIのおすすめに出る</p><p className="num mt-1 text-[2rem] font-bold text-ai">{sh.pct}%</p><p className="text-[0.8rem] text-sub">{fmt(sh.max)}回聞いて{fmt(sh.total)}回</p></Link>
        <Link href="/naosu/" className="card p-5 hover:border-ai"><p className="text-[0.85rem] text-sub">直すこと</p><p className="num mt-1 text-[2rem] font-bold">{left}<span className="text-[1rem]"> 件</span></p><p className="text-[0.8rem] text-sub">{left ? "効き目の大きい順に並んでいます" : "すべて反映しました"}</p></Link>
        <Link href="/uriage/" className="card p-5 hover:border-ai"><p className="text-[0.85rem] text-sub">AI経由の売上（今月の見込み）</p><p className="num mt-1 text-[2rem] font-bold">{fmt(m.yen + s.orders.reduce((a, o) => a + o.price, 0))}<span className="text-[1rem]"> 円</span></p><p className="text-[0.8rem] text-sub">注文 {m.orders + s.orders.length}件</p></Link>
      </section>

      <section className="mt-8" aria-labelledby="st">
        <h2 id="st" className="text-[1.15rem] font-bold">使う流れ</h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, href, icon: Icon, t, b }) => (
            <li key={n}><Link href={href} className="card group flex h-full flex-col p-5 hover:border-ai">
              <span className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-ai-2 text-ai"><Icon size={20} /></span><span className="num text-[0.8rem] font-bold text-sub">0{n}</span></span>
              <b className="mt-3 text-[1.02rem]">{t}</b>
              <span className="mt-1 flex-1 text-[0.85rem] leading-[1.7] text-sub">{b}</span>
              <ArrowRight size={16} className="mt-3 text-ai transition group-hover:translate-x-1" />
            </Link></li>
          ))}
        </ol>
      </section>
      <p className="mt-6 text-[0.78rem] leading-[1.9] text-sub">※架空のブランド「{BRAND.name}」（代表 {BRAND.owner}さん）のデモです。数字は模擬の結果です。AIにすすめられることは保証できません。TSURETEは、出る回数を測り、上げるための材料をそろえます。</p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Home /></Ready></Shell>; }
