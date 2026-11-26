"use client";

import { useEffect, useState } from "react";

// オープニング：小さなロゴと細い線だけ。線が伸びきったら、静かに消える
export default function Opening() {
  const [phase, setPhase] = useState<"show" | "leave" | "gone">("show");
  useEffect(() => {
    const fast = document.documentElement.classList.contains("framed") || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = setTimeout(() => document.documentElement.classList.add("opened"), fast ? 0 : 600);
    const t1 = setTimeout(() => setPhase("leave"), fast ? 0 : 600);
    const t2 = setTimeout(() => setPhase("gone"), fast ? 0 : 1100);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (phase === "gone") return null;
  return (
    <div className={`opening fixed inset-0 z-[100] flex items-center justify-center bg-white ${phase === "leave" ? "is-leave" : ""}`} aria-hidden>
      <div className="flex flex-col items-center">
        <p className="op-logo font-display text-[15px] tracking-[0.5em] text-ink">CRAFT<span className="ml-[0.5em] text-mute">OEM</span></p>
        <span className="op-bar mt-5 block h-px w-24 bg-ink/15"><span className="block h-full w-full origin-left bg-ink" /></span>
      </div>
    </div>
  );
}
