"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { asset } from "@/lib/asset";

// 目玉のセクション：スクロールに合わせて「ひとつの財布が売れるまで」が進む（画面は固定、場面だけ切り替わる）
// 写真・動画は画面いっぱいに（被写体が切れないよう中心をずらす）。LP・クラファン・ECの場面は、暗くした写真の上に画面のイメージ
// pos：スマホの縦長の画面で切り抜くときに、写真のどこを中心にするか
type Visual = { kind: "photo"; src: string; alt: string; pos: string } | { kind: "video"; src: string; poster: string; pos: string } | { kind: "lp" } | { kind: "meter" } | { kind: "ec" };
type Scene = { no: string; en: string; t: string; b: string; v: Visual };
const SCENES: Scene[] = [
  { no: "01", en: "Select", t: "革を、手で選ぶ。", b: "イタリアン・国産・オリジナル。実物の革に触れて、ブランドに合う一枚を選びます。", v: { kind: "photo", src: "/images/studio-pick.webp", alt: "壁に掛かった革を手に取って選んでいるところ", pos: "22% 50%" } },
  { no: "02", en: "Design", t: "型紙と抜き型から、あなただけの形に。", b: "クラファンは新しい製品が前提。デザインを図面にし、型紙と抜き型をつくって、パーツを裁断します。", v: { kind: "photo", src: "/images/work-parts.webp", alt: "裁断した黒い革のパーツ", pos: "55% 55%" } },
  { no: "03", en: "Make", t: "ひと針ずつ、縫い上げる。", b: "タイの提携工場で、50個から。パーツの段階から検品して仕上げます。", v: { kind: "video", src: "/images/sewing.mp4", poster: "/images/sewing-poster.webp", pos: "62% 45%" } },
  { no: "04", en: "Show", t: "撮影して、売れるLPに。", b: "撮影・構成・執筆までまとめて。革の産地や鞣しまで知っているから、根拠のある言葉で伝えられます。", v: { kind: "lp" } },
  { no: "05", en: "Sell", t: "クラファンで、一気に届ける。", b: "リターン設計から公開後の告知まで伴走。写真は、実際に2,169%を達成した私たちのプロジェクトです。", v: { kind: "meter" } },
  { no: "06", en: "Keep selling", t: "自社ECで、売れ続ける。", b: "クラファンの写真と文章で、Shopifyのお店を。追加生産も型紙と抜き型があるので、すぐに。", v: { kind: "ec" } },
];

// スマホの枠
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full max-h-[440px] rounded-[26px] border-[5px] border-[#2c2824] bg-white shadow-2xl" style={{ aspectRatio: "9 / 18" }}>
      <div className="h-full overflow-hidden rounded-[21px] text-ink">{children}</div>
    </div>
  );
}

