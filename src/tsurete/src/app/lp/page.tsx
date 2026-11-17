"use client";

import ScrollNav from "@/components/ScrollNav";
import LpVoice from "@/components/LpVoice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, CalendarClock, Check, ChevronRight, Copy, FileSpreadsheet, KeyRound, Mail, MousePointerClick, PenLine, Plug, Plus, RotateCcw, Rss, Search, ShieldCheck, TrendingUp, X } from "lucide-react";
import J from "@/components/J";
import { Laptop, Phone } from "@/components/Devices";
import { SAMPLE_URL } from "@/lib/check";
import { PLATFORMS, type Method } from "@/lib/platforms";

const IMG = "/sakuapp/works/tsurete/img/lp";

// ---------- 動きのための小さな道具 ----------
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
function Count({ to, suffix = "", from = 0, dec = 0 }: { to: number; suffix?: string; from?: number; dec?: number }) {
  const [ref, on] = useInView<HTMLSpanElement>();
  const [v, setV] = useState(from);
  useEffect(() => {
    if (!on) return;
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const k = Math.min(1, (t - t0) / 1400); const x = from + (to - from) * (1 - Math.pow(1 - k, 3)); setV(Math.round(x * 10 ** dec) / 10 ** dec); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [on, to, from, dec]);
  return <span ref={ref} className="num">{v.toLocaleString("ja-JP", { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</span>;
}

// ---------- ヒーローのスマホ：AIの答えが「直す前 → 直した後」で入れかわる ----------
const BEFORE = [{ b: "しずく舎", i: "やさしい化粧水", w: "敏感肌向けと明記" }, { b: "Lunae", i: "バリアローション", w: "皮膚科医と共同開発" }, { b: "NORMA BASIC", i: "化粧水", w: "口コミが多い" }];
const AFTER = [{ b: "SORAE", i: "化粧水 しっとり", w: "無香料・アルコールフリーで敏感肌向けと明記", me: true }, { b: "しずく舎", i: "やさしい化粧水", w: "敏感肌向けと明記" }, { b: "Lunae", i: "バリアローション", w: "皮膚科医と共同開発" }];
// iPhoneの中：質問 →「考えています」→ 答えが1つずつ出る。直した後はSORAEが1位に入り、光の輪が広がる
function ChatScreen({ after }: { after: boolean }) {
  const list = after ? AFTER : BEFORE;
  const [typing, setTyping] = useState(true);
  useEffect(() => { setTyping(true); const t = setTimeout(() => setTyping(false), 900); return () => clearTimeout(t); }, [after]);
  return (
    <div className="flex h-full flex-col bg-white text-[#1d1d1f]">
      <div className="flex items-center justify-center gap-2 border-b border-black/5 py-3 text-[15px] font-semibold"><Bot size={18} className="text-[#00a37a]" />AIアシスタント</div>
      <div className="flex-1 space-y-4 px-4 pt-5">
        <p key={`q${after}`} className="lp-anim ml-auto w-fit max-w-[80%] rounded-[20px] rounded-br-md bg-[#0a84ff] px-4 py-2.5 text-[16px] leading-[1.55] text-white" style={{ animation: "lp-in .45s ease-out both" }}>敏感肌でも使える、3,000円台の化粧水は？</p>
        {typing ? (
          <p className="flex gap-1.5 pl-1 pt-1" aria-label="考えています">{[0, 1, 2].map((i) => <i key={i} className="lp-anim h-2 w-2 rounded-full bg-[#8e8e93]" style={{ animation: `lp-dot 1s ${i * 0.15}s infinite` }} />)}</p>
        ) : (
          <>
            <p className="lp-anim text-[15px] text-[#6e6e73]" style={{ animation: "lp-in .4s ease-out both" }}>おすすめを3つ選びました。</p>
            <ol className="space-y-2.5">
              {list.map((x, i) => (
                <li key={`${after}${x.b}`} className={`lp-anim flex gap-3 rounded-2xl p-3.5 ${"me" in x ? "bg-[#e3f6ef] ring-2 ring-[#00a37a]" : "bg-[#f2f2f7]"}`} style={{ animation: `lp-in .45s ${0.15 + i * 0.18}s ease-out both${"me" in x ? ", lp-ring 1.4s .7s ease-out 2" : ""}` }}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${"me" in x ? "bg-[#00a37a] text-white" : "bg-white text-[#6e6e73]"}`}>{i + 1}</span>
                  <span className="min-w-0"><b className={`block text-[15px] leading-[1.5] ${"me" in x ? "text-[#007a5a]" : ""}`}>{x.b}　{x.i}</b><span className="mt-0.5 block text-[13px] leading-[1.6] text-[#6e6e73]">{x.w}</span></span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
      <div className="mx-4 mb-9 mt-4 rounded-full bg-[#f2f2f7] px-4 py-3 text-[15px] text-[#8e8e93]">メッセージを入力</div>
    </div>
  );
}
// iPhoneのまわりに浮かぶ、お客様がAIに聞きそうな質問
const QS = [
  { t: "白くならない日焼け止めは？", x: "-left-[3.2rem] sm:-left-[17rem] top-[8%]", d: 0 },
  { t: "30代へのギフト、何がいい？", x: "-right-[3.2rem] sm:-right-[17rem] top-[22%]", d: 1.6 },
  { t: "無香料のハンドクリームは？", x: "-left-[3.2rem] sm:-left-[19rem] top-[46%]", d: 3.1 },
  { t: "毛穴に効く美容液は？", x: "-right-[3.2rem] sm:-right-[15rem] top-[60%]", d: 0.8 },
  { t: "詰め替えのある化粧水", x: "-left-[14rem] top-[74%]", d: 2.3 },
  { t: "3,000円以下で、肌にやさしいもの", x: "-right-[19rem] top-[80%]", d: 3.8 },
];
function Hero() {
  const [after, setAfter] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); const id = setInterval(() => setAfter((a) => !a), 4200); return () => { clearTimeout(t); clearInterval(id); }; }, []);
  const lines = [{ t: "AIの売り場で、", c: "" }, { t: "あなたの商品は", c: "" }, { t: "何番目？", c: "lp-shine" }];
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-14 text-center sm:pb-24 sm:pt-16">
      {/* 後ろの光：ゆっくり漂う */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <i className="lp-anim absolute left-1/2 top-[48%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#2fd9a6]/30 blur-[90px] sm:h-[38rem] sm:w-[38rem]" style={{ animation: "lp-aurora1 14s ease-in-out infinite" }} />
        <i className="lp-anim absolute left-1/2 top-[58%] h-[26rem] w-[26rem] -translate-x-[10%] rounded-full bg-[#0a84ff]/20 blur-[90px] sm:h-[32rem] sm:w-[32rem]" style={{ animation: "lp-aurora2 17s ease-in-out infinite" }} />
      </div>

      <div className="relative">
        <p className={`text-[1.05rem] font-semibold text-[#00a37a] transition duration-700 sm:text-[1.2rem] ${ready ? "opacity-100" : "opacity-0"}`}>TSURETE</p>
        <h1 className="lp-h mx-auto mt-3 max-w-[14em] text-[2.5rem] sm:text-[4.4rem]">
          {lines.map((l, i) => (
            <span key={l.t} className="inline-block overflow-hidden pb-[.08em] align-bottom">
              <span className={`lp-anim inline-block ${l.c}`} style={{ animation: ready ? `lp-rise .9s ${0.1 + i * 0.16}s cubic-bezier(.2,.7,.2,1) both${l.c ? ", lp-shine 4s linear infinite" : ""}` : "none", transform: ready ? undefined : "translateY(105%)" }}>{l.t}</span>
            </span>
          ))}
        </h1>
        <p className={`mx-auto mt-5 max-w-[30em] text-[1.05rem] leading-[1.8] text-[#6e6e73] transition duration-700 sm:text-[1.3rem] ${ready ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`} style={{ transitionDelay: "600ms" }}><J>AIにすすめられる回数を、毎週自動ではかる。全商品の商品ページを、まとめて直す。</J></p>
        <div className={`mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 transition duration-700 ${ready ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "800ms" }}>
          <Link href="/" className="btn btn-ai px-7">デモを使ってみる</Link>
          <a href="#try" className="flex items-center text-[1.02rem] text-[#00a37a] hover:underline">無料で診断<ChevronRight size={18} /></a>
        </div>
        <div className={`mt-5 transition duration-700 ${ready ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "950ms" }}><LpVoice /></div>
      </div>

      <div className={`relative mx-auto mt-14 w-[15.5rem] sm:mt-12 sm:w-[18rem] ${ready ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`} style={{ transition: "opacity 1.4s .5s, transform 1.4s .5s cubic-bezier(.2,.7,.2,1)" }}>
        {/* まわりに浮かぶ質問（スマホでは左右2つずつ） */}
        {QS.map((q, i) => (
          <span key={q.t} className={`lp-anim pointer-events-none absolute z-20 whitespace-nowrap sm:z-0 rounded-full bg-white/90 px-3.5 py-2 text-[0.8rem] text-[#424245] shadow-[0_10px_30px_-12px_rgba(0,0,0,.25)] ring-1 ring-black/5 ${q.x} ${i >= 4 ? "hidden sm:block" : ""} max-sm:text-[0.7rem]`}
            style={{ animation: `lp-floatq 6s ${q.d}s ease-in-out infinite` }}>{q.t}</span>
        ))}
        <div className="relative z-10"><Phone><ChatScreen after={after} /></Phone></div>
        <div className="relative z-10 mt-6 flex justify-center gap-3 sm:contents">
          <div key={`r${after}`} className={`lp-anim whitespace-nowrap rounded-2xl px-4 py-3 text-left shadow-[0_20px_40px_-20px_rgba(0,0,0,.25)] sm:absolute sm:-left-44 sm:top-48 sm:z-20 ${after ? "bg-[#00a37a] text-white" : "bg-white text-[#1d1d1f] ring-1 ring-black/5"}`} style={{ animation: "lp-pop .55s cubic-bezier(.2,.7,.2,1) both" }}>
            <p className="text-[0.7rem] font-semibold opacity-80">{after ? "TSURETEで直した後" : "直す前"}</p>
            <p className="text-[1.5rem] font-bold leading-tight">{after ? "1位" : "圏外"}</p>
          </div>
          <div className="whitespace-nowrap rounded-2xl bg-white px-4 py-3 text-left shadow-[0_20px_40px_-20px_rgba(0,0,0,.25)] ring-1 ring-black/5 sm:absolute sm:-right-48 sm:bottom-36 sm:z-20">
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
// 3つの場面：検索なら10件 → AIなら3つ → ないのと同じ
const DUR = [4800, 4200, 5200]; // 止まって見ているとき、次へ進むまでの時間
const MIN = 1600; // スクロールが速くても、ひとつの場面を最低これだけは見せる
function TenToThree() {
  // 場面は画面に張りつき、スクロールした分か時間がたった分の先に来たほうで進む
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState(0);
  const [scrollStage, setScrollStage] = useState(0);
  const [auto, setAuto] = useState(0);
  const [flow, setFlow] = useState(false);
  const changedAt = useRef(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    let raf = 0, last = -1;
    const tick = () => {
      raf = 0; const r = el.getBoundingClientRect(), stick = (el.firstElementChild as HTMLElement | null)?.offsetHeight ?? window.innerHeight;
      const v = -r.top / Math.max(1, r.height - stick);
      const st = v >= 0.62 ? 2 : v >= 0.28 ? 1 : 0;
      if (st !== last) { last = st; setScrollStage(st); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick(); window.addEventListener("scroll", on, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  // 場面が見えはじめた時点から、最初の場面の時間を数える
  useEffect(() => { if (visible) changedAt.current = Date.now(); else { setStage(0); setAuto(0); } }, [visible]);
  // 止まって見ているときは、時間で次へ（最後の場面で止まる）
  useEffect(() => {
    if (!visible) { setAuto(0); return; }
    if (stage >= 2) return;
    const t = setTimeout(() => setAuto(stage + 1), DUR[stage]);
    return () => clearTimeout(t);
  }, [visible, stage]);
  // 見せたい場面へ、1つずつ、最低MINだけ見せてから進む（戻るときも同じ）
  const want = reduced() ? 2 : Math.max(scrollStage, Math.min(auto, 2), visible ? 0 : 0);
  useEffect(() => {
    if (want === stage) return;
    const wait = Math.max(0, MIN - (Date.now() - changedAt.current));
    const t = setTimeout(() => { changedAt.current = Date.now(); setStage((x) => x + (want > x ? 1 : -1)); }, wait);
    return () => clearTimeout(t);
  }, [want, stage]);
  // 検索の場面になるたびに、結果をいちばん上から流しなおす
  useEffect(() => {
    setFlow(false);
    if (!visible || stage !== 0) return;
    const t = setTimeout(() => setFlow(true), 60);
    return () => clearTimeout(t);
  }, [visible, stage]);
  // 検索結果は、場面に入ると下へ流れ、最後に10位（自分の商品）が見える
  const box = useRef<HTMLDivElement>(null), list = useRef<HTMLOListElement>(null);
  const [over, setOver] = useState(0);
  useEffect(() => {
    let w = 0;
    const m = () => { if (window.innerWidth === w) return; w = window.innerWidth; if (box.current && list.current) setOver(Math.max(0, list.current.scrollHeight - box.current.clientHeight)); };
    m(); window.addEventListener("resize", m); return () => window.removeEventListener("resize", m);
  }, []);
  const lines = ["検索なら、10件。", "AIなら、3つ。", "3つに入らなければ、ないのと同じ。"];
  return (
    <section ref={ref} className="relative h-[300vh] bg-black text-white" aria-label="検索とAIの違い">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-12">
        <div className="relative h-[5rem] w-full max-w-[44rem] text-center sm:h-[8rem]">
          {lines.map((t, i) => <h2 key={t} className={`lp-h absolute inset-0 grid place-items-center text-[1.75rem] transition duration-700 sm:text-[3.4rem] ${stage === i ? "translate-y-0 opacity-100" : stage > i ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0"} ${i === 2 ? "text-[#2fd9a6]" : ""}`}><J>{t}</J></h2>)}
        </div>

        {/* 白い画面：はじめは検索結果ページ、AIの段階ではチャット画面 */}
        <div className="relative mt-4 w-full max-w-[34rem] overflow-hidden rounded-[22px] bg-white text-[#202124] shadow-[0_30px_80px_-30px_rgba(47,217,166,.35)] sm:mt-7">
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

          {/* 枠の高さは、場面が変わっても同じにする（中身だけが入れかわる） */}
          <div ref={box} className={`h-[var(--card-h)] overflow-hidden transition-[padding] duration-700 [--card-h:25.5rem] sm:[--card-h:27rem] ${stage >= 1 ? "pb-14" : "pb-0"}`}>
          {stage >= 1 && <p className="fade-in px-4 pt-3 text-[0.86rem] leading-[1.8] text-[#0d0d0d]"><J>敏感肌でも使える3,000円台の化粧水なら、次の3つがおすすめです。</J></p>}
          <ol ref={list} className="px-4 py-3" style={{ transform: stage === 0 && flow ? `translate3d(0,-${over}px,0)` : "translate3d(0,0,0)", transition: stage === 0 && flow ? "transform 2s cubic-bezier(.45,0,.25,1) .9s" : "none" }} aria-hidden>
            {SEARCH.map((r, i) => {
              const ai = stage >= 1 && i < 3, gone = stage >= 1 && i >= 3;
              return (
                <li key={r.u} className="overflow-hidden transition-all duration-700" style={{ opacity: gone ? 0 : 1, maxHeight: gone ? 0 : ai ? "4rem" : "4.6rem", marginTop: i && !gone ? (ai ? "0.4rem" : "0.15rem") : 0, transform: gone ? "translateX(-24px)" : "none", transitionDelay: `${gone ? (i - 3) * 40 : 0}ms` }}>
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
            <li className={`overflow-hidden transition-all duration-700 ${stage === 2 ? "mt-2 max-h-24 opacity-100 sm:mt-3" : "mt-0 max-h-0 opacity-0"}`}>
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#00a37a]/60 bg-[#f3fbf8] px-3.5 py-2.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-dashed border-[#00a37a]/70 text-[0.68rem] text-[#00a37a]">？</span>
                <span className="min-w-0"><b className="block truncate text-[0.9rem] text-[#00805f]"><J>SORAE　化粧水 しっとり</J></b><span className="block text-[0.74rem] text-[#6e6e73]"><J>検索では10位。AIの答えには、入っていない</J></span></span>
              </div>
            </li>
          </ol>
          </div>
          <div className={`absolute inset-x-0 bottom-0 bg-white pt-1 transition duration-700 ${stage >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
            <div className="mx-3 mb-3 flex items-center gap-2 rounded-full border border-black/10 py-1.5 pl-3 pr-1.5 shadow-[0_2px_8px_rgba(0,0,0,.06)]">
              <span className="text-[1.1rem] leading-none text-[#5d5d5d]">＋</span>
              <span className="flex-1 text-[0.82rem] text-[#8e8e8e]">何でも聞いてください</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0d0d0d] text-white"><ArrowRight size={14} className="-rotate-90" /></span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex w-full max-w-[22rem] gap-2 sm:mt-8" role="tablist" aria-label="場面">
          {["検索", "AI", "結果"].map((l, i) => (
            <button key={l} type="button" role="tab" aria-selected={stage === i} onClick={() => { changedAt.current = Date.now(); setAuto(i); setStage(i); }} className="flex-1 text-left">
              <span className="block h-1 overflow-hidden rounded-full bg-white/20"><span key={`${i}-${stage}-${visible}`} className="block h-full rounded-full bg-white" style={{ width: stage > i ? "100%" : "0%", animation: stage === i && visible ? `tsr-bar ${DUR[i]}ms linear forwards` : "none" }} /></span>
              <span className={`mt-2 block text-[0.72rem] ${stage === i ? "text-white" : "text-white/45"}`}>{l}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- ノートパソコンが大きくなり、iPhoneが横から入る ----------
function Showcase() {
  // 端末が3分の1ほど見えたら動き出し、画面から完全に外れたら元に戻す（また見たときにもう一度動く）
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reduced()) { setK(1); return; }
    const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio >= 0.35) setK(1); else if (!e.isIntersecting) setK(0); }, { threshold: [0, 0.35] });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <section className="bg-[#f5f5f7] px-5 py-24 sm:py-36">
      <Reveal className="text-center">
        <h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><J>ひと目で、今週がわかる。</J></h2>
        <p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>開いたら、数字とやることだけ。パソコンでも、スマホでも。</J></p>
      </Reveal>
      <div ref={ref} className="relative mx-auto mt-16 max-w-[60rem] pr-[10%] sm:mt-24 sm:pr-[12%]">
        <div style={{ transform: `translateY(${(1 - k) * 40}px) scale(${0.8 + 0.2 * k})`, opacity: 0.35 + 0.65 * k, transformOrigin: "50% 100%", transition: "transform 1.8s cubic-bezier(.2,.7,.2,1), opacity 1.2s" }}><Laptop silver src={`${IMG}/dash-pc.webp?v=3`} alt="パソコンで見たTSURETEのホーム画面" /></div>
        <div className="absolute bottom-[-2%] right-0 w-[22%]" style={{ transform: `translateX(${(1 - k) * 90}%) rotate(${(1 - k) * 6}deg)`, opacity: k, transition: "transform 1.5s cubic-bezier(.2,.7,.2,1) .7s, opacity 1s .7s" }}><Phone src={`${IMG}/dash-phone.webp?v=3`} alt="スマホで見たTSURETEのホーム画面" /></div>
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
      <p className="mt-6 rounded-2xl bg-[#f5f5f7] px-4 py-3 text-[0.84rem] leading-[1.7] text-[#424245]">いまは <b className="text-[#1d1d1f]"><J>5位</J></b>。1位の店には、「だれ向けか」「よくある質問」が書かれています。</p>
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
        <div className="min-w-0"><b className="block text-[0.95rem]"><J>SORAE 化粧水 しっとり</J></b><p className="mt-1 text-[0.82rem] leading-[1.7] text-[#86868b] line-through decoration-[#c7c7cc]"><J>空のように澄んだ肌へ。毎日のうるおいに寄りそう、SORAEの化粧水。</J></p></div>
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
          <p className="mt-10 text-[0.85rem] text-[#6e6e73]"><J>AIにすすめられた割合</J></p>
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

// ---------- 足した場面：悩み・1週間の流れ・安心・料金・はじめ方・よくある質問 ----------
// これまでの集客に、1行ずつ取り消し線が引かれていく
function Strike({ t, d, delay }: { t: string; d: string; delay: number }) {
  const [ref, on] = useInView<HTMLLIElement>();
  return (
    <li ref={ref} className={`transition duration-700 ${on ? "opacity-100" : "translate-y-6 opacity-0"}`} style={{ transitionDelay: `${delay}ms` }}>
      <p className="relative inline-block whitespace-nowrap text-[1.9rem] font-bold leading-[1.35] tracking-[-.01em] text-[#1d1d1f] sm:text-[3.6rem]">
        <span className={`transition-colors duration-700 ${on ? "text-[#b0b0b5]" : ""}`} style={{ transitionDelay: `${delay + 700}ms` }}>{t}</span>
        <span className="absolute left-0 top-[54%] h-[3px] rounded-full bg-[#1d1d1f] transition-[width] duration-700 ease-out sm:h-[5px]" style={{ width: on ? "100%" : "0%", transitionDelay: `${delay + 500}ms` }} aria-hidden />
      </p>
      <p className={`mt-2 text-[0.92rem] text-[#86868b] transition-opacity duration-700 sm:text-[1.05rem] ${on ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: `${delay + 900}ms` }}><J>{d}</J></p>
    </li>
  );
}
function Pain() {
  return (
    <section className="bg-[#f5f5f7] px-5 py-24 sm:py-40">
      <div className="mx-auto max-w-[56rem]">
        <Reveal><p className="text-[1rem] font-semibold text-[#86868b] sm:text-[1.15rem]"><J>これまでの集客は、</J></p></Reveal>
        <ul className="mt-8 space-y-9 sm:mt-10 sm:space-y-12">
          <Strike t="広告を出しつづける。" d="同じ売上のために、かかるお金が年々ふえていく。" delay={0} />
          <Strike t="SNSを毎日更新する。" d="投稿に時間を取られて、本業が進まない。" delay={150} />
          <Strike t="検索の順位を追う。" d="お客様は検索より先に、AIに聞きはじめている。" delay={300} />
        </ul>
        <Reveal className="mt-16 sm:mt-24" delay={200}>
          <p className="text-[2.1rem] font-bold leading-[1.3] tracking-[-.01em] sm:text-[4.2rem]"><span className="inline-block">これからは、</span><span className="inline-block text-[#00a37a]">AIに選ばれる。</span></p>
        </Reveal>
      </div>
    </section>
  );
}

function Week() {
  const items = [
    { icon: CalendarClock, k: "月曜", t: "自動で測る", d: "TSURETEが4つのAIに質問。お店の作業はありません。" },
    { icon: Mail, k: "火曜", t: "やることが届く", d: "結果と「今週やること」をメールでお知らせ。" },
    { icon: MousePointerClick, k: "5分", t: "読んで、押すだけ", d: "書き直し案を読んで「この案を使う」を押す。" },
    { icon: TrendingUp, k: "翌週", t: "効果がわかる", d: "すすめられた回数と、AI経由の売上で確かめる。" },
  ];
  return (
    <section className="px-5 py-24 sm:py-36">
      <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><span className="inline-block">お店の1週間は、</span><span className="inline-block">こう変わる。</span></h2><p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>やることは、週に一度の5分だけ。</J></p></Reveal>
      <ol className="relative mx-auto mt-14 grid max-w-[64rem] gap-8 sm:mt-20 md:grid-cols-4 md:gap-6">
        <i className="absolute left-[1.35rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-[#d2d2d7] max-md:block" aria-hidden />
        <i className="absolute left-[12%] right-[12%] top-[1.4rem] hidden h-px bg-[#d2d2d7] md:block" aria-hidden />
        {items.map(({ icon: Icon, k, t, d }, i) => (
          <Reveal key={k} delay={i * 120}>
            <li className="relative flex gap-5 md:flex-col md:items-center md:text-center">
              <span className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full ${i === 2 ? "bg-[#00a37a] text-white" : "bg-white text-[#1d1d1f] ring-1 ring-[#d2d2d7]"}`}><Icon size={19} /></span>
              <span className="min-w-0 md:mt-5"><span className={`block text-[0.85rem] font-semibold ${i === 2 ? "text-[#00a37a]" : "text-[#86868b]"}`}>{k}</span><b className="mt-1 block text-[1.1rem]"><J>{t}</J></b><span className="mt-1.5 block text-[0.9rem] leading-[1.8] text-[#6e6e73]"><J>{d}</J></span></span>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Safety() {
  const items = [
    { icon: ShieldCheck, t: "勝手に書きかえない", d: "サイトが変わるのは、お店の人が「この案を使う」を押したものだけ。" },
    { icon: RotateCcw, t: "いつでも、元に戻せる", d: "書きかえる前の文章を残しておくので、ひと押しで戻せます。" },
    { icon: PenLine, t: "分からない事実は、作らない", d: "成分や使える期間など、ページにないことは【】で空けてお店に確かめます。" },
    { icon: KeyRound, t: "パスワードは預からない", d: "サイトとは公式のつなぎ方だけ。AIのキーは暗号化して保管し、測る以外には使いません。" },
  ];
  return (
    <section className="bg-[#f5f5f7] px-5 py-24 sm:py-36">
      <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><J>お店の大事なページだから。</J></h2></Reveal>
      <div className="mx-auto mt-14 grid max-w-[60rem] gap-4 sm:mt-16 sm:grid-cols-2">
        {items.map(({ icon: Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 90} className="h-full"><div className="flex h-full gap-5 rounded-[28px] bg-white p-7 sm:p-8"><Icon size={26} strokeWidth={1.7} className="mt-0.5 shrink-0 text-[#00a37a]" /><span className="min-w-0"><b className="block text-[1.1rem]"><J>{t}</J></b><span className="mt-1.5 block text-[0.92rem] leading-[1.8] text-[#6e6e73]"><J>{d}</J></span></span></div></Reveal>
        ))}
      </div>
    </section>
  );
}

const PLANS = [
  { n: "フリー", p: "0", u: "円", d: "まず試したい", f: ["1商品の無料診断", "AIに選ばれるために足りないところ", "書き直し案のひな形"] },
  { n: "スタンダード", p: "2,980", u: "円／月", d: "はじめての店に", f: ["50商品まで", "毎週の自動測定", "AIが書き直し案を作る", "CSV・コピーで届ける"], hi: true },
  { n: "プロ", p: "9,800", u: "円／月", d: "商品が多い店に", f: ["500商品まで", "よくすすめられている店との比較", "Shopifyなどへ自動で書きかえ", "AI経由の売上を計測"] },
];
function Pricing() {
  return (
    <section id="price" className="scroll-mt-12 px-5 py-24 sm:py-36">
      <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><J>料金</J></h2><p className="mx-auto mt-5 max-w-[32em] text-[1.02rem] leading-[1.8] text-[#6e6e73]"><J>AIの利用料は含みません。お店のAIのキーを使い、利用料は各社からお店に直接請求されます。聞く回数は、設定で調整できます。</J></p><p className="mt-3 text-[0.85rem] text-[#86868b]"><J>※デモ用の仮の料金です。実際の料金は決まっていません。</J></p></Reveal>
      <div className="mx-auto mt-14 grid max-w-[64rem] gap-4 sm:mt-16 md:grid-cols-3">
        {PLANS.map((x, i) => (
          <Reveal key={x.n} delay={i * 100} className="h-full">
            <div className={`flex h-full flex-col rounded-[28px] p-8 ${x.hi ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7]"}`}>
              <p className="flex items-center justify-between"><b className="text-[1.15rem]">{x.n}</b>{x.hi && <span className="rounded-full bg-[#2fd9a6] px-2.5 py-0.5 text-[0.72rem] font-semibold text-[#03140f]">おすすめ</span>}</p>
              <p className={`mt-1 text-[0.88rem] ${x.hi ? "text-white/60" : "text-[#6e6e73]"}`}>{x.d}</p>
              <p className="mt-6"><b className="num text-[2.6rem] leading-none">{x.p}</b><span className={`ml-1 text-[0.9rem] ${x.hi ? "text-white/70" : "text-[#6e6e73]"}`}>{x.u}</span></p>
              <ul className="mt-7 flex-1 space-y-3 text-[0.92rem]">{x.f.map((t) => <li key={t} className="flex gap-2.5"><Check size={17} className={`mt-0.5 shrink-0 ${x.hi ? "text-[#2fd9a6]" : "text-[#00a37a]"}`} /><span className="min-w-0"><J>{t}</J></span></li>)}</ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Start() {
  const steps = [
    { t: "URLを入れる", d: "まずは1商品、無料で診断。登録はいりません。" },
    { t: "サイトとAIのキーを設定", d: "Shopify・楽天などのサイトを選び、お店のAIのキーを入れます。" },
    { t: "毎週、届くのを待つ", d: "あとはTSURETEが自動で測って、やることを届けます。" },
  ];
  return (
    <section className="bg-[#f5f5f7] px-5 py-24 sm:py-36">
      <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><J>はじめ方は、3つだけ。</J></h2></Reveal>
      <ol className="mx-auto mt-14 grid max-w-[60rem] gap-10 sm:mt-16 md:grid-cols-3 md:gap-8">
        {steps.map((x, i) => (
          <Reveal key={x.t} delay={i * 110}><li className="border-t border-[#d2d2d7] pt-6"><span className="num text-[2.4rem] font-bold leading-none text-[#00a37a]">{i + 1}</span><b className="mt-4 block text-[1.2rem]"><J>{x.t}</J></b><span className="mt-2 block text-[0.95rem] leading-[1.8] text-[#6e6e73]"><J>{x.d}</J></span></li></Reveal>
        ))}
      </ol>
    </section>
  );
}

const FAQ = [
  { q: "必ずAIにすすめられるようになりますか？", a: "いいえ、保証はできません。AIの答えは、AIを作っている会社のしくみで決まります。TSURETEは、すすめられた回数をはかり、すすめられやすくするための材料をそろえます。" },
  { q: "どのAIで測りますか？", a: "ChatGPT・Gemini・Claude・Perplexityの4つで測る予定です。お客様がよく使うAIが変われば、測るAIも見直します。" },
  { q: "お店の作業は、どれくらいですか？", a: "AIに質問して記録するのは、すべて自動です。お店の人は、毎週届く「やること」を読んで、使う案のボタンを押すだけです。目安は週に5分ほどです。" },
  { q: "サイトの文章が、勝手に変わることはありますか？", a: "ありません。サイトが変わるのは、お店の人が「この案を使う」を押したものだけです。書きかえる前の文章は残しておくので、いつでも戻せます。" },
  { q: "AIの利用料はかかりますか？", a: "かかります。お店のAIのキーを使って質問するので、利用料は各社からお店に直接請求されます。TSURETEの料金には含みません。聞く回数を減らせば安くなり、設定画面で回数と月の質問数を確かめられます。" },
  { q: "化粧品以外でも使えますか？", a: "使えます。食品・雑貨・アパレル・ハンドメイドなど、お客様が比べて選ぶ商品に向いています。" },
  { q: "解約はいつでもできますか？", a: "いつでもできるようにする予定です。料金や契約の決まりは、正式に決まりしだいお知らせします。" },
];
function Faq() {
  return (
    <section id="faq" className="scroll-mt-12 px-5 py-24 sm:py-36">
      <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><J>よくある質問</J></h2></Reveal>
      <div className="mx-auto mt-12 max-w-[46rem] sm:mt-16">
        {FAQ.map((x) => (
          <details key={x.q} className="group border-b border-[#d2d2d7]">
            <summary className="flex cursor-pointer list-none items-center gap-4 py-6 text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden"><span className="min-w-0 flex-1"><J>{x.q}</J></span><Plus size={20} className="shrink-0 text-[#86868b] transition group-open:rotate-45" /></summary>
            <p className="pb-6 pr-8 text-[0.98rem] leading-[1.95] text-[#6e6e73]"><J>{x.a}</J></p>
          </details>
        ))}
      </div>
    </section>
  );
}

const NAV = ["はじめに","AIで買う時代","これまでの集客","検索とAIのちがい","画面","ぜんぶ自動","しくみ","お店の1週間","使う前と後","対応サイト","小さなお店へ","ほかとのちがい","安心","料金","はじめ方","よくある質問","無料診断"];

// LPに出す数字（各社の公開調査。数字を変えるときは、出典も必ず一緒に直す）
const STATS = [
  { v: 24.6, dec: 1, s: "%", l: "日本で、買い物に生成AIを使う人", src: "博報堂の調査（2026年）", href: "https://www.itmedia.co.jp/aiplus/article/2606/02/2000000046/" },
  { v: 41.5, dec: 1, s: "%", l: "アメリカで、商品を調べるのにAIを使った人（直近3か月）", src: "Product.aiの調査（2026年10月）", href: "https://product.ai/research/trust-in-ai-commerce-report/" },
  { v: 1.5, dec: 1, s: "倍", l: "AIから来たお客様の、買う割合（AI以外から来た人とくらべて）", src: "Adobeの調査（アメリカ、2026年5月）", href: "https://business.adobe.com/resources/sdk/.q3-ai-traffic-trends-report/q3-2026-ai-sourced-traffic-insights.pdf" },
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
          <nav className={`hidden gap-7 sm:flex ${dark ? "text-white/70" : "text-[#424245]"}`}><a href="#how" className="hover:text-black">しくみ</a><a href="#sites" className="hover:text-black">対応サイト</a><a href="#price" className="hover:text-black">料金</a><a href="#faq" className="hover:text-black">よくある質問</a><a href="#try" className="hover:text-black">無料診断</a></nav>
          <Link href="/" className={`ml-auto rounded-full px-3.5 py-1 text-[0.78rem] font-semibold transition-colors ${dark ? "bg-white text-black" : "bg-[#1d1d1f] text-white"}`}>デモを使う</Link>
        </div>
      </header>

      <main>
        <Hero />

        {/* お客様は、もうAIに聞いて買っている */}
        <section className="px-5 pb-24 pt-14 sm:pb-36 sm:pt-24">
          <Reveal className="text-center">
            <h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><J>お客様は、もう「AIに聞いて」買っている。</J></h2>
            <p className="mx-auto mt-4 max-w-[32em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>検索して何ページも見くらべるより、AIに「おすすめは？」と聞くほうが早いから。</J></p>
          </Reveal>
          <Reveal className="mx-auto mt-14 max-w-[64rem]" delay={120}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/ask-ai.webp?v=3`} alt="ソファでスマホのAIに相談している人" width={1264} height={848} loading="lazy" className="block h-auto w-full rounded-[28px] object-cover sm:rounded-[36px]" />
          </Reveal>
          {/* 数字で見る：AIで買い物をする人（各社の調査） */}
          <div className="mx-auto mt-16 grid max-w-[56rem] gap-10 text-center sm:mt-24 sm:grid-cols-3 sm:gap-6">
            {STATS.map((x, i) => (
              <Reveal key={x.l} delay={i * 100}>
                <p className="text-[3rem] font-bold leading-none tracking-[-.02em] sm:text-[3.4rem]"><Count to={x.v} dec={x.dec} /><span className="ml-1 text-[1.2rem] font-semibold">{x.s}</span></p>
                <p className="mx-auto mt-3 max-w-[16em] text-[0.92rem] leading-[1.7] text-[#1d1d1f]"><J>{x.l}</J></p>
                <p className="mt-1.5 text-[0.75rem] text-[#86868b]"><a href={x.href} target="_blank" rel="noopener noreferrer" className="underline decoration-black/20 underline-offset-4 hover:text-[#1d1d1f]">{x.src}</a></p>
              </Reveal>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-[40em] text-center text-[0.72rem] leading-[1.8] text-[#86868b]"><J>各社の公開調査より。調査ごとに、対象や聞き方が異なります。</J></p>
        </section>

        <Pain />
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

        <Week />

        {/* 書き直す前と後 */}
        <section className="bg-[#f5f5f7] px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><span className="inline-block">書き直すと、</span><span className="inline-block">こう変わる。</span></h2><div className="mt-6 flex items-center justify-center gap-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/sakuapp/works/tsurete/img/products/lotion.webp?v=3" alt="" width={56} height={56} className="h-14 w-14 rounded-2xl object-cover" /><p className="text-left text-[0.88rem] leading-[1.6] text-[#6e6e73]">見本：SORAE 化粧水<br />（架空のブランド・模擬の結果）</p></div></Reveal>
          <div className="mx-auto mt-16 max-w-[60rem]"><Bars /></div>
        </section>

        {/* 対応サイト */}
        <section id="sites" className="scroll-mt-12 px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><J>どのサイトでも。</J></h2><p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73]"><J>測るのは、サイトに何も入れずに。直すときは、サイトに合わせて届け方を選べます。</J></p></Reveal>
          <div className="mx-auto mt-16 grid max-w-[60rem] gap-4 sm:grid-cols-2">
            {WAYS.map(({ m, icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 90} className="h-full">
                <div className="flex h-full flex-col rounded-[28px] bg-[#f5f5f7] p-8">
                  <Icon size={30} strokeWidth={1.6} className="text-[#00a37a]" />
                  <b className="mt-6 text-[1.3rem]">{t}</b>
                  <p className="mt-1 text-[0.95rem] text-[#6e6e73]"><J>{d}</J></p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-7" aria-label="対応するサイト">
                    {(m === "feed" ? ["すべてのサイト"] : PLATFORMS.filter((p) => p.method === m).map((p) => p.name)).map((n) => {
                      const [main, sub] = n.split("（");
                      return <li key={n} className="whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[0.82rem] font-semibold text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,.04)]">{main}{sub && <span className="ml-1.5 font-normal text-[#86868b]">{sub.replace("）", "")}</span>}</li>;
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 小さなネットショップのために */}
        <section className="bg-[#f5f5f7] px-5 py-24 sm:py-36">
          <div className="mx-auto grid max-w-[64rem] items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <Reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/owner.webp?v=3`} alt="自宅の作業机でネットショップを運営している人" width={1376} height={768} loading="lazy" className="block h-auto w-full rounded-[28px] object-cover sm:rounded-[36px]" />
            </Reveal>
            <Reveal delay={150}>
              <h2 className="lp-h text-[2rem] sm:text-[2.6rem] lg:text-[2.3rem]"><J>小さなネットショップの、AI担当に。</J></h2>
              <p className="mt-5 text-[1.02rem] leading-[1.95] text-[#6e6e73]"><J>大きな会社のように、AI対策の担当者は置けない。TSURETEが毎週自動ではかって、やることだけを届けます。</J></p>
              <p className="mt-8 text-[0.85rem] font-semibold text-[#1d1d1f]"><J>比べて選ばれる商品なら、ジャンルは問いません。</J></p>
              <p className="mt-3 flex flex-wrap gap-2">{["スキンケア", "食品・お菓子", "雑貨・インテリア", "アパレル", "ハンドメイド", "ベビー用品", "ペット用品"].map((t) => <span key={t} className="rounded-full bg-white px-3.5 py-1.5 text-[0.85rem]">{t}</span>)}</p>
            </Reveal>
          </div>
        </section>

        {/* AIに自分で聞くのと何が違う */}
        <section className="px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><span className="inline-block">AIに自分で聞くのと、</span><span className="inline-block">何が違う？</span></h2></Reveal>
          <div className="mx-auto mt-16 grid max-w-[52rem] gap-4 md:grid-cols-2">
            <Reveal><div className="h-full rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10"><p className="text-[1rem] font-semibold text-[#6e6e73]"><J>AIに自分で聞く</J></p><ul className="mt-6 space-y-4 text-[0.98rem] text-[#6e6e73]">{["1回聞いた答えだけ（答えは毎回変わる）", "自分の商品だけを見る", "1商品ずつコピペ", "効いたか分からない", "毎回、自分で聞きに行く"].map((t) => <li key={t} className="flex gap-3"><X size={18} className="mt-1 shrink-0 opacity-50" /><span className="min-w-0"><J>{t}</J></span></li>)}</ul></div></Reveal>
            <Reveal delay={150}><div className="h-full rounded-[28px] bg-[#1d1d1f] p-8 text-white sm:p-10"><p className="text-[1rem] font-semibold text-[#2fd9a6]">TSURETE</p><ul className="mt-6 space-y-4 text-[0.98rem]">{["4つのAIに、毎週自動で何百回も聞いて記録", "よくすすめられている店と比べて、差を出す", "全商品まとめて、サイトに合わせて届ける", "AI経由の売上で、効果を確かめる", "AIへの質問は、毎週ぜんぶ自動"].map((t) => <li key={t} className="flex gap-3"><Check size={18} className="mt-1 shrink-0 text-[#2fd9a6]" /><span className="min-w-0"><J>{t}</J></span></li>)}</ul></div></Reveal>
          </div>
        </section>

        <Safety />
        <Pricing />
        <Start />
        <Faq />

        {/* 無料診断 */}
        <section id="try" className="scroll-mt-12 bg-[#f5f5f7] px-5 py-28 text-center sm:py-40">
          <Reveal className="mx-auto max-w-[38rem]">
            <h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><J>まずは1商品、無料で。</J></h2>
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
      <ScrollNav names={NAV} dark={[3]} />

      <footer className="bg-[#f5f5f7] px-5 pb-10 text-[0.75rem] text-[#6e6e73]">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-2 border-t border-[#d2d2d7] pt-6 sm:flex-row sm:justify-between">
          <span>TSURETE（デモ）</span><span><J>数字は架空のブランドでの模擬の結果です。AIにすすめられることは保証できません。</J></span>
        </div>
        <p className="mx-auto mt-3 max-w-[1000px]">音声ガイド：VOICEVOX:九州そら</p>
        <Link href="/" className="mx-auto mt-4 flex max-w-[1000px] items-center gap-1 text-[#00a37a]">ツールを開く<ArrowRight size={14} /></Link>
      </footer>
    </div>
  );
}
