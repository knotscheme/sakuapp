"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import { BRAND, FIXES, fmt, sales, shelf } from "@/lib/demo";
import { platformOf } from "@/lib/platforms";
import { useStore } from "@/lib/store";
import { healthAll, healthGain } from "@/lib/health";
import { tagKind } from "@/lib/tag";
import J from "@/components/J";
import HomeCharts from "@/components/HomeCharts";

// ツールのホーム：今週の状況と、やることだけを出す
function Dashboard() {
  const s = useStore();
  const sh = shelf(s.applied);
  const m = sales(sh.pct);
  const yen = m.yen + s.orders.reduce((a, o) => a + o.price, 0);
  const h = healthAll(s.applied);
  const todo = FIXES.filter((f) => !s.applied.includes(f.id)).map((f) => ({ f, g: healthGain(f.id, s.applied) })).filter((x) => x.g > 0).sort((a, b) => b.g - a.g).slice(0, 3);
  const plat = platformOf(s.site);
  const live = !!plat && (tagKind(s.site) === "csv" ? s.csv : s.tag === "ok");
  const kpi = [
    { href: "/kenko/", l: "ページの健康スコア", v: `${h.avg}`, u: "点", d: `${h.all.length}商品の平均`, good: h.avg >= 75 },
    { href: "/kouka/", l: "AIから来たお客様（今月）", v: fmt(m.visits), u: "人", d: live ? "計測タグより" : "見込み・タグ未設置", good: false },
    { href: "/kouka/", l: "AI経由の売上（今月）", v: fmt(yen), u: "円", d: `注文 ${m.orders + s.orders.length}件`, good: false },
  ];
  return (
    <>
      <p className="text-[0.82rem] text-sub">{BRAND.name}・11月18日（火）</p>
      <h1 className="mt-1 text-[1.6rem] font-bold tracking-[.04em] sm:text-[2rem]">今週のAI対策</h1>
      <p className="mt-2 text-[0.92rem] text-sub">{todo.length ? <>やることは、あと<b className="num text-ai">{todo.length}</b>つです。</> : "今週のやることは、すべて終わりました。"}</p>

      {/* 数字は3つだけ */}
      <section className="mt-8 grid grid-cols-3 gap-2 sm:gap-4" aria-label="今週の数字">
        {kpi.map((k) => (
          <Link key={k.l} href={k.href} className="card min-w-0 p-3 min-[360px]:p-3.5 transition hover:bg-white/[.03] sm:p-7">
            <p className="text-[0.68rem] leading-[1.5] text-sub sm:text-[0.82rem]"><J>{k.l}</J></p>
            <p className="mt-2 whitespace-nowrap sm:mt-3"><b className={`num text-[0.8rem] leading-none min-[360px]:text-[0.92rem] min-[400px]:text-[1.2rem] sm:text-[2.4rem] ${k.good ? "text-ai" : ""}`}>{k.v}</b><span className="ml-0.5 text-[0.75rem] text-sub sm:ml-1 sm:text-base">{k.u}</span></p>
            <p className="mt-2 text-[0.66rem] leading-[1.5] text-sub sm:mt-3 sm:text-[0.8rem]"><J>{k.d}</J></p>
          </Link>
        ))}
      </section>

      <HomeCharts />

      {/* やることは、上から順に */}
      <section className="mt-14" aria-labelledby="todo">
        <h2 id="todo" className="text-[1.1rem] font-bold">今週やること</h2>
        {todo.length ? (
          <>
            <ol className="mt-4 border-t hair">
              {todo.map(({ f, g }, i) => (
                <li key={f.id} className="flex items-center gap-4 border-b hair py-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[.06] text-[0.78rem] font-bold text-sub">{i + 1}</span>
                  <span className="min-w-0 flex-1"><b className="block text-[0.95rem] leading-[1.6]"><J>{f.title}</J></b><span className="text-[0.78rem] text-sub">+{g}点・{f.effort}</span></span>
                </li>
              ))}
            </ol>
            <Link href="/naosu/" className="btn btn-ai mt-6 w-full sm:w-auto sm:px-10">直しはじめる<ArrowRight size={18} /></Link>
          </>
        ) : <p className="mt-4 text-[0.9rem] text-sub">今週やることは、すべて終わりました。</p>}
      </section>

      <p className="mt-14 text-[0.8rem] leading-[1.9] text-sub">次の自動の点検：11月24日（月）{plat ? `・サイト：${plat.name}` : ""}<br /><Link href="/hakaru/" className="text-ai underline underline-offset-4">AIの中での順位を見る（プロ）</Link><br /><Link href="/manabu/" className="text-ai underline underline-offset-4">AI対策を学ぶ（1レッスン約3分）</Link></p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Dashboard /></Ready></Shell>; }
