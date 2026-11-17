"use client";

import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { ChatSim, Real } from "@/components/ChatSim";
import { AIS, BRAND, PRODUCTS, QUESTIONS, RIVAL_HAS, SIGNALS, WEEKS, fmt, shelf, signals, winners, type Sig } from "@/lib/demo";
import { useStore } from "@/lib/store";
import J from "@/components/J";

// 週ごとの推薦率の折れ線
function Trend({ data, W = 640, H = 180, fs = 10 }: { data: { w: string; p: number }[]; W?: number; H?: number; fs?: number }) {
  const P = 28, max = 80;
  const x = (i: number) => P + (i * (W - P * 2)) / (data.length - 1), y = (v: number) => H - P - (v / max) * (H - P * 2);
  const d = data.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.p)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="週ごとのAI推薦率のグラフ">
      {[0, 40, 80].map((v) => <g key={v}><line x1={P} x2={W - P} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,.06)" /><text x={0} y={y(v) + 4} fontSize={fs} fill="#6b7b98">{v}%</text></g>)}
      <path d={d} fill="none" stroke="#10d9a0" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((p, i) => <g key={p.w}><circle cx={x(i)} cy={y(p.p)} r={i === data.length - 1 ? 5 : 3} fill={i === data.length - 1 ? "#10d9a0" : "#0b1426"} stroke="#10d9a0" strokeWidth="2" />{(W > 400 || i % 2 === 0 || i === data.length - 1) && <text x={x(i)} y={H - 6} fontSize={fs} fill={i === data.length - 1 ? "#10d9a0" : "#6b7b98"} textAnchor="middle">{p.w}</text>}</g>)}
    </svg>
  );
}

