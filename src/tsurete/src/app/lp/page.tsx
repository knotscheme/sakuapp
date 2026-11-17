"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, Check, ChevronRight, Copy, FileSpreadsheet, Plug, Rss, X } from "lucide-react";
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
      const v = mode === "sticky" ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
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
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "0px 0px -12% 0px" });
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
        <p className="mx-auto mt-5 max-w-[30em] text-[1.05rem] leading-[1.8] text-[#6e6e73] sm:text-[1.3rem]"><J>AIにすすめられる回数を毎週はかって、全商品の商品ページをまとめて直す。</J></p>
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

// ---------- 黒い場面：スクロールに合わせて「10件」が「3つ」に減る ----------
function TenToThree() {
  const [ref, p] = useProgress<HTMLElement>("sticky");
  const stage = p < 0.3 ? 0 : p < 0.65 ? 1 : 2;
  const lines = ["検索なら、10件。", "AIなら、3つ。", "3つに入らなければ、ないのと同じ。"];
  return (
    <section ref={ref} className="relative h-[300vh] bg-black text-white" aria-label="検索とAIの違い">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5">
        <div className="relative h-[7.5rem] w-full max-w-[44rem] text-center sm:h-[8rem]">
          {lines.map((t, i) => <h2 key={t} className={`lp-h absolute inset-0 grid place-items-center text-[1.9rem] transition duration-700 sm:text-[3.4rem] ${stage === i ? "translate-y-0 opacity-100" : stage > i ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0"} ${i === 2 ? "text-[#2fd9a6]" : ""}`}><J>{t}</J></h2>)}
        </div>
        <ol className="mt-8 w-full max-w-[26rem] sm:mt-10" aria-hidden>
          {Array.from({ length: 10 }, (_, i) => {
            const gone = stage >= 1 && i >= 3;
            // 消える行は、場所ごと縮める（残った3つが真ん中に来る）
            return (
              <li key={i} className="flex items-center gap-3 overflow-hidden transition-all duration-700" style={{ opacity: gone ? 0 : 1, maxHeight: gone ? 0 : "3rem", marginTop: i && !gone ? "0.55rem" : 0, transform: gone ? "translateX(-24px)" : "none", transitionDelay: `${gone ? (i - 3) * 40 : (9 - i) * 30}ms` }}>
                <span className="num w-5 text-right text-[0.8rem] text-white/40">{i + 1}</span>
                <span className={`h-7 flex-1 rounded-xl sm:h-9 transition-colors duration-700 ${stage >= 1 && i < 3 ? "bg-white/20" : "bg-white/[.07]"}`} style={{ maxWidth: `${92 - (i % 4) * 9}%` }} />
              </li>
            );
          })}
        </ol>
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
        <div style={{ transform: `scale(${0.86 + 0.14 * k})`, transformOrigin: "50% 100%" }}><Laptop silver src={`${IMG}/dash-pc.webp`} alt="パソコンで見たTSURETEのホーム画面" /></div>
        <div className="absolute bottom-[-2%] right-0 w-[22%]" style={{ transform: `translateX(${(1 - k) * 60}%)`, opacity: 0.2 + 0.8 * k }}><Phone src={`${IMG}/dash-phone.webp`} alt="スマホで見たTSURETEのホーム画面" /></div>
      </div>
    </section>
  );
}

