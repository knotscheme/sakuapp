"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, Check, Copy, FileSpreadsheet, Plug, Rss, Search, User, X } from "lucide-react";
import { Logo } from "@/components/Shell";
import J from "@/components/J";
import { SAMPLE_URL } from "@/lib/check";
import { PLATFORMS, type Method } from "@/lib/platforms";

const IMG = "/sakuapp/works/tsurete/img/lp";

// 画面に入ったら、ふわっと出す
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition duration-700 ease-out ${on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${className}`}>{children}</div>;
}

// ヒーロー：AIの答えが「直す前 → 直した後」で入れかわる
const BEFORE = [{ b: "しずく舎", i: "やさしい化粧水", w: "敏感肌向けと明記" }, { b: "Lunae", i: "バリアローション", w: "皮膚科医と共同開発" }, { b: "NORMA BASIC", i: "化粧水", w: "口コミが多い" }];
const AFTER = [{ b: "SORAE", i: "化粧水 しっとり", w: "無香料・アルコールフリーで敏感肌向けと明記", me: true }, { b: "しずく舎", i: "やさしい化粧水", w: "敏感肌向けと明記" }, { b: "Lunae", i: "バリアローション", w: "皮膚科医と共同開発" }];
function HeroPhone() {
  const [after, setAfter] = useState(false);
  useEffect(() => { const id = setInterval(() => setAfter((a) => !a), 3600); return () => clearInterval(id); }, []);
  const list = after ? AFTER : BEFORE;
  return (
    <div className="relative mx-auto w-full max-w-[20rem]">
      <div className="rounded-[2.6rem] bg-[#0d1830] p-2.5 shadow-[0_40px_80px_-30px_rgba(16,217,160,.35)] ring-1 ring-white/10">
        <div className="overflow-hidden rounded-[2.1rem] bg-[#070d1c]">
          <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3.5 text-[0.75rem] text-sub"><Bot size={14} className="text-ai" />AIアシスタント</div>
          <div className="space-y-3 p-4">
            <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-white/10 px-3.5 py-2 text-[0.82rem] leading-[1.7]">敏感肌でも使える、3,000円台の化粧水は？</p>
            <p className="text-[0.78rem] text-sub">おすすめを3つ選びました。</p>
            <ol key={String(after)} className="fade-in space-y-2">
              {list.map((x, i) => (
                <li key={x.b} className={`flex gap-2.5 rounded-xl p-2.5 ${"me" in x ? "bg-ai/15 ring-1 ring-ai" : "bg-white/[.04]"}`}>
                  <span className={`num grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.65rem] ${"me" in x ? "bg-ai text-[#03140f]" : "bg-white/10"}`}>{i + 1}</span>
                  <span className="min-w-0"><b className={`block text-[0.8rem] ${"me" in x ? "text-lime" : ""}`}>{x.b}　{x.i}</b><span className="block text-[0.68rem] leading-[1.6] text-sub">{x.w}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-3 sm:contents">
      <div className={`rounded-2xl px-3.5 py-2.5 shadow-xl ring-1 transition sm:absolute sm:-left-16 sm:top-24 ${after ? "bg-ai text-[#03140f] ring-ai" : "bg-panel text-ink ring-white/10"}`}>
        <p className="text-[0.62rem] font-bold opacity-70">{after ? "TSURETEで直した後" : "直す前"}</p>
        <p className="num text-[1.3rem] font-bold leading-tight">{after ? "1位" : "圏外"}</p>
      </div>
      <div className="rounded-2xl bg-panel px-3.5 py-2.5 shadow-xl ring-1 ring-white/10 sm:absolute sm:-right-14 sm:bottom-10">
        <p className="text-[0.62rem] text-sub">AIにすすめられた割合</p>
        <p className="num text-[1.15rem] font-bold">10% <span className="text-sub">→</span> <span className="text-ai">70%</span></p>
      </div>
      </div>
    </div>
  );
}

function Frame({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-panel shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] ring-1 ring-white/10">
      <div className="flex gap-1.5 border-b border-white/5 px-4 py-2.5" aria-hidden><i className="h-2 w-2 rounded-full bg-white/15" /><i className="h-2 w-2 rounded-full bg-white/15" /><i className="h-2 w-2 rounded-full bg-white/15" /></div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/${src}`} alt={alt} width={w} height={h} loading="lazy" className="block h-auto w-full" />
    </div>
  );
}

