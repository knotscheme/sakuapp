"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// 読みこみ画面：緑の点から波紋が広がり、TSURETEの文字が浮かび上がる。
// ブラウザを開いている間は最初の1回だけ（2回目からは lib/splash.ts の仕組みで短い版にする）
const WORD = "TSURETE".split("");

export default function Splash() {
  const path = usePathname() ?? "";
  const light = path.includes("/lp");
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  useEffect(() => {
    const short = document.documentElement.getAttribute("data-splash") === "short";
    try { sessionStorage.setItem("tsr-splash", "1"); } catch {}
    const quick = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [o, g] = quick ? [200, 450] : short ? [500, 1300] : [1700, 2500];
    const a = setTimeout(() => setPhase("out"), o);
    const b = setTimeout(() => setPhase("gone"), g);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (phase === "gone") return null;
  const blue = path.includes("/lp2");
  const ink = blue ? "#0b1e3d" : light ? "#1d1d1f" : "#e6eef9", bg = light ? "#ffffff" : "#050a16", green = blue ? "#1f5ad1" : light ? "#00a37a" : "#4d8dff";
  return (
    <div className="tsr-splash fixed inset-0 z-[300] grid place-items-center" aria-hidden
      style={{ background: bg, clipPath: phase === "out" ? "inset(0 0 100% 0)" : "inset(0 0 0 0)", transition: "clip-path .8s cubic-bezier(.7,0,.2,1)" }}>
      <div className="flex flex-col items-center" style={{ opacity: phase === "out" ? 0 : 1, transform: phase === "out" ? "translateY(-24px)" : "none", transition: "opacity .5s, transform .8s cubic-bezier(.7,0,.2,1)" }}>
        {/* 緑の点と、2重の波紋 */}
        <div className="relative grid h-24 w-24 place-items-center">
          {[0, 0.45].map((d) => <i key={d} className="absolute h-6 w-6 rounded-full" style={{ border: `1.5px solid ${green}`, animation: `sp-ripple 1.6s ${d}s cubic-bezier(.2,.7,.2,1) infinite` }} />)}
          <i className="sp-q h-4 w-4 rounded-full" style={{ background: green, boxShadow: `0 0 24px ${green}`, animation: "sp-dot .9s cubic-bezier(.2,.7,.2,1) both" }} />
        </div>
        {/* 文字：1文字ずつ浮かび上がる */}
        <p className="mt-4 flex font-display text-[1.6rem] font-semibold tracking-[.32em]" style={{ color: ink }}>
          {WORD.map((c, i) => <span key={i} className="sp-q" style={{ animation: `sp-letter .7s ${0.25 + i * 0.07}s cubic-bezier(.2,.7,.2,1) both` }}>{c}</span>)}
        </p>
        <p className="sp-q mt-2 text-[0.75rem] tracking-[.2em]" style={{ color: blue ? "#687387" : light ? "#86868b" : "#8191ad", animation: "sp-fade .6s .85s both" }}>AIが、お客様をつれてくる。</p>
        {/* 細い線がのびる */}
        <span className="mt-7 block h-[2px] w-32 overflow-hidden rounded-full" style={{ background: blue ? "#e6ecf6" : light ? "#e8e8ed" : "rgba(255,255,255,.08)" }}>
          <span className="sp-q block h-full rounded-full" style={{ background: green, animation: "sp-bar 1.5s .15s cubic-bezier(.6,0,.2,1) both" }} />
        </span>
      </div>
    </div>
  );
}