function Shot({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return (
    <div className="overflow-hidden rounded-[22px] bg-[#0b1426] shadow-[0_30px_60px_-30px_rgba(0,0,0,.35)] ring-1 ring-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/${src}`} alt={alt} width={w} height={h} loading="lazy" className="block h-auto w-full" />
    </div>
  );
}
const STEPS = [
  { n: "測る", h: "AIの中での順位を、毎週。", d: "お客様が聞きそうな質問を、ChatGPTなど4つのAIに毎週何百回も聞いて、すすめられた回数と順位を記録します。", img: ["rank.webp", 1000, 644] },
  { n: "直す", h: "足りないものを、AIが書き直す。", d: "よくすすめられている店との差を、AIが商品ページの書き直し案にします。押すだけで、お店のサイトに合った方法で届けます。", img: ["naosu.webp", 1000, 925] },
  { n: "売上", h: "効いたかどうかは、お金で。", d: "AIにすすめられて来たお客様と、その売上を数えます。直した効果を、はっきり確かめられます。", img: ["sales.webp", 1000, 468] },
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
            <img src={`${IMG}/ask-ai.webp`} alt="ソファでスマホのAIに相談している人の手元" width={1264} height={848} loading="lazy" className="block h-auto w-full rounded-[28px] object-cover sm:rounded-[36px]" />
          </Reveal>
        </section>

        <TenToThree />
        <Showcase />

        {/* 数字 */}
        <section className="px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]">毎週、AIに聞きつづける。</h2></Reveal>
          <div className="mx-auto mt-16 grid max-w-[56rem] grid-cols-2 gap-y-12 text-center sm:grid-cols-4">
            {[{ v: 960, s: "回", l: "毎週AIに聞く回数" }, { v: 4, s: "つ", l: "調べるAI" }, { v: 7, s: "項目", l: "点検する情報" }, { v: 9, s: "種類", l: "対応するサイト" }].map((x) => (
              <Reveal key={x.l}><p className="text-[2.6rem] font-bold leading-none sm:text-[3.4rem]"><Count to={x.v} /><span className="ml-1 text-[1.2rem] font-semibold">{x.s}</span></p><p className="mt-3 text-[0.88rem] text-[#6e6e73]">{x.l}</p></Reveal>
            ))}
          </div>
        </section>

        {/* しくみ */}
        <section id="how" className="scroll-mt-12 bg-[#f5f5f7] px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><span className="inline-block">測る。直す。</span><span className="inline-block">売上で確かめる。</span></h2></Reveal>
          <div className="mx-auto mt-20 max-w-[62rem] space-y-28 sm:space-y-40">
            {STEPS.map((s, i) => (
              <div key={s.n} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <Reveal className={i % 2 ? "lg:order-2" : ""}>
                  <p className="text-[1rem] font-semibold text-[#00a37a]">{s.n}</p>
                  <h3 className="lp-h mt-2 text-[1.8rem] sm:text-[2.4rem]"><J>{s.h}</J></h3>
                  <p className="mt-5 text-[1.02rem] leading-[1.95] text-[#6e6e73]"><J>{s.d}</J></p>
                </Reveal>
                <Reveal className={i % 2 ? "lg:order-1" : ""} delay={150}><Shot src={s.img[0]} alt={`「${s.n}」の画面`} w={s.img[1]} h={s.img[2]} /></Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* 書き直す前と後 */}
        <section className="px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]">書き直すと、こう変わる。</h2><div className="mt-6 flex items-center justify-center gap-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/sakuapp/works/tsurete/img/products/lotion.webp" alt="" width={56} height={56} className="h-14 w-14 rounded-2xl object-cover" /><p className="text-left text-[0.88rem] leading-[1.6] text-[#6e6e73]">見本：SORAE 化粧水<br />（架空のブランド・模擬の結果）</p></div></Reveal>
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
              <img src={`${IMG}/owner.webp`} alt="自宅の作業机でネットショップを運営している人" width={1376} height={768} loading="lazy" className="block h-auto w-full rounded-[28px] object-cover sm:rounded-[36px]" />
            </Reveal>
            <Reveal delay={150}>
              <h2 className="lp-h text-[2rem] sm:text-[2.6rem] lg:text-[2.3rem]"><span className="inline-block">小さなネットショップの、</span><span className="inline-block">AI担当に。</span></h2>
              <p className="mt-5 text-[1.02rem] leading-[1.95] text-[#6e6e73]"><J>大きな会社のように、AI対策の担当者は置けない。TSURETEが毎週はかって、やることだけを届けます。</J></p>
              <p className="mt-8 text-[0.85rem] font-semibold text-[#1d1d1f]">比べて選ばれる商品なら、ジャンルは問いません。</p>
              <p className="mt-3 flex flex-wrap gap-2">{["スキンケア", "食品・お菓子", "雑貨・インテリア", "アパレル", "ハンドメイド", "ベビー用品", "ペット用品"].map((t) => <span key={t} className="rounded-full bg-[#f5f5f7] px-3.5 py-1.5 text-[0.85rem]">{t}</span>)}</p>
            </Reveal>
          </div>
        </section>

        {/* AIに自分で聞くのと何が違う */}
        <section className="bg-[#f5f5f7] px-5 py-24 sm:py-36">
          <Reveal className="text-center"><h2 className="lp-h text-[2rem] sm:text-[3.4rem]"><span className="inline-block">AIに自分で聞くのと、</span><span className="inline-block">何が違う？</span></h2></Reveal>
          <div className="mx-auto mt-16 grid max-w-[52rem] gap-4 md:grid-cols-2">
            <Reveal><div className="h-full rounded-[28px] bg-white p-8 sm:p-10"><p className="text-[1rem] font-semibold text-[#6e6e73]">AIに自分で聞く</p><ul className="mt-6 space-y-4 text-[0.98rem] text-[#6e6e73]">{["1回聞いた答えだけ（答えは毎回変わる）", "自分の商品だけを見る", "1商品ずつコピペ", "効いたか分からない"].map((t) => <li key={t} className="flex gap-3"><X size={18} className="mt-1 shrink-0 opacity-50" /><span className="min-w-0"><J>{t}</J></span></li>)}</ul></div></Reveal>
            <Reveal delay={150}><div className="h-full rounded-[28px] bg-[#1d1d1f] p-8 text-white sm:p-10"><p className="text-[1rem] font-semibold text-[#2fd9a6]">TSURETE</p><ul className="mt-6 space-y-4 text-[0.98rem]">{["4つのAIに、毎週何百回も聞いて記録", "よくすすめられている店と比べて、差を出す", "全商品まとめて、サイトに合わせて届ける", "AI経由の売上で、効果を確かめる"].map((t) => <li key={t} className="flex gap-3"><Check size={18} className="mt-1 shrink-0 text-[#2fd9a6]" /><span className="min-w-0"><J>{t}</J></span></li>)}</ul></div></Reveal>
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
