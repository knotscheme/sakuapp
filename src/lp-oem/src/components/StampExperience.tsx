"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLp } from "./LpContext";

// あなたのブランド名を、革に箔押しして見せる体験
type Finish = "gold" | "silver" | "blind";
const FINISHES: { id: Finish; name: string }[] = [
  { id: "gold", name: "金箔" },
  { id: "silver", name: "銀箔" },
  { id: "blind", name: "素押し" },
];
const LEATHERS = [
  { id: "brown", name: "ダークブラウン", c: "#3a2418" },
  { id: "navy", name: "ネイビー", c: "#1b2638" },
  { id: "black", name: "ブラック", c: "#1a1a1a" },
  { id: "camel", name: "キャメル", c: "#9a5f32" },
];

export default function StampExperience() {
  const { sendBrandToContact } = useLp();
  const [name, setName] = useState("");
  const [finish, setFinish] = useState<Finish>("gold");
  const [leather, setLeather] = useState(LEATHERS[0]);
  const [press, setPress] = useState(0); // 押すたびに演出をやり直す
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const shown = (name.trim() || "YOUR BRAND").slice(0, 18);

  // 画面に入ったら、最初の1回を押す
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); setPress((p) => p + 1); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 入力が止まったら押し直す
  const onName = (v: string) => {
    setName(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPress((p) => p + 1), 650);
  };
  const choose = (fn: () => void) => { fn(); setPress((p) => p + 1); };

  const size = shown.length > 12 ? "text-[clamp(28px,7vw,72px)]" : shown.length > 8 ? "text-[clamp(34px,9vw,96px)]" : "text-[clamp(40px,11vw,120px)]";

  return (
    <section ref={ref} id="stamp" className="relative flex min-h-[100svh] flex-col overflow-hidden text-white" style={{ backgroundColor: leather.c }}>
      {/* 革のシボ（SVGで作った質感） */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[.55] mix-blend-overlay" aria-hidden>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" result="n" />
          <feDiffuseLighting in="n" surfaceScale="1.6" lightingColor="#fff" result="l"><feDistantLight azimuth="235" elevation="52" /></feDiffuseLighting>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[.35] mix-blend-soft-light" aria-hidden>
        <filter id="mottle"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" /></filter>
        <rect width="100%" height="100%" filter="url(#mottle)" />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_45%_40%,rgba(255,255,255,.14),transparent_60%),radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(0,0,0,.55))]" />
      {/* ステッチ */}
      <div className="pointer-events-none absolute inset-5 border border-dashed border-white/15 md:inset-8" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-24 md:px-10 md:pt-28">
        <p className="font-display text-[12px] tracking-[0.4em] text-white/55">EXPERIENCE</p>
        <h2 className="mt-3 text-[22px] font-medium tracking-[0.08em] md:text-[30px]"><span className="inline-block">あなたのブランドを、</span><span className="inline-block">刻んでみる。</span></h2>
      </div>

      {/* 刻印 */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-10">
        <div key={press} className="relative">
          {seen && <span className="stamp-die" aria-hidden />}
          <p className={`stamp-mark ${finish} ${size} font-display leading-none tracking-[0.12em] whitespace-nowrap`} aria-live="polite">{shown}</p>
          {seen && finish !== "blind" && <span className="stamp-glow" aria-hidden />}
        </div>
      </div>

      {/* 操作 */}
      <div className="relative mx-auto w-full max-w-4xl px-6 pb-14 md:px-10">
        <div className="grid gap-6 border-t border-white/15 pt-7 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8">
          <label className="block">
            <span className="text-[11px] tracking-[0.25em] text-white/55">BRAND NAME</span>
            <input value={name} onChange={(e) => onName(e.target.value)} maxLength={18} placeholder="ブランド名を入力" autoComplete="off"
              className="mt-2 w-full border-b border-white/30 bg-transparent pb-2 font-display text-[20px] tracking-[0.1em] text-white outline-none placeholder:font-sans placeholder:text-[14px] placeholder:tracking-normal placeholder:text-white/40 focus:border-white" />
          </label>
          <div>
            <span className="text-[11px] tracking-[0.25em] text-white/55">FINISH</span>
            <div className="mt-3 flex gap-5">
              {FINISHES.map((f) => (
                <button key={f.id} type="button" onClick={() => choose(() => setFinish(f.id))} aria-pressed={finish === f.id}
                  className={`border-b pb-1 text-[14px] transition ${finish === f.id ? "border-white text-white" : "border-transparent text-white/55 hover:text-white"}`}>{f.name}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[11px] tracking-[0.25em] text-white/55">LEATHER</span>
            <div className="mt-3 flex gap-3">
              {LEATHERS.map((l) => (
                <button key={l.id} type="button" aria-label={l.name} aria-pressed={leather.id === l.id} onClick={() => choose(() => setLeather(l))}
                  className={`h-7 w-7 rounded-full ring-1 transition ${leather.id === l.id ? "ring-2 ring-white ring-offset-2 ring-offset-transparent" : "ring-white/30 hover:ring-white/70"}`} style={{ backgroundColor: l.c }} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <button type="button" onClick={() => setPress((p) => p + 1)} className="border border-white/40 px-6 py-3 text-[13px] tracking-[0.15em] transition hover:border-white">もう一度押す</button>
          <button type="button" onClick={() => sendBrandToContact(`【刻印イメージ】${shown} / ${FINISHES.find((f) => f.id === finish)!.name} / ${leather.name}`)}
            className="group inline-flex items-center gap-2 bg-white px-6 py-3 text-[13px] tracking-[0.15em] text-ink transition hover:bg-gold hover:text-white">
            この名前で見積もり・相談 <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
