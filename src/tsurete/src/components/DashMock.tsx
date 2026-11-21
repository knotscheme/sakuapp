"use client";

// LP用の分析ダッシュボードの見本（画像ではなく部品で描く。数字はすべて架空）
// 760×470 の大きさで描き、置き場所の幅に合わせて縮める
import { useEffect, useRef, useState } from "react";

// 幅が狭いとき（スマホ）は、左のメニューを外し、数字を2列にして大きく見せる
const BLUE = "#1f5ad1", NAVY = "#0b1e3d", SUB = "#687387", LINE = "#e6eaf2";
const WEEKS = ["9/29", "10/6", "10/13", "10/20", "10/27", "11/3", "11/10", "11/17"];
const RATE = [9, 11, 10, 14, 19, 26, 31, 38];
const CITE = [12, 13, 15, 16, 22, 27, 33, 41];
const DONUT = [{ l: "ChatGPT", v: 38, c: BLUE }, { l: "Gemini", v: 26, c: "#5b8def" }, { l: "Perplexity", v: 21, c: "#9bbcf6" }, { l: "Claude", v: 15, c: "#cddcf9" }];
const BARS = [{ l: "化粧水 しっとり", v: 86 }, { l: "美容液", v: 72 }, { l: "UVジェル", v: 64 }, { l: "クレンジング", v: 41 }];

function smooth(pts: [number, number][]) {
  return pts.map((p, i) => {
    if (!i) return `M${p[0]},${p[1]}`;
    const a = pts[i - 1], dx = (p[0] - a[0]) / 2;
    return `C${a[0] + dx},${a[1]} ${p[0] - dx},${p[1]} ${p[0]},${p[1]}`;
  }).join(" ");
}

