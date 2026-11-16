"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// 一文字ずつ、光の粒が集まるように文字が現れる
const LINES = [["革に、", "あなたの", "名前を", "刻む。"], ["その", "ひと押しから、"], ["ブランドが", "はじまる。"]];
const ACCENT = new Set(["名前を", "ブランドが"]);

export default function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const chars = useMemo(() => {
    let i = 0;
    // 位置と遅れは見た目用のゆらぎ（毎回同じになるよう、文字の順番から決める）
    const rnd = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
    return LINES.map((line) => line.map((w) => ({
      w, accent: ACCENT.has(w),
      cs: w.split("").map((ch) => { i++; const a = rnd(i) * Math.PI * 2, R = 40 + rnd(i + 99) * 120; return { ch, dx: Math.cos(a) * R, dy: Math.sin(a) * R + 40, d: i * 0.05 + rnd(i + 7) * 0.45 }; }),
    })));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-28 md:py-40">
      <div ref={ref} className={`statement relative mx-auto max-w-4xl px-6 text-center ${on ? "on" : ""}`}>
        <p className="mb-12 font-display text-[12px] tracking-[0.5em] text-mute">OUR PHILOSOPHY</p>
        {chars.map((line, li) => (
          <p key={li} className="text-[24px] leading-[2.1] font-normal tracking-[0.2em] text-ink sm:text-[34px] md:text-[44px]">
            {line.map(({ w, accent, cs }) => (
              <span key={w} className={`inline-block whitespace-nowrap ${accent ? "ac" : ""}`}>
                {cs.map((c, k) => (
                  <span key={k} className="c" style={{ ["--dx" as string]: `${c.dx.toFixed(0)}px`, ["--dy" as string]: `${c.dy.toFixed(0)}px`, ["--d" as string]: `${c.d.toFixed(2)}s` }}>{c.ch}</span>
                ))}
              </span>
            ))}
          </p>
        ))}
        <span className="st-line mx-auto mt-12 block h-px w-16 bg-gold-2" />
      </div>
    </section>
  );
}
