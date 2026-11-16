"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";
import { useLp } from "./LpContext";

// 実際の財布の写真（ロゴを消したもの）の、ロゴがあった場所に、入力したブランド名を押して見せる
type Finish = "gold" | "silver" | "blind";
const FINISHES: { id: Finish; name: string }[] = [
  { id: "gold", name: "金箔" },
  { id: "silver", name: "銀箔" },
  { id: "blind", name: "素押し" },
];

// x・y は写真（1408×768）上のロゴの位置。anchor はロゴの揃え方、fs は文字の大きさ（写真の幅に対する%）
const WALLETS = [
  { id: "long", name: "ラウンド長財布", color: "ダークブラウン", img: "blank-long", x: 1107, y: 566, anchor: "right", fs: 3.1 },
  { id: "bifold", name: "二つ折り財布", color: "ネイビー", img: "blank-bifold", x: 482, y: 558, anchor: "left", fs: 2.6 },
  { id: "trifold", name: "三つ折りミニ財布", color: "キャメル", img: "blank-trifold", x: 702, y: 389, anchor: "center", fs: 2.6 },
  { id: "fragment", name: "フラグメントケース", color: "ブラック", img: "blank-fragment", x: 703, y: 540, anchor: "center", fs: 2.8 },
] as const;

export default function StampExperience() {
  const { sendBrandToContact } = useLp();
  const [name, setName] = useState("");
  const [finish, setFinish] = useState<Finish>("gold");
  const [w, setW] = useState<(typeof WALLETS)[number]>(WALLETS[0]);
  const [press, setPress] = useState(0); // 押すたびに演出をやり直す
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const shown = (name.trim() || "YOUR BRAND").slice(0, 18);
  const fit = Math.min(1, 10 / Math.max(shown.length, 1));

  // 画面に入ったら、最初の1回を押す
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); setPress((p) => p + 1); io.disconnect(); } }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onName = (v: string) => {
    setName(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPress((p) => p + 1), 650);
  };
  const choose = (fn: () => void) => { fn(); setPress((p) => p + 1); };

  const pos: React.CSSProperties = { top: `${(w.y / 768) * 100}%`, fontSize: `${w.fs * fit}cqw` };
  if (w.anchor === "center") Object.assign(pos, { left: `${(w.x / 1408) * 100}%`, translate: "-50% -50%" });
  if (w.anchor === "left") Object.assign(pos, { left: `${(w.x / 1408) * 100}%`, translate: "0 -50%" });
  if (w.anchor === "right") Object.assign(pos, { right: `${100 - (w.x / 1408) * 100}%`, translate: "0 -50%" });

  return (
    <section ref={ref} id="stamp" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="reveal mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="font-display text-[12px] tracking-[0.4em] text-mute">EXPERIENCE</p>
          <h2 className="mt-4 text-[26px] leading-snug font-medium tracking-[0.06em] md:text-[36px]">
            <span className="inline-block">あなたのブランドを、</span><span className="inline-block">刻んでみる。</span>
          </h2>
          <p className="mt-5 text-[14px] leading-loose text-mute"><span className="inline-block">ブランド名を入れると、</span><span className="inline-block">実際の財布に押した</span><span className="inline-block">イメージが見られます。</span></p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
          {/* 財布の写真と刻印 */}
          <div className="relative aspect-[1408/768] w-full overflow-hidden bg-paper [container-type:inline-size]">
            {WALLETS.map((x) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={x.id} src={asset(`/images/${x.img}.webp`)} alt={`${x.color}の${x.name}`} loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${x.id === w.id ? "opacity-100" : "opacity-0"}`} />
            ))}
            <div key={`${press}-${w.id}`} className="absolute" style={pos}>
              {seen && <span className="stamp-die small" aria-hidden />}
              <p className={`stamp-mark on-photo ${finish} font-display leading-none tracking-[0.12em] whitespace-nowrap`} aria-live="polite">{shown}</p>
              {seen && finish !== "blind" && <span className="stamp-glow" aria-hidden />}
            </div>
          </div>

          {/* 操作 */}
          <div>
            <label className="block">
              <span className="text-[11px] tracking-[0.3em] text-mute">BRAND NAME</span>
              <input value={name} onChange={(e) => onName(e.target.value)} maxLength={18} placeholder="ブランド名を入力" autoComplete="off"
                className="mt-2 w-full border-b border-line bg-transparent pb-2 font-display text-[22px] tracking-[0.1em] text-ink outline-none placeholder:font-sans placeholder:text-[14px] placeholder:tracking-normal placeholder:text-mute/60 focus:border-ink" />
            </label>

            <p className="mt-9 text-[11px] tracking-[0.3em] text-mute">FINISH</p>
            <div className="mt-3 flex gap-6 border-b border-line">
              {FINISHES.map((f) => (
                <button key={f.id} type="button" onClick={() => choose(() => setFinish(f.id))} aria-pressed={finish === f.id}
                  className={`-mb-px border-b pb-2.5 text-[14px] transition ${finish === f.id ? "border-ink text-ink" : "border-transparent text-mute hover:text-ink"}`}>{f.name}</button>
              ))}
            </div>

            <p className="mt-9 text-[11px] tracking-[0.3em] text-mute">MODEL</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {WALLETS.map((x) => (
                <button key={x.id} type="button" onClick={() => choose(() => setW(x))} aria-pressed={w.id === x.id} aria-label={`${x.color}の${x.name}`}
                  className={`overflow-hidden border transition ${w.id === x.id ? "border-ink" : "border-line hover:border-mute"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(`/images/${x.img}.webp`)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-mute">{w.name}・{w.color}</p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <button type="button" onClick={() => sendBrandToContact(`【刻印イメージ】${shown} / ${FINISHES.find((f) => f.id === finish)!.name} / ${w.name}（${w.color}）`)}
                className="group inline-flex items-center gap-3 bg-ink px-7 py-3.5 text-[13.5px] tracking-[0.1em] text-white transition hover:bg-gold">
                この名前で見積もり・相談 <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </button>
              <button type="button" onClick={() => setPress((p) => p + 1)} className="border-b border-ink/40 pb-0.5 text-[13px] text-ink transition hover:border-gold hover:text-gold">もう一度押す</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
