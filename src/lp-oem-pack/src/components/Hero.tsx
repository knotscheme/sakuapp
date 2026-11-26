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

  const badges = [
    { top: "生産実績", big: "20", unit: "年", sub: "革製品づくり" },
    { top: "クラファン累計", big: n >= GOAL ? "1" : (n / 100_000_000).toFixed(2).replace(/0+$/, "").replace(/\.$/, ""), unit: "億円", sub: "支援達成" },
    { top: "小ロット", big: "50", unit: "個〜", sub: "カラー別OK" },
  ];

  // 写真（上・PCは右）と文字（下・PCは左）を分ける。文字はすべて左ぞろえ・同じ幅
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#141210] text-white md:flex-row-reverse">
      <div className="relative h-[44svh] shrink-0 overflow-hidden md:h-auto md:w-1/2">
        <div ref={bg} className="absolute inset-0 scale-[1.06] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/work-totes.webp")} alt="仕上げ前の革のトートバッグと長財布が並ぶ作業台" className="h-full w-full object-cover object-[55%_55%]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#141210] to-transparent md:inset-y-0 md:left-0 md:h-auto md:w-1/3 md:bg-gradient-to-r" />
      </div>

      <div className="relative flex flex-1 flex-col justify-between px-6 pt-4 pb-8 md:w-1/2 md:justify-center md:gap-12 md:px-[max(2rem,calc((100vw-72rem)/2+2rem))] md:pt-24 md:pr-12 md:pb-16">
        <div>
          <h1 className="text-[44px] leading-[1.15] font-medium tracking-[0.02em] sm:text-[60px] lg:text-[72px]">
            <span className="line-mask"><span style={{ animationDelay: ".2s" }}>売れるまで、</span></span>
            <span className="line-mask"><span style={{ animationDelay: ".35s" }}><span className="text-gold">つくる。</span></span></span>
          </h1>
          <p className="hero-in mt-4 text-[clamp(10.5px,3.4vw,15px)] tracking-[0.02em] whitespace-nowrap text-white/75" style={{ animationDelay: ".55s" }}>小ロットOEM × 売れるLP × クラファン × 自社EC</p>
          <a href="#plans" className="hero-in group mt-6 flex w-full items-center justify-center gap-3 bg-white py-4 text-[14px] tracking-[0.1em] text-ink transition hover:bg-gold hover:text-white md:w-auto md:max-w-[320px]" style={{ animationDelay: ".7s" }}>
            プランを見る <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </a>
        </div>

        {/* 実績の帯（月桂樹のバッジ）。クラファンの数字は 0 → 1億 まで数える */}
        <ul className="hero-in mt-7 grid grid-cols-3 border-t border-white/15 pt-5 md:mt-0 md:max-w-[480px]" style={{ animationDelay: ".85s" }}>
          {badges.map((x) => (
            <li key={x.top} className="relative mx-auto grid aspect-square w-full max-w-[140px] place-items-center text-center text-[#e9cf8f]">
              <Laurel className="absolute inset-0 h-full w-full drop-shadow-[0_1px_6px_rgba(0,0,0,.35)]" />
              <div className="relative -mt-[6%] flex w-[64%] flex-col items-center gap-1 text-white">
                <small className="text-[8px] leading-tight font-bold whitespace-nowrap text-white/90 min-[380px]:text-[10px]">{x.top}</small>
                <b className="font-display text-[24px] leading-none font-medium tabular-nums min-[380px]:text-[32px]">{x.big}<i className="ml-0.5 font-sans text-[10px] font-bold not-italic">{x.unit}</i></b>
                <small className="mt-0.5 border-t border-[#e9cf8f]/70 pt-1 text-[7.5px] leading-tight whitespace-nowrap text-white/85 min-[380px]:text-[9px]">{x.sub}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
