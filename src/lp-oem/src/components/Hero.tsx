"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { asset } from "@/lib/asset";

const STATS = [
  { k: "型代・設計費", v: "0", u: "円" },
  { k: "小ロット", v: "30", u: "個〜" },
  { k: "最短納期", v: "30", u: "日" },
];

// ファーストビュー：画面いっぱいの写真に、見出しを重ねる（スマホは下、パソコンは左）
// 専用の写真が届いたら、HERO_PC / HERO_SP を差し替える
const HERO_PC = "/images/giftbox.webp";
const HERO_SP = "/images/giftbox.webp";

export default function Hero() {
  const photo = useRef<HTMLDivElement>(null);
  const dust = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = photo.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let mx = 0, my = 0, cx = 0, cy = 0, raf = 0;
    const fine = matchMedia("(pointer: fine)").matches;
    const move = (e: MouseEvent) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
    const tick = () => {
      cx += (mx - cx) * 0.05; cy += (my - cy) * 0.05;
      el.style.transform = `translate3d(${cx * -20}px, ${scrollY * 0.3 + cy * -14}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    if (fine) addEventListener("mousemove", move);
    raf = requestAnimationFrame(tick);
    return () => { removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  // 金の粒が舞う
  useEffect(() => {
    const c = dust.current;
    if (!c || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const N = innerWidth < 768 ? 30 : 60;
    const ps = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + 0.4, s: Math.random() * 0.0004 + 0.0001, a: Math.random() * 6.28 }));
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.s * 16; if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(t / 900 + p.a));
        ctx.beginPath(); ctx.fillStyle = `rgba(200,160,70,${0.6 * tw})`;
        ctx.arc(p.x * w + Math.sin(t / 2600 + p.a) * 14, p.y * h, p.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="top" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-white">
      <div ref={photo} className="absolute -inset-x-6 -top-6 -bottom-24 will-change-transform">
        <div className="hero-zoom absolute inset-0">
          <picture>
            <source media="(min-width: 1024px)" srcSet={asset(HERO_PC)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(HERO_SP)} alt="ロゴ入りの化粧箱に収められた革財布" className="h-full w-full object-cover object-[62%_50%] lg:object-[70%_50%]" />
          </picture>
        </div>
      </div>
      <span className="hero-glare pointer-events-none absolute inset-0" aria-hidden />
      {/* 文字を読みやすくする白のグラデーション */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent to-75% lg:bg-gradient-to-r lg:from-white lg:via-white/80 lg:to-transparent lg:to-60%" />
      <canvas ref={dust} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-10 md:px-8 lg:justify-center lg:pb-0">
        <div className="lg:max-w-[540px]">
          <p className="hero-in font-display text-[12px] tracking-[0.35em] text-gold sm:text-sm sm:tracking-[0.45em]" style={{ animationDelay: ".1s" }}>LOGO OEM FOR LEATHER GOODS</p>
          <h1 className="mt-4 text-[40px] leading-[1.28] font-bold tracking-wide sm:text-[48px] lg:text-[60px] lg:leading-[1.25]">
            <span className="line-mask"><span style={{ animationDelay: ".2s" }}>あなたのロゴで、</span></span>
            <span className="line-mask"><span style={{ animationDelay: ".35s" }}><span className="gold-text shine">上質な革財布</span>を。</span></span>
          </h1>
          <p className="hero-in mt-5 max-w-md text-[14.5px] leading-loose text-ink/70 md:text-[15px]" style={{ animationDelay: ".6s" }}>
            売れている定番の型に、ブランドロゴを刻印・箔押しするだけ。設計いらずで、自分の財布ブランドを始められます。
          </p>
          <dl className="hero-in mt-7 grid max-w-md grid-cols-3 divide-x divide-ink/10 border-y border-ink/10" style={{ animationDelay: ".75s" }}>
            {STATS.map((s) => (
              <div key={s.k} className="py-3.5 text-center">
                <dt className="text-[11px] tracking-wider text-ink/55">{s.k}</dt>
                <dd className="mt-1 font-display text-[32px] leading-none">{s.v}<span className="ml-0.5 font-sans text-[12px] font-bold">{s.u}</span></dd>
              </div>
            ))}
          </dl>
          <div className="hero-in mt-7 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: ".9s" }}>
            <a href="#models" className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-[15px] font-bold tracking-wide whitespace-nowrap text-white transition hover:bg-gold">
              ベースモデルを見る <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#simulator" className="hidden items-center justify-center gap-2 rounded-full border border-ink/20 bg-white/80 px-7 py-4 text-[15px] font-bold tracking-wide whitespace-nowrap text-ink backdrop-blur transition hover:border-gold hover:text-gold sm:inline-flex">
              <Calculator size={18} /> 利益をシミュレーションする
            </a>
          </div>
        </div>
      </div>

      <a href="#problems" className="hero-in absolute right-6 bottom-8 hidden flex-col items-center gap-3 font-display text-[11px] tracking-[0.3em] text-ink/50 [writing-mode:vertical-rl] lg:flex" style={{ animationDelay: "1.2s" }} aria-label="下へスクロール">
        SCROLL <span className="scroll-cue block h-12 w-px bg-ink/30" />
      </a>
    </section>
  );
}