function Mock({ v, fill, total }: { v: Visual; fill: number; total: number }) {
  if (v.kind === "photo") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(v.src)} alt={v.alt} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: v.pos }} />;
  }
  if (v.kind === "video") {
    return <video src={asset(v.src)} poster={asset(v.poster)} muted loop playsInline autoPlay preload="none" className="h-full w-full object-cover" style={{ objectPosition: v.pos }} />;
  }
  if (v.kind === "lp") {
    // 売れるLP（イメージ）：クラファンでよく見る縦長のページを、画面の中で自動でスクロールして見せる
    const dot = ["#5b2a1e", "#8a4b2a", "#b8743a", "#2c3a4f", "#2f4a35", "#1d1d1f"];
    return (
      <Phone>
        <div className="h-full [container-type:size]">
          <div className="lp-autoscroll bg-white">
            {/* ファーストビュー：写真にキャッチコピー */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/images/studio-brown.webp")} alt="" className="aspect-[3/4] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
              <p className="absolute top-12 right-2 rounded-full bg-[#e85a4f] px-1.5 py-1 text-center text-[6px] leading-tight font-bold text-white">超早割<br /><b className="text-[9px]">30%</b><br />OFF</p>
              <p className="absolute top-3 left-3 bg-black/60 px-2 py-1 text-[13px] font-bold tracking-[0.08em] text-white">「縫わない美学」</p>
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p className="text-[12px] leading-snug font-bold">変化を楽しむ、大人の財布。</p>
                <p className="mt-0.5 text-[7px] text-white/85">イタリアンレザーの経年変化を、最大限に楽しむ。</p>
                <div className="mt-1.5 flex gap-1">{dot.map((c) => <span key={c} className="h-2.5 w-2.5 rounded-full ring-1 ring-white/70" style={{ background: c }} />)}</div>
              </div>
            </div>
            <p className="bg-[#1d1d1f] py-1.5 text-center text-[7.5px] font-bold tracking-wider text-[#e9cf8f]">20年のつくり手 × 累計1億円の実績</p>
            {/* こだわり */}
            <div className="px-3 pt-3">
              <p className="text-center text-[6.5px] tracking-[0.3em] text-[#b8860b]">POINT 01</p>
              <p className="mt-0.5 text-center text-[11px] font-bold">一枚ずつ選ぶ、イタリアンレザー</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/images/studio-tag.webp")} alt="" className="mt-1.5 aspect-[16/10] w-full rounded object-cover" />
              <p className="mt-1 text-[7px] leading-relaxed text-[#555]">植物のタンニンでゆっくり鞣した革。使うほどに艶が深まります。</p>
            </div>
            <div className="px-3 pt-3">
              <p className="text-center text-[6.5px] tracking-[0.3em] text-[#b8860b]">POINT 02</p>
              <p className="mt-0.5 text-center text-[11px] font-bold">縫い目のない、ひと続きの形</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/images/cf-wallet-nobu.webp")} alt="" className="mt-1.5 aspect-[4/3] w-full rounded bg-white object-contain" />
            </div>
            {/* 声 */}
            <div className="mx-3 mt-3 rounded bg-[#faf6ee] p-2">
              <p className="text-[8px] text-[#e8a317]">★★★★★</p>
              <p className="mt-0.5 text-[7px] leading-relaxed text-[#444]">「半年でいい色に育ちました。薄いのに小銭もお札もちゃんと入る」</p>
            </div>
            {/* リターン */}
            <div className="mx-3 mt-3 rounded border-2 border-[#e85a4f] p-2">
              <p className="text-[7px] font-bold text-[#e85a4f]">【超早割】数量限定 30%OFF</p>
              <p className="mt-0.5 flex items-baseline gap-1.5"><s className="text-[7.5px] text-[#999]">¥18,000</s><b className="text-[14px]">¥12,600</b><span className="text-[6.5px] text-[#999]">税込・送料込</span></p>
              <p className="mt-0.5 text-[6.5px] text-[#999]">残り 12 / 100</p>
            </div>
            <p className="mx-3 mt-2.5 mb-4 rounded bg-[#e85a4f] py-2 text-center text-[9px] font-bold text-white">このプロジェクトを応援する</p>
          </div>
        </div>
      </Phone>
    );
  }
  if (v.kind === "meter") {
    // 実際のクラファンページ（CAMPFIRE・公開中のプロジェクト）
    return (
      <Phone>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/cf-page.webp")} alt="CAMPFIREで2,169%を達成したプロジェクトページ" className="h-full w-full bg-white object-contain object-top" />
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

// 画面のイメージは、暗くぼかした写真の上に置く（ほかの場面と同じく画面いっぱいの見た目に）
const MOCK_BG: Record<string, string> = { lp: "/images/ai-shooting.webp", meter: "/images/work-totes.webp", ec: "/images/ai-ecshop.webp" };
function SceneVisual({ v, fill, total }: { v: Visual; fill: number; total: number }) {
  if (v.kind === "photo" || v.kind === "video") return <div className="relative h-full w-full"><Mock v={v} fill={fill} total={total} /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent" /></div>;
  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(MOCK_BG[v.kind])} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${v.kind === "lp" ? "opacity-80" : "scale-110 opacity-45 blur-[6px]"}`} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent" />
      <div className="absolute inset-x-0 top-[9svh] bottom-[46svh] flex justify-center md:top-[12svh] md:bottom-[12svh] md:left-1/2">
        <Mock v={v} fill={fill} total={total} />
      </div>
    </div>
  );
}

// 1場面あたりのスクロール量（画面の高さの何倍か）。大きいほどゆっくり切り替わる
const STEP = 0.9;

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
        // 1場面＝画面の高さ×STEP ぶんのスクロール。p は「いま何場面目か」（小数つき）
        setP(Math.max(0, -r.top / (innerHeight * STEP)));
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  const k = Math.min(SCENES.length - 1, Math.floor(p));
  const inScene = Math.min(1, p - k); // その場面の中の進み具合（0〜1）
  const meterK = SCENES.findIndex((s) => s.v.kind === "meter");
  const fill = k > meterK ? 1 : k === meterK ? Math.min(1, inScene * 1.4) : 0;
  const total = Math.round(12_800_000 * fill);

  return (
    <section id="story" ref={wrap} className="relative bg-[#141210] text-white" style={{ height: `${SCENES.length * STEP * 100 + 100}svh` }}>
      {/* 場面ごとの止まる位置：指で弾いても、1回で1場面ずつ進む */}
      {SCENES.map((s, i) => <span key={s.no} aria-hidden className="story-stop pointer-events-none absolute left-0 h-px w-px" style={{ top: `calc(${i * STEP * 100 + STEP * 5}svh + 80px)` }} />)}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {SCENES.map((s, i) => (
          <div key={s.no} className={`absolute inset-0 transition-opacity duration-700 ${i === k ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={i !== k}>
            <SceneVisual v={s.v} fill={fill} total={total} />
          </div>
        ))}

        {/* 見出しと説明 */}
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-28 md:px-8 md:pb-20">
          <div className="md:max-w-[46%]">
            <p className="font-display text-[11px] tracking-[0.35em] text-white/60 uppercase">Story — ひとつの財布が売れるまで</p>
            <div className="relative">
              {SCENES.map((s, i) => (
                <div key={s.no} className={`transition-all duration-700 ${i === k ? "relative translate-y-0 opacity-100" : "pointer-events-none absolute inset-x-0 top-0 translate-y-4 opacity-0"}`}>
                  <p className="mt-4 flex items-baseline gap-3"><span className="font-num text-[15px] text-gold">{s.no}</span><span className="font-display text-[12px] tracking-[0.3em] text-white/60 uppercase">{s.en}</span></p>
                  <h2 className="mt-2 text-[26px] leading-snug font-medium sm:text-[40px]">{s.t}</h2>
                  <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-white/80">{s.b}</p>
                </div>
              ))}
            </div>
            {/* 進み具合 */}
            <ol className="mt-7 flex gap-1.5" aria-label="進み具合">
              {SCENES.map((s, i) => <li key={s.no} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= k ? "bg-gold" : "bg-white/20"}`} />)}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
