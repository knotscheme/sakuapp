"use client";

import Link from "next/link";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { PAST, PRODUCTS, fmt, sales, shelf } from "@/lib/demo";
import { useStore } from "@/lib/store";

function Uriage() {
  const s = useStore();
  const sh = shelf(s.applied), base = shelf([]);
  const m = sales(sh.pct), m0 = sales(base.pct);
  const extra = s.orders.reduce((a, o) => a + o.price, 0);
  const weeks = [...PAST, { w: "今週", o: Math.round(m.orders / 4) + s.orders.length, now: true }];
  const top = Math.max(...weeks.map((w) => w.o), 4);
  const tot = sh.byAi.reduce((a, x) => a + x.n, 0) || 1;
  const yen = m.yen + extra;
  return (
    <>
      <Title n="3" title="売上" lead="AIにすすめられて来たお客様と、その売上です（今月の見込み）。直した効果を、お金で確かめます。" />

      <section className="grid gap-12 sm:grid-cols-3 sm:gap-8" aria-label="今月">
        <div><p className="text-[0.85rem] text-sub">AI経由の売上</p><p className="num mt-2 text-[2.6rem] font-bold leading-none">{fmt(yen)}<span className="ml-1 text-[1rem] text-sub">円</span></p><p className={`num mt-3 text-[0.85rem] ${yen > m0.yen ? "text-ai" : "text-sub"}`}>{yen > m0.yen ? `直す前より +${fmt(yen - m0.yen)}円` : "直す前と同じ"}</p></div>
        <div><p className="text-[0.85rem] text-sub">AIから来たお客様</p><p className="num mt-2 text-[2.6rem] font-bold leading-none">{fmt(m.visits)}<span className="ml-1 text-[1rem] text-sub">人</span></p></div>
        <div><p className="text-[0.85rem] text-sub">注文</p><p className="num mt-2 text-[2.6rem] font-bold leading-none">{m.orders + s.orders.length}<span className="ml-1 text-[1rem] text-sub">件</span></p></div>
      </section>

      <section className="mt-24" aria-labelledby="wk">
        <h2 id="wk" className="text-[1.2rem] font-bold tracking-[.04em]">週ごとの注文（AI経由）</h2>
        <div className="mt-10 flex h-48 items-end gap-2 sm:gap-4" role="img" aria-label="週ごとの注文数のグラフ">
          {weeks.map((w) => (
            <div key={w.w} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <span className="num text-[0.75rem] text-sub">{w.o}</span>
              <span className={`w-full max-w-[2.2rem] rounded-full transition-all duration-700 ${"now" in w ? "bg-ai" : "bg-white/[.08]"}`} style={{ height: `${(w.o / top) * 100}%` }} />
              <span className={`text-[0.68rem] ${"now" in w ? "font-bold text-ai" : "text-sub"}`}>{w.w}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24" aria-labelledby="by">
        <h2 id="by" className="text-[1.2rem] font-bold tracking-[.04em]">どのAIから来たか</h2>
        <ul className="mt-8 border-t hair">
          {sh.byAi.map((x) => { const p = Math.round((x.n / tot) * 100); return <li key={x.ai} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-4 border-b hair py-4 text-[0.92rem]"><span>{x.ai}</span><span className="h-1.5 overflow-hidden rounded-full bg-white/[.06]"><span className="block h-full rounded-full bg-ai" style={{ width: `${p}%` }} /></span><span className="num text-right">{p}%</span></li>; })}
        </ul>
        <p className="mt-5 text-[0.8rem] leading-[1.9] text-sub">AIのサイトから来たお客様を、リンクに付けた目印とアクセス元で見分けて数えます。どのサイトでも、計測用のタグを1行入れるだけで使えます。</p>
      </section>

      <section className="mt-24" aria-labelledby="od">
        <h2 id="od" className="text-[1.2rem] font-bold tracking-[.04em]">デモの中で買われた注文</h2>
        {s.orders.length === 0 ? <p className="mt-4 text-[0.9rem] leading-[1.9] text-sub">まだありません。「<Link href="/hakaru/" className="text-ai underline underline-offset-4">測る</Link>」の「お客様がAIに聞くと」で、{"SORAE"}の「商品を見る」→「買う」を押すと、ここに入ります。</p> : (
          <ul className="mt-6 border-t hair">{s.orders.slice(0, 8).map((o) => <li key={o.id} className="flex flex-wrap items-baseline gap-x-4 border-b hair py-4 text-[0.92rem]"><b>{PRODUCTS.find((p) => p.id === o.product)?.short}</b><span className="num">{fmt(o.price)}円</span><span className="text-[0.82rem] text-ai">{o.ai}経由</span><span className="num ml-auto text-[0.78rem] text-sub">{new Date(o.at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</span></li>)}</ul>
        )}
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Uriage /></Ready></Shell>; }
