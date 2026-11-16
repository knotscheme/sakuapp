"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { asset } from "@/lib/asset";

const STATS = [
  { k: "型代・設計費", v: "0", u: "円" },
  { k: "小ロット", v: "30", u: "個〜" },
  { k: "最短納期", v: "30", u: "日" },
];

export default function Hero() {
  const photo = useRef<HTMLDivElement>(null);

  // スクロールで写真がゆっくり沈み、マウスで少し動く
  useEffect(() => {
    const el = photo.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let mx = 0, my = 0, cx = 0, cy = 0, raf = 0;
    const fine = matchMedia("(pointer: fine)").matches;
    const move = (e: MouseEvent) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
    const tick = () => {
      cx += (mx - cx) * 0.05; cy += (my - cy) * 0.05;
      el.style.transform = `translate3d(${fine ? cx * -18 : 0}px, ${scrollY * 0.18 + (fine ? cy * -12 : 0)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    if (fine) addEventListener("mousemove", move);
    raf = requestAnimationFrame(tick);
    return () => { removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* 写真（パソコンは右側いっぱい、スマホは上） */}
      <div className="relative h-[46svh] min-h-[300px] overflow-hidden lg:absolute lg:top-[calc(50%+2rem)] lg:right-8 lg:left-[calc(50%+1.5rem)] lg:aspect-[16/12.5] lg:h-auto lg:min-h-0 lg:-translate-y-1/2 lg:rounded-[28px] lg:shadow-[0_50px_90px_-50px_rgba(0,0,0,.55)] xl:right-[max(2rem,calc((100vw-76rem)/2))]">
        <div ref={photo} className="absolute -inset-6 will-change-transform">
          <div className="hero-zoom absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/images/finish-gold.webp")} alt="革財布に金箔押しされたロゴ" className="h-full w-full object-cover object-[52%_50%]" />
          </div>
        </div>
        <span className="hero-glare pointer-events-none absolute inset-0" aria-hidden />
        {/* 白へのグラデーション */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent lg:hidden" />
        <span className="absolute right-5 bottom-5 hidden rounded-full bg-white/90 px-3.5 py-1.5 font-display text-[11px] tracking-[0.25em] text-ink backdrop-blur lg:block">GOLD FOIL STAMPING</span>
        <div className="hero-curtain pointer-events-none absolute inset-0 bg-white" aria-hidden />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-16 md:px-8 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-24 lg:pb-24">
        <div className="-mt-2 lg:mt-0 lg:w-[calc(50%-2rem)] lg:max-w-[540px]">
          <p className="hero-in font-display text-[12px] tracking-[0.3em] text-gold sm:text-sm sm:tracking-[0.4em]" style={{ animationDelay: ".5s" }}>LOGO OEM FOR LEATHER GOODS</p>
          <h1 className="mt-5 text-[36px] leading-[1.3] font-bold tracking-wide sm:text-[44px] lg:text-[52px] lg:leading-[1.3]">
            <span className="line-mask"><span style={{ animationDelay: ".6s" }}>あなたのロゴで、</span></span>
            <span className="line-mask"><span style={{ animationDelay: ".75s" }}><span className="gold-text shine">上質な革財布</span>を。</span></span>
          </h1>
          <p className="hero-in mt-6 max-w-md text-[15px] leading-loose text-mute" style={{ animationDelay: "1s" }}>
            売れている定番の型に、ブランドロゴを刻印・箔押しするだけ。設計いらずで、自分の財布ブランドを始められます。
          </p>

          <dl className="hero-in mt-9 grid max-w-md grid-cols-3 divide-x divide-line border-y border-line" style={{ animationDelay: "1.15s" }}>
            {STATS.map((s) => (
              <div key={s.k} className="py-4 text-center">
                <dt className="text-[11px] tracking-wider text-mute">{s.k}</dt>
                <dd className="mt-1 font-display text-[34px] leading-none text-ink">
                  {s.v}
                  <span className="ml-0.5 font-sans text-[13px] font-bold">{s.u}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row" style={{ animationDelay: "1.3s" }}>
            <a href="#models" className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-[15px] font-bold tracking-wide whitespace-nowrap text-white transition hover:bg-gold">
              ベースモデルを見る
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#simulator" className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-7 py-4 text-[15px] font-bold tracking-wide whitespace-nowrap text-ink transition hover:border-gold hover:text-gold">
              <Calculator size={18} />
              利益をシミュレーションする
            </a>
          </div>
        </div>
      </div>

      <a href="#problems" className="hero-in absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-display text-[11px] tracking-[0.3em] text-ink/50 lg:flex" style={{ animationDelay: "1.6s" }} aria-label="下へスクロール">
        SCROLL
        <span className="scroll-cue block h-10 w-px bg-ink/30" />
      </a>
    </section>
  );
}
