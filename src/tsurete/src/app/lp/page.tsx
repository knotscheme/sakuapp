"use client";

import ScrollNav from "@/components/ScrollNav";
import LpVoice from "@/components/LpVoice";
import LineChart from "@/components/LineChart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, Bot, CalendarClock, GraduationCap, Award, Clock, Check, Download, Minus, ChevronRight, Copy, FileSpreadsheet, KeyRound, Link2, Mail, MousePointerClick, PenLine, Plug, Plus, RotateCcw, Rss, Search, ShieldCheck, Stethoscope, Swords, TrendingUp, X } from "lucide-react";
import J from "@/components/J";
import { Laptop, Phone } from "@/components/Devices";
import { SAMPLE_URL } from "@/lib/check";
import { BookOpen as BookIcon } from "lucide-react";
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
        <p key={`q${after}`} className="lp-anim ml-auto w-fit max-w-[80%] rounded-[12px] rounded-br-md bg-[#0a84ff] px-4 py-2.5 text-[16px] leading-[1.55] text-white" style={{ animation: "lp-in .45s ease-out both" }}>敏感肌でも使える、3,000円台の化粧水は？</p>
        {typing ? (
          <p className="flex gap-1.5 pl-1 pt-1" aria-label="考えています">{[0, 1, 2].map((i) => <i key={i} className="lp-anim h-2 w-2 rounded-full bg-[#8e8e93]" style={{ animation: `lp-dot 1s ${i * 0.15}s infinite` }} />)}</p>
        ) : (
          <>
            <p className="lp-anim text-[15px] text-[#6e6e73]" style={{ animation: "lp-in .4s ease-out both" }}>おすすめを3つ選びました。</p>
            <ol className="space-y-2.5">
              {list.map((x, i) => (
                <li key={`${after}${x.b}`} className={`lp-anim flex gap-3 rounded-[14px] p-3.5 ${"me" in x ? "bg-[#e3f6ef] ring-2 ring-[#00a37a]" : "bg-[#f2f2f7]"}`} style={{ animation: `lp-in .45s ${0.15 + i * 0.18}s ease-out both${"me" in x ? ", lp-ring 1.4s .7s ease-out 2" : ""}` }}>
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
  const lines = [{ t: "AIに、", c: "" }, { t: "おすすめされる", c: "lp-shine" }, { t: "商品ページへ。", c: "" }];
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-12 text-center sm:pb-20 sm:pt-16">
      {/* 後ろの光：ゆっくり漂う */}
      <div className="pointer-events-none absolute inset-0 -z-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_55%,transparent_98%)]" aria-hidden>
        <i className="lp-anim absolute left-1/2 top-[48%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#2fd9a6]/30 blur-[90px] sm:h-[38rem] sm:w-[38rem]" style={{ animation: "lp-aurora1 14s ease-in-out infinite" }} />
        <i className="lp-anim absolute left-1/2 top-[58%] h-[26rem] w-[26rem] -translate-x-[10%] rounded-full bg-[#0a84ff]/20 blur-[90px] sm:h-[32rem] sm:w-[32rem]" style={{ animation: "lp-aurora2 17s ease-in-out infinite" }} />
      </div>

      <div className="relative mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 text-left lg:grid-cols-[1.1fr_1fr] lg:gap-8">
      <div>
        <p className={`inline-flex items-center gap-2 rounded-full border border-[#00a37a]/30 bg-white/80 px-3 py-1 text-[0.78rem] font-semibold text-[#00805f] transition duration-700 ${ready ? "opacity-100" : "opacity-0"}`}><span className="h-1.5 w-1.5 rounded-full bg-[#00a37a]" />ネットショップ向け AI検索対策ツール</p>
        <h1 className="lp-h mt-5 text-[2.3rem] leading-[1.25] sm:text-[3.6rem]">
          {lines.map((l, i) => (
            <span key={l.t} className="inline-block overflow-hidden pb-[.08em] align-bottom">
              <span className={`lp-anim inline-block whitespace-nowrap ${l.c}`} style={{ animation: ready ? `lp-rise .9s ${0.1 + i * 0.16}s cubic-bezier(.2,.7,.2,1) both${l.c ? ", lp-shine 4s linear infinite" : ""}` : "none", transform: ready ? undefined : "translateY(105%)" }}>{l.t.replace(/[、。]$/, "")}{/[、。]$/.test(l.t) && <span className="-mr-[0.08em]">{l.t.slice(-1)}</span>}</span>
            </span>
          ))}
        </h1>
        <p className={`mt-5 max-w-[32em] text-[1rem] leading-[1.9] text-[#424245] transition duration-700 sm:text-[1.1rem] ${ready ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`} style={{ transitionDelay: "600ms" }}><J>AIに選ばれるために足りないところを全商品で見つけ、直す文章とコードを用意し、AIから来た売上まで確かめます。</J></p>
        <ul className={`mt-6 space-y-2.5 transition duration-700 ${ready ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "700ms" }}>
          {["4つのAIの答えを、毎週測る", "商品ページの書き直し案を、そのままショップへ", "AIから来たお客様と売上を、数字で確かめる"].map((t) => <li key={t} className="flex items-start gap-2.5 text-[0.95rem]"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#00a37a] text-white"><Check size={13} strokeWidth={3} /></span><span className="min-w-0"><J>{t}</J></span></li>)}
        </ul>
        <div className={`mt-8 flex flex-col gap-3 transition duration-700 sm:flex-row ${ready ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "800ms" }}>
          <a href="#try" className="btn bg-[#00a37a] px-8 text-white hover:bg-[#008f6b]">14日間 無料で試す<ArrowRight size={18} /></a>
          <Link href="/" className="btn border border-black/15 bg-white px-7 text-[#1d1d1f]">デモ画面を見る</Link>
        </div>
        <p className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.78rem] text-[#6e6e73] transition duration-700 ${ready ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "900ms" }}><span className="flex items-center gap-1"><Check size={13} className="text-[#00a37a]" />カードの登録不要</span><span className="flex items-center gap-1"><Check size={13} className="text-[#00a37a]" />14日間無料</span><span className="flex items-center gap-1"><Check size={13} className="text-[#00a37a]" />いつでも解約</span></p>
        <div className={`mt-5 transition duration-700 ${ready ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "950ms" }}><LpVoice /></div>
      </div>
      <div className={`relative mx-auto mt-4 w-[15.5rem] sm:w-[18rem] lg:mt-0 ${ready ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`} style={{ transition: "opacity 1.4s .5s, transform 1.4s .5s cubic-bezier(.2,.7,.2,1)" }}>
        {/* まわりに浮かぶ質問（スマホでは左右2つずつ） */}
        {QS.map((q, i) => (
          <span key={q.t} className={`lp-anim pointer-events-none absolute z-20 whitespace-nowrap sm:z-0 rounded-full bg-white/90 px-3.5 py-2 text-[0.8rem] text-[#424245] shadow-[0_10px_30px_-12px_rgba(0,0,0,.25)] ring-1 ring-black/5 ${q.x} ${i >= 4 ? "hidden sm:block" : ""} max-sm:text-[0.7rem]`}
            style={{ animation: `lp-floatq 6s ${q.d}s ease-in-out infinite` }}>{q.t}</span>
        ))}
        <div className="relative z-10"><Phone><ChatScreen after={after} /></Phone></div>
        <div className="relative left-1/2 z-10 mt-6 grid w-[min(21rem,calc(100vw-2.5rem))] -translate-x-1/2 grid-cols-2 gap-2.5 sm:contents">
          <div key={`r${after}`} className={`lp-anim min-w-0 rounded-[8px] px-3.5 py-3 text-left sm:whitespace-nowrap sm:px-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,.25)] sm:absolute sm:-left-44 sm:top-48 sm:z-20 ${after ? "bg-[#00a37a] text-white" : "bg-white text-[#1d1d1f] ring-1 ring-black/5"}`} style={{ animation: "lp-pop .55s cubic-bezier(.2,.7,.2,1) both" }}>
            <p className="text-[0.7rem] font-semibold opacity-80">{after ? "TSURETEで直した後" : "直す前"}</p>
            <p className="text-[1.5rem] font-bold leading-tight">{after ? "1位" : "圏外"}</p>
          </div>
          <div className="min-w-0 rounded-[8px] bg-white px-3.5 py-3 text-left sm:whitespace-nowrap sm:px-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,.25)] ring-1 ring-black/5 sm:absolute sm:-right-48 sm:bottom-36 sm:z-20">
            <p className="text-[0.7rem] text-[#6e6e73]">AIにすすめられた割合</p>
            <p className="num whitespace-nowrap text-[1.1rem] font-bold sm:text-[1.3rem]">10% <span className="text-[#86868b]">→</span> <span className="text-[#00a37a]">70%</span></p>
          </div>
        </div>
      </div>
      </div>
      <div className="relative mx-auto mt-16 max-w-[1120px] rounded-[12px] border border-black/[.06] bg-white/85 px-5 py-4 text-left">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-10">
          <p className="flex flex-wrap items-center gap-2 text-[0.8rem]"><span className="mr-1 font-semibold text-[#6e6e73]">測るAI</span>{AI6.map((a) => <span key={a} className="rounded-[4px] bg-[#f4f7f6] px-2.5 py-1 font-semibold text-[#1d1d1f]">{a}</span>)}</p>
          <p className="flex flex-wrap items-center gap-2 text-[0.8rem]"><span className="mr-1 font-semibold text-[#6e6e73]">対応サイト</span>{["Shopify", "楽天市場", "Amazon", "Yahoo!ショッピング", "BASE", "STORES", "ほか"].map((a) => <span key={a} className="rounded-[4px] bg-[#f4f7f6] px-2.5 py-1 font-semibold text-[#1d1d1f]">{a}</span>)}</p>
        </div>
      </div>
    </section>
  );
}

const AI6 = ["ChatGPT", "Gemini", "Claude", "Perplexity"];

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
        <div className="relative mt-4 w-full max-w-[34rem] overflow-hidden rounded-[12px] bg-white text-[#202124] shadow-[0_30px_80px_-30px_rgba(47,217,166,.35)] sm:mt-7">
          <div className="relative h-[5.6rem] border-b border-black/[.06] sm:h-[5.4rem]">
            <div className={`absolute inset-0 px-4 pt-3 transition duration-700 ${stage === 0 ? "opacity-100" : "-translate-y-2 opacity-0"}`}>
              <div className="flex h-9 items-center gap-2.5 rounded-full border border-black/10 px-4 text-[0.85rem] shadow-[0_1px_4px_rgba(0,0,0,.08)]"><Search size={15} className="shrink-0 text-[#5f6368]" />敏感肌 化粧水 3000円</div>
              <p className="mt-3 flex gap-4 px-1 text-[0.72rem] text-[#5f6368]"><span className="border-b-2 border-[#1a73e8] pb-1 font-semibold text-[#1a73e8]">すべて</span><span>画像</span><span>ショッピング</span><span>ニュース</span></p>
            </div>
            <div className={`absolute inset-0 flex flex-col justify-between px-4 pb-2.5 pt-2.5 transition duration-700 ${stage >= 1 ? "opacity-100" : "translate-y-2 opacity-0"}`}>
              <p className="flex items-center gap-1 text-[0.82rem] font-semibold text-[#0d0d0d]">AIアシスタント<ChevronRight size={14} className="rotate-90 text-[#8e8e8e]" /></p>
              <span className="ml-auto rounded-[12px] bg-[#f4f4f4] px-3.5 py-1.5 text-[0.84rem] text-[#0d0d0d]">敏感肌でも使える、3,000円台の化粧水は？</span>
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
              <div className="flex items-center gap-3 rounded-[8px] border border-dashed border-[#00a37a]/60 bg-[#f3fbf8] px-3.5 py-2.5">
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
    <section className="px-5 py-24 sm:py-36">
      <Reveal className="text-center">
        <p className="lp-eye">Dashboard</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><J>ひと目で、今週がわかる。</J></h2>
        <p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>開いたら、数字とやることだけ。パソコンでも、スマホでも。</J></p>
      </Reveal>
      <div ref={ref} className="relative mx-auto mt-16 max-w-[60rem] pr-[10%] sm:mt-24 sm:pr-[12%]">
        <div style={{ transform: `translateY(${(1 - k) * 40}px) scale(${0.8 + 0.2 * k})`, opacity: 0.35 + 0.65 * k, transformOrigin: "50% 100%", transition: "transform 1.8s cubic-bezier(.2,.7,.2,1), opacity 1.2s" }}><Laptop silver src={`${IMG}/dash-pc.webp?v=6`} alt="パソコンで見たTSURETEのホーム画面" /></div>
        <div className="absolute bottom-[-2%] right-0 w-[22%]" style={{ transform: `translateX(${(1 - k) * 90}%) rotate(${(1 - k) * 6}deg)`, opacity: k, transition: "transform 1.5s cubic-bezier(.2,.7,.2,1) .7s, opacity 1s .7s" }}><Phone src={`${IMG}/dash-phone.webp?v=6`} alt="スマホで見たTSURETEのホーム画面" /></div>
      </div>
      {/* 画面が小さくて見えにくいときに、すぐ実物を開けるように */}
      <p className="mt-10 text-center sm:mt-14"><Link href="/" className="inline-flex items-center gap-1 text-[0.88rem] text-[#00a37a] hover:underline">実際の画面をデモで見る<ChevronRight size={16} /></Link></p>
    </section>
  );
}

// しくみの3つの見本（写真ではなく部品で描くので、スマホでも欠けない）
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] bg-white p-6 shadow-[0_30px_60px_-36px_rgba(0,0,0,.28)] ring-1 ring-black/[.04] sm:p-8">
      <p className="text-[0.95rem] font-semibold">{title}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}
