"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, Check, ChevronRight, Copy, FileSpreadsheet, Plug, Rss, Search, X } from "lucide-react";
import J from "@/components/J";
import { Laptop, Phone } from "@/components/Devices";
import { SAMPLE_URL } from "@/lib/check";
import { PLATFORMS, type Method } from "@/lib/platforms";

const IMG = "/sakuapp/works/tsurete/img/lp";

// ---------- 動きのための小さな道具 ----------
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 要素が画面のどこにあるか（0：画面の下から入りはじめ → 1：画面の上から出きる）
function useProgress<T extends HTMLElement>(mode: "pass" | "sticky" = "pass") {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    if (reduced()) { setP(mode === "sticky" ? 1 : 0.5); return; }
    let raf = 0;
    const tick = () => {
      raf = 0; const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const stick = (el.firstElementChild as HTMLElement | null)?.offsetHeight ?? vh;
      const v = mode === "sticky" ? -r.top / Math.max(1, r.height - stick) : (vh - r.top) / (vh + r.height);
      setP(Math.min(1, Math.max(0, v)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [mode]);
  return [ref, p] as const;
}
// 一度だけ「画面に入った」を知らせる
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reduced()) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "0px 0px -4% 0px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ref, on] = useInView<HTMLDivElement>();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] ${on ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${className}`}>{children}</div>;
}
// 数字が数えあがる
function Count({ to, suffix = "", from = 0 }: { to: number; suffix?: string; from?: number }) {
  const [ref, on] = useInView<HTMLSpanElement>();
  const [v, setV] = useState(from);
  useEffect(() => {
    if (!on) return;
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const k = Math.min(1, (t - t0) / 1400); setV(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [on, to, from]);
  return <span ref={ref} className="num">{v.toLocaleString("ja-JP")}{suffix}</span>;
}

// ---------- ヒーローのスマホ：AIの答えが「直す前 → 直した後」で入れかわる ----------
const BEFORE = [{ b: "しずく舎", i: "やさしい化粧水", w: "敏感肌向けと明記" }, { b: "Lunae", i: "バリアローション", w: "皮膚科医と共同開発" }, { b: "NORMA BASIC", i: "化粧水", w: "口コミが多い" }];
const AFTER = [{ b: "SORAE", i: "化粧水 しっとり", w: "無香料・アルコールフリーで敏感肌向けと明記", me: true }, { b: "しずく舎", i: "やさしい化粧水", w: "敏感肌向けと明記" }, { b: "Lunae", i: "バリアローション", w: "皮膚科医と共同開発" }];
function ChatScreen({ after }: { after: boolean }) {
  const list = after ? AFTER : BEFORE;
  return (
    <div className="flex h-full flex-col bg-white text-[#1d1d1f]">
      <div className="flex items-center justify-center gap-2 border-b border-black/5 py-3 text-[15px] font-semibold"><Bot size={18} className="text-[#00a37a]" />AIアシスタント</div>
      <div className="flex-1 space-y-4 px-4 pt-5">
        <p className="ml-auto w-fit max-w-[80%] rounded-[20px] rounded-br-md bg-[#0a84ff] px-4 py-2.5 text-[16px] leading-[1.55] text-white">敏感肌でも使える、3,000円台の化粧水は？</p>
        <p className="text-[15px] text-[#6e6e73]">おすすめを3つ選びました。</p>
        <ol key={String(after)} className="fade-in space-y-2.5">
          {list.map((x, i) => (
            <li key={x.b} className={`flex gap-3 rounded-2xl p-3.5 ${"me" in x ? "bg-[#e3f6ef] ring-2 ring-[#00a37a]" : "bg-[#f2f2f7]"}`}>
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${"me" in x ? "bg-[#00a37a] text-white" : "bg-white text-[#6e6e73]"}`}>{i + 1}</span>
              <span className="min-w-0"><b className={`block text-[15px] leading-[1.5] ${"me" in x ? "text-[#007a5a]" : ""}`}>{x.b}　{x.i}</b><span className="mt-0.5 block text-[13px] leading-[1.6] text-[#6e6e73]">{x.w}</span></span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mx-4 mb-9 mt-4 rounded-full bg-[#f2f2f7] px-4 py-3 text-[15px] text-[#8e8e93]">メッセージを入力</div>
    </div>
  );
}
function Hero() {
  const [after, setAfter] = useState(false);
  const [ref, p] = useProgress<HTMLDivElement>();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); const id = setInterval(() => setAfter((a) => !a), 3600); return () => { clearTimeout(t); clearInterval(id); }; }, []);
  return (
    <section className="overflow-hidden px-5 pb-10 pt-16 text-center sm:pt-24">
      <div className={`transition duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)] ${ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <p className="text-[1.05rem] font-semibold text-[#00a37a] sm:text-[1.2rem]">TSURETE</p>
        <h1 className="lp-h mx-auto mt-3 max-w-[14em] text-[2.4rem] sm:text-[4.2rem]"><span className="inline-block">AIの売り場で、</span><span className="inline-block">あなたの商品は</span><span className="inline-block">何番目？</span></h1>
        <p className="mx-auto mt-5 max-w-[30em] text-[1.05rem] leading-[1.8] text-[#6e6e73] sm:text-[1.3rem]"><J>AIにすすめられる回数を、毎週自動ではかる。全商品の商品ページを、まとめて直す。</J></p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link href="/" className="btn btn-ai px-7">デモを使ってみる</Link>
          <a href="#try" className="flex items-center text-[1.02rem] text-[#00a37a] hover:underline">無料で診断<ChevronRight size={18} /></a>
        </div>
      </div>
      <div ref={ref} className={`relative mx-auto mt-16 w-[15.5rem] transition-opacity duration-[1400ms] sm:mt-20 sm:w-[18rem] ${ready ? "opacity-100" : "opacity-0"}`} style={{ transform: `translateY(${ready ? (0.5 - p) * 60 : 80}px)`, transition: "opacity 1.4s, transform .9s cubic-bezier(.2,.7,.2,1)" }}>
        <Phone><ChatScreen after={after} /></Phone>
        <div className="mt-6 flex justify-center gap-3 sm:contents">
          <div className={`whitespace-nowrap rounded-2xl px-4 py-3 text-left shadow-[0_20px_40px_-20px_rgba(0,0,0,.25)] transition duration-500 sm:absolute sm:-left-44 sm:top-48 ${after ? "bg-[#00a37a] text-white" : "bg-white text-[#1d1d1f] ring-1 ring-black/5"}`}>
            <p className="text-[0.7rem] font-semibold opacity-80">{after ? "TSURETEで直した後" : "直す前"}</p>
            <p className="text-[1.5rem] font-bold leading-tight">{after ? "1位" : "圏外"}</p>
          </div>
          <div className="whitespace-nowrap rounded-2xl bg-white px-4 py-3 text-left shadow-[0_20px_40px_-20px_rgba(0,0,0,.25)] ring-1 ring-black/5 sm:absolute sm:-right-48 sm:bottom-36">
            <p className="text-[0.7rem] text-[#6e6e73]">AIにすすめられた割合</p>
            <p className="num text-[1.3rem] font-bold">10% <span className="text-[#86868b]">→</span> <span className="text-[#00a37a]">70%</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- 黒い場面：スクロールに合わせて「検索の10件」が「AIの3つ」に変わる ----------
// サイト名・ブランド名はすべて架空
const SEARCH = [
  { t: "敏感肌の化粧水おすすめ15選｜選び方も解説", u: "hada-guide.example", n: "はだガイド", d: "敏感肌でも使いやすい化粧水を、成分・価格・口コミで比べました。" },
  { t: "しずく舎 やさしい化粧水｜公式通販", u: "shizukusha.example", n: "しずく舎", d: "敏感肌のために作った、無香料・アルコールフリーの化粧水。" },
  { t: "3,000円台の化粧水ランキング", u: "cosme-rank.example", n: "コスメランク", d: "3,000円台で買える化粧水を、人気順に紹介します。" },
  { t: "Lunae バリアローション 150ml", u: "lunae.example", n: "Lunae", d: "皮膚科医と共同開発したローション。" },
  { t: "【口コミ】敏感肌でも使える化粧水まとめ", u: "kuchikomi.example", n: "くちコミ広場", d: "実際に使った人の声を集めました。" },
  { t: "NORMA BASIC 化粧水｜公式", u: "normabasic.example", n: "NORMA BASIC", d: "毎日たっぷり使える、手ごろな化粧水。" },
  { t: "化粧水の選び方を皮膚科医に聞いた", u: "health-mag.example", n: "ヘルスマガジン", d: "肌タイプ別の選び方を解説。" },
  { t: "あおば研究所 保湿ローション", u: "aoba-lab.example", n: "あおば研究所", d: "セラミド配合の保湿ローション。" },
  { t: "アルコールフリー化粧水を比較", u: "hikaku.example", n: "ひかくナビ", d: "アルコールが入っていない化粧水を比べました。" },
  { t: "SORAE 化粧水 しっとり 150ml", u: "sorae-skin.example", n: "SORAE", d: "空のように澄んだ肌へ。毎日のうるおいに。", me: true },
];
const PICKS = [{ b: "しずく舎　やさしい化粧水", w: "敏感肌向けと明記されている" }, { b: "Lunae　バリアローション", w: "皮膚科医と共同開発" }, { b: "NORMA BASIC　化粧水", w: "口コミが多く、手ごろ" }];
function TenToThree() {
  const [ref, p] = useProgress<HTMLElement>("sticky");
  const stage = p < 0.3 ? 0 : p < 0.65 ? 1 : 2;
  // 検索結果は、スクロールに合わせて下へ流れ、最後に10位（自分の商品）が見える
  const box = useRef<HTMLDivElement>(null), list = useRef<HTMLOListElement>(null);
  const [over, setOver] = useState(0);
  useEffect(() => {
    let w = 0;
    const m = () => { if (window.innerWidth === w) return; w = window.innerWidth; if (box.current && list.current) setOver(Math.max(0, list.current.scrollHeight - box.current.clientHeight)); };
    m(); window.addEventListener("resize", m); return () => window.removeEventListener("resize", m);
  }, []);
  const k0 = Math.min(1, Math.max(0, (p - 0.04) / 0.2));
  const lines = ["検索なら、10件。", "AIなら、3つ。", "3つに入らなければ、ないのと同じ。"];
  return (
    <section ref={ref} className="relative h-[300vh] bg-black text-white" aria-label="検索とAIの違い">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5 pt-12">
        <div className="relative h-[5.5rem] w-full max-w-[44rem] text-center sm:h-[8rem]">
          {lines.map((t, i) => <h2 key={t} className={`lp-h absolute inset-0 grid place-items-center text-[1.75rem] transition duration-700 sm:text-[3.4rem] ${stage === i ? "translate-y-0 opacity-100" : stage > i ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0"} ${i === 2 ? "text-[#2fd9a6]" : ""}`}><J>{t}</J></h2>)}
        </div>

        {/* 白い画面：はじめは検索結果ページ、AIの段階ではチャット画面 */}
        <div className="mt-4 w-full max-w-[34rem] overflow-hidden rounded-[22px] bg-white text-[#202124] shadow-[0_30px_80px_-30px_rgba(47,217,166,.35)] sm:mt-7">
          <div className="relative h-[5.6rem] border-b border-black/[.06] sm:h-[5.4rem]">
            <div className={`absolute inset-0 px-4 pt-3 transition duration-700 ${stage === 0 ? "opacity-100" : "-translate-y-2 opacity-0"}`}>
              <div className="flex h-9 items-center gap-2.5 rounded-full border border-black/10 px-4 text-[0.85rem] shadow-[0_1px_4px_rgba(0,0,0,.08)]"><Search size={15} className="shrink-0 text-[#5f6368]" />敏感肌 化粧水 3000円</div>
              <p className="mt-3 flex gap-4 px-1 text-[0.72rem] text-[#5f6368]"><span className="border-b-2 border-[#1a73e8] pb-1 font-semibold text-[#1a73e8]">すべて</span><span>画像</span><span>ショッピング</span><span>ニュース</span></p>
            </div>
            <div className={`absolute inset-0 flex flex-col justify-between px-4 pb-2.5 pt-2.5 transition duration-700 ${stage >= 1 ? "opacity-100" : "translate-y-2 opacity-0"}`}>
              <p className="flex items-center gap-1 text-[0.82rem] font-semibold text-[#0d0d0d]">AIアシスタント<ChevronRight size={14} className="rotate-90 text-[#8e8e8e]" /></p>
              <span className="ml-auto rounded-[20px] bg-[#f4f4f4] px-3.5 py-1.5 text-[0.84rem] text-[#0d0d0d]">敏感肌でも使える、3,000円台の化粧水は？</span>
            </div>
          </div>

          <div ref={box} className="overflow-hidden transition-[height] duration-700 [--serp-h:19rem] sm:[--serp-h:25rem]" style={{ height: stage === 0 ? "var(--serp-h)" : undefined }}>
          {stage >= 1 && <p className="fade-in px-4 pt-3 text-[0.86rem] leading-[1.8] text-[#0d0d0d]">敏感肌でも使える3,000円台の化粧水なら、次の3つがおすすめです。</p>}
          <ol ref={list} className="px-4 py-3 will-change-transform" style={{ transform: stage === 0 ? `translate3d(0,-${Math.round(over * k0)}px,0)` : "none" }} aria-hidden>
            {SEARCH.map((r, i) => {
              const ai = stage >= 1 && i < 3, gone = stage >= 1 && i >= 3;
              return (
                <li key={r.u} className="overflow-hidden transition-all duration-700" style={{ opacity: gone ? 0 : 1, maxHeight: gone ? 0 : ai ? "4rem" : "4.6rem", marginTop: i && !gone ? (ai ? "0.55rem" : "0.15rem") : 0, transform: gone ? "translateX(-24px)" : "none", transitionDelay: `${gone ? (i - 3) * 40 : 0}ms` }}>
                  {ai ? (
                    <div className="fade-in flex gap-2 text-[0.86rem] leading-[1.7] text-[#0d0d0d]">
                      <span className="w-4 shrink-0 text-right">{i + 1}.</span>
                      <span className="min-w-0"><b className="font-semibold">{PICKS[i].b.replace("　", " ")}</b><span className="block text-[0.8rem] text-[#5d5d5d]">{PICKS[i].w}</span></span>
                    </div>
                  ) : (
                    <div className={`rounded-xl px-2 py-1.5 sm:py-2 ${"me" in r ? "bg-[#e6f6f0] ring-1 ring-[#00a37a]/40" : ""}`}>
                      <p className="flex items-center gap-2 text-[0.68rem] leading-tight">
                        <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[0.55rem] font-bold text-white ${"me" in r ? "bg-[#00a37a]" : "bg-[#9aa0a6]"}`}>{r.n.slice(0, 1)}</span>
                        <span className="truncate text-[#202124]">{r.n}</span><span className="hidden truncate text-[#5f6368] sm:inline">https://{r.u}</span>
                      </p>
                      <p className={`mt-0.5 truncate text-[0.86rem] leading-snug sm:text-[0.95rem] ${"me" in r ? "font-semibold text-[#00805f]" : "text-[#1a0dab]"}`}>{r.t}</p>
                      <p className="hidden truncate text-[0.74rem] text-[#4d5156] sm:block">{r.d}</p>
                    </div>
                  )}
                </li>
              );
            })}

            {/* 最後：自分の商品は、AIの答えに入っていない */}
            <li className={`overflow-hidden transition-all duration-700 ${stage === 2 ? "mt-3 max-h-24 opacity-100" : "mt-0 max-h-0 opacity-0"}`}>
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#00a37a]/60 bg-[#f3fbf8] px-3.5 py-2.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-dashed border-[#00a37a]/70 text-[0.68rem] text-[#00a37a]">？</span>
                <span className="min-w-0"><b className="block truncate text-[0.9rem] text-[#00805f]">SORAE　化粧水 しっとり</b><span className="block text-[0.74rem] text-[#6e6e73]">検索では10位。AIの答えには、入っていない</span></span>
              </div>
            </li>
          </ol>
          </div>
          <div className={`overflow-hidden transition-all duration-700 ${stage >= 1 ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="mx-3 mb-3 flex items-center gap-2 rounded-full border border-black/10 py-1.5 pl-3 pr-1.5 shadow-[0_2px_8px_rgba(0,0,0,.06)]">
              <span className="text-[1.1rem] leading-none text-[#5d5d5d]">＋</span>
              <span className="flex-1 text-[0.82rem] text-[#8e8e8e]">何でも聞いてください</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0d0d0d] text-white"><ArrowRight size={14} className="-rotate-90" /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- ノートパソコンが大きくなり、iPhoneが横から入る ----------
function Showcase() {
  const [ref, p] = useProgress<HTMLDivElement>();
  const k = Math.min(1, Math.max(0, (p - 0.1) / 0.4)); // 0 → 1
  return (
    <section className="bg-[#f5f5f7] px-5 py-24 sm:py-36">
      <Reveal className="text-center">
        <h2 className="lp-h text-[2rem] sm:text-[3.4rem]">ひと目で、今週がわかる。</h2>
        <p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>開いたら、数字とやることだけ。パソコンでも、スマホでも。</J></p>
      </Reveal>
      <div ref={ref} className="relative mx-auto mt-16 max-w-[60rem] pr-[10%] sm:mt-24 sm:pr-[12%]">
        <div style={{ transform: `scale(${0.86 + 0.14 * k})`, transformOrigin: "50% 100%" }}><Laptop silver src={`${IMG}/dash-pc.webp?v=3`} alt="パソコンで見たTSURETEのホーム画面" /></div>
        <div className="absolute bottom-[-2%] right-0 w-[22%]" style={{ transform: `translateX(${(1 - k) * 60}%)`, opacity: 0.2 + 0.8 * k }}><Phone src={`${IMG}/dash-phone.webp?v=3`} alt="スマホで見たTSURETEのホーム画面" /></div>
      </div>
    </section>
  );
}

// しくみの3つの見本（写真ではなく部品で描くので、スマホでも欠けない）
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_30px_60px_-36px_rgba(0,0,0,.28)] ring-1 ring-black/[.04] sm:p-8">
      <p className="text-[0.95rem] font-semibold">{title}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}
function RankVisual() {
  const [ref, on] = useInView<HTMLDivElement>();
  const rows = [["NORMA BASIC", 71], ["しずく舎", 70], ["Lunae", 68], ["あおば研究所", 51], ["SORAE", 10]] as const;
  return (
    <div ref={ref}><Card title="AIの売り場での順位">
      <ul className="space-y-3.5">
        {rows.map(([n, v], i) => { const me = n === "SORAE"; return (
          <li key={n} className="grid grid-cols-[1.2rem_6.8rem_1fr_2.6rem] items-center gap-3 text-[0.9rem]">
            <span className={`num ${me ? "text-[#00a37a]" : "text-[#86868b]"}`}>{i + 1}</span>
            <b className={`truncate font-semibold ${me ? "text-[#00a37a]" : ""}`}>{n}</b>
            <span className="h-2 overflow-hidden rounded-full bg-[#ececf0]"><span className={`block h-full rounded-full transition-[width] duration-[1200ms] ease-out ${me ? "bg-[#00a37a]" : "bg-[#c7c7cc]"}`} style={{ width: on ? `${v}%` : 0, transitionDelay: `${i * 90}ms` }} /></span>
            <span className={`num text-right ${me ? "font-semibold text-[#00a37a]" : "text-[#6e6e73]"}`}>{v}%</span>
          </li>); })}
      </ul>
      <p className="mt-6 rounded-2xl bg-[#f5f5f7] px-4 py-3 text-[0.84rem] leading-[1.7] text-[#424245]">いまは <b className="text-[#1d1d1f]">5位</b>。1位の店には、「だれ向けか」「よくある質問」が書かれています。</p>
    </Card></div>
  );
}
function FixVisual() {
  const [used, setUsed] = useState(false);
  return (
    <Card title="商品ページの書き直し案">
      <div className="flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sakuapp/works/tsurete/img/products/lotion.webp?v=3" alt="" width={72} height={72} className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-2xl object-cover" />
        <div className="min-w-0"><b className="block text-[0.95rem]">SORAE 化粧水 しっとり</b><p className="mt-1 text-[0.82rem] leading-[1.7] text-[#86868b] line-through decoration-[#c7c7cc]">空のように澄んだ肌へ。毎日のうるおいに寄りそう、SORAEの化粧水。</p></div>
      </div>
      <div className={`mt-5 rounded-2xl p-4 transition-colors duration-500 ${used ? "bg-[#e3f6ef]" : "border border-dashed border-[#00a37a]/50"}`}>
        <p className="text-[0.75rem] font-semibold text-[#00a37a]">{used ? "書きかえました" : "AIの書き直し案"}</p>
        <p className="mt-1.5 text-[0.9rem] leading-[1.8]"><J>敏感肌・乾燥肌の方のために作った化粧水です。香料・アルコールは入っていません。</J></p>
      </div>
      <button type="button" onClick={() => setUsed(!used)} className={`mt-4 rounded-full px-5 py-2 text-[0.86rem] font-semibold transition-colors ${used ? "bg-[#f5f5f7] text-[#424245]" : "bg-[#1d1d1f] text-white"}`}>{used ? "もとに戻す" : "この案を使う"}</button>
    </Card>
  );
}
function SalesVisual() {
  const [ref, on] = useInView<HTMLDivElement>();
  const w = [2, 1, 3, 2, 2, 3, 2, 3, 6], lab = ["9/22", "", "10/6", "", "10/20", "", "11/3", "", "今週"];
  return (
    <div ref={ref}><Card title="AI経由の注文">
      <p><b className="text-[2.2rem] font-bold leading-none">{on ? <Count to={64100} /> : 0}</b><span className="ml-1 text-[0.9rem] text-[#6e6e73]">円</span><span className="ml-2 text-[0.85rem] font-semibold text-[#00a37a]">直す前より増えた売上</span></p>
      <div className="mt-6 flex h-32 items-end gap-2">
        {w.map((v, i) => <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <span className={`w-full rounded-full transition-[height] duration-[1000ms] ease-out ${i === w.length - 1 ? "bg-[#00a37a]" : "bg-[#d9d9de]"}`} style={{ height: on ? `${(v / 6) * 100}%` : "4%", transitionDelay: `${i * 70}ms` }} />
          <span className={`h-3 text-[0.62rem] ${i === w.length - 1 ? "font-semibold text-[#00a37a]" : "text-[#86868b]"}`}>{lab[i]}</span>
        </div>)}
      </div>
    </Card></div>
  );
}
const VISUALS = [RankVisual, FixVisual, SalesVisual];

const STEPS = [
  { n: "測る", h: "AIの中での順位を、毎週。", d: "お客様が聞きそうな質問を、TSURETEが毎週自動で、ChatGPTなど4つのAIに何百回も聞いて、すすめられた回数と順位を記録します。", img: ["rank.webp?v=3", 1000, 738] },
  { n: "直す", h: "足りないものを、AIが書き直す。", d: "よくすすめられている店との差を、AIが商品ページの書き直し案にします。押すだけで、お店のサイトに合った方法で届けます。", img: ["naosu.webp?v=3", 1000, 965] },
  { n: "売上", h: "効いたかどうかは、お金で。", d: "AIにすすめられて来たお客様と、その売上を数えます。直した効果を、はっきり確かめられます。", img: ["sales.webp?v=3", 1000, 572] },
] as const;

function Bars() {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="grid gap-3 md:grid-cols-2 sm:gap-4">
      {[
        { t: "いまの商品説明", d: "空のように澄んだ肌へ。毎日のうるおいに寄りそう、SORAEの化粧水。", v: 10, c: "#c2410c", tone: "text-[#6e6e73]" },
        { t: "AIが書き直した後", d: "敏感肌・乾燥肌の方のために作った化粧水です。香料・アルコールは入っていません。朝晩使って約2か月、1日あたり約55円。", v: 70, c: "#00a37a", tone: "" },
      ].map((x, i) => (
        <div key={x.t} className="flex flex-col rounded-[28px] bg-white p-8 sm:p-10">
          <p className={`text-[0.9rem] font-semibold ${i ? "text-[#00a37a]" : "text-[#6e6e73]"}`}>{x.t}</p>
          <p className={`mt-4 flex-1 text-[1.02rem] leading-[1.9] ${x.tone}`}><J>{x.d}</J></p>
          <p className="mt-10 text-[0.85rem] text-[#6e6e73]">AIにすすめられた割合</p>
          <p className="mt-1 text-[3rem] font-bold leading-none" style={{ color: x.c }}>{on ? <Count to={x.v} suffix="%" /> : "0%"}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8e8ed]"><div className="h-full rounded-full transition-[width] duration-[1600ms] ease-out" style={{ width: on ? `${x.v}%` : 0, background: x.c, transitionDelay: `${i * 250}ms` }} /></div>
        </div>
      ))}
    </div>
  );
}

const WAYS: { m: Method | "feed"; icon: typeof Plug; t: string; d: string }[] = [
  { m: "api", icon: Plug, t: "自動で書きかえ", d: "押すだけで商品ページが書きかわる" },
  { m: "csv", icon: FileSpreadsheet, t: "CSVで一括", d: "サイトの取りこみ用CSVをお渡し" },
  { m: "copy", icon: Copy, t: "コピーして貼る", d: "どんなサイトでも" },
  { m: "feed", icon: Rss, t: "商品フィード", d: "サイトの外から、AIに商品を届ける" },
];

export default function Page() {
  const router = useRouter();
  const [url, setUrl] = useState(SAMPLE_URL);
  // ページの外側（引っぱったときに見える部分）も白にする
  // 黒い場面の上では、上のメニューも黒くする（Appleのサイトと同じ）
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.querySelector('[aria-label="検索とAIの違い"]');
    const on = () => { if (!el) return; const r = el.getBoundingClientRect(); setDark(r.top <= 48 && r.bottom >= 48); };
    on(); window.addEventListener("scroll", on, { passive: true }); return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { const b = document.body.style.background; document.body.style.background = "#fff"; document.documentElement.style.colorScheme = "light"; return () => { document.body.style.background = b; document.documentElement.style.colorScheme = ""; }; }, []);
  return (
    <div className="lp-light min-h-screen overflow-x-clip">
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-500 ${dark ? "border-white/10 bg-black/70 text-white" : "border-black/5 bg-white/75"}`}>
        <div className="mx-auto flex h-12 max-w-[1000px] items-center gap-8 px-5 text-[0.8rem]">
          <Link href="/lp/" className="flex items-center gap-1.5 font-semibold tracking-[.18em]"><span className="h-1.5 w-1.5 rounded-full bg-[#00a37a]" />TSURETE</Link>
          <nav className={`hidden gap-7 sm:flex ${dark ? "text-white/70" : "text-[#424245]"}`}><a href="#how" className="hover:text-black">しくみ</a><a href="#sites" className="hover:text-black">対応サイト</a><a href="#try" className="hover:text-black">無料診断</a></nav>
          <Link href="/" className={`ml-auto rounded-full px-3.5 py-1 text-[0.78rem] font-semibold transition-colors ${dark ? "bg-white text-black" : "bg-[#1d1d1f] text-white"}`}>デモを使う</Link>
        </div>
      </header>

      <main>
        <Hero />

        {/* お客様は、もうAIに聞いて買っている */}
        <section className="px-5 pb-24 pt-14 sm:pb-36 sm:pt-24">
          <Reveal className="text-center">
            <h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><span className="inline-block">お客様は、もう</span><span className="inline-block">「AIに聞いて」買っている。</span></h2>
            <p className="mx-auto mt-4 max-w-[32em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>検索して何ページも見くらべるより、AIに「おすすめは？」と聞くほうが早いから。</J></p>
          </Reveal>
          <Reveal className="mx-auto mt-14 max-w-[64rem]" delay={120}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/ask-ai.webp?v=3`} alt="ソファでスマホのAIに相談している人" width={1264} height={848} loading="lazy" className="block h-auto w-full rounded-[28px] object-cover sm:rounded-[36px]" />
          </Reveal>
        </section>

        <TenToThree />
        <Showcase />

        {/* 数字 */}
        <section className="px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><span className="inline-block">AIへの質問は、</span><span className="inline-block">ぜんぶ自動。</span></h2><p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>お店の人がAIに聞く必要はありません。TSURETEが毎週決まった日に聞いて、結果とやることを届けます。</J></p></Reveal>
          <div className="mx-auto mt-16 grid max-w-[56rem] grid-cols-2 gap-y-12 text-center sm:grid-cols-4">
            {[{ v: 960, s: "回", l: "毎週、自動で聞く回数" }, { v: 4, s: "つ", l: "自動で調べるAI" }, { v: 7, s: "項目", l: "点検する情報" }, { v: 9, s: "種類", l: "対応するサイト" }].map((x) => (
              <Reveal key={x.l}><p className="text-[2.6rem] font-bold leading-none sm:text-[3.4rem]"><Count to={x.v} /><span className="ml-1 text-[1.2rem] font-semibold">{x.s}</span></p><p className="mt-3 text-[0.88rem] text-[#6e6e73]">{x.l}</p></Reveal>
            ))}
          </div>
        </section>

        {/* しくみ */}
        <section id="how" className="scroll-mt-12 bg-[#f5f5f7] px-5 pb-20 pt-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><span className="inline-block">測る。直す。</span><span className="inline-block">売上で確かめる。</span></h2></Reveal>
          <div className="mx-auto mt-14 max-w-[62rem] space-y-20 sm:mt-20 sm:space-y-40">
            {STEPS.map((s, i) => (
              <div key={s.n} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <Reveal className={i % 2 ? "lg:order-2" : ""}>
                  <p className="text-[1rem] font-semibold text-[#00a37a]">{s.n}</p>
                  <h3 className="lp-h mt-2 text-[1.8rem] sm:text-[2.4rem]"><J>{s.h}</J></h3>
                  <p className="mt-5 text-[1.02rem] leading-[1.95] text-[#6e6e73]"><J>{s.d}</J></p>
                </Reveal>
                <Reveal className={i % 2 ? "lg:order-1" : ""} delay={150}>{(() => { const V = VISUALS[i]; return <V />; })()}</Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* 書き直す前と後 */}
        <section className="px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]">書き直すと、こう変わる。</h2><div className="mt-6 flex items-center justify-center gap-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/sakuapp/works/tsurete/img/products/lotion.webp?v=3" alt="" width={56} height={56} className="h-14 w-14 rounded-2xl object-cover" /><p className="text-left text-[0.88rem] leading-[1.6] text-[#6e6e73]">見本：SORAE 化粧水<br />（架空のブランド・模擬の結果）</p></div></Reveal>
          <div className="mx-auto mt-16 max-w-[60rem] rounded-[36px] bg-[#f5f5f7] p-3 sm:p-4"><Bars /></div>
        </section>

        {/* 対応サイト */}
        <section id="sites" className="scroll-mt-12 bg-[#f5f5f7] px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]">どのサイトでも。</h2><p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73]"><J>測るのは、サイトに何も入れずに。直すときは、サイトに合わせて届け方を選べます。</J></p></Reveal>
          <div className="mx-auto mt-16 grid max-w-[60rem] gap-4 sm:grid-cols-2">
            {WAYS.map(({ m, icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 90} className="h-full">
                <div className="flex h-full flex-col rounded-[28px] bg-white p-8">
                  <Icon size={30} strokeWidth={1.6} className="text-[#00a37a]" />
                  <b className="mt-6 text-[1.3rem]">{t}</b>
                  <p className="mt-1 text-[0.95rem] text-[#6e6e73]"><J>{d}</J></p>
                  <p className="mt-6 text-[0.88rem] leading-[1.9] text-[#424245]">{(m === "feed" ? ["すべてのサイト"] : PLATFORMS.filter((p) => p.method === m).map((p) => p.name)).join("・")}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 小さなネットショップのために */}
        <section className="px-5 py-24 sm:py-36">
          <div className="mx-auto grid max-w-[64rem] items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <Reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/owner.webp?v=3`} alt="自宅の作業机でネットショップを運営している人" width={1376} height={768} loading="lazy" className="block h-auto w-full rounded-[28px] object-cover sm:rounded-[36px]" />
            </Reveal>
            <Reveal delay={150}>
              <h2 className="lp-h text-[2rem] sm:text-[2.6rem] lg:text-[2.3rem]"><span className="inline-block">小さなネットショップの、</span><span className="inline-block">AI担当に。</span></h2>
              <p className="mt-5 text-[1.02rem] leading-[1.95] text-[#6e6e73]"><J>大きな会社のように、AI対策の担当者は置けない。TSURETEが毎週自動ではかって、やることだけを届けます。</J></p>
              <p className="mt-8 text-[0.85rem] font-semibold text-[#1d1d1f]">比べて選ばれる商品なら、ジャンルは問いません。</p>
              <p className="mt-3 flex flex-wrap gap-2">{["スキンケア", "食品・お菓子", "雑貨・インテリア", "アパレル", "ハンドメイド", "ベビー用品", "ペット用品"].map((t) => <span key={t} className="rounded-full bg-[#f5f5f7] px-3.5 py-1.5 text-[0.85rem]">{t}</span>)}</p>
            </Reveal>
          </div>
        </section>

        {/* AIに自分で聞くのと何が違う */}
        <section className="bg-[#f5f5f7] px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><span className="inline-block">AIに自分で聞くのと、</span><span className="inline-block">何が違う？</span></h2></Reveal>
          <div className="mx-auto mt-16 grid max-w-[52rem] gap-4 md:grid-cols-2">
            <Reveal><div className="h-full rounded-[28px] bg-white p-8 sm:p-10"><p className="text-[1rem] font-semibold text-[#6e6e73]">AIに自分で聞く</p><ul className="mt-6 space-y-4 text-[0.98rem] text-[#6e6e73]">{["1回聞いた答えだけ（答えは毎回変わる）", "自分の商品だけを見る", "1商品ずつコピペ", "効いたか分からない", "毎回、自分で聞きに行く"].map((t) => <li key={t} className="flex gap-3"><X size={18} className="mt-1 shrink-0 opacity-50" /><span className="min-w-0"><J>{t}</J></span></li>)}</ul></div></Reveal>
            <Reveal delay={150}><div className="h-full rounded-[28px] bg-[#1d1d1f] p-8 text-white sm:p-10"><p className="text-[1rem] font-semibold text-[#2fd9a6]">TSURETE</p><ul className="mt-6 space-y-4 text-[0.98rem]">{["4つのAIに、毎週自動で何百回も聞いて記録", "よくすすめられている店と比べて、差を出す", "全商品まとめて、サイトに合わせて届ける", "AI経由の売上で、効果を確かめる", "AIへの質問は、毎週ぜんぶ自動"].map((t) => <li key={t} className="flex gap-3"><Check size={18} className="mt-1 shrink-0 text-[#2fd9a6]" /><span className="min-w-0"><J>{t}</J></span></li>)}</ul></div></Reveal>
          </div>
        </section>

        {/* 無料診断 */}
        <section id="try" className="scroll-mt-12 px-5 py-28 text-center sm:py-40">
          <Reveal className="mx-auto max-w-[38rem]">
            <h2 className="lp-h text-[2rem] sm:text-[3.4rem]">まずは1商品、無料で。</h2>
            <p className="mt-4 text-[1.02rem] leading-[1.8] text-[#6e6e73]"><J>商品ページのURLを入れると、AIに選ばれるために足りないところと、書き直し案をお出しします。</J></p>
            <form onSubmit={(e) => { e.preventDefault(); router.push(`/shindan/?url=${encodeURIComponent(url)}`); }} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="u">商品ページのURL</label>
              <input id="u" value={url} onChange={(e) => setUrl(e.target.value)} className="field num" inputMode="url" />
              <button type="submit" className="btn btn-ai shrink-0 px-8">診断する</button>
            </form>
            <p className="mt-7 flex flex-col items-center gap-3 text-[0.95rem] sm:flex-row sm:justify-center sm:gap-8">
              <Link href="/shindan/?csv=1" className="flex items-center text-[#00a37a] hover:underline">CSVでまとめて診断<ChevronRight size={17} /></Link>
              <Link href="/" className="flex items-center text-[#00a37a] hover:underline">デモを使ってみる<ChevronRight size={17} /></Link>
            </p>
          </Reveal>
        </section>
      </main>

      <footer className="bg-[#f5f5f7] px-5 pb-10 text-[0.75rem] text-[#6e6e73]">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-2 border-t border-[#d2d2d7] pt-6 sm:flex-row sm:justify-between">
          <span>TSURETE（デモ）</span><span><J>数字は架空のブランドでの模擬の結果です。AIにすすめられることは保証できません。</J></span>
        </div>
        <Link href="/" className="mx-auto mt-4 flex max-w-[1000px] items-center gap-1 text-[#00a37a]">ツールを開く<ArrowRight size={14} /></Link>
      </footer>
    </div>
  );
}
