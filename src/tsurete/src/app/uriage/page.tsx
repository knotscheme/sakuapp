"use client";

import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { PAST, PRODUCTS, fmt, sales, shelf } from "@/lib/demo";
import { useStore } from "@/lib/store";

function Uriage() {
  const s = useStore();
  const sh = shelf(s.applied), base = shelf([]);
  const m = sales(sh.pct), m0 = sales(base.pct);
  const extraYen = s.orders.reduce((a, o) => a + o.price, 0);
  const weeks = [...PAST, { w: "今週", o: Math.round(m.orders / 4) + s.orders.length, now: true }];
  const top = Math.max(...weeks.map((w) => w.o), 4);
  const kpi = [
    { l: "AIから来たお客様", v: `${fmt(m.visits)}人`, d: m.visits - m0.visits, u: "人" },
    { l: "注文", v: `${fmt(m.orders + s.orders.length)}件`, d: m.orders - m0.orders + s.orders.length, u: "件" },
    { l: "売上", v: `${fmt(m.yen + extraYen)}円`, d: m.yen - m0.yen + extraYen, u: "円" },
  ];
  const byAiTotal = sh.byAi.reduce((a, x) => a + x.n, 0) || 1;
  return (
    <>
      <Title n="4" title="売れたか" lead="AIのおすすめから来たお客様と、その売上です（今月の見込み）。" />
      <div className="grid gap-3 sm:grid-cols-3">
        {kpi.map((k) => <div key={k.l} className="card p-5"><p className="text-[0.85rem] text-sub">{k.l}</p><p className="num mt-1 text-[1.9rem] font-bold">{k.v}</p><p className={`num text-[0.82rem] ${k.d > 0 ? "text-ai" : "text-sub"}`}>{k.d > 0 ? `直す前より +${fmt(k.d)}${k.u}` : "直す前と同じ"}</p></div>)}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-5" aria-labelledby="wk">
          <h2 id="wk" className="text-[1.05rem] font-bold">週ごとの注文（AI経由）</h2>
          <div className="mt-5 flex h-44 items-end gap-2" role="img" aria-label="週ごとの注文数のグラフ">
            {weeks.map((w) => (
              <div key={w.w} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                <span className="num text-[0.75rem] text-sub">{w.o}</span>
                <span className={`w-full max-w-[2.4rem] rounded-t-md transition-all duration-700 ${"now" in w ? "bg-ai" : "bg-[#2a3b5c]"}`} style={{ height: `${(w.o / top) * 100}%` }} />
                <span className={`text-[0.68rem] ${"now" in w ? "font-bold text-ai" : "text-sub"}`}>{w.w}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card p-5" aria-labelledby="by">
          <h2 id="by" className="text-[1.05rem] font-bold">どのAIから来たか</h2>
          <ul className="mt-4 space-y-3">
            {sh.byAi.map((x) => { const p = Math.round((x.n / byAiTotal) * 100); return <li key={x.ai} className="flex items-center gap-3 text-[0.88rem]"><span className="w-[6.5em] shrink-0">{x.ai}</span><span className="h-2 flex-1 overflow-hidden rounded-full bg-deep"><span className="block h-full rounded-full bg-ai" style={{ width: `${p}%` }} /></span><span className="num w-10 text-right">{p}%</span></li>; })}
          </ul>
          <p className="mt-4 text-[0.78rem] leading-[1.7] text-sub">AIのサイトから来た人を、ショップ側で見分けて数えます。</p>
        </section>
      </div>

      <section className="card mt-5 p-5" aria-labelledby="od">
        <h2 id="od" className="text-[1.05rem] font-bold">「お客様のAI画面」から買われた注文</h2>
        {s.orders.length === 0 ? <p className="mt-2 text-[0.88rem] text-sub">まだありません。「お客様のAI画面」でSORAEの「商品を見る」→「買う」を押すと、ここに入ります。</p> : (
          <ul className="mt-3 divide-y divide-line">
            {s.orders.slice(0, 8).map((o) => <li key={o.id} className="flex flex-wrap items-baseline gap-x-3 py-2 text-[0.9rem]"><b>{PRODUCTS.find((p) => p.id === o.product)?.short}</b><span className="num">{fmt(o.price)}円</span><span className="chip bg-ai-2 text-ai">{o.ai}経由</span><span className="num ml-auto text-[0.78rem] text-sub">{new Date(o.at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</span></li>)}
          </ul>
        )}
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Uriage /></Ready></Shell>; }
