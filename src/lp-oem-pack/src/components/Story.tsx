"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { asset } from "@/lib/asset";

// 目玉のセクション：スクロールに合わせて「ひとつの財布が売れるまで」が進む（画面は固定、場面だけ切り替わる）
// 写真は切り抜かずに全体を見せる。LP・クラファン・ECの場面は、画面のイメージで見せる
type Visual = { kind: "photo"; src: string; alt: string } | { kind: "video"; src: string; poster: string } | { kind: "lp" } | { kind: "meter" } | { kind: "ec" };
type Scene = { no: string; en: string; t: string; b: string; v: Visual };
const SCENES: Scene[] = [
  { no: "01", en: "Select", t: "革を、手で選ぶ。", b: "イタリアン・国産・オリジナル。実物の革に触れて、ブランドに合う一枚を選びます。", v: { kind: "photo", src: "/images/studio-pick.webp", alt: "壁に掛かった革を手に取って選んでいるところ" } },
  { no: "02", en: "Design", t: "型紙と抜き型から、あなただけの形に。", b: "クラファンは新しい製品が前提。デザインを図面にし、型紙と抜き型をつくって、パーツを裁断します。", v: { kind: "photo", src: "/images/work-parts.webp", alt: "裁断した黒い革のパーツ" } },
  { no: "03", en: "Make", t: "ひと針ずつ、縫い上げる。", b: "タイの提携工場で、50個から。パーツの段階から検品して仕上げます。", v: { kind: "video", src: "/images/sewing.mp4", poster: "/images/sewing-poster.webp" } },
  { no: "04", en: "Show", t: "撮影して、売れるLPに。", b: "撮影・構成・執筆までまとめて。革の産地や鞣しまで知っているから、根拠のある言葉で伝えられます。", v: { kind: "lp" } },
  { no: "05", en: "Sell", t: "クラファンで、一気に届ける。", b: "リターン設計から公開後の告知まで伴走。支援が集まった分だけ生産するので、在庫を抱えません。", v: { kind: "meter" } },
  { no: "06", en: "Keep selling", t: "自社ECで、売れ続ける。", b: "クラファンの写真と文章で、Shopifyのお店を。追加生産も型紙と抜き型があるので、すぐに。", v: { kind: "ec" } },
];

// スマホの枠
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full max-h-[460px] rounded-[26px] border-[5px] border-[#2c2824] bg-white shadow-2xl" style={{ aspectRatio: "9 / 18" }}>
      <div className="h-full overflow-hidden rounded-[21px] text-ink">{children}</div>
    </div>
  );
}

