"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";
import Laurel from "./Laurel";

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
        <img src={asset("/images/work-totes.webp")} alt="仕上げ前の革のトートバッグと長財布が並ぶ作業台" className="h-full w-full object-cover object-[55%_45%]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/75 to-[#141210]/20" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-28 pb-10 text-center sm:text-left md:px-8 md:pb-20">
        <p className="hero-in font-display text-[11px] tracking-[0.35em] text-white/60 sm:text-[12px]" style={{ animationDelay: ".1s" }}>LEATHER OEM × CROWDFUNDING</p>
        <h1 className="mt-3 text-[42px] leading-[1.18] font-medium tracking-[0.02em] sm:text-[64px] lg:text-[84px]">
          <span className="line-mask"><span style={{ animationDelay: ".2s" }}>売れるまで、</span></span>
          <span className="line-mask"><span style={{ animationDelay: ".35s" }}><span className="text-gold">つくる。</span></span></span>
        </h1>

        {/* 実績のバッジ（月桂樹の輪）。クラファンの数字は 0 → 1億 まで数える */}
        <ul className="hero-in -mx-3 mt-7 flex justify-center sm:mx-0 sm:justify-start sm:gap-4" style={{ animationDelay: ".55s" }}>
          {[
            { top: "生産実績", big: "20", unit: "年", sub: "革製品づくり" },
            { top: "クラファン累計", big: n >= GOAL ? "1" : (n / 100_000_000).toFixed(2).replace(/0+$/, "").replace(/\.$/, ""), unit: "億円", sub: "支援達成" },
            { top: "小ロット", big: "50", unit: "個〜", sub: "カラー別OK" },
          ].map((x) => (
            <li key={x.top} className="relative grid aspect-square w-1/3 max-w-[150px] sm:w-[150px] place-items-center text-center text-[#e9cf8f]">
              <Laurel className="absolute inset-0 h-full w-full drop-shadow-[0_1px_6px_rgba(0,0,0,.35)]" />
              <div className="relative -mt-[6%] flex w-[64%] flex-col items-center gap-1 text-white [text-shadow:0_1px_10px_rgba(0,0,0,.4)]">
                <small className="text-[8.5px] leading-tight font-bold whitespace-nowrap text-white/90 min-[380px]:text-[10px] sm:text-[10px]">{x.top}</small>
                <b className="font-display text-[26px] min-[380px]:text-[30px] leading-none font-medium tabular-nums sm:text-[34px]">{x.big}<i className="ml-0.5 font-sans text-[9px] font-bold not-italic sm:text-[11px]">{x.unit}</i></b>
                <small className="mt-1 border-t border-[#e9cf8f]/70 pt-1 text-[7.5px] leading-tight whitespace-nowrap text-white/85 min-[380px]:text-[8.5px] sm:text-[9.5px]">{x.sub}</small>
              </div>
            </li>
          ))}
        </ul>

        <p className="hero-in mx-auto mt-6 max-w-xl text-[14px] sm:mx-0 leading-relaxed text-white/85 sm:text-[15px]" style={{ animationDelay: ".7s" }}>
          <span className="inline-block">小ロットOEMと、</span><span className="inline-block">売れるLP・クラファン・自社ECまで、</span><span className="inline-block">ひとつのチームで。</span>
        </p>
        <div className="hero-in mt-7 flex flex-col items-center gap-4 sm:flex-row sm:gap-8" style={{ animationDelay: ".85s" }}>
          <a href="#plans" className="group inline-flex w-full max-w-[340px] items-center justify-center gap-3 bg-gold px-7 py-4 sm:w-auto sm:py-3.5 text-[13.5px] tracking-[0.1em] whitespace-nowrap text-white transition hover:bg-white hover:text-ink">
            プランを見る <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </a>
          <a href="#story" className="border-b border-white/40 pb-0.5 text-[13px] tracking-[0.08em] whitespace-nowrap text-white transition hover:border-gold hover:text-gold">売れるまでの流れを見る ↓</a>
        </div>
      </div>
    </section>
  );
}
