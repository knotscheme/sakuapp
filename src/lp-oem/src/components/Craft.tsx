"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import Phrase from "./Phrase";

const STEPS = [
  { en: "SELECT", title: "革を選ぶ", body: "一枚ごとに表情の違う革を、職人が手で確かめて選別。キズや厚みのムラがない部分だけを使います。", img: "craft-select", alt: "広げた革の表面を手で確かめる職人" },
  { en: "SEW", title: "縫い上げる", body: "革専用のミシンで、ひと針ずつ均一に。ステッチの美しさが、財布の印象を決めます。", img: "craft-sew", alt: "革専用のミシンで財布を縫う職人の手元" },
  { en: "STAMP", title: "ロゴを刻む", body: "温度と圧を革ごとに見極め、あなたのロゴを1点ずつ箔押し・刻印します。", img: "craft-press", alt: "真鍮の箔押し機で革財布にロゴを押す職人の手元" },
  { en: "INSPECT", title: "検品して届ける", body: "ロゴのかすれ・ズレ・縫製まで国内で全数検品。すぐに販売できる状態でお届けします。", img: "craft-inspect", alt: "仕上がった財布を手に取って検品する職人" },
];

export default function Craft() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [prog, setProg] = useState(0);

  // パソコン：画面に固定したまま、スクロール量に合わせて工程と写真を切り替える
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const total = r.height - innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
        setProg(p);
        setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length * 0.999)));
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);

  const head = (
    <div>
      <p className="font-display text-sm tracking-[0.35em] text-gold uppercase">Craftsmanship</p>
      <h2 className="mt-3 text-[26px] leading-snug font-bold tracking-wide md:text-4xl md:leading-snug">
        <Phrase text="ロゴひとつにも、|職人の手を。" />
      </h2>
      <p className="mt-5 text-[15px] leading-loose text-mute">
        <Phrase text="型は定番でも、|仕上がりは妥協しません。|革選びから検品まで、|職人が一貫して手がけます。" />
      </p>
    </div>
  );

  return (
    <section className="bg-white">
      {/* パソコン：スクロールで工程を見せる */}
      <div ref={wrap} className="relative hidden lg:block" style={{ height: `${STEPS.length * 85 + 40}vh` }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[.8fr_1.2fr] items-center gap-16 px-8">
            <div>
              {head}
              <ol className="mt-10 space-y-1">
                {STEPS.map((s, i) => (
                  <li key={s.en} className={`relative border-l py-4 pl-6 transition-all duration-500 ${i === active ? "border-gold" : "border-line"}`}>
                    <span className={`absolute top-0 -left-px h-full w-[2px] origin-top bg-gold transition-transform duration-500 ${i === active ? "scale-y-100" : "scale-y-0"}`} />
                    <p className={`font-display text-xs tracking-[0.3em] transition-colors ${i === active ? "text-gold" : "text-mute/60"}`}>{String(i + 1).padStart(2, "0")} — {s.en}</p>
                    <p className={`mt-1 text-lg font-bold transition-colors ${i === active ? "text-ink" : "text-ink/35"}`}>{s.title}</p>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ${i === active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <p className="overflow-hidden text-[14px] leading-loose text-mute"><span className="block pt-2">{s.body}</span></p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative">
              <div className="relative aspect-[16/11] overflow-hidden rounded-3xl bg-line shadow-[0_40px_80px_-50px_rgba(0,0,0,.6)]">
                {STEPS.map((s, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={s.img} src={asset(`/images/${s.img}.webp`)} alt={s.alt} loading={i ? "lazy" : "eager"}
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform,clip-path] duration-[1100ms] ease-[cubic-bezier(.6,0,.2,1)] ${i === active ? "scale-100 opacity-100 [clip-path:inset(0_0_0_0)]" : i < active ? "scale-105 opacity-0 [clip-path:inset(0_0_0_0)]" : "scale-110 opacity-100 [clip-path:inset(100%_0_0_0)]"}`} />
                ))}
                <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1.5 font-display text-[11px] tracking-[0.25em] text-ink backdrop-blur">{String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")} · {STEPS[active].en}</span>
              </div>
              <div className="mt-5 h-[2px] w-full overflow-hidden rounded bg-line">
                <div className="h-full origin-left bg-gradient-to-r from-gold to-gold-2" style={{ transform: `scaleX(${prog})` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* スマホ・タブレット：縦に並べる */}
      <div className="mx-auto max-w-xl px-5 py-20 lg:hidden">
        <div className="reveal">{head}</div>
        <ol className="mt-10 space-y-12">
          {STEPS.map((s, i) => (
            <li key={s.en}>
              <div className="clip-up overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(`/images/${s.img}.webp`)} alt={s.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              </div>
              <div className="reveal mt-5">
                <p className="font-display text-xs tracking-[0.3em] text-gold">{String(i + 1).padStart(2, "0")} — {s.en}</p>
                <p className="mt-1 text-lg font-bold">{s.title}</p>
                <p className="mt-2 text-[14px] leading-loose text-mute">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
