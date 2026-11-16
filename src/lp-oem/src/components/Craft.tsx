"use client";

import { useEffect, useRef } from "react";
import { Hand, ScanSearch, Sparkles } from "lucide-react";
import { asset } from "@/lib/asset";
import Phrase from "./Phrase";

const POINTS = [
  { icon: Hand, title: "箔押しは職人の手作業", body: "温度と圧を革ごとに見極め、1点ずつ押していきます。" },
  { icon: ScanSearch, title: "国内で全数検品", body: "ロゴのかすれ・ズレ・キズを、出荷前にすべて確認します。" },
  { icon: Sparkles, title: "仕上げまで丁寧に", body: "コバ磨きや糸始末まで整えて、すぐ販売できる状態に。" },
];

export default function Craft() {
  const img = useRef<HTMLDivElement>(null);

  // スクロールに合わせて写真をゆっくり動かす（奥行き）
  useEffect(() => {
    const el = img.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.parentElement!.getBoundingClientRect();
        const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        el.style.transform = `translate3d(0, ${k * -40}px, 0) scale(1.12)`;
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
        <div className="clip-up relative aspect-[16/10] overflow-hidden rounded-3xl">
          <div ref={img} className="absolute inset-0 will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/images/craft-press.webp")} alt="真鍮の箔押し機で、革財布にロゴを押す職人の手元" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 font-display text-[11px] tracking-[0.25em] text-ink backdrop-blur">HANDCRAFTED</span>
        </div>
        <div className="reveal-r">
          <p className="font-display text-sm tracking-[0.35em] text-gold uppercase">Craftsmanship</p>
          <h2 className="mt-3 text-[26px] leading-snug font-bold tracking-wide md:text-4xl md:leading-snug">
            <Phrase text="ロゴひとつにも、|職人の手を。" />
          </h2>
          <div className="grow-line mt-5 h-px bg-gold-2" />
          <p className="mt-6 text-[15px] leading-loose text-mute">
            <Phrase text="型は定番でも、|仕上がりは妥協しません。|ブランドの顔になるロゴを、|一つひとつ丁寧に刻みます。" />
          </p>
          <ul className="mt-8 space-y-5">
            {POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-2/50 text-gold"><Icon size={19} strokeWidth={1.5} /></span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-mute">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