const STEPS = [
  { n: "01", t: "測る", d: "お客様が聞きそうな質問を、ChatGPTなど4つのAIに毎週何百回も聞いて、すすめられた回数と順位を記録します。", pts: ["AIの売り場での順位", "よくすすめられている店との差", "質問ごとの結果"], img: ["rank.webp", 1000, 644], img2: ["gap.webp", 1000, 691] },
  { n: "02", t: "直す", d: "見つかった差を、AIが商品ページの書き直し案にします。押すだけで、お店のサイトに合った方法で届けます。", pts: ["商品説明・成分・容量・よくある質問", "全商品まとめて", "サイトに合わせて自動・CSV・コピー"], img: ["naosu.webp", 1000, 925] },
  { n: "03", t: "売上で確かめる", d: "AIにすすめられて来たお客様と、その売上を数えます。直した効果を、お金で確かめられます。", pts: ["AI経由の売上・注文", "週ごとの変化", "どのAIから来たか"], img: ["sales.webp", 1000, 468] },
] as const;

const WAYS: { m: Method | "feed"; icon: typeof Plug; t: string; d: string }[] = [
  { m: "api", icon: Plug, t: "自動で書きかえ", d: "押すだけで商品ページが書きかわる" },
  { m: "csv", icon: FileSpreadsheet, t: "CSVで一括", d: "サイトの取りこみ用CSVをお渡し" },
  { m: "copy", icon: Copy, t: "コピーして貼る", d: "どんなサイトでも" },
  { m: "feed", icon: Rss, t: "商品フィード", d: "サイトの外から、AIに商品を届ける" },
];

