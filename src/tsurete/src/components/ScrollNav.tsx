"use client";

import { useEffect, useRef, useState } from "react";

// 画面の下の細いバー：読んだところまで線がのびて、いまのセクション名を小さく出す。
// スクロール中はReactの再描画をせず、線の長さだけを直接動かす（iPhoneでもカクつかないように）
export default function ScrollNav({ names, dark = [] }: { names: string[]; dark?: number[] }) {
  const bar = useRef<HTMLSpanElement>(null);
  const [i, setI] = useState(-1);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    let tops: number[] = [], raf = 0, last = -2, vis = false;
    const measure = () => { tops = els.map((e) => e.getBoundingClientRect().top + scrollY); };
    const tick = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
      const mid = scrollY + innerHeight * 0.45;
      let n = 0; tops.forEach((t, k) => { if (t <= mid) n = k; });
      if (n !== last) { last = n; setI(n); }
      const v = scrollY > innerHeight * 0.6;
      if (v !== vis) { vis = v; setShow(v); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    measure(); tick();
    const ro = new ResizeObserver(() => { measure(); on(); }); ro.observe(document.body);
    addEventListener("scroll", on, { passive: true });
    return () => { removeEventListener("scroll", on); ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  const d = dark.includes(i);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-40 transition-[opacity,transform] duration-500"
      style={{ opacity: show ? 1 : 0, transform: show ? "none" : "translateY(8px)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="tsr-navlabel mx-auto flex max-w-[1000px] px-4 pb-2 transition-opacity duration-300 text-[0.68rem] tracking-[.08em]">
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 backdrop-blur-xl transition-colors duration-500 ${d ? "bg-black/55" : "bg-white/75 shadow-[0_1px_8px_rgba(0,0,0,.06)]"}`}>
        <span className={`num transition-colors duration-500 ${d ? "text-white/45" : "text-[#86868b]"}`}>{String(i + 1).padStart(2, "0")}<span className="mx-1 opacity-50">/</span>{String(names.length).padStart(2, "0")}</span>
        <span key={i} className={`lp-navname transition-colors duration-500 ${d ? "text-white/85" : "text-[#1d1d1f]"}`}>{names[i] ?? ""}</span>
        </div>
      </div>
      <span className={`block h-[2px] w-full transition-colors duration-500 ${d ? "bg-white/10" : "bg-black/[.06]"}`}>
        <span ref={bar} className="block h-full w-full origin-left bg-[#00a37a]" style={{ transform: "scaleX(0)" }} />
      </span>
    </div>
  );
}
