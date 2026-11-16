"use client";

import { useEffect, useState } from "react";

// オープニング：金の線で「CRAFT」が描かれ、箔押しのように光ってから幕が上がる
export default function Opening() {
  const [phase, setPhase] = useState<"show" | "leave" | "gone">("show");
  useEffect(() => {
    const framed = document.documentElement.classList.contains("framed");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fast = framed || reduce;
    const t0 = setTimeout(() => document.documentElement.classList.add("opened"), fast ? 0 : 2500);
    const t1 = setTimeout(() => setPhase("leave"), fast ? 0 : 2600);
    const t2 = setTimeout(() => setPhase("gone"), fast ? 0 : 3500);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (phase === "gone") return null;
  return (
    <div className={`opening fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white ${phase === "leave" ? "is-leave" : ""}`} aria-hidden>
      <svg viewBox="0 0 520 120" className="w-[min(78vw,460px)]">
        <defs>
          <linearGradient id="op-gold" x1="0" x2="1">
            <stop offset="0" stopColor="#8d6a10" /><stop offset=".45" stopColor="#ecd59a" /><stop offset="1" stopColor="#b8860b" />
          </linearGradient>
        </defs>
        <text x="260" y="88" textAnchor="middle" className="op-word" fontFamily="var(--font-cormorant), Georgia, serif" fontSize="104" letterSpacing="18">CRAFT</text>
      </svg>
      <span className="op-line mt-4 block h-px w-40 bg-gold-2" />
      <p className="op-sub mt-4 font-display text-[12px] tracking-[0.5em] text-ink/60">LEATHER ATELIER · OEM</p>
    </div>
  );
}
