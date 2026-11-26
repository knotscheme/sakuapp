"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import NoOrphan from "./NoOrphan";

// 職人の工程：画面いっぱいの写真が、スクロールで場面ごとに切り替わる（スマホも同じ）
const STEPS = [
  { en: "Select", title: "革を選ぶ", body: "一枚ごとに表情の違う革を、職人が手で確かめて選別。キズや厚みのムラがない部分だけを使います。", img: "craft-select", alt: "広げた革の表面を手で確かめる職人" },
  { en: "Sew", title: "縫い上げる", body: "革専用のミシンで、ひと針ずつ均一に。ステッチの美しさが、財布の印象を決めます。", img: "craft-sew", alt: "革専用のミシンで財布を縫う職人の手元" },
  { en: "Stamp", title: "ロゴを刻む", body: "温度と圧を革ごとに見極め、あなたのロゴを1点ずつ箔押し・刻印します。", img: "craft-press", alt: "真鍮の箔押し機で革財布にロゴを押す職人の手元" },
  { en: "Inspect", title: "検品して届ける", body: "ロゴのかすれ・ズレ・縫製まで国内で全数検品。すぐに販売できる状態でお届けします。", img: "craft-inspect", alt: "仕上がった財布を手に取って検品する職人" },
];

export default function Craft() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1); // -1 は導入の場面
  const [local, setLocal] = useState(0); // 場面の中の進み具合（写真をゆっくり動かす）

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const total = r.height - innerHeight;
        const p = total > 0 ? Math.min(0.9999, Math.max(0, -r.top / total)) : 0;
        const n = STEPS.length + 1; // 導入＋4工程
        const idx = Math.floor(p * n);
        setActive(idx - 1);
        setLocal(p * n - idx);
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);

  const cur = Math.max(0, active);

  return (
    <section aria-label="職人の工程" className="bg-ink">
      <div ref={wrap} className="relative" style={{ height: `${(STEPS.length + 1) * 100}svh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {STEPS.map((s, i) => (
            <div key={s.img} className={`absolute inset-0 transition-[opacity,clip-path] duration-[1200ms] ease-[cubic-bezier(.6,0,.2,1)] ${i === cur ? "opacity-100 [clip-path:inset(0_0_0_0)]" : i < cur ? "opacity-0 [clip-path:inset(0_0_0_0)]" : "opacity-100 [clip-path:inset(100%_0_0_0)]"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(`/images/${s.img}.webp`)} alt={s.alt} loading="lazy" className="h-full w-full object-cover"
                style={{ transform: `scale(${i === cur ? 1.12 - 0.08 * (active < 0 ? 0 : local) : 1.12})`, transition: "transform .2s linear" }} />
            </div>
          ))}
          {/* 文字を読みやすくする影 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
          <div className={`pointer-events-none absolute inset-0 bg-black/55 transition-opacity duration-700 ${active < 0 ? "opacity-100" : "opacity-0"}`} />

          {/* 導入の見出し */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white transition-all duration-700 ${active < 0 ? "opacity-100" : "pointer-events-none -translate-y-6 opacity-0"}`}>
            <p className="font-display text-[12px] tracking-[0.5em] text-white/60">CRAFTSMANSHIP</p>
            <h2 className="mt-5 text-[30px] leading-[1.6] font-normal tracking-[0.14em] md:text-[46px]">
              <span className="inline-block">ロゴひとつにも、</span><span className="inline-block">職人の手を。</span>
            </h2>
            <p className="mt-6 max-w-md text-[13.5px] leading-loose text-white/70"><span className="inline-block">型は定番でも、</span><span className="inline-block">仕上がりは妥協しません。</span><span className="inline-block">革選びから検品まで、</span><span className="inline-block">職人が一貫して手がけます。</span></p>
            <span className="scroll-cue mt-10 block h-12 w-px bg-white/50" />
          </div>

          {/* 工程の文字 */}
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-14 text-white md:px-10 md:pb-20">
            {STEPS.map((s, i) => (
              <div key={s.en} className={`absolute bottom-14 left-6 right-6 transition-all duration-700 md:bottom-20 md:left-10 md:max-w-xl ${i === active ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none translate-y-6 opacity-0"}`}>
                <p className="font-display text-[clamp(56px,10vw,120px)] leading-none text-white/90">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-display text-[12px] tracking-[0.45em] text-white/60 uppercase">{s.en}</p>
                <h3 className="mt-2 text-[24px] font-medium tracking-[0.1em] md:text-[30px]">{s.title}</h3>
                <p className="mt-3 max-w-md text-[13.5px] leading-loose text-white/75 md:text-[14.5px]"><NoOrphan text={s.body} /></p>
              </div>
            ))}
          </div>

          {/* 進み具合 */}
          <div className="absolute top-1/2 right-5 flex -translate-y-1/2 flex-col gap-3 md:right-10">
            {STEPS.map((s, i) => (
              <span key={s.en} className="relative block h-10 w-px overflow-hidden bg-white/25">
                <span className="absolute inset-x-0 top-0 block bg-white transition-[height] duration-300" style={{ height: i < active ? "100%" : i === active ? `${local * 100}%` : "0%" }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