function HealthVisual() {
  const [ref, on] = useInView<HTMLDivElement>();
  const rows = [["向いている人／向いていない人", false], ["比較表", false], ["よくある質問", false], ["構造化データ", false], ["成分・素材", true], ["値段・容量", true], ["用語の説明", false], ["レビューの中身", true]] as const;
  return (
    <div ref={ref}><Card title="商品ページの健康診断">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sakuapp/works/tsurete/img/products/lotion.webp?v=3" alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-[8px] object-cover" />
        <div className="min-w-0 flex-1"><b className="block text-[0.95rem]"><J>SORAE 化粧水 しっとり</J></b>
          <div className="mt-2 flex items-center gap-3"><span className="h-2 flex-1 overflow-hidden rounded-full bg-[#ececf0]"><span className="block h-full rounded-full bg-[#c2410c] transition-[width] duration-[1200ms] ease-out" style={{ width: on ? "38%" : 0 }} /></span><b className="num text-[#c2410c]">{on ? <Count to={38} /> : 0}点</b></div>
        </div>
      </div>
      <ul className="mt-5 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
        {rows.map(([t, ok], i) => (
          <li key={t} className="flex items-center gap-2 text-[0.86rem] transition-all duration-500" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(6px)", transitionDelay: `${300 + i * 70}ms` }}>
            {ok ? <Check size={16} className="shrink-0 text-[#00a37a]" /> : <X size={16} className="shrink-0 text-[#c2410c]" />}<span className={ok ? "text-[#86868b]" : "font-semibold"}><J>{t}</J></span>
          </li>
        ))}
      </ul>
      <p className="mt-5 rounded-[8px] bg-[#f5f5f7] px-4 py-3 text-[0.84rem] leading-[1.7] text-[#424245]"><J>足りないのは5か所。点検にAIは使わないので、AIの利用料はかかりません。</J></p>
    </Card></div>
  );
}
function FixVisual() {
  const [used, setUsed] = useState(false);
  return (
    <Card title="商品ページの書き直し案">
      <div className="flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sakuapp/works/tsurete/img/products/lotion.webp?v=3" alt="" width={72} height={72} className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-[8px] object-cover" />
        <div className="min-w-0"><b className="block text-[0.95rem]"><J>SORAE 化粧水 しっとり</J></b><p className="mt-1 text-[0.82rem] leading-[1.7] text-[#86868b] line-through decoration-[#c7c7cc]"><J>空のように澄んだ肌へ。毎日のうるおいに寄りそう、SORAEの化粧水。</J></p></div>
      </div>
      <div className={`mt-5 rounded-[8px] p-4 transition-colors duration-500 ${used ? "bg-[#e3f6ef]" : "border border-dashed border-[#00a37a]/50"}`}>
        <p className="text-[0.75rem] font-semibold text-[#00a37a]">{used ? "書きかえました" : "AIの書き直し案"}</p>
        <p className="mt-1.5 text-[0.9rem] leading-[1.8]"><J>敏感肌・乾燥肌の方のために作った化粧水です。香料・アルコールは入っていません。</J></p>
      </div>
      <button type="button" onClick={() => setUsed(!used)} className={`mt-4 rounded-[6px] px-5 py-2 text-[0.86rem] font-semibold transition-colors ${used ? "bg-[#f5f5f7] text-[#424245]" : "bg-[#1d1d1f] text-white"}`}>{used ? "もとに戻す" : "この案を使う"}</button>
    </Card>
  );
}
function SalesVisual() {
  const [ref, on] = useInView<HTMLDivElement>();
  const lab = ["9/22", "", "10/6", "", "10/20", "", "11/3", "", "今週"];
  return (
    <div ref={ref}><Card title="AI経由の注文">
      <p><b className="text-[2.2rem] font-bold leading-none">{on ? <Count to={64100} /> : 0}</b><span className="ml-1 text-[0.9rem] text-[#6e6e73]">円</span><span className="ml-2 text-[0.85rem] font-semibold text-[#00a37a]">直す前より増えた売上</span></p>
      <div className="mt-6"><LineChart data={[2, 1, 3, 2, 2, 3, 2, 3, 6]} labels={lab} on={on} /></div>
    </Card></div>
  );
}
const VISUALS = [HealthVisual, FixVisual, SalesVisual];

const STEPS = [
  { n: "診断", h: "AIに選ばれる準備は、できている？", d: "全商品のページを、比較表・向いている人・よくある質問・構造化データなど8つの項目で点検します。足りないところが、ひと目で分かります。", img: ["rank.webp?v=3", 1000, 738] },
  { n: "直す", h: "足りないところに、処方箋を。", d: "足りない項目ごとに、書き直し案とページに貼るコードを出します。基本はコピーして貼るだけ。Shopifyなどは押すだけで反映もできます。", img: ["naosu.webp?v=3", 1000, 965] },
  { n: "確かめる", h: "効いたかどうかは、お金で。", d: "お店のサイトに計測タグを貼るだけで、AIから来たお客様と売上を数えます。推測ではなく、実際の来店と注文で確かめます。", img: ["sales.webp?v=3", 1000, 572] },
] as const;