function Hakaru() {
  const s = useStore();
  const sh = shelf(s.applied);
  const data = [...WEEKS, { w: "今週", p: sh.pct }];
  const diff = sh.pct - WEEKS[WEEKS.length - 1].p;
  const rank = [...sh.rivals.slice(0, 4), { name: BRAND.name, n: sh.total }].sort((a, b) => b.n - a.n);
  const myPos = rank.findIndex((r) => r.name === BRAND.name) + 1;
  const mine = (k: Sig) => PRODUCTS.reduce((a, p) => a + signals(p.id, s.applied)[k], 0) / PRODUCTS.length >= 0.4;
  const cols = [BRAND.name, ...Object.keys(RIVAL_HAS)];
  const win = winners(s.applied);
  return (
    <>
      <Title n="1" title="測る" lead="お客様が聞きそうな質問を、TSURETEが毎週自動で4つのAIに何度も聞いて、あなたの商品が何回すすめられたかを記録します。" />

      <section aria-label="今週の結果" className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-16">
        <div>
          <p className="text-[0.85rem] text-sub">今週、AIにすすめられた割合</p>
          <p className="mt-2"><b className="num text-[4.2rem] leading-none text-ai">{sh.pct}</b><span className="ml-1 text-[1.2rem] text-sub">%</span></p>
          <p className={`num mt-3 text-[0.88rem] ${diff > 0 ? "text-ai" : "text-sub"}`}>{diff > 0 ? `先週より +${diff}ポイント` : diff < 0 ? `先週より ${diff}ポイント` : "先週と同じ"}</p>
          <p className="mt-6 text-[0.8rem] leading-[1.9] text-sub">{QUESTIONS.length}個の質問 × {AIS.length}つのAI × 20回<br />＝ {fmt(sh.max)}回聞いて、{fmt(sh.total)}回<br />次の自動測定：11月24日（月）</p>
        </div>
        <div className="min-w-0"><div className="hidden sm:block"><Trend data={data} /></div><div className="sm:hidden"><Trend data={data} W={360} H={200} fs={12} /></div></div>
      </section>

      <section className="mt-24" aria-labelledby="rk">
        <h2 id="rk" className="text-[1.2rem] font-bold tracking-[.04em]">AIの売り場での順位</h2>
        <p className="mt-2 text-[0.88rem] text-sub"><J>同じ質問で、どのブランドがすすめられたか。</J><span className="whitespace-nowrap">いまは <b className="text-ink">{myPos}位</b> です。</span></p>
        <ol className="mt-8 border-t hair">
          {rank.map((r, i) => {
            const me = r.name === BRAND.name;
            return (
              <li key={r.name} className="grid grid-cols-[2rem_7.5rem_1fr_3.5rem] items-center gap-4 border-b hair py-4 text-[0.92rem] sm:grid-cols-[2.5rem_10rem_1fr_4rem]">
                <span className={`num ${me ? "text-ai" : "text-sub"}`}>{i + 1}</span>
                <b className={`truncate ${me ? "text-ai" : ""}`}>{r.name}</b>
                <span className="h-1.5 overflow-hidden rounded-full bg-white/[.06]"><span className={`block h-full rounded-full transition-all duration-700 ${me ? "bg-ai" : "bg-[#2a3b5c]"}`} style={{ width: `${(r.n / rank[0].n) * 100}%` }} /></span>
                <span className="num text-right text-sub">{Math.round((r.n / sh.max) * 100)}%</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-24" aria-labelledby="gap">
        <h2 id="gap" className="text-[1.2rem] font-bold tracking-[.04em]">よくすすめられている店との差</h2>
        <p className="mt-2 text-[0.88rem] leading-[1.9] text-sub"><J>AIが答えるときに参考にしたページを読んで、書かれていることを比べました。</J></p>
        <div className="mt-8">
          <table className="w-full table-fixed text-[0.8rem] sm:text-[0.88rem]">
            <thead><tr className="border-b hair text-left text-[0.78rem] text-sub"><th className="w-[33%] py-3 min-[360px]:w-[38%] font-medium sm:w-auto"><J>AIが見ている情報</J></th>{cols.map((c) => <th key={c} className={`px-0.5 py-3 text-center text-[0.66rem] font-bold leading-[1.3] sm:px-2 sm:text-[0.78rem] ${c === BRAND.name ? "text-ai" : ""}`}>{c.includes(" ") ? <J>{c}</J> : <span className="whitespace-nowrap">{c}</span>}</th>)}</tr></thead>
            <tbody>
              {(Object.keys(SIGNALS) as Sig[]).map((k) => (
                <tr key={k} className="border-b hair">
                  <td className="py-3.5 pr-2 leading-[1.5]"><J>{SIGNALS[k]}</J></td>
                  {cols.map((c) => { const ok = c === BRAND.name ? mine(k) : RIVAL_HAS[c].includes(k); return <td key={c} className="px-2 text-center">{ok ? <Check size={17} className="mx-auto text-ai" /> : c === BRAND.name ? <span className="text-[0.75rem] font-bold text-warn">なし</span> : <Minus size={15} className="mx-auto text-sub/50" />}</td>; })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/naosu/" className="btn btn-ai mt-10 px-7">この差を直す<ArrowRight size={18} /></Link>
      </section>

      <section className="mt-24" aria-labelledby="qs">
        <h2 id="qs" className="text-[1.2rem] font-bold tracking-[.04em]">質問ごとの結果</h2>
        <ul className="mt-8 border-t hair">
          {win.map((r) => (
            <li key={r.q.id} className="grid gap-x-6 gap-y-1 border-b hair py-4 sm:grid-cols-[1fr_9rem_6rem] sm:items-center">
              <span className="text-[0.92rem]"><J>{r.q.text}</J></span>
              <span className="text-[0.8rem] text-sub">いちばん：<b className={r.top === BRAND.name ? "text-ai" : "text-ink"}>{r.top}</b></span>
              <span className={`num text-[0.85rem] sm:text-right ${r.me / r.max >= 0.5 ? "text-ai" : "text-warn"}`}>{BRAND.name} {Math.round((r.me / r.max) * 100)}%</span>
            </li>
          ))}
        </ul>
      </section>

      <ChatSim />
      <Real />
    </>
  );
}

export default function Page() { return <Shell><Ready><Hakaru /></Ready></Shell>; }
