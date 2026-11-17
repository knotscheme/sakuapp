"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Loader2, Search, Sparkles, TrendingUp, Wand2 } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { toast } from "@/components/Confirm";
import { aiReady, askRecommend, useAi } from "@/lib/ai";
import { ACTIONS, AIS, SHOP, SIGNALS, simulate } from "@/lib/demo";
import { update, useStore } from "@/lib/store";

const THIS_WEEK = "11/18";

function Chart({ data }: { data: { week: string; share: number }[] }) {
  const W = 560, H = 180, P = 28, max = 100;
  const x = (i: number) => P + (i * (W - P * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) => H - P - (v / max) * (H - P * 2);
  const d = data.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.share)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`AI推薦シェアの変化。いまは${data[data.length - 1].share}%`}>
      {[0, 25, 50, 75, 100].map((v) => <g key={v}><line x1={P} x2={W - P} y1={y(v)} y2={y(v)} stroke="#e3e2dc" strokeDasharray={v ? "3 4" : ""} /><text x={4} y={y(v) + 4} fontSize="10" fill="#8a8c99">{v}%</text></g>)}
      <path d={`${d} L${x(data.length - 1)},${H - P} L${x(0)},${H - P} Z`} fill="url(#g)" opacity=".5" />
      <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6d4aff" stopOpacity=".35" /><stop offset="1" stopColor="#6d4aff" stopOpacity="0" /></linearGradient></defs>
      <path d={d} fill="none" stroke="#6d4aff" strokeWidth="3" strokeLinejoin="round" />
      {data.map((p, i) => <g key={i}><circle cx={x(i)} cy={y(p.share)} r={i === data.length - 1 ? 6 : 4} fill={i === data.length - 1 ? "#6d4aff" : "#fff"} stroke="#6d4aff" strokeWidth="2" /><text x={x(i)} y={H - 8} fontSize="10" fill="#8a8c99" textAnchor="middle">{p.week}</text></g>)}
    </svg>
  );
}

