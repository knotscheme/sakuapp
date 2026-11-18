"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import { BRAND, FIXES, fmt, sales, shelf } from "@/lib/demo";
import { platformOf } from "@/lib/platforms";
import { useStore } from "@/lib/store";
import { healthAll, healthGain, ITEMS } from "@/lib/health";
import { tagKind } from "@/lib/tag";
import J from "@/components/J";

// ツールのホーム：今週の状況と、やることだけを出す
function Dashboard() {
  const s = useStore();
  const sh = shelf(s.applied);
  const m = sales(sh.pct);
  const yen = m.yen + s.orders.reduce((a, o) => a + o.price, 0);
  const h = healthAll(s.applied);
  const todo = FIXES.filter((f) => !s.applied.includes(f.id)).map((f) => ({ f, g: healthGain(f.id, s.applied) })).filter((x) => x.g > 0).sort((a, b) => b.g - a.g).slice(0, 3);
  const low = [...h.all].sort((a, b) => a.score - b.score);
  const plat = platformOf(s.site);
  const live = !!plat && (tagKind(s.site) === "csv" ? s.csv : s.tag === "ok");
  const kpi = [
    { href: "/kenko/", l: "ページの健康スコア", v: `${h.avg}`, u: "点", d: `${h.all.length}商品の平均`, good: h.avg >= 75 },
    { href: "/kouka/", l: "AIから来たお客様（今月）", v: fmt(m.visits), u: "人", d: live ? "計測タグより" : "見込み・タグ未設置", good: false },
    { href: "/kouka/", l: "AI経由の売上（今月）", v: fmt(yen), u: "円", d: `注文 ${m.orders + s.orders.length}件`, good: false },
  ];
  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-3 sm:mb-14">
        <div><p className="text-[0.82rem] text-sub">11月18日（火）の状況</p><h1 className="mt-1 text-[1.5rem] font-bold tracking-[.04em] sm:text-[1.8rem]">{BRAND.name} の今週</h1></div>
        <p className="text-[0.8rem] text-sub">次の自動の点検：11月24日（月）{plat ? `・サイト：${plat.name}` : ""}</p>
      </div>

      <section className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="今週の数字">
        {kpi.map((k) => (
          <Link key={k.l} href={k.href} className="card group min-w-0 p-3.5 transition hover:bg-white/[.03] sm:p-7">
            <p className="text-[0.68rem] leading-[1.5] text-sub sm:text-[0.82rem]"><J>{k.l}</J></p>
            <p className="mt-2 whitespace-nowrap sm:mt-3"><b className="num text-[1.02rem] leading-none min-[360px]:text-[1.2rem] sm:text-[2.4rem]">{k.v}</b><span className="ml-0.5 text-[0.75rem] text-sub sm:ml-1 sm:text-base">{k.u}</span></p>
            <p className={`mt-2 text-[0.66rem] leading-[1.5] sm:mt-3 sm:text-[0.8rem] ${k.good ? "text-ai" : "text-sub"}`}><J>{k.d}</J></p>
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
                  <span className="min-w-0 flex-1"><b className="block text-[0.95rem] leading-[1.6]"><J>{f.title}</J></b><span className="text-[0.78rem] text-sub">健康スコア +{g}点・{f.effort}</span></span>
                  <ChevronRight size={18} className="shrink-0 text-sub" />
                </Link></li>
              ))}
            </ul>
          ) : <p className="mt-5 text-[0.9rem] text-sub">今週やることは、すべて終わりました。</p>}
        </section>

        <section aria-labelledby="low">
          <div className="flex items-end justify-between"><h2 id="low" className="text-[1.1rem] font-bold">点数の低い商品</h2><Link href="/kenko/" className="flex items-center gap-1 text-[0.82rem] text-ai">診断の画面へ<ArrowRight size={15} /></Link></div>
          <ul className="mt-5 border-t hair">
            {low.map((x) => (
              <li key={x.p.id}><Link href={`/naosu/?p=${x.p.id}`} className="flex items-center gap-4 border-b hair py-4 hover:bg-white/[.02]">
                <span className="min-w-0 flex-1"><span className="block text-[0.92rem] leading-[1.7]"><J>{x.p.name}</J></span><span className="text-[0.78rem] text-sub">足りない項目 {ITEMS.length - x.ok}か所</span></span>
                <span className={`num shrink-0 text-[1rem] font-bold ${x.score >= 75 ? "text-ai" : x.score >= 50 ? "" : "text-warn"}`}>{x.score}点</span>
                <ChevronRight size={18} className="shrink-0 text-sub" />
              </Link></li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Dashboard /></Ready></Shell>; }
