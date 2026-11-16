"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";

// ファーストビュー：画面いっぱいの写真に、見出しを重ねる（スマホは下、パソコンは左）
// 専用の写真が届いたら、HERO_PC / HERO_SP を差し替える
const HERO_PC = "/images/giftbox.webp";
const HERO_SP = "/images/giftbox.webp";

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
    <section id="top" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-white">
      <div ref={photo} className="absolute inset-x-0 top-0 -bottom-24 will-change-transform">
        <div className="hero-zoom absolute inset-0">
          <picture>
            <source media="(min-width: 1024px)" srcSet={asset(HERO_PC)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(HERO_SP)} alt="ロゴ入りの化粧箱に収められた革財布" className="h-full w-full object-cover object-[62%_50%] lg:object-[70%_50%]" />
          </picture>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/75 to-transparent to-70% lg:bg-gradient-to-r lg:from-white lg:via-white/85 lg:to-transparent lg:to-55%" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-12 md:px-8 lg:justify-center lg:pb-0">
        <div className="lg:max-w-[520px]">
          <p className="hero-in font-display text-[12px] tracking-[0.4em] text-mute" style={{ animationDelay: ".1s" }}>LOGO OEM FOR LEATHER GOODS</p>
          <h1 className="mt-5 text-[38px] leading-[1.35] font-medium tracking-[0.04em] sm:text-[46px] lg:text-[56px]">
            <span className="line-mask"><span style={{ animationDelay: ".2s" }}>あなたのロゴで、</span></span>
            <span className="line-mask"><span style={{ animationDelay: ".35s" }}><span className="text-gold">上質な革財布</span>を。</span></span>
          </h1>
          <p className="hero-in mt-6 max-w-md text-[14.5px] leading-loose text-ink/65" style={{ animationDelay: ".6s" }}>
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

      <a href="#problems" className="hero-in absolute right-6 bottom-8 hidden flex-col items-center gap-3 font-display text-[11px] tracking-[0.3em] text-ink/50 [writing-mode:vertical-rl] lg:flex" style={{ animationDelay: "1.2s" }} aria-label="下へスクロール">
        SCROLL <span className="scroll-cue block h-12 w-px bg-ink/30" />
      </a>
    </section>
  );
}