export default function DashMock() {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  const [narrow, setNarrow] = useState(false);
  const W0 = narrow ? 540 : 760, H0 = narrow ? 676 : 572;
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(() => { const n = el.clientWidth < 560; setNarrow(n); setK(el.clientWidth / (n ? 540 : 760)); }); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.2 }); io.observe(el);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setOn(true);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);
  // 折れ線
  const cw = 430, ch = 150, px = (i: number) => 8 + (i * (cw - 16)) / (WEEKS.length - 1), py = (v: number) => ch - 10 - (v / 50) * (ch - 24);
  const pr = RATE.map((v, i) => [px(i), py(v)] as [number, number]), pc = CITE.map((v, i) => [px(i), py(v)] as [number, number]);
  const dr = smooth(pr), dc = smooth(pc);
  // 円
  const R = 46, C = 2 * Math.PI * R; let acc = 0;
  const tr = (d: number) => ({ transition: `stroke-dashoffset 1.6s cubic-bezier(.2,.7,.2,1) ${d}ms, opacity .8s ${d}ms, width 1.2s ease-out ${d}ms` });
  return (
    <div ref={box} className="relative w-full" style={{ height: H0 * k }} role="img" aria-label="TSURETEの分析ダッシュボードの見本（数字は架空）">
      <div className="absolute left-0 top-0 origin-top-left overflow-hidden rounded-[12px] border border-[#0b1e3d]/[.1] bg-white shadow-[0_40px_80px_-36px_rgba(11,30,61,.45)]" style={{ width: W0, height: H0, transform: `scale(${k})`, color: NAVY, fontFamily: "inherit" }}>
        {/* ウィンドウの上 */}
        <div className="flex h-8 items-center gap-1.5 border-b px-3" style={{ borderColor: LINE, background: "#f7f9fc" }}>
          {["#ff6058", "#ffbd2e", "#28c940"].map((c) => <i key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}
          <span className="mx-auto rounded-[4px] bg-white px-10 py-0.5 text-[10px]" style={{ color: SUB, border: `1px solid ${LINE}` }}>app.tsurete.example/analytics</span>
        </div>
        <div className="flex" style={{ height: H0 - 32 }}>
          {/* 左のメニュー */}
          <aside className={`w-[120px] shrink-0 border-r px-3 py-4 text-[11px] ${narrow ? "hidden" : ""}`} style={{ borderColor: LINE, background: "#fbfcfe" }}>
            <p className="mb-4 flex items-center gap-1.5 font-bold tracking-[.12em]"><i className="h-2 w-2 rounded-full" style={{ background: BLUE }} />TSURETE</p>
            {["ホーム", "分析", "診断", "直す", "売上", "設定"].map((t, i) => <p key={t} className="mb-1 rounded-[5px] px-2 py-1.5" style={i === 1 ? { background: "#e8effc", color: BLUE, fontWeight: 700 } : { color: SUB }}>{t}</p>)}
          </aside>
          <div className="min-w-0 flex-1 p-4">
            <div className="flex items-center">
              <div><p className="text-[10px]" style={{ color: SUB }}>SORAE・11月18日</p><p className="text-[15px] font-bold">AI検索の分析</p></div>
              <div className="ml-auto flex rounded-[6px] p-0.5 text-[10px]" style={{ background: "#f1f4f9" }}>{["4週", "12週", "26週"].map((t, i) => <span key={t} className="rounded-[4px] px-2.5 py-1" style={i === 1 ? { background: "#fff", color: NAVY, fontWeight: 700, boxShadow: "0 1px 2px rgba(0,0,0,.08)" } : { color: SUB }}>{t}</span>)}</div>
            </div>
            {/* 数字 */}
            <div className={`mt-3 grid gap-2 ${narrow ? "grid-cols-2" : "grid-cols-4"}`}>
              {[["すすめられた割合", "38", "%", "+12.4"], ["1位の割合", "14", "%", "+6.1"], ["サイトが根拠に", "41", "%", "+15.0"], ["AI経由の売上", "64,100", "円", "+38%"]].map(([l, v, u, d]) => (
                <div key={l} className="rounded-[8px] border px-3 py-2.5" style={{ borderColor: LINE }}>
                  <p className="text-[9.5px]" style={{ color: SUB }}>{l}</p>
                  <p className="mt-1"><b className="text-[19px] tracking-[-.02em]">{v}</b><span className="ml-0.5 text-[10px]" style={{ color: SUB }}>{u}</span></p>
                  <p className="text-[9.5px] font-bold" style={{ color: "#0f9d6b" }}>▲ {d}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: "1fr 170px" }}>
              {/* 折れ線 */}
              <div className="rounded-[8px] border p-3" style={{ borderColor: LINE }}>
                <p className="flex items-center text-[11px] font-bold">週ごとの推移<span className="ml-auto flex gap-3 text-[9.5px] font-normal" style={{ color: SUB }}><span className="flex items-center gap-1"><i className="h-1.5 w-3 rounded-full" style={{ background: BLUE }} />すすめられた割合</span><span className="flex items-center gap-1"><i className="h-1.5 w-3 rounded-full" style={{ background: "#9bbcf6" }} />根拠に</span></span></p>
                <svg viewBox={`0 0 ${cw} ${ch + 14}`} className="mt-1 block w-full">
                  <defs><linearGradient id="dmg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={BLUE} stopOpacity=".22" /><stop offset="1" stopColor={BLUE} stopOpacity="0" /></linearGradient></defs>
                  {[0, 25, 50].map((v) => <g key={v}><line x1="0" x2={cw} y1={py(v)} y2={py(v)} stroke={LINE} /><text x="0" y={py(v) - 3} fontSize="8" fill={SUB}>{v}%</text></g>)}
                  <path d={`${dr} L${px(WEEKS.length - 1)},${ch - 10} L${px(0)},${ch - 10} Z`} fill="url(#dmg)" style={{ opacity: on ? 1 : 0, transition: "opacity 1s .9s" }} />
                  <path d={dc} fill="none" stroke="#9bbcf6" strokeWidth="2" strokeDasharray="900" style={{ strokeDashoffset: on ? 0 : 900, ...tr(200) }} />
                  <path d={dr} fill="none" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="900" style={{ strokeDashoffset: on ? 0 : 900, ...tr(0) }} />
                  <circle cx={pr[pr.length - 1][0]} cy={pr[pr.length - 1][1]} r="4" fill="#fff" stroke={BLUE} strokeWidth="2.4" style={{ opacity: on ? 1 : 0, transition: "opacity .4s 1.5s" }} />
                  {WEEKS.map((w, i) => (i % 2 === 1 || i === WEEKS.length - 1) && <text key={w} x={px(i)} y={ch + 10} fontSize="8" fill={SUB} textAnchor={i === WEEKS.length - 1 ? "end" : "middle"}>{w}</text>)}
                </svg>
              </div>
              {/* 円 */}
              <div className="rounded-[8px] border p-3" style={{ borderColor: LINE }}>
                <p className="text-[11px] font-bold">AI別の来店</p>
                <div className="mt-1 flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-[92px] w-[92px] -rotate-90">
                    <circle cx="60" cy="60" r={R} fill="none" stroke="#f1f4f9" strokeWidth="16" />
                    {DONUT.map((d, i) => { const len = (d.v / 100) * C, off = acc; acc += len; return <circle key={d.l} cx="60" cy="60" r={R} fill="none" stroke={d.c} strokeWidth="16" strokeDasharray={`${on ? len : 0} ${C}`} strokeDashoffset={-off} style={{ transition: `stroke-dasharray 1.1s ease-out ${300 + i * 150}ms` }} />; })}
                  </svg>
                </div>
                <ul className="mt-1.5 space-y-0.5 text-[9.5px]">{DONUT.map((d) => <li key={d.l} className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-[2px]" style={{ background: d.c }} /><span style={{ color: SUB }}>{d.l}</span><b className="ml-auto">{d.v}%</b></li>)}</ul>
              </div>
            </div>
            {/* 棒 */}
            <div className="mt-2 rounded-[8px] border px-3 py-2.5" style={{ borderColor: LINE }}>
              <p className="flex text-[11px] font-bold">商品ページの健康スコア<span className="ml-auto text-[9.5px] font-normal" style={{ color: SUB }}>8項目で点検</span></p>
              <div className="mt-1.5 grid grid-cols-2 gap-x-5 gap-y-1.5">
                {BARS.map((b, i) => <div key={b.l} className="flex items-center gap-2 text-[9.5px]"><span className="w-[72px] shrink-0 truncate" style={{ color: SUB }}>{b.l}</span><span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "#f1f4f9" }}><span className="block h-full rounded-full" style={{ width: on ? `${b.v}%` : 0, background: b.v >= 75 ? BLUE : b.v >= 60 ? "#5b8def" : "#f0a23b", ...tr(400 + i * 120) }} /></span><b className="w-5 text-right">{b.v}</b></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
