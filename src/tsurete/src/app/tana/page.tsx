"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { AIS, BRAND, PRODUCTS, QUESTIONS, SIGNALS, fmt, shelf, signals, type Sig } from "@/lib/demo";
import { aiReady, askProduct, useAi } from "@/lib/ai";
import { useStore } from "@/lib/store";

const GOOD = 0.6; // よく出ているブランドの目安

function Bar({ v, max, me }: { v: number; max: number; me?: boolean }) {
  return <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-deep"><span className={`block h-full rounded-full transition-all duration-700 ${me ? "bg-ai" : "bg-[#2a3b5c]"}`} style={{ width: `${Math.round((v / max) * 100)}%` }} /></span>;
}

function Real() {
  const ai = useAi();
  const s = useStore();
  const brand = s.real.brand || BRAND.name;
  const [q, setQ] = useState(s.real.item ? `${s.real.item}のおすすめは？` : QUESTIONS[0].text);
  const [res, setRes] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const hit = res && res.toLowerCase().includes(brand.toLowerCase());
  return (
    <section className="card mt-6 p-5" aria-labelledby="real">
      <h2 id="real" className="flex items-center gap-2 text-[1.05rem] font-bold"><Search size={18} className="text-ai" />本物のAIに聞いてみる</h2>
      <p className="mt-1 text-[0.85rem] text-sub">設定でAIのキーを入れると、自分の質問で試せます（ネット検索なしの答えです）。</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} className="field" aria-label="質問" />
        <button type="button" disabled={busy || !q.trim()} onClick={async () => {
          if (!aiReady(ai)) { setErr("先に「設定」でAIのキーを入れてください"); return; }
          setBusy(true); setErr(""); setRes("");
          try { setRes(await askProduct(q)); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
        }} className="btn btn-ai shrink-0">{busy ? "聞いています…" : "聞く"}</button>
      </div>
      {err && <p className="mt-2 text-[0.88rem] text-warn">{err}</p>}
      {res && <>
        <p className={`mt-3 text-[0.9rem] font-bold ${hit ? "text-ai" : "text-warn"}`}>{hit ? `「${brand}」が答えに入っていました` : `「${brand}」は答えに入っていませんでした`}</p>
        <p className="mt-2 whitespace-pre-wrap rounded-xl bg-paper p-3 text-[0.86rem] leading-[1.8]">{res}</p>
      </>}
    </section>
  );
}

function Tana() {
  const s = useStore();
  const sh = shelf(s.applied);
  const base = shelf([]);
  const sig = (k: Sig) => PRODUCTS.reduce((a, p) => a + signals(p.id, s.applied)[k], 0) / PRODUCTS.length;
  const gaps = (Object.keys(SIGNALS) as Sig[]).map((k) => ({ k, v: sig(k) })).sort((a, b) => a.v - b.v);
  const topRival = sh.rivals.slice(0, 5);
  return (
    <>
      <Title n="2" title="棚チェック" lead="お客様が聞きそうな質問を4つのAIに何度も聞いて、SORAEが出た回数を数えました。" />

      <section className="glow rounded-[20px] p-6 text-white" aria-label="出た回数">
        <p className="text-[0.85rem] text-white/60">{QUESTIONS.length}個の質問 × {AIS.length}つのAI × 20回 ＝ {fmt(sh.max)}回聞いて</p>
        <p className="mt-2"><span className="text-[1rem]">{BRAND.name}が出たのは </span><b className="num text-[3rem] leading-none text-lime">{fmt(sh.total)}</b><span className="text-[1rem]"> 回</span><span className="num ml-3 text-[1.1rem] text-white/70">{sh.pct}%</span></p>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-lime transition-all duration-700" style={{ width: `${sh.pct}%` }} /></div>
        {sh.total !== base.total && <p className="mt-3 text-[0.88rem] text-white/75">直す前は {fmt(base.total)}回（{base.pct}%）でした。</p>}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="card p-5" aria-labelledby="gap">
          <h2 id="gap" className="text-[1.05rem] font-bold">出ない理由</h2>
          <p className="mt-1 text-[0.82rem] text-sub">AIが見ている情報の、そろい具合（線の位置が、よく出るブランドの目安）</p>
          <ul className="mt-4 space-y-3">
            {gaps.map(({ k, v }) => (
              <li key={k}>
                <p className="flex justify-between text-[0.88rem]"><span>{SIGNALS[k]}</span><span className={`num ${v < GOOD * 0.7 ? "text-warn" : "text-ai"}`}>{Math.round(v * 100)}</span></p>
                <div className="relative mt-1 h-2 rounded-full bg-deep"><div className={`h-full rounded-full transition-all duration-700 ${v < GOOD * 0.7 ? "bg-warn" : "bg-ai"}`} style={{ width: `${Math.round(v * 100)}%` }} /><i className="absolute -top-1 h-4 w-px bg-white/50" style={{ left: `${GOOD * 100}%` }} /></div>
              </li>
            ))}
          </ul>
          <Link href="/naosu/" className="btn btn-ai mt-5 w-full sm:w-auto">直すことを見る<ArrowRight size={18} /></Link>
        </section>

        <div className="space-y-5">
          <section className="card p-5" aria-labelledby="riv">
            <h2 id="riv" className="text-[1.05rem] font-bold">代わりに出ているブランド</h2>
            <ul className="mt-3 space-y-2">
              {[...topRival, { name: BRAND.name, n: sh.total, me: true }].sort((a, b) => b.n - a.n).map((r) => (
                <li key={r.name} className="flex items-center gap-3 text-[0.88rem]"><span className={`w-[7.5em] shrink-0 truncate ${"me" in r ? "font-bold text-ai" : ""}`}>{r.name}</span><Bar v={r.n} max={sh.max / 3} me={"me" in r} /><span className="num w-12 text-right text-sub">{fmt(r.n)}</span></li>
              ))}
            </ul>
          </section>
          <section className="card p-5" aria-labelledby="pr">
            <h2 id="pr" className="text-[1.05rem] font-bold">商品・AIごと</h2>
            <ul className="mt-3 space-y-2">
              {sh.byProduct.map((x) => <li key={x.p.id} className="flex items-center gap-3 text-[0.88rem]"><span className="w-[7.5em] shrink-0">{x.p.short}</span><Bar v={x.n} max={x.max} me /><span className="num w-12 text-right">{Math.round((x.n / x.max) * 100)}%</span></li>)}
            </ul>
            <ul className="mt-4 space-y-2 border-t border-line pt-4">
              {sh.byAi.map((x) => <li key={x.ai} className="flex items-center gap-3 text-[0.88rem]"><span className="w-[7.5em] shrink-0">{x.ai}</span><Bar v={x.n} max={x.max} me /><span className="num w-12 text-right">{Math.round((x.n / x.max) * 100)}%</span></li>)}
            </ul>
          </section>
        </div>
      </div>

      <section className="card mt-5 overflow-hidden p-0" aria-labelledby="qt">
        <h2 id="qt" className="px-5 pt-4 text-[1.05rem] font-bold">質問ごと（20回のうち出た回数）</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-[0.85rem]">
            <thead className="bg-paper text-left text-[0.78rem] text-sub"><tr><th className="px-4 py-2 font-medium">お客様の質問</th>{AIS.map((a) => <th key={a} className="px-2 py-2 text-center font-medium">{a}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {sh.rows.map((r) => <tr key={r.q.id}><td className="px-4 py-2.5">{r.q.text}</td>{r.by.map((n, i) => <td key={i} className="px-2 text-center"><span className={`num inline-block min-w-[2.4em] rounded-md px-1.5 py-0.5 ${n >= 12 ? "bg-ai/30 text-ai" : n >= 6 ? "bg-ai/10" : "bg-warn/15 text-warn"}`}>{n}</span></td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <Real />
    </>
  );
}

export default function Page() { return <Shell><Ready><Tana /></Ready></Shell>; }
