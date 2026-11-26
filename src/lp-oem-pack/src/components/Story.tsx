"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

// 目玉のセクション：スクロールに合わせて「ひとつの財布が売れるまで」が進む（画面は固定、場面だけ切り替わる）
type Scene = { no: string; en: string; t: string; b: string; img?: string; video?: string; meter?: boolean };
const SCENES: Scene[] = [
  { no: "01", en: "Select", t: "革を、手で選ぶ。", b: "イタリアン・国産・オリジナル。実物の革に触れて、ブランドに合う一枚を選びます。", img: "/images/studio-pick.webp" },
  { no: "02", en: "Design", t: "あなただけの形を、一から。", b: "クラファンは新しい製品が前提。デザインを図面にし、型紙と抜き型から起こします。仕様はチャットで固めるので止まりません。", img: "/images/studio-black.webp" },
  { no: "03", en: "Make", t: "ひと針ずつ、縫い上げる。", b: "タイの提携工場で、50個から。パーツの段階から検品して仕上げます。", video: "/images/sewing.mp4", img: "/images/sewing-poster.webp" },
  { no: "04", en: "Show", t: "こだわりを、売れる言葉に。", b: "撮影・構成・執筆までまとめて。革の産地や鞣しまで知っているから、根拠のある言葉で伝えられます。", img: "/images/studio-tag.webp" },
  { no: "05", en: "Sell", t: "クラファンで、一気に届ける。", b: "リターン設計から公開後の告知まで伴走。支援が集まった分だけ生産するので、在庫を抱えません。", meter: true },
  { no: "06", en: "Keep selling", t: "終わったあとも、売れ続ける。", b: "クラファンの写真と文章で自社ECを。追加生産も型紙があるので、すぐに。", img: "/images/studio-brown.webp" },
];

export default function Story() {
  const wrap = useRef<HTMLElement>(null);
  const [p, setP] = useState(0); // 0〜1：このセクションをどこまで進んだか
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setP(Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))));
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  const k = Math.min(SCENES.length - 1, Math.floor(p * SCENES.length));
  const inScene = p * SCENES.length - k; // その場面の中の進み具合（0〜1）
  const meterK = SCENES.findIndex((s) => s.meter);
  const fill = k > meterK ? 1 : k === meterK ? Math.min(1, inScene * 1.4) : 0;
  const total = Math.round(12_800_000 * fill);

  return (
    <section id="story" ref={wrap} className="relative bg-[#141210] text-white" style={{ height: `${SCENES.length * 85 + 15}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {SCENES.map((s, i) => (
          <div key={s.no} className={`absolute inset-0 transition-opacity duration-700 ${i === k ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== k}>
            {s.video ? (
              <video src={asset(s.video)} poster={s.img ? asset(s.img) : undefined} muted loop playsInline autoPlay preload="none" className="h-full w-full object-cover" />
            ) : s.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset(s.img)} alt="" loading="lazy" className={`h-full w-full object-cover transition-transform duration-[2500ms] ${i === k ? "scale-100" : "scale-110"}`} />
            ) : (
              // 売る：支援額のメーターが伸びる
              <div className="flex h-full w-full items-start justify-center bg-[radial-gradient(ellipse_at_center,#2a2219_0%,#141210_70%)] px-6 pt-[16svh] md:items-center md:pt-0">
                <div className="w-full max-w-xl">
                  <p className="text-[12px] tracking-[0.2em] text-white/60">支援総額（例）</p>
                  <p className="mt-2 font-num text-[44px] leading-none font-medium tabular-nums sm:text-[72px]">¥{total.toLocaleString("ja-JP")}</p>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(100, fill * 100)}%` }} /></div>
                  <div className="mt-2 flex justify-between text-[12px] text-white/60"><span>目標 ¥1,000,000</span><span className="font-num text-gold">達成率 {Math.round(fill * 1280)}%</span></div>
                  <p className="mt-4 text-[10.5px] text-white/40">※イメージです</p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent" />

        {/* 見出しと説明 */}
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-28 md:px-8 md:pb-20">
          <p className="font-display text-[11px] tracking-[0.35em] text-white/60 uppercase">Story — ひとつの財布が売れるまで</p>
          {SCENES.map((s, i) => (
            <div key={s.no} className={`transition-all duration-700 ${i === k ? "translate-y-0 opacity-100" : "pointer-events-none absolute translate-y-4 opacity-0"}`}>
              <p className="mt-4 flex items-baseline gap-3"><span className="font-num text-[15px] text-gold">{s.no}</span><span className="font-display text-[12px] tracking-[0.3em] text-white/60 uppercase">{s.en}</span></p>
              <h2 className="mt-2 text-[28px] leading-snug font-medium sm:text-[44px]">{s.t}</h2>
              <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-white/80">{s.b}</p>
            </div>
          ))}
          {/* 進み具合 */}
          <ol className="mt-7 flex gap-1.5" aria-label="進み具合">
            {SCENES.map((s, i) => <li key={s.no} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= k ? "bg-gold" : "bg-white/20"}`} />)}
          </ol>
        </div>
      </div>
    </section>
  );
}
