"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";

// ファーストビュー
// ・巨大な「CRAFT」の文字が、写真の財布の“後ろ”を通る（財布だけ切り抜いた画像を手前に重ねる）
// ・窓の光がゆっくり流れ、マウスの位置に光が当たる
// ・スクロールで画面から抜けるとき、写真が少し寄り、大きな文字がゆっくり上へ
type Shot = { src: string; cut: string; w: number; h: number; logo: [number, number]; pos: [number, number] };
const PC: Shot = { src: "/images/hero-pc.webp", cut: "/images/hero-pc-cut.webp", w: 1376, h: 768, logo: [1040, 228], pos: [0.6, 0.5] };
const SP: Shot = { src: "/images/hero-sp.webp", cut: "/images/hero-sp-cut.webp", w: 768, h: 1376, logo: [472, 588], pos: [0.5, 0.25] };

// object-fit: cover で表示したとき、写真上の点が画面のどこに来るか
function pointOnScreen(s: Shot, cw: number, ch: number) {
  const k = Math.max(cw / s.w, ch / s.h);
  const ox = (s.w * k - cw) * s.pos[0];
  const oy = (s.h * k - ch) * s.pos[1];
  return { x: s.logo[0] * k - ox, y: s.logo[1] * k - oy };
}

export default function Hero() {
  const sec = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const [glint, setGlint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = sec.current, st = stage.current;
    if (!el || !st) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let origin = { x: 0, y: 0 };

    const measure = () => {
      const lg = innerWidth >= 1024;
      const r = st.getBoundingClientRect();
      origin = pointOnScreen(lg ? PC : SP, r.width, r.height);
      st.style.transformOrigin = `${origin.x}px ${origin.y}px`;
      setGlint({ x: origin.x, y: origin.y });
    };

    const frame = () => {
      // 画面から抜けていく間だけ、写真を少し寄せ、大きな文字をゆっくり上へ（固定や白飛びはしない）
      const p = reduce ? 0 : Math.min(1, Math.max(0, scrollY / Math.max(1, el.offsetHeight)));
      st.style.transform = `scale(${1 + p * 0.18})`;
      if (word.current) word.current.style.translate = `0 ${p * -120}px`;
      if (copy.current) copy.current.style.transform = `translateY(${p * 60}px)`;
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };

    // マウスの位置に光を当てる
    const move = (e: MouseEvent) => {
      if (!light.current) return;
      light.current.style.setProperty("--mx", `${e.clientX}px`);
      light.current.style.setProperty("--my", `${e.clientY}px`);
      light.current.style.opacity = "1";
    };

    measure(); frame();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", () => { measure(); on(); });
    if (matchMedia("(pointer: fine)").matches) addEventListener("mousemove", move);
    return () => { removeEventListener("scroll", on); removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  const layer = "absolute inset-0 h-full w-full object-cover";
  const posSp = "object-[50%_25%]";
  const posPc = "lg:object-[60%_50%]";

  return (
    <section ref={sec} id="top" className="relative h-[100svh] min-h-[600px] bg-white">
      <div className="relative h-full overflow-hidden">
        {/* 写真のエリア（スマホは上 62%、パソコンは全面） */}
        <div className="absolute inset-x-0 top-0 h-[62svh] overflow-hidden lg:h-full">
          <div ref={stage} className="absolute inset-0 will-change-transform">
            <div className="hero-zoom absolute inset-0">
              <picture>
                <source media="(min-width: 1024px)" srcSet={asset(PC.src)} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(SP.src)} alt="窓辺の光に照らされた、金のロゴ入りの革財布" className={`${layer} ${posSp} ${posPc}`} />
              </picture>

              {/* 財布の後ろを通る大きな文字 */}
              <div ref={word} className="hero-word pointer-events-none absolute inset-x-0 top-[24%] text-center font-display leading-none font-light tracking-[0.32em] text-ink/75 select-none lg:top-[22%] lg:text-left" aria-hidden>
                <span className="mx-auto block max-w-6xl pl-[0.32em] text-[15vw] md:px-8 lg:pl-8 lg:text-[8vw] xl:text-[112px]">CRAFT</span>
              </div>

              {/* 財布だけ切り抜いた画像を手前に重ねる */}
              <picture>
                <source media="(min-width: 1024px)" srcSet={asset(PC.cut)} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(SP.cut)} alt="" aria-hidden className={`${layer} ${posSp} ${posPc} pointer-events-none`} />
              </picture>

              {/* 窓の光がゆっくり流れる */}
              <div className="window-light pointer-events-none absolute inset-0" aria-hidden />
              {/* ロゴのきらめき */}
              {glint && <span className="logo-glint pointer-events-none absolute" style={{ left: glint.x, top: glint.y }} aria-hidden />}
            </div>
          </div>
          {/* マウスの光（パソコン） */}
          <div ref={light} className="cursor-light pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent lg:hidden" />
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-tr from-white/85 via-white/20 via-35% to-transparent to-60% lg:block" />
        </div>

        {/* 見出し（スマホは写真の下、パソコンは左下） */}
        <div ref={copy} className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-10 md:px-8 lg:pb-16">
          <div className="lg:max-w-[520px]">
            <p className="hero-in font-display text-[11px] tracking-[0.22em] text-mute sm:text-[12px] sm:tracking-[0.4em]" style={{ animationDelay: ".1s" }}>LOGO OEM FOR LEATHER GOODS</p>
            <h1 className="mt-4 text-[30px] leading-[1.4] font-medium tracking-[0.04em] sm:text-[40px] lg:text-[46px]">
              <span className="line-mask"><span style={{ animationDelay: ".2s" }}>あなたのロゴで、</span></span>
              <span className="line-mask"><span style={{ animationDelay: ".35s" }}><span className="text-gold">上質な革財布</span>を。</span></span>
            </h1>
            <p className="hero-in mt-5 text-[13px] tracking-[0.12em] text-ink" style={{ animationDelay: ".6s" }}>
              型代 0円<span className="mx-3 text-line">|</span>30個から<span className="mx-3 text-line">|</span>最短30日
            </p>
            <div className="hero-in mt-7 flex items-center gap-8" style={{ animationDelay: ".75s" }}>
              <a href="#models" className="group inline-flex items-center gap-3 bg-ink px-7 py-3.5 text-[13.5px] tracking-[0.1em] whitespace-nowrap text-white transition hover:bg-gold">
                ベースモデルを見る <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </a>
              <a href="#stamp" className="hidden border-b border-ink/40 pb-0.5 text-[13px] tracking-[0.08em] text-ink transition hover:border-gold hover:text-gold sm:inline">ロゴを試し押しする</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
