"use client";

import { useId } from "react";

// なめらかな折れ線グラフ（線の下はうっすら塗る）。on になると、線が左から描かれる
export default function LineChart({ data, labels, on = true, color = "#00a37a", grid = "rgba(0,0,0,.06)", sub = "#86868b", H = 120, W = 320, head = 1.1, sparse = false }:
  { data: number[]; labels: string[]; on?: boolean; color?: string; grid?: string; sub?: string; H?: number; W?: number; head?: number; sparse?: boolean }) {
  const id = useId().replace(/:/g, "");
  const P = 8, top = 10;
  const max = Math.max(...data) * head || 1;
  const pts = data.map((v, i) => [P + (i * (W - P * 2)) / (data.length - 1), top + (H - top - 6) * (1 - v / max)] as const);
  // 点と点を、なめらかな曲線でつなぐ
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  const last = pts[pts.length - 1];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label="週ごとの推移のグラフ">
        <defs>
          <linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".22" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((r) => <line key={r} x1={P} x2={W - P} y1={top + (H - top - 6) * r} y2={top + (H - top - 6) * r} stroke={grid} strokeDasharray="2 4" />)}
        <path d={`${d} L${last[0]},${H} L${pts[0][0]},${H} Z`} fill={`url(#g${id})`} style={{ opacity: on ? 1 : 0, transition: "opacity 1s .6s" }} />
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)" }} />
        <circle cx={last[0]} cy={last[1]} r="9" fill={color} opacity=".18" style={{ opacity: on ? 0.18 : 0, transition: "opacity .4s 1.5s" }} />
        <circle cx={last[0]} cy={last[1]} r="4.5" fill={color} style={{ opacity: on ? 1 : 0, transition: "opacity .4s 1.5s" }} />
      </svg>
      <div className="mt-2 flex justify-between text-[0.62rem] sm:text-[0.72rem]">{labels.map((l, i) => <span key={i} className={`w-0 whitespace-nowrap text-center ${i === labels.length - 1 ? "font-semibold" : ""} ${sparse && i % 2 && i !== labels.length - 1 ? "invisible sm:visible" : ""}`} style={{ color: i === labels.length - 1 ? color : sub, display: "flex", justifyContent: i === 0 ? "flex-start" : i === labels.length - 1 ? "flex-end" : "center" }}>{l}</span>)}</div>
    </div>
  );
}
