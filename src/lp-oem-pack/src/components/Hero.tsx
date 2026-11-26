"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";
import Laurel from "./Laurel";

// ファーストビュー：革の壁の写真の上に、合言葉「売れるまで、つくる。」と、0 → 1億円まで一気に数える数字
const GOAL = 100_000_000;
// 写真のスライダー（自動で切り替わる）。pos：切り抜くときの中心
const SLIDES = [
  { src: "/images/work-totes.webp", alt: "仕上げ前の革のトートバッグと長財布が並ぶ作業台", pos: "55% 55%" },
  { src: "/images/studio-wall.webp", alt: "色とりどりの革が並ぶ工房の壁", pos: "50% 60%" },
  { src: "/images/work-pouches.webp", alt: "縫い上がった革のポーチが並ぶ工場", pos: "50% 55%" },
  { src: "/images/studio-brown.webp", alt: "茶色の革を台の上に広げているところ", pos: "50% 50%" },
  { src: "/images/work-parts.webp", alt: "裁断した黒い革のパーツ", pos: "50% 55%" },
];
export default function Hero() {
  const [n, setN] = useState(0);
  const [cur, setCur] = useState(0);
  // 4.5秒ごとに次の写真へ（動きを減らす設定のときは切り替えない）
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setCur((c) => (c + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);
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
      <div className="relative h-[30svh] shrink-0 overflow-hidden md:h-auto md:w-1/2">
        <div ref={bg} className="absolute inset-0 scale-[1.06] will-change-transform">
          {SLIDES.map((x, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={x.src} src={asset(x.src)} alt={i === cur ? x.alt : ""} aria-hidden={i !== cur} loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1600ms] ease-out ${i === cur ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`} style={{ objectPosition: x.pos }} />
          ))}
        </div>
        {/* いまの写真の位置（押すとその写真へ） */}
        <div className="absolute right-5 bottom-4 z-[1] flex gap-1.5 md:right-6 md:bottom-6">
          {SLIDES.map((x, i) => (
            <button key={x.src} type="button" onClick={() => setCur(i)} aria-label={`${i + 1}枚目の写真`} aria-current={i === cur} className="p-1">
              <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === cur ? "w-5 bg-white" : "w-2.5 bg-white/40"}`} />
            </button>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#141210] to-transparent md:inset-y-0 md:left-0 md:h-auto md:w-1/3 md:bg-gradient-to-r" />
      </div>

      <div className="relative flex flex-1 flex-col justify-between px-6 pt-4 pb-8 md:w-1/2 md:justify-center md:gap-12 md:px-[max(2rem,calc((100vw-72rem)/2+2rem))] md:pt-24 md:pr-12 md:pb-16">
        <div>
          <p className="hero-in mb-3 font-display text-[10.5px] tracking-[0.3em] text-white/55" style={{ animationDelay: ".1s" }}>LEATHER OEM / ODM × CROWDFUNDING</p>
          <h1 className="text-[40px] leading-[1.15] font-medium tracking-[0.02em] sm:text-[56px] lg:text-[68px]">
            <span className="line-mask"><span style={{ animationDelay: ".2s" }}>売れるまで、</span></span>
            <span className="line-mask"><span style={{ animationDelay: ".35s" }}><span className="text-gold">つくる。</span></span></span>
          </h1>
          <p className="hero-in mt-4 text-[13.5px] leading-relaxed text-white/80 sm:text-[15px]" style={{ animationDelay: ".5s" }}>
            <span className="inline-block">革製品づくり20年のつくり手が、</span><span className="inline-block">設計・生産から売れるLP、クラファン、</span><span className="inline-block">自社ECまで伴走します。</span>
          </p>
          {/* やることを4つの段で見せる */}
          <ol className="hero-in mt-4 grid grid-cols-4 gap-1.5 text-center sm:max-w-[480px]" style={{ animationDelay: ".6s" }}>
            {["設計・型紙", "小ロット生産", "LP×クラファン", "自社EC"].map((t, i) => (
              <li key={t} className="border border-white/15 bg-white/[.04] px-1 py-2">
                <span className="block font-num text-[10px] text-gold">0{i + 1}</span>
                <span className="mt-0.5 block text-[clamp(9px,2.7vw,12px)] leading-tight whitespace-nowrap text-white/85">{t}</span>
              </li>
            ))}
          </ol>
          <div className="hero-in mt-5 flex items-center gap-3" style={{ animationDelay: ".7s" }}>
            <a href="#plans" className="group inline-flex items-center gap-2 bg-white px-5 py-2.5 text-[13px] tracking-[0.06em] text-ink transition hover:bg-gold hover:text-white">
              プランを見る <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#contact" className="inline-flex items-center border border-white/40 px-5 py-2.5 text-[13px] tracking-[0.06em] text-white transition hover:border-gold hover:text-gold">無料で相談</a>
          </div>
        </div>

        {/* 実績の帯（月桂樹のバッジ）。クラファンの数字は 0 → 1億 まで数える */}
        <ul className="hero-in mt-6 grid grid-cols-3 border-t border-white/15 pt-4 md:mt-0 md:max-w-[480px]" style={{ animationDelay: ".85s" }}>
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
