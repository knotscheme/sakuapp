"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import { BRAND, FIXES, WEEKS, fmt, sales, shelf, winners } from "@/lib/demo";
import { platformOf } from "@/lib/platforms";
import { useStore } from "@/lib/store";
import J from "@/components/J";

// ツールのホーム：今週の状況と、やることだけを出す
function Dashboard() {
  const s = useStore();
  const sh = shelf(s.applied);
  const diff = sh.pct - WEEKS[WEEKS.length - 1].p;
  const rank = [...sh.rivals.slice(0, 4), { name: BRAND.name, n: sh.total }].sort((a, b) => b.n - a.n);
  const pos = rank.findIndex((r) => r.name === BRAND.name) + 1;
  const m = sales(sh.pct);
  const yen = m.yen + s.orders.reduce((a, o) => a + o.price, 0);
  const todo = FIXES.filter((f) => !s.applied.includes(f.id)).map((f) => ({ f, g: shelf([...s.applied, f.id]).total - sh.total })).sort((a, b) => b.g - a.g).slice(0, 3);
  const lose = winners(s.applied).filter((w) => w.top !== BRAND.name).sort((a, b) => a.me - b.me).slice(0, 3);
  const plat = platformOf(s.site);
  const kpi = [
    { href: "/hakaru/", l: "AIにすすめられた割合", v: `${sh.pct}`, u: "%", d: diff > 0 ? `先週より +${diff}` : "先週と同じ", good: diff > 0 },
    { href: "/hakaru/", l: "AIの売り場での順位", v: `${pos}`, u: "位", d: `1位は ${rank[0].name === BRAND.name ? "自社" : rank[0].name}`, good: pos === 1 },
    { href: "/kouka/", l: "AI経由の売上（今月）", v: fmt(yen), u: "円", d: `注文 ${m.orders + s.orders.length}件`, good: false },
  ];
  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-3 sm:mb-14">
        <div><p className="text-[0.82rem] text-sub">11月18日（火）の状況</p><h1 className="mt-1 text-[1.5rem] font-bold tracking-[.04em] sm:text-[1.8rem]">{BRAND.name} の今週</h1></div>
        <p className="text-[0.8rem] text-sub">次の自動測定：11月24日（月）{plat ? `・サイト：${plat.name}` : ""}</p>
      </div>

      <section className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="今週の数字">
        {kpi.map((k) => (
          <Link key={k.l} href={k.href} className="card group min-w-0 p-3.5 transition hover:bg-white/[.03] sm:p-7">
            <p className="text-[0.68rem] leading-[1.5] text-sub sm:text-[0.82rem]"><J>{k.l}</J></p>
            <p className="mt-2 whitespace-nowrap sm:mt-3"><b className="num text-[1.02rem] leading-none min-[360px]:text-[1.2rem] sm:text-[2.4rem]">{k.v}</b><span className="ml-0.5 text-[0.75rem] text-sub sm:ml-1 sm:text-base">{k.u}</span></p>
            <p className={`mt-2 text-[0.66rem] leading-[1.5] sm:mt-3 sm:text-[0.8rem] ${k.good ? "text-ai" : "text-sub"}`}>{k.d}</p>
          </Link>
        ))}
      </section>

      <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-12">
        <section aria-labelledby="todo">
          <div className="flex items-end justify-between"><h2 id="todo" className="text-[1.1rem] font-bold">今週やること</h2><Link href="/naosu/" className="flex items-center gap-1 text-[0.82rem] text-ai">直す画面へ<ArrowRight size={15} /></Link></div>
          {todo.length ? (
            <ul className="mt-5 border-t hair">
              {todo.map(({ f, g }, i) => (
                <li key={f.id}><Link href="/naosu/" className="flex items-center gap-4 border-b hair py-4 hover:bg-white/[.02]">
                  <span className="num text-[0.78rem] text-ai">0{i + 1}</span>
                  <span className="min-w-0 flex-1"><b className="block text-[0.95rem] leading-[1.6]">{f.title}</b><span className="text-[0.78rem] text-sub">AIに出る回数 +{fmt(g)}回の見込み・{f.effort}</span></span>
                  <ChevronRight size={18} className="shrink-0 text-sub" />
                </Link></li>
              ))}
            </ul>
          ) : <p className="mt-5 text-[0.9rem] text-sub">今週やることは、すべて終わりました。</p>}
        </section>

        <section aria-labelledby="lose">
          <div className="flex items-end justify-between"><h2 id="lose" className="text-[1.1rem] font-bold">負けている質問</h2><Link href="/hakaru/" className="flex items-center gap-1 text-[0.82rem] text-ai">測る画面へ<ArrowRight size={15} /></Link></div>
          {lose.length ? (
            <ul className="mt-5 border-t hair">
              {lose.map((w) => (
                <li key={w.q.id} className="border-b hair py-4">
                  <p className="text-[0.92rem] leading-[1.7]">{w.q.text}</p>
                  <p className="mt-1 text-[0.78rem] text-sub">いちばん：{w.top}・{BRAND.name}は <span className="num text-warn">{Math.round((w.me / w.max) * 100)}%</span></p>
                </li>
              ))}
            </ul>
          ) : <p className="mt-5 text-[0.9rem] text-sub">すべての質問で、いちばんすすめられています。</p>}
        </section>
      </div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Dashboard /></Ready></Shell>; }