function Bars() {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="grid grid-cols-1 gap-3 md:grid-cols-2 sm:gap-4">
      {[
        { t: "いまの商品説明", d: "空のように澄んだ肌へ。毎日のうるおいに寄りそう、SORAEの化粧水。", v: 10, c: "#c2410c", tone: "text-[#6e6e73]" },
        { t: "AIが書き直した後", d: "敏感肌・乾燥肌の方のために作った化粧水です。香料・アルコールは入っていません。朝晩使って約2か月、1日あたり約55円。", v: 70, c: "#00a37a", tone: "" },
      ].map((x, i) => (
        <div key={x.t} className="flex flex-col rounded-[14px] bg-white p-8 sm:p-10">
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
      <p className="relative inline-block whitespace-nowrap text-[1.55rem] font-bold min-[360px]:text-[1.9rem] leading-[1.35] tracking-[-.01em] text-[#1d1d1f] sm:text-[3.6rem]">
        <span className={`transition-colors duration-700 ${on ? "text-[#b0b0b5]" : ""}`} style={{ transitionDelay: `${delay + 700}ms` }}>{t}</span>
        <span className="absolute left-0 top-[54%] h-[3px] rounded-full bg-[#1d1d1f] transition-[width] duration-700 ease-out sm:h-[5px]" style={{ width: on ? "100%" : "0%", transitionDelay: `${delay + 500}ms` }} aria-hidden />
      </p>
      <p className={`mt-2 text-[0.92rem] text-[#86868b] transition-opacity duration-700 sm:text-[1.05rem] ${on ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: `${delay + 900}ms` }}><J>{d}</J></p>
    </li>
  );
}
function Pain() {
  return (
    <section className="px-5 py-24 sm:py-40">
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
    { icon: CalendarClock, k: "月曜", t: "自動で点検", d: "TSURETEが全商品のページを点検。お店の作業はありません。" },
    { icon: Mail, k: "火曜", t: "処方箋が届く", d: "点検の結果と「今週やること」をメールでお知らせ。" },
    { icon: MousePointerClick, k: "5分", t: "読んで、押すだけ", d: "書き直し案を読んで「この案を使う」を押す。" },
    { icon: TrendingUp, k: "翌週", t: "効果がわかる", d: "計測タグで、AIから来たお客様と売上を確かめる。" },
  ];
  return (
    <section className="px-5 py-24 sm:py-36">
      <Reveal className="text-center"><p className="lp-eye">Workflow</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><span className="inline-block">お店の1週間は、</span><span className="inline-block">こう変わる。</span></h2><p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>やることは、週に一度の5分だけ。</J></p></Reveal>
      <ol className="relative mx-auto mt-14 grid grid-cols-1 max-w-[64rem] gap-8 sm:mt-20 md:grid-cols-4 md:gap-6">
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

// ---------- 測る：AIの答えを4つの数字で（AI計測ツールと同じことを、小さなお店の料金で） ----------
const AIBARS = [["ChatGPT", 31], ["Gemini", 24], ["Claude", 22], ["Perplexity", 35]] as const;
const KW = [["敏感肌 化粧水 アルコールフリー", true], ["化粧水 3000円台 比較", true], ["敏感肌 化粧水 口コミ", false], ["敏感肌向け 化粧水 選び方", true]] as const;
const MTOOLS = [
  { icon: TrendingUp, t: "毎週の推移と前の期間との比較", d: "4週・12週・26週で、上がったか下がったかを。" },
  { icon: BarChart3, t: "質問 × AI の一覧", d: "どの質問を、どのAIに聞いたときに出たかを色で。" },
  { icon: Swords, t: "ほかのブランドとの比較", d: "すすめられた割合・1位・根拠・平均の順位を並べて。" },
  { icon: Bot, t: "気づきと、データへの質問", d: "数字が動いた理由と次の一手。「負けている質問は？」と聞くだけ。" },
];
function Measure() {
  const [ref, on] = useInView<HTMLDivElement>();
  const nums = [{ l: "すすめられた割合", v: 28, u: "%" }, { l: "1位の割合", v: 9, u: "%" }, { l: "自分のサイトが根拠に", v: 46, u: "%" }, { l: "平均の順位", v: 2.1, u: "位", dec: 1 }];
  return (
    <section id="measure" className="scroll-mt-12 px-5 py-24 sm:py-36">
      <Reveal className="text-center">
        <p className="lp-eye">Measure</p>
        <h2 className="lp-h mt-2 text-[2rem] sm:text-[3.4rem]"><span className="inline-block">AIの答えを、</span><span className="inline-block">4つの数字で。</span></h2>
        <p className="mx-auto mt-4 max-w-[32em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>お客様が聞きそうな質問を、4つのAIに毎週くり返し聞いて数えます。名前が出たか、何番目か、自分のサイトが根拠になったか。前の期間とくらべて、上がったか下がったかまで。</J></p>
      </Reveal>
      <div ref={ref} className="mx-auto mt-14 grid grid-cols-1 max-w-[64rem] gap-4 sm:mt-20 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="h-full"><div className="h-full rounded-[14px] bg-white p-6 shadow-[0_30px_60px_-36px_rgba(0,0,0,.28)] sm:p-8">
          <div className="grid grid-cols-2 gap-3">
            {nums.map((x) => <div key={x.l} className="rounded-[8px] bg-[#f5f5f7] p-4"><p className="text-[0.78rem] text-[#6e6e73]"><J>{x.l}</J></p><p className="mt-1.5"><b className="text-[2rem] font-bold leading-none text-[#00a37a]">{on ? <Count to={x.v} dec={x.dec ?? 0} /> : 0}</b><span className="ml-1 text-[0.85rem] text-[#6e6e73]">{x.u}</span></p></div>)}
          </div>
          <p className="mt-7 text-[0.9rem] font-semibold">AIごとの、すすめられた割合</p>
          <ul className="mt-3 space-y-2.5">
            {AIBARS.map(([a, v], i) => <li key={a} className="grid grid-cols-[5.6rem_1fr_2.6rem] items-center gap-3 text-[0.84rem]"><span className="truncate font-semibold">{a}</span><span className="h-2 overflow-hidden rounded-full bg-[#ececf0]"><span className="block h-full rounded-full bg-[#00a37a] transition-[width] duration-[1200ms] ease-out" style={{ width: on ? `${v * 2}%` : 0, transitionDelay: `${200 + i * 80}ms` }} /></span><span className="num text-right text-[#6e6e73]">{v}%</span></li>)}
          </ul>
        </div></Reveal>
        <Reveal className="h-full" delay={150}><div className="h-full rounded-[14px] bg-white p-6 shadow-[0_30px_60px_-36px_rgba(0,0,0,.28)] sm:p-8">
          <p className="text-[0.9rem] font-semibold">AIが裏で調べたキーワード</p>
          <p className="mt-1 text-[0.8rem] leading-[1.7] text-[#6e6e73]"><J>質問「敏感肌でも使える、3,000円台の化粧水は？」のとき</J></p>
          <ul className="mt-4 divide-y divide-black/[.06]">
            {KW.map(([k, ok], i) => <li key={k} className="flex items-center gap-3 py-3 text-[0.86rem] transition-all duration-500" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(6px)", transitionDelay: `${300 + i * 90}ms` }}><Search size={14} className="shrink-0 text-[#86868b]" /><span className="min-w-0 flex-1"><J>{k}</J></span>{ok ? <span className="flex shrink-0 items-center gap-1 text-[0.75rem] font-semibold text-[#00a37a]"><Check size={14} />答えあり</span> : <span className="flex shrink-0 items-center gap-1 text-[0.75rem] font-semibold text-[#c2410c]"><X size={14} />答えなし</span>}</li>)}
          </ul>
          <p className="mt-5 rounded-[8px] bg-[#fdf0ea] px-4 py-3 text-[0.84rem] leading-[1.7] text-[#7c2d12]"><J>「口コミ」で調べられているのに、ページに答えがない。→ 処方箋：レビュー依頼の質問を変える</J></p>
        </div></Reveal>
      </div>
      <div className="mx-auto mt-4 grid grid-cols-1 max-w-[64rem] gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MTOOLS.map(({ icon: Icon, t, d }, i) => <Reveal key={t} delay={i * 80} className="h-full"><div className="h-full rounded-[12px] bg-white/80 p-5"><Icon size={20} strokeWidth={1.8} className="text-[#00a37a]" /><b className="mt-3 block text-[0.98rem]"><J>{t}</J></b><p className="mt-1 text-[0.84rem] leading-[1.75] text-[#6e6e73]"><J>{d}</J></p></div></Reveal>)}
      </div>
      <Reveal className="mx-auto mt-10 max-w-[40rem] text-center" delay={200}>
        <p className="text-[1.05rem] leading-[1.9] text-[#424245] sm:text-[1.2rem]"><J>測って終わりにしない。足りないところは、そのまま「直す」へ。</J></p>
        <p className="mt-3 text-[0.72rem] text-[#86868b]"><J>数字は架空のブランドでの模擬の結果です。</J></p>
      </Reveal>
    </section>
  );
}

const FEATURES = [
  { icon: CalendarClock, t: "全商品を毎週点検", d: "8つの項目で、全商品のページを自動で点検。" },
  { icon: Stethoscope, t: "処方箋", d: "書き直し案・よくある質問・構造化データのコード。" },
  { icon: Plug, t: "サイトに反映", d: "Shopifyは押すだけ。楽天・Amazon・Yahoo!はCSVで。" },
  { icon: BarChart3, t: "4つのAIで毎週測る", d: "4つの数字を、前の期間とくらべて。今すぐ測ることも（プロ）。" },
  { icon: Search, t: "AIが調べたキーワード", d: "質問の裏の検索に、ページが答えられているか。" },
  { icon: Swords, t: "ほかのブランドとの比較", d: "数字の比較と、ページに書かれていることの差。" },
  { icon: Bot, t: "データに質問", d: "「負けている質問は？」と聞くと、数字から答える。" },
  { icon: Link2, t: "AIが根拠にしたサイト", d: "載ると有利な記事と、掲載をお願いする文。" },
  { icon: TrendingUp, t: "売上で確かめる", d: "計測タグで、AIから来たお客様と売上を数える。" },
  { icon: Download, t: "CSVで書き出し", d: "結果を、Excelでそのまま開ける形で。" },
  { icon: GraduationCap, t: "学べる講座", d: "1レッスン約3分。確認テストと修了証つき。" },
];
function Features() {
  return (
    <section id="features" className="scroll-mt-12 px-5 py-24 sm:py-36">
      <Reveal className="text-center"><p className="lp-eye">Features</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><span className="inline-block">測るから、売上まで。</span><span className="inline-block">ぜんぶ、ひとつで。</span></h2><p className="mx-auto mt-4 max-w-[32em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>測るだけのツール、直すだけのアプリ、売上を見る道具。別々に入れていたものを、TSURETEひとつに。</J></p></Reveal>
      <ol className="mx-auto mt-14 grid grid-cols-1 max-w-[64rem] gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, t, d }, i) => (
          <Reveal key={t} delay={(i % 3) * 90} className="h-full"><li className="flex h-full gap-4 rounded-[12px] bg-white/80 p-6"><span className="num w-7 shrink-0 pt-0.5 text-[0.85rem] font-semibold text-[#86868b]">{String(i + 1).padStart(2, "0")}</span><span className="min-w-0"><Icon size={22} strokeWidth={1.7} className="text-[#00a37a]" /><b className="mt-3 block text-[1.05rem]"><J>{t}</J></b><span className="mt-1 block text-[0.88rem] leading-[1.75] text-[#6e6e73]"><J>{d}</J></span></span></li></Reveal>
        ))}
      </ol>
    </section>
  );
}

// ---------- 学ぶ：小さなお店向けの短い講座 ----------
const COURSE = [["知る", "AIで買い物をする時代に、何が変わったのか"], ["点検する", "自分のページの、どこが足りないかを見つける"], ["直す", "AIにも人にも伝わる商品ページの書き方"], ["届ける", "直したページを、AIが見る場所へ"], ["確かめる", "効いたかどうかを、数字とお金で見る"]];
function Learn() {
  return (
    <section id="learn" className="scroll-mt-12 px-5 py-24 sm:py-36">
      <div className="mx-auto grid grid-cols-1 max-w-[64rem] items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="lp-eye">Academy</p>
          <h2 className="lp-h mt-2 text-[2rem] sm:text-[3rem]"><span className="inline-block">お店の人が、</span><span className="inline-block">AI担当になれる。</span></h2>
          <p className="mt-5 text-[1.02rem] leading-[1.95] text-[#6e6e73]"><J>何時間も動画を見る必要はありません。1レッスン約3分の文章で、読んだらそのまま自分のお店の画面で試せます。登録なし・無料で、だれでも読めます。</J></p>
          <ul className="mt-8 flex flex-wrap gap-2">{[["5章・15レッスン", BookIcon], ["1つ約3分", Clock], ["確認テスト", Check], ["お店の名前入りの修了証", Award]].map(([t, I]) => { const Ic = I as typeof Check; return <li key={t as string} className="flex items-center gap-1.5 rounded-[4px] bg-white px-3.5 py-1.5 text-[0.84rem] font-semibold"><Ic size={15} className="text-[#00a37a]" />{t as string}</li>; })}</ul>
          <Link href="/manabu/" className="btn btn-ai mt-9 px-7">講座を読んでみる<ArrowRight size={18} /></Link>
        </Reveal>
        <Reveal delay={150}>
          <div className="rounded-[14px] bg-white p-6 shadow-[0_30px_60px_-36px_rgba(0,0,0,.28)] sm:p-8">
            <p className="flex items-center gap-2 text-[0.9rem] font-semibold"><GraduationCap size={18} className="text-[#00a37a]" />AIに選ばれる商品ページ講座</p>
            <ol className="mt-5 divide-y divide-black/[.06]">
              {COURSE.map(([t, d], i) => <li key={t} className="flex items-center gap-4 py-3.5"><span className="num grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e3f6ef] text-[0.8rem] font-bold text-[#00805f]">{i + 1}</span><span className="min-w-0 flex-1"><b className="block text-[0.95rem]">第{i + 1}章　{t}</b><span className="block text-[0.8rem] leading-[1.6] text-[#6e6e73]"><J>{d}</J></span></span><span className="shrink-0 text-[0.72rem] text-[#86868b]">3レッスン</span></li>)}
            </ol>
            <p className="mt-4 rounded-[8px] bg-[#f5f5f7] px-4 py-3 text-[0.82rem] leading-[1.7] text-[#424245]"><J>各章のあとに確認テスト。全部合格すると、修了証をその場で受け取れます。</J></p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ほかとのちがい：選ばれる理由と、よくある方法との比較（特定の会社名は出さない）
const PILLARS = [
  { icon: CalendarClock, t: "全商品を、毎週、自動で。", d: "AIに頼むことすら要りません。全商品のページを毎週点検して、やることだけを届けます。" },
  { icon: FileSpreadsheet, t: "楽天・Amazonにも、そのまま。", d: "Shopifyへの反映、楽天・Amazon・Yahoo!の取りこみ用CSVなど、サイトに合わせた形で届けます。" },
  { icon: TrendingUp, t: "使うほど、処方箋が賢くなる。", d: "どの直し方で、AIからのお客様と売上が増えたかを学び、ジャンルごとに効く案を出せるようにしていきます。" },
];
const COLS = ["TSURETE", "AIに\n自分で頼む", "SEO\nツール", "AI計測ツール\n（月数万円〜）", "1つの作業\nだけのアプリ"];
const COLS_SP = ["TSURETE", "AIに\n頼む", "SEO\nツール", "AI計測\nツール", "単機能\nアプリ"];
const ROWS: [string, number[]][] = [
  ["いくつものAIの答えを数える", [2, 0, 1, 2, 0]],
  ["ほかのブランドと、数字でくらべる", [2, 0, 1, 2, 0]],
  ["数字の理由と、次の一手を出す", [2, 1, 0, 1, 0]],
  ["AIが調べたキーワードを見る", [2, 0, 0, 2, 0]],
  ["全商品のページを、毎週自動で点検", [2, 0, 1, 0, 0]],
  ["直す文章とコードまで出す", [2, 1, 0, 1, 1]],
  ["ショップに反映（Shopify・楽天CSV）", [2, 0, 0, 0, 1]],
  ["効果を売上で確かめる", [2, 0, 1, 1, 0]],
  ["月3,000円から始められる料金", [2, 2, 1, 0, 1]],
];
function Mark({ v, me }: { v: number; me?: boolean }) {
  if (v === 2) return <Check size={18} strokeWidth={2.4} className={`mx-auto ${me ? "text-[#2fd9a6]" : "text-[#00a37a]"}`} aria-label="できる" />;
  if (v === 1) return <span className="mx-auto block h-3 w-3 rounded-full border-[1.5px] border-[#86868b]" aria-label="一部できる" />;
  return <Minus size={16} className="mx-auto text-[#c7c7cc]" aria-label="できない" />;
}
function Compare() {
  return (
    <section className="px-5 py-24 sm:py-36">
      <Reveal className="text-center"><p className="lp-eye">Why TSURETE</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><J>TSURETEを選ぶ理由。</J></h2></Reveal>
      <div className="mx-auto mt-14 grid grid-cols-1 max-w-[64rem] gap-4 sm:mt-16 md:grid-cols-3">
        {PILLARS.map(({ icon: Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 100} className="h-full"><div className="h-full rounded-[14px] bg-white/75 p-7 sm:p-8"><Icon size={26} strokeWidth={1.7} className="text-[#00a37a]" /><b className="mt-5 block text-[1.15rem] leading-[1.5]"><J>{t}</J></b><p className="mt-2 text-[0.92rem] leading-[1.8] text-[#6e6e73]"><J>{d}</J></p></div></Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-20 max-w-[56rem]">
        <p className="text-center text-[1.15rem] font-semibold sm:text-[1.4rem]"><J>よくある方法と、くらべると。</J></p>
        <div className="mt-8 overflow-hidden rounded-[12px] bg-white/75">
          <table className="w-full table-fixed text-[0.8rem] sm:text-[0.92rem]">
            <thead>
              <tr>
                <th className="w-[30%] p-3 sm:p-4" />
                {COLS.map((c, i) => <th key={c} className={`whitespace-pre-line px-0.5 py-3 text-center font-semibold leading-[1.35] sm:px-2 sm:text-[0.78rem] ${i === 0 ? "bg-[#1d1d1f] text-[0.55rem] tracking-[-.02em] text-[#2fd9a6]" : "text-[0.62rem] text-[#6e6e73]"}`}><span className="sm:hidden">{COLS_SP[i]}</span><span className="hidden sm:inline">{c}</span></th>)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([t, v]) => (
                <tr key={t} className="border-t border-black/[.05]">
                  <td className="p-3 leading-[1.5] sm:p-4"><J>{t}</J></td>
                  {v.map((x, i) => <td key={i} className={`py-3 ${i === 0 ? "bg-[#1d1d1f]" : ""}`}><Mark v={x} me={i === 0} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.75rem] text-[#86868b]"><span className="flex items-center gap-1"><Check size={13} className="text-[#00a37a]" />できる</span><span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-[#86868b]" />一部できる</span><span className="flex items-center gap-1"><Minus size={13} />できない</span></p>
        <p className="mt-2 text-center text-[0.72rem] leading-[1.8] text-[#86868b]"><J>一般的な特徴をもとにした比較です。特定の会社のサービスではありません。ツールや使い方によって異なります。</J><span className="block sm:hidden"><J>AI計測ツール＝AIの答えを測るツール（月数万円〜）、単機能アプリ＝1つの作業だけのアプリ</J></span></p>
      </Reveal>
    </section>
  );
}

function Safety() {
  const items = [
    { icon: ShieldCheck, t: "勝手に書きかえない", d: "サイトが変わるのは、お店の人が「この案を使う」を押したものだけ。" },
    { icon: RotateCcw, t: "いつでも、元に戻せる", d: "書きかえる前の文章を残しておくので、ひと押しで戻せます。" },
    { icon: PenLine, t: "分からない事実は、作らない", d: "成分や使える期間など、ページにないことは【】で空けてお店に確かめます。" },
    { icon: KeyRound, t: "パスワードは預からない", d: "サイトとは公式のつなぎ方だけ。計測タグは、名前やメールなどの個人の情報を集めません。" },
  ];
  return (
    <section id="safe" className="scroll-mt-14 px-5 py-24 sm:py-36">
      <Reveal className="text-center"><p className="lp-eye">Security</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><J>お店の大事なページだから。</J></h2></Reveal>
      <div className="mx-auto mt-14 grid grid-cols-1 max-w-[60rem] gap-4 sm:mt-16 sm:grid-cols-2">
        {items.map(({ icon: Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 90} className="h-full"><div className="flex h-full gap-5 rounded-[14px] bg-white p-7 sm:p-8"><Icon size={26} strokeWidth={1.7} className="mt-0.5 shrink-0 text-[#00a37a]" /><span className="min-w-0"><b className="block text-[1.1rem]"><J>{t}</J></b><span className="mt-1.5 block text-[0.92rem] leading-[1.8] text-[#6e6e73]"><J>{d}</J></span></span></div></Reveal>
        ))}
      </div>
    </section>
  );
}

const PLANS = [
  { n: "フリー", p: "0", u: "円", d: "まず1商品で試したい", who: "", f: ["1商品の診断と書き直し案（月1回）", "URL・CSVでの無料診断"] },
  { n: "スタンダード", p: "2,980", u: "円／月", d: "自分のお店のページを整えたい", who: "自分のお店", f: ["50商品を毎週自動で点検", "書き直し案 月50件", "Shopifyへの反映・楽天などのCSV", "AIから来たお客様と売上の計測", "ジャンル共通のAIの測定（月1回）"], hi: true },
  { n: "プロ", p: "9,800", u: "円／月", d: "自分のお店を、AIの答えまで深く見たい", who: "自分のお店", f: ["スタンダードのすべて", "500商品（100商品ごとに追加できます）", "書き直し案 月200件", "自分の質問15個を、4つのAIで毎週測る", "ほかのブランドとの比較・気づき・データに質問", "今すぐ測る（月2回）・CSVの書き出し"] },
  { n: "代理店", p: "13,780", u: "円／月〜", note: "1店舗のとき。基本料 9,800円＋1店舗ごと 3,980円", d: "お客様のお店をいくつも見る", who: "お客様のお店", f: ["全店の点数と変化を1画面で", "自社のロゴ入りレポートの書き出し", "お店の人の招待・見られる範囲を分ける", "1店舗ごと：点検・書き直し案 月50件・質問10個を毎週測る"] },
];
// プランの違い：1行ずつ、どこまでできるか
const MATRIX: [string, string[]][] = [
  ["向いている人", ["試したい", "自分のお店", "自分のお店", "お客様のお店"]],
  ["商品の数", ["1", "50", "500\n（追加できます）", "1店舗500\n（追加できます）"]],
  ["毎週の自動の点検", ["−", "◯", "◯", "◯"]],
  ["書き直し案", ["月1件", "月50件", "月200件", "1店舗 月50件"]],
  ["ショップへの反映（Shopify・CSV）", ["−", "◯", "◯", "◯"]],
  ["AIから来たお客様と売上の計測", ["−", "◯", "◯", "◯"]],
  ["ジャンル共通のAIの測定", ["−", "月1回", "月1回", "月1回"]],
  ["自分の質問をAIで測る", ["−", "−", "15個・毎週", "1店舗10個・毎週"]],
  ["今すぐ測る", ["−", "−", "月2回", "追加で購入"]],
  ["ほかのブランドとの比較・気づき", ["−", "−", "◯", "◯"]],
  ["データに質問・CSVの書き出し", ["−", "−", "◯", "◯"]],
  ["全店の一覧（点数と変化）", ["−", "−", "−", "◯"]],
  ["自社ロゴ入りのレポート", ["−", "−", "−", "◯"]],
  ["お店の人の招待・見られる範囲", ["−", "−", "−", "◯"]],
];
const STORES = [1, 3, 5, 10];
function Cell({ v }: { v: string }) {
  if (v === "◯") return <Check size={17} strokeWidth={2.4} className="mx-auto text-[#00a37a]" aria-label="あり" />;
  if (v === "−") return <Minus size={15} className="mx-auto text-[#c7c7cc]" aria-label="なし" />;
  return <span className="block whitespace-pre-line text-center leading-[1.4]">{v.includes("\n") ? v : <J>{v}</J>}</span>;
}
function Pricing() {
  const [n, setN] = useState(3);
  return (
    <section id="price" className="scroll-mt-12 px-5 py-24 sm:py-36">
      <Reveal className="text-center"><p className="lp-eye">Pricing</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><J>料金</J></h2><p className="mx-auto mt-5 max-w-[32em] text-[1.02rem] leading-[1.8] text-[#6e6e73]"><J>お店がAIの利用料を払う必要はありません。どのプランも、はじめの14日間は無料。カードの登録はいりません。</J></p><p className="mt-2 text-[0.8rem] text-[#86868b]"><J>※デモ用の仮の料金です。実際の料金は決まっていません。</J></p></Reveal>

      {/* まず、どれを選ぶか */}
      <Reveal className="mx-auto mt-12 max-w-[56rem]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[["まず試したい", "フリー"], ["自分のお店を良くしたい", "スタンダード・プロ"], ["お客様のお店を見ている", "代理店"]].map(([q, a]) => <div key={q} className="rounded-[12px] bg-white/80 px-5 py-4 text-center"><p className="text-[0.85rem] text-[#6e6e73]"><J>{q}</J></p><p className="mt-1 text-[1.05rem] font-bold text-[#00805f]">→ {a}</p></div>)}
        </div>
      </Reveal>

      <div className="mx-auto mt-8 grid grid-cols-1 max-w-[72rem] gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((x, i) => (
          <Reveal key={x.n} delay={i * 100} className="h-full">
            <div className={`flex h-full flex-col rounded-[14px] p-8 ${x.hi ? "bg-[#1d1d1f] text-white" : "bg-white/75"}`}>
              <p className="flex items-center justify-between gap-2"><b className="text-[1.15rem]">{x.n}</b>{x.hi ? <span className="rounded-full bg-[#2fd9a6] px-2.5 py-0.5 text-[0.72rem] font-semibold text-[#03140f]">おすすめ</span> : x.who && <span className="rounded-full bg-[#f2f2f5] px-2.5 py-0.5 text-[0.72rem] text-[#6e6e73]">{x.who}</span>}</p>
              <p className={`mt-1 text-[0.86rem] ${x.hi ? "text-white/60" : "text-[#6e6e73]"}`}><J>{x.d}</J></p>
              <p className="mt-6"><b className="num text-[2.6rem] leading-none">{x.p}</b><span className={`ml-1 text-[0.85rem] ${x.hi ? "text-white/70" : "text-[#6e6e73]"}`}>{x.u}</span></p>
              {"note" in x && <p className="mt-2 text-[0.8rem] leading-[1.6] text-[#6e6e73]"><J>{x.note as string}</J></p>}
              <ul className="mt-7 flex-1 space-y-3 text-[0.9rem]">{x.f.map((t) => <li key={t} className="flex gap-2.5"><Check size={17} className={`mt-0.5 shrink-0 ${x.hi ? "text-[#2fd9a6]" : "text-[#00a37a]"}`} /><span className="min-w-0"><J>{t}</J></span></li>)}</ul>
            </div>
          </Reveal>
        ))}
      </div>


      {/* 商品が多いお店の追加 */}
      <Reveal className="mx-auto mt-6 max-w-[56rem]">
        <div className="flex flex-col gap-4 rounded-[12px] bg-white/80 p-6 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[0.92rem] font-semibold">500商品をこえるお店は、100商品ごとに追加</p>
            <p className="mt-1 text-[0.84rem] leading-[1.8] text-[#6e6e73]"><J>プロと代理店（1店舗ごと）で使えます。追加した100商品ぶんの点検と、書き直し案 月50件がつきます。スタンダードで50商品をこえるときは、プロへ。</J></p>
          </div>
          <p className="shrink-0"><span className="text-[0.85rem] text-[#6e6e73]">100商品ごと</span> <b className="num text-[1.8rem]">980</b><span className="text-[0.85rem] text-[#6e6e73]">円／月</span></p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          {[500, 800, 1000, 2000].map((k) => <div key={k} className="rounded-[8px] bg-white/60 px-3 py-3"><p className="text-[0.78rem] text-[#6e6e73]">{k.toLocaleString("ja-JP")}商品なら</p><p className="num mt-0.5 text-[1.05rem] font-bold">{(9800 + Math.max(0, Math.ceil((k - 500) / 100)) * 980).toLocaleString("ja-JP")}円</p><p className="text-[0.7rem] text-[#86868b]">プロの場合</p></div>)}
        </div>
      </Reveal>

      {/* プロと代理店のちがい */}
      <Reveal className="mx-auto mt-16 max-w-[56rem]">
        <p className="text-center text-[1.15rem] font-semibold sm:text-[1.4rem]"><J>プロと代理店のちがい</J></p>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-[12px] bg-white/80 p-6"><b className="text-[1.05rem]">プロ</b><p className="mt-2 text-[0.92rem] leading-[1.85] text-[#424245]"><J>自分のお店を、深く見る。質問を多く測れて、今すぐ測るも使えます。お店が1つなら、こちらが安くてくわしい。</J></p></div>
          <div className="rounded-[12px] bg-white/80 p-6"><b className="text-[1.05rem]">代理店</b><p className="mt-2 text-[0.92rem] leading-[1.85] text-[#424245]"><J>たくさんのお店を、手間なく回す。全店の一覧、ロゴ入りレポート、お店の人の招待など、管理のための機能があります。</J></p></div>
        </div>
        <div className="mt-4 rounded-[12px] bg-white/80 p-6">
          <p className="text-[0.92rem] font-semibold">代理店の料金は、店舗の数で決まります</p><p className="mt-1 text-[0.82rem] text-[#6e6e73]"><J>基本料 9,800円（管理の機能）＋ 1店舗ごとに 3,980円</J></p>
          <div className="mt-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="店舗の数">
            {STORES.map((k) => <button key={k} type="button" role="tab" aria-selected={n === k} onClick={() => setN(k)} className={`rounded-[6px] px-4 py-1.5 text-[0.88rem] ${n === k ? "bg-[#1d1d1f] font-semibold text-white" : "bg-[#f2f2f5] text-[#424245]"}`}>{k}店舗</button>)}
          </div>
          <p className="mt-5 text-[0.88rem] text-[#6e6e73]">{n}店舗なら、月の合計</p>
          <p className="mt-1"><b className="num text-[2.2rem] leading-none">{(9800 + 3980 * n).toLocaleString("ja-JP")}</b><span className="ml-1 text-[0.9rem] text-[#6e6e73]">円／月</span></p>
          <p className="num mt-2 text-[0.8rem] text-[#6e6e73]">9,800円 ＋ 3,980円 × {n}店舗{n > 1 ? `（1店舗あたり ${Math.round((9800 + 3980 * n) / n).toLocaleString("ja-JP")}円）` : ""}</p>
        </div>
      </Reveal>

      {/* プランの違い（表） */}
      <Reveal className="mx-auto mt-16 max-w-[64rem]">
        <p className="text-center text-[1.15rem] font-semibold sm:text-[1.4rem]"><J>プランでできること</J></p>
        <div className="mt-6 overflow-x-auto rounded-[12px] bg-white/80">
          <table className="w-full min-w-[40rem] table-fixed text-[0.82rem] sm:text-[0.9rem]">
            <thead><tr className="border-b border-black/[.06]"><th className="w-[34%] p-3 text-left sm:p-4" />{PLANS.map((x) => <th key={x.n} className={`px-1 py-3 text-center font-semibold ${x.hi ? "bg-[#1d1d1f] text-[#2fd9a6]" : ""}`}>{x.n}</th>)}</tr></thead>
            <tbody>{MATRIX.map(([t, v]) => <tr key={t} className="border-t border-black/[.05]"><td className="p-3 leading-[1.5] sm:p-4"><J>{t}</J></td>{v.map((c, i) => <td key={i} className={`px-1 py-3 text-[0.78rem] ${PLANS[i].hi ? "bg-[#1d1d1f] text-white" : "text-[#424245]"}`}><Cell v={c} /></td>)}</tr>)}</tbody>
          </table>
        </div>
        <p className="mt-3 text-center text-[0.75rem] leading-[1.8] text-[#86868b]"><J>測るAIは、ChatGPT・Gemini・Claude・Perplexityの4つです。商品の数・書き直し案・測る回数には、プランごとに上限があります。上限をこえた月は、追加するか次の月までお待ちください。</J></p>
      </Reveal>
    </section>
  );
}

function Start() {
  const steps = [
    { t: "URLを入れる", d: "まずは1商品、無料で診断。登録はいりません。" },
    { t: "サイトを選んで、タグを貼る", d: "Shopify・楽天などのサイトを選び、計測タグを貼ります（貼れないサイトは注文CSVで）。" },
    { t: "毎週、届くのを待つ", d: "あとはTSURETEが自動で点検して、処方箋を届けます。" },
  ];
  return (
    <section className="px-5 py-24 sm:py-36">
      <Reveal className="text-center"><p className="lp-eye">Getting started</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><J>はじめ方は、3つだけ。</J></h2></Reveal>
      <ol className="mx-auto mt-14 grid grid-cols-1 max-w-[60rem] gap-10 sm:mt-16 md:grid-cols-3 md:gap-8">
        {steps.map((x, i) => (
          <Reveal key={x.t} delay={i * 110}><li className="border-t border-[#d2d2d7] pt-6"><span className="num text-[2.4rem] font-bold leading-none text-[#00a37a]">{i + 1}</span><b className="mt-4 block text-[1.2rem]"><J>{x.t}</J></b><span className="mt-2 block text-[0.95rem] leading-[1.8] text-[#6e6e73]"><J>{x.d}</J></span></li></Reveal>
        ))}
      </ol>
    </section>
  );
}

const FAQ = [
  { q: "必ずAIにすすめられるようになりますか？", a: "いいえ、保証はできません。AIの答えは、AIを作っている会社のしくみで決まります。TSURETEは、AIが読み取りやすいページになるよう材料をそろえ、効いたかどうかを実際の来店と売上で確かめます。" },
  { q: "AIの答えは、人によって変わるのでは？", a: "変わります。だからTSURETEは、AIの答えを当てにいくのではなく、AIが読み取りやすいページかを点検して直します。効いたかどうかは、計測タグで実際の来店と売上を見て確かめます。どの質問で負けているかは、プロプランの共有の測定で目安を出します。" },
  { q: "AIの答えを測るツールとは、何が違いますか？", a: "測るツールは、AIにどれだけ名前が出ているかを教えてくれます。TSURETEも同じように4つのAIで測りますが、そこで終わりません。足りないところを商品ページごとに見つけて、直す文章とコードを出し、ショップに反映し、AIから来たお客様と売上まで確かめます。料金も、月3,000円ほどから始められる額にしています。" },
  { q: "AI対策の知識がなくても使えますか？", a: "使えます。点検と書き直し案はTSURETEが出すので、お店の人は読んで選ぶだけです。考え方を知りたい方のために、1レッスン約3分の講座（全5章・15レッスン、確認テストと修了証つき）を、登録なし・無料で用意しています。" },
  { q: "ハックや裏技は使いますか？", a: "使いません。AIをだます方法は、見つかると逆に外されるおそれがあります。TSURETEは、比較表やよくある質問、構造化データなど、AIにも人にも分かりやすいページにする、まっとうな方法だけを使います。" },
  { q: "お店の作業は、どれくらいですか？", a: "点検は、すべて自動です。お店の人は、毎週届く処方箋を読んで、コピーして貼るか、使う案のボタンを押すだけです。目安は週に5分ほどです。" },
  { q: "サイトの文章が、勝手に変わることはありますか？", a: "ありません。サイトが変わるのは、お店の人が「この案を使う」を押したものだけです。書きかえる前の文章は残しておくので、いつでも戻せます。" },
  { q: "AIの利用料はかかりますか？", a: "お店が払う必要はありません。点検はAIを使わずに行い、書き直し案を作る分の小さな費用は、TSURETEの料金に含みます。" },
  { q: "化粧品以外でも使えますか？", a: "使えます。食品・雑貨・アパレル・ハンドメイドなど、お客様が比べて選ぶ商品に向いています。" },
  { q: "解約はいつでもできますか？", a: "いつでもできるようにする予定です。料金や契約の決まりは、正式に決まりしだいお知らせします。" },
];
function Faq() {
  return (
    <section id="faq" className="scroll-mt-12 px-5 py-24 sm:py-36">
      <Reveal className="text-center"><p className="lp-eye">FAQ</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><J>よくある質問</J></h2></Reveal>
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

// ---------- サポート：困ったときに頼れる ----------
function Support() {
  const items = [
    { icon: CalendarClock, t: "はじめの設定を、一緒に", d: "サイトのつなぎ方と計測タグの貼り方を、オンライン（30分）でお手伝いします。" },
    { icon: Mail, t: "メールで質問", d: "使い方や、書き直し案の考え方の質問に、2営業日以内にお返事します。" },
    { icon: GraduationCap, t: "学べる講座", d: "1レッスン約3分。考え方と使い方を、登録なし・無料で読めます。" },
  ];
  return (
    <section id="support" className="scroll-mt-14 px-5 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[64rem] grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <Reveal><p className="lp-eye">Support</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3rem]"><span className="inline-block">はじめてでも、</span><span className="inline-block">ひとりにしない。</span></h2><p className="mt-4 text-[1.02rem] leading-[1.9] text-[#6e6e73]"><J>AI対策がはじめての方でも、続けられるように。設定から使い方まで、人がお手伝いします。</J></p></Reveal>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Reveal delay={120}><img src={`${IMG}/support.webp?v=1`} alt="オンラインで設定を手伝うサポート担当" width={1376} height={768} loading="lazy" className="block h-auto w-full rounded-[14px] object-cover" /></Reveal>
      </div>
      <div className="mx-auto mt-14 grid grid-cols-1 max-w-[64rem] gap-4 md:grid-cols-3">
        {items.map(({ icon: Icon, t, d }, i) => <Reveal key={t} delay={i * 100} className="h-full"><div className="h-full rounded-[12px] border border-black/[.06] bg-white p-7"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e3f6ef] text-[#00805f]"><Icon size={21} /></span><b className="mt-5 block text-[1.08rem]"><J>{t}</J></b><p className="mt-2 text-[0.9rem] leading-[1.85] text-[#6e6e73]"><J>{d}</J></p></div></Reveal>)}
      </div>
      <p className="mt-6 text-center text-[0.75rem] text-[#86868b]"><J>※デモのため、サポートの内容は予定です。</J></p>
    </section>
  );
}
function FinalCta() {
  return (
    <section className="px-5 pb-24 sm:pb-32">
      <div className="relative mx-auto max-w-[64rem] overflow-hidden rounded-[14px] bg-[#1d1d1f] px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/cta-bg.webp?v=1`} alt="" width={1376} height={768} loading="lazy" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111]/80 via-[#111]/72 to-[#111]/88" aria-hidden />
        <div className="relative">
        <p className="lp-eye lp-eye-dark">Get started</p>
        <h2 className="lp-h mt-3 text-[1.9rem] sm:text-[3rem]"><span className="inline-block">AIに選ばれる準備を、</span><span className="inline-block">今日から。</span></h2>
        <p className="mx-auto mt-4 max-w-[30em] text-[0.98rem] leading-[1.85] text-white/70"><J>全商品の点検から、書き直し、売上の確認まで。14日間、すべての機能を無料で試せます。</J></p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#try" className="btn bg-[#00a37a] px-8 text-white hover:bg-[#00b588]">14日間 無料で試す<ArrowRight size={18} /></a>
          <Link href="/" className="btn border border-white/25 px-7 text-white hover:border-white/60">デモ画面を見る</Link>
          <Link href="/manabu/" className="btn border border-white/25 px-7 text-white hover:border-white/60">使い方を見る</Link>
        </div>
        <p className="mt-5 text-[0.78rem] text-white/60">カードの登録不要・14日間無料・いつでも解約</p>
        </div>
      </div>
    </section>
  );
}

// セクションごとの背景の色（スクロールに合わせて、となりの色へとけるように変わる）
// 黒い場面（4番目）は、その場面だけ黒。ページ全体まで黒にすると、手前の文字が読めなくなるため
const BG = ["#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6", "#ffffff", "#f4f7f6"];
const NAV = ["はじめに","AIで買う時代","これまでの集客","検索とAIのちがい","画面","点検は自動","しくみ","測る","お店の1週間","使う前と後","対応サイト","だれのため","機能","学ぶ","選ばれる理由","サポート","安心","料金","はじめ方","よくある質問","無料診断","はじめる"];

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
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-500 ${dark ? "border-white/10 bg-black/75 text-white" : "border-black/[.06] bg-white/90"}`}>
        <div className="mx-auto flex h-14 max-w-[1120px] items-center gap-6 px-5 text-[0.82rem]">
          <Link href="/lp/" className="flex shrink-0 items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#00a37a]" /><b className="tracking-[.18em]">TSURETE</b><span className={`hidden rounded-md border px-1.5 py-px text-[0.62rem] font-semibold tracking-[.06em] sm:inline ${dark ? "border-white/25 text-white/70" : "border-black/15 text-[#424245]"}`}>AI検索対策</span></Link>
          <nav className={`hidden gap-6 lg:flex ${dark ? "text-white/70" : "text-[#424245]"}`}><a href="#how" className="hover:text-[#00a37a]">しくみ</a><a href="#measure" className="hover:text-[#00a37a]">測る</a><a href="#features" className="hover:text-[#00a37a]">機能</a><a href="#price" className="hover:text-[#00a37a]">料金</a><a href="#support" className="hover:text-[#00a37a]">サポート</a><Link href="/manabu/" className="hover:text-[#00a37a]">学ぶ</Link><a href="#faq" className="hover:text-[#00a37a]">よくある質問</a></nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className={`hidden rounded-[6px] border px-4 py-1.5 text-[0.78rem] font-semibold sm:inline-block ${dark ? "border-white/30" : "border-black/15"}`}>デモを見る</Link>
            <a href="#try" className="rounded-[6px] bg-[#00a37a] px-4 py-1.5 text-[0.78rem] font-semibold text-white hover:bg-[#008f6b]">無料で試す</a>
          </div>
        </div>
      </header>

      <main>
        <Hero />

        {/* お客様は、もうAIに聞いて買っている */}
        <section className="px-5 pb-24 pt-14 sm:pb-36 sm:pt-24">
          <Reveal className="text-center">
            <p className="lp-eye">Market</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><J>お客様は、もう「AIに聞いて」買っている。</J></h2>
            <p className="mx-auto mt-4 max-w-[32em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>検索して何ページも見くらべるより、AIに「おすすめは？」と聞くほうが早いから。</J></p>
          </Reveal>
          <Reveal className="mx-auto mt-14 max-w-[64rem]" delay={120}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/ask-ai.webp?v=3`} alt="ソファでスマホのAIに相談している人" width={1264} height={848} loading="lazy" className="block h-auto w-full rounded-[14px] object-cover sm:rounded-[14px]" />
          </Reveal>
          {/* 数字で見る：AIで買い物をする人（各社の調査） */}
          <div className="mx-auto mt-16 grid grid-cols-1 max-w-[56rem] gap-10 text-center sm:mt-24 sm:grid-cols-3 sm:gap-6">
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
          <Reveal className="text-center"><p className="lp-eye">Automation</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><span className="inline-block">点検は、</span><span className="inline-block">ぜんぶ自動。</span></h2><p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>お店の人は、何もしなくて大丈夫。TSURETEが毎週、全商品のページを点検して、処方箋を届けます。</J></p></Reveal>
          <div className="mx-auto mt-16 grid max-w-[56rem] grid-cols-2 gap-y-12 text-center sm:grid-cols-4">
            {[{ v: 8, s: "項目", l: "点検する情報" }, { v: 4, s: "つ", l: "答えを測るAI" }, { v: 9, s: "種類", l: "対応するサイト" }, { v: 5, s: "分", l: "1週間の作業の目安" }].map((x) => (
              <Reveal key={x.l}><p className="text-[2.6rem] font-bold leading-none sm:text-[3.4rem]"><Count to={x.v} /><span className="ml-1 text-[1.2rem] font-semibold">{x.s}</span></p><p className="mt-3 text-[0.88rem] text-[#6e6e73]">{x.l}</p></Reveal>
            ))}
          </div>
        </section>

        {/* しくみ */}
        <section id="how" className="scroll-mt-12 px-5 pb-20 pt-24 sm:py-36">
          <Reveal className="text-center"><p className="lp-eye">How it works</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><span className="inline-block">点検する。直す。</span><span className="inline-block">売上で確かめる。</span></h2></Reveal>
          <div className="mx-auto mt-14 max-w-[62rem] space-y-20 sm:mt-20 sm:space-y-40">
            {STEPS.map((s, i) => (
              <div key={s.n} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
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

        <Measure />
        <Week />

        {/* 書き直す前と後 */}
        <section className="px-5 py-24 sm:py-36">
          <Reveal className="text-center"><p className="lp-eye">Before / After</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><span className="inline-block">書き直すと、</span><span className="inline-block">こう変わる。</span></h2><div className="mt-6 flex items-center justify-center gap-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/sakuapp/works/tsurete/img/products/lotion.webp?v=3" alt="" width={56} height={56} className="h-14 w-14 rounded-[8px] object-cover" /><p className="text-left text-[0.88rem] leading-[1.6] text-[#6e6e73]">見本：SORAE 化粧水<br />（架空のブランド・模擬の結果）</p></div></Reveal>
          <div className="mx-auto mt-16 max-w-[60rem]"><Bars /></div>
        </section>

        {/* 対応サイト */}
        <section id="sites" className="scroll-mt-12 px-5 py-24 sm:py-36">
          <Reveal className="text-center"><p className="lp-eye">Integrations</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><J>どのサイトでも。</J></h2><p className="mx-auto mt-4 max-w-[30em] text-[1.02rem] leading-[1.8] text-[#6e6e73]"><J>測るのは、サイトに何も入れずに。直すときは、サイトに合わせて届け方を選べます。</J></p></Reveal>
          <div className="mx-auto mt-16 grid grid-cols-1 max-w-[60rem] gap-4 sm:grid-cols-2">
            {WAYS.map(({ m, icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 90} className="h-full">
                <div className="flex h-full flex-col rounded-[14px] bg-white/75 p-8">
                  <Icon size={30} strokeWidth={1.6} className="text-[#00a37a]" />
                  <b className="mt-6 text-[1.3rem]">{t}</b>
                  <p className="mt-1 text-[0.95rem] text-[#6e6e73]"><J>{d}</J></p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-7" aria-label="対応するサイト">
                    {(m === "feed" ? ["すべてのサイト"] : PLATFORMS.filter((p) => p.method === m).map((p) => p.name)).map((n) => {
                      const [main, sub] = n.split("（");
                      return <li key={n} className="whitespace-nowrap rounded-[4px] bg-white px-3.5 py-1.5 text-[0.82rem] font-semibold text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,.04)]">{main}{sub && <span className="ml-1.5 font-normal text-[#86868b]">{sub.replace("）", "")}</span>}</li>;
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* だれのため：自分のお店／いくつものお店を見る会社 */}
        <section className="px-5 py-24 sm:py-36">
          <Reveal className="text-center">
            <p className="lp-eye">For whom</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><span className="inline-block">お店の、</span><span className="inline-block">AI担当に。</span></h2>
            <p className="mx-auto mt-4 max-w-[32em] text-[1.02rem] leading-[1.8] text-[#6e6e73] sm:text-[1.2rem]"><J>AI対策の担当者を置かなくても、TSURETEが毎週点検して、やることだけを届けます。1つのお店でも、たくさんのお店でも。</J></p>
          </Reveal>
          <div className="mx-auto mt-14 grid grid-cols-1 max-w-[64rem] gap-4 sm:mt-16 md:grid-cols-2">
            {[
              { img: "owner.webp?v=3", alt: "作業机でネットショップを運営している人", k: "自分のお店を運営する方", t: "ひとりでも、AI対策を続けられる。", d: "点検はぜんぶ自動。毎週届く「今週やること」を読んで、使う案を押すだけ。作業は週5分ほどです。", p: "フリー・スタンダード・プロ" },
              { img: "agency.webp?v=1", alt: "オフィスでモニターの数字を見ながら打ち合わせをする2人", k: "制作会社・代理店・EC運用チーム", t: "たくさんのお店を、まとめて見る。", d: "お店ごとの点検・測定・書き直し案をひとつの画面で。お店ごとのレポートを書き出して、そのまま報告に使えます。お店の人を招待して、一緒に進めることも。", p: "代理店プラン（基本料＋1店舗ごと）" },
            ].map((x, i) => (
              <Reveal key={x.k} delay={i * 120} className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-[14px] bg-white">
                  {x.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`${IMG}/${x.img}`} alt={x.alt} width={1376} height={768} loading="lazy" className="block aspect-[16/9] h-auto w-full object-cover" />
                  ) : (
                    <div className="grid aspect-[16/9] place-items-center bg-[#1d1d1f] p-6">
                      <ul className="w-full max-w-[20rem] space-y-2">{[["SORAE", 86], ["はなもり茶舗", 72], ["KOMOREBI 雑貨", 64], ["Lumi Kids", 41]].map(([n, v]) => <li key={n as string} className="flex items-center gap-3 rounded-xl bg-white/[.06] px-3.5 py-2.5 text-[0.82rem] text-white"><span className="min-w-0 flex-1 truncate">{n as string}</span><span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-[#2fd9a6]" style={{ width: `${v}%` }} /></span><span className="num w-7 text-right text-[#2fd9a6]">{v as number}</span></li>)}</ul>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-7 sm:p-8">
                    <p className="text-[0.85rem] font-semibold text-[#00a37a]">{x.k}</p>
                    <b className="mt-2 block text-[1.3rem] leading-[1.5]"><J>{x.t}</J></b>
                    <p className="mt-3 flex-1 text-[0.95rem] leading-[1.9] text-[#6e6e73]"><J>{x.d}</J></p>
                    <a href="#price" className="mt-6 flex items-center text-[0.9rem] text-[#00a37a] hover:underline">{x.p}<ChevronRight size={16} /></a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-12 max-w-[56rem] text-center" delay={150}>
            <p className="text-[0.85rem] font-semibold text-[#1d1d1f]"><J>比べて選ばれる商品なら、ジャンルは問いません。</J></p>
            <p className="mt-3 flex flex-wrap justify-center gap-2">{["スキンケア", "食品・お菓子", "雑貨・インテリア", "アパレル", "ハンドメイド", "ベビー用品", "ペット用品"].map((t) => <span key={t} className="rounded-[4px] bg-white px-3.5 py-1.5 text-[0.85rem]">{t}</span>)}</p>
            <p className="mt-4 text-[0.72rem] text-[#86868b]"><J>店名はすべて架空です。</J></p>
          </Reveal>
        </section>

        <Features />
        <Learn />
        <Compare />

        <Support />
        <Safety />
        <Pricing />
        <Start />
        <Faq />

        {/* 無料診断 */}
        <section id="try" className="scroll-mt-12 px-5 py-28 text-center sm:py-40">
          <Reveal className="mx-auto max-w-[38rem]">
            <p className="lp-eye">Free check</p><h2 className="lp-h mt-3 text-[2rem] sm:text-[3.2rem]"><J>まずは1商品、無料で。</J></h2>
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
        <FinalCta />
      </main>
      <ScrollNav names={NAV} dark={[3]} colors={BG} />

      <footer className="border-t border-black/[.06] bg-[#f4f7f6] px-5 pb-28 pt-14 text-[0.82rem] text-[#424245] sm:pb-12">
        <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#00a37a]" /><b className="tracking-[.18em] text-[#1d1d1f]">TSURETE</b></p>
            <p className="mt-3 max-w-[22em] leading-[1.8] text-[#6e6e73]"><J>ネットショップのための、AI検索対策ツール。点検・書き直し・測定・売上の確認を、ひとつで。</J></p>
          </div>
          {[
            { h: "製品", l: [["しくみ", "#how"], ["測る", "#measure"], ["機能", "#features"], ["対応サイト", "#sites"], ["料金", "#price"]] },
            { h: "始める・学ぶ", l: [["無料で試す", "#try"], ["デモ画面", "/"], ["学ぶ・使い方", "/manabu/"], ["サポート", "#support"], ["よくある質問", "#faq"]] },
            { h: "安心して使うために", l: [["セキュリティ", "#safe"], ["利用規約（準備中）", ""], ["プライバシーポリシー（準備中）", ""], ["特定商取引法に基づく表記（準備中）", ""]] },
          ].map((c) => (
            <div key={c.h} className="min-w-0"><p className="font-semibold text-[#1d1d1f]">{c.h}</p><ul className="mt-3 space-y-2">{c.l.map(([t, h]) => <li key={t}>{h ? (h.startsWith("#") ? <a href={h} className="hover:text-[#00a37a]">{t}</a> : <Link href={h} className="hover:text-[#00a37a]">{t}</Link>) : <span className="text-[#86868b]">{t}</span>}</li>)}</ul></div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-[1120px] flex-col gap-2 border-t border-black/[.08] pt-6 text-[0.72rem] text-[#86868b] sm:flex-row sm:justify-between">
          <span>TSURETE（デモ）・音声ガイド：VOICEVOX:九州そら</span><span><J>数字は架空のブランドでの模擬の結果です。AIにすすめられることは保証できません。</J></span>
        </div>
      </footer>

      {/* スマホ：下に固定の申し込みボタン */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[.06] bg-white/95 px-4 pb-[calc(.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl sm:hidden">
        <div className="flex gap-2"><a href="#try" className="flex h-11 flex-1 items-center justify-center rounded-[6px] bg-[#00a37a] text-[0.9rem] font-semibold text-white">14日間 無料で試す</a><Link href="/" className="flex h-11 items-center justify-center rounded-[6px] border border-black/15 px-4 text-[0.85rem] font-semibold">デモ</Link></div>
      </div>
    </div>
  );
}
