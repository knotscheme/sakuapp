"use client";

// ホームの分析グラフ：週ごとの推移（波線）・AI別のすすめられた割合（円）・商品ごとの健康スコア（棒）
// 数字はデモの状態（「直す」で反映したもの）から計算する。架空のブランドでの模擬の結果
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { daily, metrics } from "@/lib/demo";
import { healthAll } from "@/lib/health";
import { useStore } from "@/lib/store";

const A = "#1f5ad1", B = "#8db0ef", SUB = "#6b7b98", GRID = "rgba(11,30,61,.08)";
const DC = ["#1f5ad1", "#8db0ef", "#a78bfa", "#f2b84b"];
function smooth(p: [number, number][]) { return p.map((q, i) => { if (!i) return `M${q[0]},${q[1]}`; const a = p[i - 1], dx = (q[0] - a[0]) / 2; return `C${a[0] + dx},${a[1]} ${q[0] - dx},${q[1]} ${q[0]},${q[1]}`; }).join(" "); }

export default function HomeCharts() {
  const s = useStore();
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);
  const d = daily(s.applied, 12), m = metrics(s.applied), h = healthAll(s.applied);
  const W = 560, H = 190, P = 26, max = Math.max(20, ...d.flatMap((x) => [x.pct, x.cite])) * 1.2;
  const x = (i: number) => P + (i * (W - P * 2)) / (d.length - 1), y = (v: number) => H - P - (v / max) * (H - P * 2);
  const pa = d.map((v, i) => [x(i), y(v.pct)] as [number, number]), pb = d.map((v, i) => [x(i), y(v.cite)] as [number, number]);
  const sum = m.byAi.reduce((a, b) => a + b.pct, 0) || 1, R = 46, C = 2 * Math.PI * R; let acc = 0;
  const first = d[0], last = d[d.length - 1];
  return (
    <section className="mt-10 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[1.6fr_1fr]" aria-label="分析">
      <div className="card min-w-0 p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1"><b className="text-[0.98rem]">週ごとの推移</b><span className="ml-auto flex gap-3 text-[0.72rem] text-sub"><span className="flex items-center gap-1.5"><i className="h-1.5 w-3 rounded-full" style={{ background: A }} />すすめられた割合</span><span className="flex items-center gap-1.5"><i className="h-1.5 w-3 rounded-full" style={{ background: B }} />サイトが根拠に</span></span></p>
        <p className="mt-1 text-[0.78rem] text-sub">12週前 {first.pct}% → 今週 <b className="text-ai">{last.pct}%</b></p>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 block h-auto w-full" role="img" aria-label="週ごとの推移のグラフ">
          <defs><linearGradient id="hcg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={A} stopOpacity=".28" /><stop offset="1" stopColor={A} stopOpacity="0" /></linearGradient></defs>
          {[0, 0.5, 1].map((f) => <g key={f}><line x1={P} x2={W - P} y1={y(max * f)} y2={y(max * f)} stroke={GRID} /><text x={0} y={y(max * f) + 4} fontSize="10" fill={SUB}>{Math.round(max * f)}%</text></g>)}
          <path d={`${smooth(pa)} L${x(d.length - 1)},${H - P} L${x(0)},${H - P} Z`} fill="url(#hcg)" style={{ opacity: on ? 1 : 0, transition: "opacity 1s .8s" }} />
          <path d={smooth(pb)} fill="none" stroke={B} strokeWidth="2" strokeDasharray="1200" style={{ strokeDashoffset: on ? 0 : 1200, transition: "stroke-dashoffset 1.6s ease-out .15s" }} />
          <path d={smooth(pa)} fill="none" stroke={A} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="1200" style={{ strokeDashoffset: on ? 0 : 1200, transition: "stroke-dashoffset 1.6s ease-out" }} />
          <circle cx={x(d.length - 1)} cy={y(last.pct)} r="4.5" fill="#ffffff" stroke={A} strokeWidth="2.4" />
          {d.map((v, i) => (i % 3 === 2 || i === d.length - 1) && <text key={i} x={x(i)} y={H - 6} fontSize="10" fill={SUB} textAnchor={i === d.length - 1 ? "end" : "middle"}>{v.d}</text>)}
        </svg>
      </div>
      <div className="card min-w-0 p-5 sm:p-6">
        <b className="text-[0.98rem]">AI別のすすめられた割合</b>
        <div className="mt-3 flex items-center gap-5">
          <svg viewBox="0 0 120 120" className="h-[108px] w-[108px] shrink-0 -rotate-90" role="img" aria-label="AI別の円グラフ">
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(11,30,61,.08)" strokeWidth="16" />
            {m.byAi.map((a, i) => { const len = (a.pct / sum) * C, off = acc; acc += len; return <circle key={a.ai} cx="60" cy="60" r={R} fill="none" stroke={DC[i % 4]} strokeWidth="16" strokeDasharray={`${on ? len : 0} ${C}`} strokeDashoffset={-off} style={{ transition: `stroke-dasharray 1.1s ease-out ${200 + i * 150}ms` }} />; })}
          </svg>
          <ul className="min-w-0 flex-1 space-y-1.5 text-[0.82rem]">{m.byAi.map((a, i) => <li key={a.ai} className="flex items-center gap-2"><i className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: DC[i % 4] }} /><span className="min-w-0 truncate text-sub">{a.ai}</span><b className="num ml-auto">{a.pct}%</b></li>)}</ul>
        </div>
        <Link href="/hakaru/" className="mt-4 inline-flex items-center gap-1 text-[0.8rem] text-ai hover:underline">くわしく測る<ChevronRight size={15} /></Link>
      </div>
      <div className="card min-w-0 p-5 sm:p-6 lg:col-span-2">
        <p className="flex items-center"><b className="text-[0.98rem]">商品ごとの健康スコア</b><span className="ml-auto text-[0.72rem] text-sub">8項目で点検・75点以上で合格</span></p>
        <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
          {h.all.map((x, i) => (
            <li key={x.p.id} className="min-w-0">
              <p className="flex items-baseline text-[0.84rem]"><span className="min-w-0 truncate">{x.p.short}</span><b className={`num ml-auto ${x.score >= 75 ? "text-ai" : x.score >= 50 ? "" : "text-warn"}`}>{x.score}<span className="text-[0.7rem] text-sub">点</span></b></p>
              <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-white/[.06]"><span className="block h-full rounded-full" style={{ width: on ? `${x.score}%` : 0, background: x.score >= 75 ? A : x.score >= 50 ? B : "#f2b84b", transition: `width 1.2s ease-out ${300 + i * 120}ms` }} /></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