function Erabareru() {
  const s = useStore();
  const ai = useAi();
  const sim = simulate(s.applied);
  const before = simulate([]).share;
  const hist = [...s.history.filter((h) => h.week !== THIS_WEEK), { week: THIS_WEEK, share: sim.share }];
  const [filter, setFilter] = useState("");
  const [real, setReal] = useState<{ text: string; hit: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const apply = (id: string) => {
    const was = sim.share;
    update((x) => ({ ...x, applied: [...x.applied, id], windowOn: id === "today" ? true : x.windowOn }));
    const now = simulate([...s.applied, id]).share;
    toast(`AI推薦シェア ${was}% → ${now}%`);
  };
  async function tryReal() {
    const name = s.real.name || SHOP.name, area = s.real.area || SHOP.area, kind = s.real.kind || SHOP.kind;
    setBusy(true); setReal(null);
    try { const text = await askRecommend(area, kind); setReal({ text, hit: text.replace(/\s/g, "").includes(name.replace(/\s/g, "")) }); }
    catch (e) { toast((e as Error).message); } finally { setBusy(false); }
  }
  const rows = sim.rows.filter((r) => !filter || r.tags.includes(filter));
  const qs = [...new Set(rows.map((r) => r.q))];

  return (
    <>
      <Title n="1" title="AIに選ばれる" lead={<>お客様は、お店を「検索」ではなく<b className="text-ink">「AIに聞いて」</b>探しはじめています。お客様が聞きそうな質問を{sim.rows.length / AIS.length}通り作り、4つのAIに聞いて、{SHOP.name}が<b className="text-ink">おすすめに入った割合</b>を測りました。</>} />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
        <section className="glow rounded-[22px] p-6 text-white" aria-label="AI推薦シェア">
          <p className="text-[0.85rem] text-white/60">AI推薦シェア（おすすめの上位3つに入った割合）</p>
          <p className="num mt-1 text-[4rem] font-bold leading-none text-lime">{sim.share}<span className="text-[1.6rem]">%</span></p>
          {sim.share !== before && <p className="mt-2 flex items-center gap-1 text-[0.9rem] text-white/80"><TrendingUp size={16} className="text-lime" />改善の前 {before}% から +{sim.share - before}ポイント</p>}
          <ul className="mt-5 space-y-2.5">
            {sim.byAi.map((b) => (
              <li key={b.ai}><div className="flex justify-between text-[0.85rem]"><span>{b.ai}</span><span className="num">{b.share}%</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-lime transition-all duration-700" style={{ width: `${b.share}%` }} /></div></li>
            ))}
          </ul>
        </section>
        <section className="card p-5 sm:p-6" aria-labelledby="ch">
          <h2 id="ch" className="text-[1.05rem] font-bold">これまでの変化</h2>
          <Chart data={hist} />
          <h3 className="mt-2 text-[0.95rem] font-bold">近くのお店とくらべる</h3>
          <ul className="mt-2 space-y-1.5">
            {[{ name: SHOP.name, share: sim.share, me: true }, ...sim.rival].sort((a, b) => b.share - a.share).map((r) => (
              <li key={r.name} className="flex items-center gap-3 text-[0.9rem]"><span className={`w-[9em] shrink-0 truncate ${"me" in r ? "font-bold text-ai" : ""}`}>{r.name}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper"><span className={`block h-full rounded-full transition-all duration-700 ${"me" in r ? "bg-ai" : "bg-[#c9c7bf]"}`} style={{ width: `${r.share}%` }} /></span><span className="num w-10 text-right">{r.share}%</span></li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6" aria-labelledby="why">
        <h2 id="why" className="text-[1.25rem] font-bold">選ばれていない理由</h2>
        <p className="mt-1 text-[0.92rem] text-sub">お客様が気にすることごとに、おすすめから外れた質問の数です。</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sim.weak.filter((w) => w.miss).slice(0, 6).map((w) => (
            <li key={w.k} className="card p-4">
              <div className="flex items-center justify-between"><b className="text-[1rem]">{w.label}</b><span className="chip bg-[#fff1e3] text-warn">{w.miss}/{w.total} 外れ</span></div>
              <p className="mt-1 text-[0.85rem] text-sub">{w.win ? `代わりに「${w.win}」が選ばれています` : ""}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper"><div className="h-full rounded-full bg-ai" style={{ width: `${Math.round((sim.me[w.k] ?? 0) * 100)}%` }} /></div>
              <p className="mt-1 text-[0.75rem] text-sub">AIへの伝わり方 {Math.round((sim.me[w.k] ?? 0) * 100)}%</p>
            </li>
          ))}
          {sim.weak.every((w) => !w.miss) && <li className="card p-4 text-[0.95rem]">外れている質問は、ありません。</li>}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="act">
        <h2 id="act" className="flex items-center gap-2 text-[1.25rem] font-bold"><Wand2 size={22} className="text-ai" />選ばれるための打ち手</h2>
        <p className="mt-1 text-[0.92rem] text-sub">効き目の大きい順に並べています。「入れる」を押すと、AI推薦シェアがどう変わるかを計算し直します（デモ）。</p>
        <ol className="mt-3 space-y-3">
          {ACTIONS.map((a) => {
            const done = s.applied.includes(a.id);
            const gain = done ? 0 : simulate([...s.applied, a.id]).share - sim.share;
            return (
              <li key={a.id} className={`card flex flex-col gap-3 p-5 sm:flex-row sm:items-center ${done ? "border-ok/40 bg-[#f4fbf7]" : ""}`}>
                <div className="min-w-0 flex-1">
                  <b className="block text-[1.02rem] leading-[1.6]">{a.title}</b>
                  <p className="mt-1 text-[0.88rem] leading-[1.8] text-sub">{a.why}</p>
                  <p className="mt-1.5 flex flex-wrap gap-1.5"><span className="chip bg-paper text-sub">手間：{a.effort}</span>{Object.keys(a.up).map((k) => <span key={k} className="chip bg-ai-2 text-ai">{SIGNALS[k]}</span>)}</p>
                </div>
                {done ? <span className="chip shrink-0 bg-ok text-white"><Check size={14} />入れました</span>
                  : <button type="button" onClick={() => apply(a.id)} className="btn btn-ai shrink-0">{gain > 0 ? `入れる（+${gain}ポイント）` : "入れる"}</button>}
              </li>
            );
          })}
        </ol>
        {s.applied.includes("today") && <p className="mt-3 text-[0.9rem]"><Link href="/yoyaku/" className="font-bold text-ai underline">②AI予約窓口</Link>を公開しました。AIが空き状況を確かめられるようになっています。</p>}
      </section>

      <section className="mt-8" aria-labelledby="qs">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="qs" className="text-[1.25rem] font-bold">質問ごとの結果</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="field w-auto" aria-label="お客様が気にすること で絞る"><option value="">すべての質問</option>{Object.entries(SIGNALS).filter(([k]) => k !== "base").map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        </div>
        <div className="card mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-[0.88rem]">
            <thead className="bg-paper text-left text-[0.8rem] text-sub"><tr><th className="px-4 py-2.5 font-medium">お客様の質問</th>{AIS.map((a) => <th key={a} className="px-2 py-2.5 text-center font-medium">{a}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {qs.map((q) => (
                <tr key={q}><td className="px-4 py-2.5">{q}</td>
                  {AIS.map((a) => { const r = rows.find((x) => x.q === q && x.ai === a)!; return <td key={a} className="px-2 py-2.5 text-center">{r.mine ? <span className="chip bg-ai text-white">{r.mine}位</span> : <span className="text-[0.8rem] text-sub" title={`1位：${r.top[0]}`}>外</span>}</td>; })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[0.8rem] text-sub">※デモの結果は、決まった計算で作った模擬の結果です。架空の町・架空のお店です。</p>
      </section>

      <section className="card mt-8 p-5 sm:p-6" aria-labelledby="real">
        <h2 id="real" className="flex items-center gap-2 text-[1.15rem] font-bold"><Search size={20} className="text-ai" />自分のお店で、本当に試す</h2>
        <p className="mt-1 text-[0.92rem] text-sub">設定で入れたAIのキーを使って、「{s.real.area || SHOP.area}でおすすめの{s.real.kind || SHOP.kind}は？」と本当に聞き、{s.real.name || SHOP.name}が出てくるかを確かめます。</p>
        {aiReady(ai) ? (
          <button type="button" disabled={busy} onClick={tryReal} className="btn btn-ink mt-3">{busy ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}AIに聞いてみる</button>
        ) : <p className="mt-3 text-[0.92rem]"><Link href="/settings/" className="font-bold text-ai underline">設定</Link>で、お店の名前・地域と、AIのキーを入れると試せます。</p>}
        {real && (
          <div className="mt-4 rounded-2xl bg-paper p-4">
            <p className={`font-bold ${real.hit ? "text-ok" : "text-warn"}`}>{real.hit ? "おすすめに入っていました" : "おすすめに入っていませんでした"}</p>
            <p className="mt-2 whitespace-pre-wrap text-[0.9rem] leading-[1.8]">{real.text}</p>
          </div>
        )}
      </section>
      <div className="mt-8"><Link href="/yoyaku/" className="btn btn-ai">次は「AIが予約できる」<ArrowRight size={18} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Erabareru /></Ready></Shell>; }
