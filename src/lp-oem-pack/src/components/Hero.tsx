"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";

// ファーストビュー：革の壁の写真の上に、合言葉「売れるまで、つくる。」と、0 → 1億円まで一気に数える数字
const GOAL = 100_000_000;
export default function Hero() {
  const [n, setN] = useState(0);
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(GOAL); return; }
    // オープニングが終わるころに数え始める（最後はゆっくり止まる）
    let raf = 0;
    const start = performance.now() + 900;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start) / 2400));
      setN(Math.round(GOAL * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // スクロールで写真をゆっくり寄せる
    const on = () => { if (bg.current) bg.current.style.transform = `scale(${1.06 + Math.min(1, scrollY / innerHeight) * 0.12})`; };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", on); };
  }, []);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#141210] text-white">
      <div ref={bg} className="absolute inset-0 scale-[1.06] will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/studio-wall.webp")} alt="色とりどりの革が並ぶ工房の壁" className="h-full w-full object-cover object-[60%_50%]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/75 to-[#141210]/20" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-28 pb-12 md:px-8 md:pb-20">
        <p className="hero-in font-display text-[11px] tracking-[0.35em] text-white/60 sm:text-[12px]" style={{ animationDelay: ".1s" }}>LEATHER OEM × CROWDFUNDING</p>
        <h1 className="mt-4 text-[44px] leading-[1.15] font-medium tracking-[0.02em] sm:text-[64px] lg:text-[84px]">
          <span className="line-mask"><span style={{ animationDelay: ".2s" }}>売れるまで、</span></span>
          <span className="line-mask"><span style={{ animationDelay: ".35s" }}><span className="text-gold">つくる。</span></span></span>
        </h1>

        {/* 1億円のカウントアップ */}
        <div className="hero-in mt-8 border-t border-white/20 pt-5" style={{ animationDelay: ".55s" }}>
          <p className="text-[12px] tracking-[0.2em] text-white/60">クラウドファンディング累計支援額</p>
          <p className="mt-1 font-num text-[40px] leading-none font-medium tabular-nums sm:text-[64px] lg:text-[80px]" aria-label="1億円">
            <span className="text-[0.5em] text-white/70">¥</span>{n.toLocaleString("ja-JP")}<span className="ml-1 text-[0.35em] text-white/70">+</span>
          </p>
        </div>

        <p className="hero-in mt-6 max-w-xl text-[14px] leading-relaxed text-white/85 sm:text-[15px]" style={{ animationDelay: ".7s" }}>
          <span className="inline-block">革製品づくり20年。</span><span className="inline-block">50個からの小ロットOEMと、</span><span className="inline-block">売れるLP・クラファン・自社ECまで、</span><span className="inline-block">ひとつのチームで。</span>
        </p>
        <div className="hero-in mt-7 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: ".85s" }}>
          <a href="#plans" className="group inline-flex items-center gap-3 bg-gold px-7 py-3.5 text-[13.5px] tracking-[0.1em] whitespace-nowrap text-white transition hover:bg-white hover:text-ink">
            プランを見る <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </a>
          <a href="#story" className="border-b border-white/40 pb-0.5 text-[13px] tracking-[0.08em] whitespace-nowrap text-white transition hover:border-gold hover:text-gold">売れるまでの流れを見る ↓</a>
        </div>
      </div>
    </section>
  );
}
