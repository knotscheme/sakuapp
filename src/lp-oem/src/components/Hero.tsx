"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";

// ファーストビュー：画面いっぱいの写真に、見出しを重ねる（スマホは下、パソコンは左）
// 専用の写真が届いたら、HERO_PC / HERO_SP を差し替える
const HERO_PC = "/images/hero-pc.webp";
const HERO_SP = "/images/hero-sp.webp";

export default function Hero() {
  const photo = useRef<HTMLDivElement>(null);

  // スクロールで写真がゆっくり沈む
  useEffect(() => {
    const el = photo.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { el.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`; }); };
    addEventListener("scroll", on, { passive: true });
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="top" className="relative overflow-hidden bg-white lg:h-[100svh] lg:min-h-[620px]">
      <div className="relative h-[66svh] min-h-[420px] overflow-hidden lg:absolute lg:inset-0 lg:h-auto lg:min-h-0">
      <div ref={photo} className="absolute inset-x-0 top-0 -bottom-24 will-change-transform">
        <div className="hero-zoom absolute inset-0">
          <picture>
            <source media="(min-width: 1024px)" srcSet={asset(HERO_PC)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(HERO_SP)} alt="窓辺の光に照らされた、金のロゴ入りの革財布" className="h-full w-full object-cover object-[50%_25%] lg:object-[60%_50%]" />
          </picture>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white to-transparent to-20% lg:bg-gradient-to-r lg:from-white/90 lg:via-white/50 lg:via-30% lg:to-transparent lg:to-55%" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-4 pb-16 md:px-8 lg:absolute lg:inset-0 lg:flex lg:flex-col lg:justify-center lg:py-0">
        <div className="lg:max-w-[520px]">
          <p className="hero-in font-display text-[11px] tracking-[0.22em] text-mute sm:text-[12px] sm:tracking-[0.4em]" style={{ animationDelay: ".1s" }}>LOGO OEM FOR LEATHER GOODS</p>
          <h1 className="mt-5 text-[32px] leading-[1.4] font-medium tracking-[0.04em] sm:text-[44px] lg:text-[56px]">
            <span className="line-mask"><span style={{ animationDelay: ".2s" }}>あなたのロゴで、</span></span>
            <span className="line-mask"><span style={{ animationDelay: ".35s" }}><span className="text-gold">上質な革財布</span>を。</span></span>
          </h1>
          <p className="hero-in mt-5 max-w-md text-[14px] leading-loose text-ink/65 md:text-[14.5px]" style={{ animationDelay: ".6s" }}>
            売れている定番の型に、ブランドロゴを刻印・箔押しするだけ。設計いらずで、自分の財布ブランドを始められます。
          </p>
          <p className="hero-in mt-6 text-[13px] tracking-[0.12em] text-ink" style={{ animationDelay: ".75s" }}>
            型代 0円<span className="mx-3 text-line">|</span>30個から<span className="mx-3 text-line">|</span>最短30日
          </p>
          <div className="hero-in mt-9 flex items-center gap-8" style={{ animationDelay: ".9s" }}>
            <a href="#models" className="group inline-flex items-center gap-3 bg-ink px-8 py-4 text-[14px] tracking-[0.1em] whitespace-nowrap text-white transition hover:bg-gold">
              ベースモデルを見る <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#simulator" className="hidden border-b border-ink/40 pb-0.5 text-[13px] tracking-[0.08em] text-ink transition hover:border-gold hover:text-gold sm:inline">利益を試算する</a>
          </div>
        </div>
      </div>

      <a href="#philosophy" className="hero-in absolute right-6 bottom-8 hidden flex-col items-center gap-3 font-display text-[11px] tracking-[0.3em] text-ink/50 [writing-mode:vertical-rl] lg:flex" style={{ animationDelay: "1.2s" }} aria-label="下へスクロール">
        SCROLL <span className="scroll-cue block h-12 w-px bg-ink/30" />
      </a>
    </section>
  );
}