export default function Page() {
  const router = useRouter();
  const [url, setUrl] = useState(SAMPLE_URL);
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center px-5 sm:px-8"><Logo href="/lp/" /><Link href="/" className="ml-auto text-[0.86rem] font-bold text-ai">デモを使う</Link></div>
      </header>

      <main className="flex-1">
        {/* ヒーロー */}
        <section className="mx-auto grid max-w-[1120px] items-center gap-16 px-5 pb-24 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-32">
          <div className="text-center lg:text-left">
            <p className="text-[0.85rem] font-bold tracking-[.12em] text-ai">ネットショップのための AI集客ツール</p>
            <h1 className="mt-6 text-[2.1rem] font-bold leading-[1.5] tracking-[.05em] sm:text-[3rem]"><span className="inline-block">AIの売り場で、</span><span className="inline-block">あなたの商品は</span><span className="inline-block">何番目？</span></h1>
            <p className="mx-auto mt-6 max-w-[30em] text-[1rem] leading-[2.05] text-sub lg:mx-0"><J>ChatGPTに「おすすめは？」と聞いて買う時代。TSURETEは、AIにすすめられる回数を毎週はかり、全商品の商品ページをまとめて直します。</J></p>
            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/" className="btn btn-ai px-8">デモを使ってみる<ArrowRight size={18} /></Link>
              <a href="#try" className="btn btn-line px-6">無料で診断</a>
            </div>
          </div>
          <HeroPhone />
        </section>

        {/* 検索とAIの違い */}
        <section className="border-y hair bg-white/[.015] py-20 sm:py-32">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
            <Reveal><h2 className="text-center text-[1.5rem] font-bold leading-[1.6] tracking-[.05em] sm:text-[2rem]"><span className="inline-block">検索は10件並ぶ。</span><span className="inline-block text-ai">AIは3つしか選ばない。</span></h2></Reveal>
            <div className="mx-auto mt-16 grid max-w-[52rem] gap-6 md:grid-cols-2 md:gap-10">
              <Reveal className="card p-6 sm:p-8">
                <p className="flex items-center gap-2 text-[0.82rem] text-sub"><Search size={15} />これまで：検索</p>
                <ul className="mt-6 space-y-3" aria-hidden>{Array.from({ length: 7 }, (_, i) => <li key={i} className="flex items-center gap-3"><span className="num w-4 text-[0.7rem] text-sub/60">{i + 1}</span><span className="h-2.5 rounded-full bg-white/[.08]" style={{ width: `${88 - (i % 3) * 14}%` }} /></li>)}</ul>
                <p className="mt-6 text-[0.86rem] leading-[1.9] text-sub"><J>2ページ目、3ページ目まで見てもらえる。</J></p>
              </Reveal>
              <Reveal className="card p-6 ring-1 ring-ai/40 sm:p-8" delay={150}>
                <p className="flex items-center gap-2 text-[0.82rem] text-ai"><Bot size={15} />これから：AIに聞く</p>
                <ul className="mt-6 space-y-3">{["しずく舎", "Lunae", "NORMA BASIC"].map((b, i) => <li key={b} className="flex items-center gap-3 rounded-xl bg-white/[.04] px-3 py-2.5"><span className="num grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[0.65rem]">{i + 1}</span><b className="text-[0.88rem]">{b}</b></li>)}</ul>
                <p className="mt-6 text-[0.86rem] leading-[1.9]"><span className="inline-block">3つに入らなければ、</span><b className="inline-block text-warn">ないのと同じ。</b></p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 画面 */}
        <section className="mx-auto max-w-[1120px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal><h2 className="text-center text-[1.5rem] font-bold tracking-[.05em] sm:text-[2rem]">ひと目で、今週の状況がわかる</h2><p className="mt-4 text-center text-[0.92rem] text-sub"><J>開いたら、数字とやることだけ。</J></p></Reveal>
          <Reveal className="relative mx-auto mt-16 max-w-[58rem] pb-10 sm:pb-0" delay={100}>
            <Frame src="dash.webp" alt="TSURETEのホーム画面" w={1400} h={972} />
            <div className="absolute -bottom-2 right-2 w-[34%] max-w-[12rem] overflow-hidden rounded-[1.6rem] bg-[#0d1830] p-1.5 shadow-2xl ring-1 ring-white/10 sm:-bottom-10 sm:-right-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/dash-sp.webp`} alt="スマホで見たホーム画面" width={585} height={996} loading="lazy" className="block h-auto w-full rounded-[1.25rem]" />
            </div>
          </Reveal>
        </section>

        {/* 3つのステップ */}
        <section className="mx-auto max-w-[1120px] space-y-24 px-5 py-16 sm:space-y-40 sm:px-8 sm:py-24">
          {STEPS.map((s, i) => (
            <div key={s.n} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal className={i % 2 ? "lg:order-2" : ""}>
                <p className="num text-[0.9rem] text-ai">{s.n}</p>
                <h3 className="mt-2 text-[1.7rem] font-bold tracking-[.05em] sm:text-[2.1rem]">{s.t}</h3>
                <p className="mt-5 max-w-[28em] text-[0.98rem] leading-[2.05] text-sub"><J>{s.d}</J></p>
                <ul className="mt-7 space-y-2.5">{s.pts.map((t) => <li key={t} className="flex items-center gap-3 text-[0.92rem]"><span className="grid h-5 w-5 place-items-center rounded-full bg-ai/15 text-ai"><Check size={12} /></span><span className="min-w-0"><J>{t}</J></span></li>)}</ul>
              </Reveal>
              <Reveal className={`relative ${i % 2 ? "lg:order-1" : ""}`} delay={150}>
                <Frame src={s.img[0]} alt={`「${s.t}」の画面`} w={s.img[1]} h={s.img[2]} />
                {"img2" in s && <div className="relative -mt-14 ml-[14%] hidden w-[86%] sm:block"><Frame src={s.img2[0]} alt="よくすすめられている店との差" w={s.img2[1]} h={s.img2[2]} /></div>}
              </Reveal>
            </div>
          ))}
        </section>

        {/* 書き直す前と後 */}
        <section className="border-y hair bg-white/[.015] py-20 sm:py-32">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
            <Reveal><h2 className="text-center text-[1.5rem] font-bold tracking-[.05em] sm:text-[2rem]">書き直すと、こう変わる</h2><p className="mt-4 text-center text-[0.85rem] text-sub"><J>見本：架空のブランド SORAE（模擬の結果です）</J></p></Reveal>
            <div className="mx-auto mt-16 grid max-w-[60rem] items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
              <Reveal className="card p-7 sm:p-9">
                <p className="flex items-center gap-2 text-[0.8rem] text-sub"><X size={15} />いまの商品説明</p>
                <p className="mt-5 text-[0.95rem] leading-[2.05] text-sub"><J>空のように澄んだ肌へ。毎日のうるおいに寄りそう、SORAEの化粧水。</J></p>
                <div className="mt-8"><p className="flex justify-between text-[0.78rem] text-sub"><span>AIにすすめられた割合</span><b className="num text-warn">10%</b></p><div className="mt-2 h-2 rounded-full bg-white/[.06]"><div className="h-full w-[10%] rounded-full bg-warn" /></div></div>
              </Reveal>
              <div className="grid place-items-center text-ai" aria-hidden><ArrowRight size={28} className="rotate-90 md:rotate-0" /></div>
              <Reveal className="card p-7 ring-1 ring-ai/50 sm:p-9" delay={150}>
                <p className="flex items-center gap-2 text-[0.8rem] text-ai"><Check size={15} />AIが書き直した後</p>
                <p className="mt-5 text-[0.95rem] leading-[2.05]"><J>敏感肌・乾燥肌の方のために作った化粧水です。香料・アルコールは入っていません。朝晩使って約2か月、1日あたり約55円。</J></p>
                <div className="mt-8"><p className="flex justify-between text-[0.78rem] text-sub"><span>AIにすすめられた割合</span><b className="num text-ai">70%</b></p><div className="mt-2 h-2 rounded-full bg-white/[.06]"><div className="h-full w-[70%] rounded-full bg-ai" /></div></div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* どのサイトでも */}
        <section className="mx-auto max-w-[1120px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal><h2 className="text-center text-[1.5rem] font-bold tracking-[.05em] sm:text-[2rem]">どのサイトでも使えます</h2><p className="mx-auto mt-4 max-w-[34em] text-center text-[0.92rem] leading-[2] text-sub"><J>測るのは、サイトに何も入れずにできます。直すときは、サイトに合わせて届け方を選びます。</J></p></Reveal>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WAYS.map(({ m, icon: Icon, t, d }, i) => (
              <Reveal key={t} className="card flex h-full flex-col p-6" delay={i * 80}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ai/10 text-ai"><Icon size={21} /></span>
                <b className="mt-5 text-[1.02rem]">{t}</b>
                <p className="mt-1 text-[0.82rem] leading-[1.8] text-sub"><J>{d}</J></p>
                <p className="mt-5 flex flex-wrap gap-1.5">{(m === "feed" ? [{ id: "all", name: "すべてのサイト" }] : PLATFORMS.filter((p) => p.method === m)).map((p) => <span key={p.id} className="rounded-full bg-white/[.05] px-2.5 py-1 text-[0.72rem]">{p.name}</span>)}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* AIに自分で聞くのと何が違う */}
        <section className="border-y hair bg-white/[.015] py-20 sm:py-32">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
            <Reveal><h2 className="text-center text-[1.5rem] font-bold tracking-[.05em] sm:text-[2rem]">AIに自分で聞くのと、何が違う？</h2></Reveal>
            <div className="mx-auto mt-16 grid max-w-[52rem] gap-6 md:grid-cols-2">
              <Reveal className="card p-7 sm:p-9">
                <p className="flex items-center gap-2 text-[0.88rem] font-bold text-sub"><User size={16} />AIに自分で聞く</p>
                <ul className="mt-6 space-y-4 text-[0.9rem] text-sub">{["1回聞いた答えだけ（答えは毎回変わる）", "自分の商品だけを見る", "1商品ずつコピペ", "効いたか分からない"].map((t) => <li key={t} className="flex gap-3"><X size={17} className="mt-1 shrink-0 text-sub/60" /><span className="min-w-0"><J>{t}</J></span></li>)}</ul>
              </Reveal>
              <Reveal className="card p-7 ring-1 ring-ai/50 sm:p-9" delay={150}>
                <p className="flex items-center gap-2 text-[0.88rem] font-bold text-ai"><span className="h-2 w-2 rounded-full bg-ai" />TSURETE</p>
                <ul className="mt-6 space-y-4 text-[0.9rem]">{["4つのAIに、毎週何百回も聞いて記録", "よくすすめられている店と比べて、差を出す", "全商品まとめて、サイトに合わせて届ける", "AI経由の売上で、効果を確かめる"].map((t) => <li key={t} className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-ai" /><span className="min-w-0"><J>{t}</J></span></li>)}</ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 無料診断 */}
        <section id="try" className="mx-auto max-w-[40rem] scroll-mt-20 px-5 py-28 text-center sm:px-8 sm:py-36">
          <Reveal>
            <h2 className="text-[1.5rem] font-bold tracking-[.05em] sm:text-[2rem]">まずは1商品、無料で診断</h2>
            <p className="mt-4 text-[0.92rem] leading-[2] text-sub"><J>商品ページのURLを入れると、AIに選ばれるために足りないところと、書き直し案をお出しします。</J></p>
            <form onSubmit={(e) => { e.preventDefault(); router.push(`/shindan/?url=${encodeURIComponent(url)}`); }} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="u">商品ページのURL</label>
              <input id="u" value={url} onChange={(e) => setUrl(e.target.value)} className="field num" inputMode="url" />
              <button type="submit" className="btn btn-ai shrink-0 px-8">診断する</button>
            </form>
            <p className="mt-6 flex flex-col items-center gap-3 text-[0.86rem] sm:flex-row sm:justify-center sm:gap-6"><Link href="/shindan/?csv=1" className="text-ai underline underline-offset-4">商品が多いときは、CSVでまとめて診断</Link><Link href="/" className="text-ai underline underline-offset-4">デモを使ってみる</Link></p>
          </Reveal>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-[1120px] px-5 sm:px-8"><div className="flex flex-col gap-3 border-t hair py-10 text-[0.78rem] text-sub sm:flex-row sm:items-center sm:justify-between"><Logo href="/lp/" /><span><J>TSURETE はデモです。数字は架空のブランドでの模擬の結果です。AIにすすめられることは保証できません。</J></span></div></footer>
    </div>
  );
}
