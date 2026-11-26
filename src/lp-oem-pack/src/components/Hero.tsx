"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";
import Laurel from "./Laurel";

// ファーストビュー：革の壁の写真の上に、合言葉「「アイデア」を、「売れた」に。」と、0 → 1億円まで一気に数える数字
// 写真のスライダー（自動で切り替わる）。pos：切り抜くときの中心
const SLIDES = [
  { src: "/images/work-totes.webp", alt: "仕上げ前の革のトートバッグと長財布が並ぶ作業台", pos: "55% 55%" },
  { src: "/images/studio-wall.webp", alt: "色とりどりの革が並ぶ工房の壁", pos: "50% 60%" },
  { src: "/images/work-pouches.webp", alt: "縫い上がった革のポーチが並ぶ工場", pos: "50% 55%" },
  { src: "/images/studio-brown.webp", alt: "茶色の革を台の上に広げているところ", pos: "50% 50%" },
  { src: "/images/work-parts.webp", alt: "裁断した黒い革のパーツ", pos: "50% 55%" },
];
export default function Hero() {
  const [cur, setCur] = useState(0);
  // 4.5秒ごとに次の写真へ（動きを減らす設定のときは切り替えない）
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setCur((c) => (c + 1) % SLIDES.length), 3200);
    return () => clearInterval(t);
  }, []);
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // スクロールで写真をゆっくり寄せる
    const on = () => { if (bg.current) bg.current.style.transform = `scale(${1.06 + Math.min(1, scrollY / innerHeight) * 0.12})`; };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  const badges = [
    { top: "生産実績", big: "20", unit: "年", sub: "革製品づくり" },
    { top: "クラファン", big: "1", unit: "億円", sub: "累計支援額" },
    { top: "小ロット", big: "50", unit: "個〜", sub: "カラー別OK" },
  ];

  // 写真を大きく（スマホは上55%、PCは全面）。見出しは写真に重ねて大きく。写真は3.2秒ごとに切り替わり、ゆっくり寄る
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#141210] text-white md:block">
      <div className="relative h-[62svh] shrink-0 overflow-hidden md:absolute md:inset-0 md:h-auto">
        <div ref={bg} className="absolute inset-0 scale-[1.06] will-change-transform">
          {SLIDES.map((x, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={x.src} src={asset(x.src)} alt={i === cur ? x.alt : ""} aria-hidden={i !== cur} loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${i === cur ? "hero-kb opacity-100" : "opacity-0"}`} style={{ objectPosition: x.pos }} />
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 -bottom-[3px] bg-gradient-to-t from-[#141210] from-[3px] via-[#141210]/25 to-black/30 md:bg-gradient-to-r md:from-[#141210] md:via-[#141210]/70 md:to-transparent" />
        {/* いまの写真の位置（押すとその写真へ） */}
        <div className="absolute top-20 right-4 z-[2] flex flex-col gap-1 md:top-auto md:right-8 md:bottom-8 md:flex-row">
          {SLIDES.map((x, i) => (
            <button key={x.src} type="button" onClick={() => setCur(i)} aria-label={`${i + 1}枚目の写真`} aria-current={i === cur} className="p-1">
              <span className={`block rounded-full transition-all duration-300 ${i === cur ? "h-5 w-[3px] bg-white md:h-[3px] md:w-6" : "h-2.5 w-[3px] bg-white/40 md:h-[3px] md:w-2.5"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-[1] -mt-48 flex flex-1 flex-col px-6 pb-8 md:mx-auto md:mt-0 md:min-h-[100svh] md:max-w-6xl md:justify-center md:px-8 md:pt-24 md:pb-16">
        <p className="hero-in font-display text-[10px] tracking-[0.18em] whitespace-nowrap text-white/75 min-[380px]:text-[10.5px] min-[380px]:tracking-[0.3em]" style={{ animationDelay: ".05s" }}>LEATHER OEM / ODM × CROWDFUNDING</p>
        <h1 className="mt-2 text-[clamp(34px,11.2vw,56px)] leading-[1.08] font-bold tracking-[0.01em] [text-shadow:0_2px_24px_rgba(0,0,0,.5)] sm:text-[72px] lg:text-[96px]">
          <span className="line-mask"><span style={{ animationDelay: ".1s" }}>「アイデア」を、</span></span>
          <span className="line-mask"><span style={{ animationDelay: ".2s" }}><span className="text-gold">「売れた」</span>に。</span></span>
        </h1>
        <p className="hero-in mt-4 max-w-md text-[14px] leading-relaxed text-white/85 sm:text-[15.5px]" style={{ animationDelay: ".3s" }}>
          <span className="inline-block">革製品づくり20年のつくり手が、</span><span className="inline-block">設計・小ロット生産から売れるLP、</span><span className="inline-block">クラファン、自社ECまで伴走。</span>
        </p>
        <div className="hero-in mt-5 flex items-center gap-3" style={{ animationDelay: ".4s" }}>
          <a href="#plans" className="group inline-flex items-center gap-2 bg-gold px-5 py-2.5 text-[13px] tracking-[0.06em] text-white transition hover:bg-white hover:text-ink">
            プランを見る <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </a>
          <a href="#contact" className="inline-flex items-center border border-white/50 px-5 py-2.5 text-[13px] tracking-[0.06em] text-white transition hover:border-gold hover:text-gold">無料で相談</a>
        </div>

        {/* 実績（月桂樹のバッジ） */}
        <ul className="hero-in mt-auto grid grid-cols-3 pt-6 md:mt-12 md:max-w-[480px]" style={{ animationDelay: ".5s" }}>
          {badges.map((x) => (
            <li key={x.top} className="relative mx-auto grid aspect-square w-full max-w-[140px] place-items-center text-center text-[#e9cf8f]">
              <Laurel className="absolute inset-0 h-full w-full drop-shadow-[0_1px_6px_rgba(0,0,0,.35)]" />
              <div className="relative mt-[1%] flex w-[60%] flex-col items-center gap-0.5 text-white">
                <small className="text-[8px] leading-tight font-bold whitespace-nowrap text-white/90 min-[380px]:text-[10px]">{x.top}</small>
                <b className="font-display text-[22px] leading-none font-medium tabular-nums min-[380px]:text-[28px]">{x.big}<i className="ml-0.5 font-sans text-[10px] font-bold not-italic">{x.unit}</i></b>
                <small className="mt-0.5 border-t border-[#e9cf8f]/70 pt-0.5 text-[7.5px] leading-tight whitespace-nowrap text-white/85 min-[380px]:text-[9px]">{x.sub}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