function SceneVisual({ v, fill, total }: { v: Visual; fill: number; total: number }) {
  if (v.kind === "photo") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(v.src)} alt={v.alt} loading="lazy" className="max-h-full max-w-full rounded-xl object-contain shadow-2xl" />;
  }
  if (v.kind === "video") {
    return <video src={asset(v.src)} poster={asset(v.poster)} muted loop playsInline autoPlay preload="none" className="max-h-full max-w-full rounded-xl object-contain shadow-2xl" />;
  }
  if (v.kind === "lp") {
    // 撮影した写真で作ったLP（イメージ）
    return (
      <Phone>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/model-long.webp")} alt="" className="aspect-[4/3] w-full object-cover" />
        <div className="px-3 pt-3">
          <p className="text-[7px] tracking-[0.2em] text-mute">NEW PROJECT</p>
          <p className="mt-1 text-[11px] leading-snug font-bold">20年の職人が選んだ革で、一生ものの長財布を。</p>
          <p className="mt-1.5 text-[7.5px] leading-relaxed text-mute">イタリアンレザーを、タンニンでゆっくり鞣して。使うほどに艶が出ます。</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/studio-tag.webp")} alt="" className="mt-2 aspect-[16/9] w-full rounded object-cover" />
          <p className="mt-2 rounded bg-[#e85a4f] py-1.5 text-center text-[9px] font-bold text-white">このプロジェクトを支援する</p>
        </div>
      </Phone>
    );
  }
  if (v.kind === "meter") {
    // クラファンのページ（イメージ）：支援額が伸びる
    return (
      <Phone>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/model-long.webp")} alt="" className="aspect-[4/3] w-full object-cover" />
        <div className="px-3 pt-3">
          <p className="text-[8px] text-mute">現在の支援総額</p>
          <p className="font-num text-[20px] leading-tight font-bold tabular-nums">¥{total.toLocaleString("ja-JP")}</p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#eee]"><div className="h-full rounded-full bg-[#e85a4f]" style={{ width: `${Math.min(100, fill * 100)}%` }} /></div>
          <p className="mt-1 flex justify-between text-[8px]"><span className="text-mute">目標 ¥1,000,000</span><b className="text-[#e85a4f] tabular-nums">{Math.round(fill * 1280)}%</b></p>
          <div className="mt-2.5 grid grid-cols-2 border-t border-[#eee] pt-2 text-center">
            <div><p className="text-[7px] text-mute">支援者</p><p className="text-[11px] font-bold tabular-nums">{Math.round(fill * 1240).toLocaleString()}人</p></div>
            <div><p className="text-[7px] text-mute">残り</p><p className="text-[11px] font-bold">12日</p></div>
          </div>
          <p className="mt-2.5 rounded bg-[#e85a4f] py-1.5 text-center text-[9px] font-bold text-white">支援する</p>
          <p className="mt-1.5 text-center text-[6.5px] text-mute">※イメージです</p>
        </div>
      </Phone>
    );
  }
  // 自社EC（Shopify）のお店（イメージ）
  const items = [["/images/model-long.webp", "長財布", "18,000"], ["/images/model-trifold.webp", "ミニ財布", "12,800"], ["/images/model-fragment.webp", "カードケース", "7,800"], ["/images/model-tote.webp", "トート", "29,000"]];
  return (
    <Phone>
      <div className="flex items-center justify-between border-b border-[#eee] px-3 py-2"><span className="font-display text-[10px] tracking-[0.3em]">YOUR BRAND</span><ShoppingBag size={11} /></div>
      <p className="px-3 pt-2 text-[8px] font-bold">クラファンで1,240人が選んだ革小物</p>
      <div className="grid grid-cols-2 gap-1.5 px-3 pt-2">
        {items.map(([src, n, p]) => (
          <div key={n}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(src)} alt="" className="aspect-square w-full rounded object-cover" />
            <p className="mt-0.5 text-[7.5px]">{n}</p><p className="text-[7.5px] font-bold">¥{p}</p>
          </div>
        ))}
      </div>
      <p className="mx-3 mt-2 rounded bg-ink py-1.5 text-center text-[8.5px] text-white">カートに入れる</p>
    </Phone>
  );
}

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
  const meterK = SCENES.findIndex((s) => s.v.kind === "meter");
  const fill = k > meterK ? 1 : k === meterK ? Math.min(1, inScene * 1.4) : 0;
  const total = Math.round(12_800_000 * fill);

  return (
    <section id="story" ref={wrap} className="relative bg-[#141210] text-white" style={{ height: `${SCENES.length * 85 + 15}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#2a2219_0%,#141210_65%)] px-6 pt-20 pb-24 md:flex-row-reverse md:items-center md:gap-12 md:px-[max(2rem,calc((100vw-72rem)/2+2rem))] md:pt-24 md:pb-16">
        {/* 絵（写真・動画・画面のイメージ） */}
        <div className="relative min-h-0 flex-1 md:h-[70svh]">
          {SCENES.map((s, i) => (
            <div key={s.no} className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${i === k ? "scale-100 opacity-100" : "pointer-events-none scale-[.97] opacity-0"}`} aria-hidden={i !== k}>
              <SceneVisual v={s.v} fill={fill} total={total} />
            </div>
          ))}
        </div>

        {/* 見出しと説明 */}
        <div className="relative mt-5 shrink-0 md:mt-0 md:w-[42%]">
          <p className="font-display text-[10.5px] tracking-[0.3em] text-white/60 uppercase">Story — ひとつの財布が売れるまで</p>
          <div className="relative">
            {SCENES.map((s, i) => (
              <div key={s.no} className={`transition-all duration-700 ${i === k ? "relative translate-y-0 opacity-100" : "pointer-events-none absolute inset-x-0 top-0 translate-y-3 opacity-0"}`}>
                <p className="mt-3 flex items-baseline gap-3"><span className="font-num text-[15px] text-gold">{s.no}</span><span className="font-display text-[12px] tracking-[0.3em] text-white/60 uppercase">{s.en}</span></p>
                <h2 className="mt-1.5 text-[23px] leading-snug font-medium sm:text-[34px]">{s.t}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-white/80 sm:text-[14px]">{s.b}</p>
              </div>
            ))}
          </div>
          {/* 進み具合 */}
          <ol className="mt-5 flex gap-1.5" aria-label="進み具合">
            {SCENES.map((s, i) => <li key={s.no} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= k ? "bg-gold" : "bg-white/20"}`} />)}
          </ol>
        </div>
      </div>
    </section>
  );
}
