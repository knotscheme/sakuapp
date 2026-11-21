"use client";

// TSURETE LP（法人向けの、整理された版）。今のLP（/lp/）は残し、こちらは別のURLで公開する
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, Check, ChevronRight, FileSpreadsheet, GraduationCap, KeyRound, LineChart as LineIcon, Mail, Minus, PenLine, Plus, RotateCcw, Search, ShieldCheck, Stethoscope, Swords, TrendingUp } from "lucide-react";
import J from "@/components/J";
import { Laptop, Phone } from "@/components/Devices";

const IMG = "/sakuapp/works/tsurete/img/lp";

// ---------- 小さな道具 ----------
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "0px 0px -6% 0px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}
function In({ children, className = "", d = 0 }: { children: React.ReactNode; className?: string; d?: number }) {
  const [ref, on] = useInView<HTMLDivElement>();
  return <div ref={ref} style={{ transitionDelay: `${d}ms` }} className={`transition duration-700 ease-out ${on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${className}`}>{children}</div>;
}
function Count({ to, dec = 0 }: { to: number; dec?: number }) {
  const [ref, on] = useInView<HTMLSpanElement>();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return; let raf = 0; const t0 = performance.now();
    const f = (t: number) => { const k = Math.min(1, (t - t0) / 1200); setV(to * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf);
  }, [on, to]);
  return <span ref={ref}>{v.toLocaleString("ja-JP", { minimumFractionDigits: dec, maximumFractionDigits: dec })}</span>;
}
function Head({ en, t, lead, center = true }: { en: string; t: React.ReactNode; lead?: string; center?: boolean }) {
  return (
    <In className={center ? "text-center" : ""}>
      <p className="lp2-eye">{en}</p>
      <h2 className="mt-3 text-[1.75rem] font-bold leading-[1.4] tracking-[.01em] text-[#0f1a17] sm:text-[2.4rem]">{t}</h2>
      {lead && <p className={`mt-4 text-[0.98rem] leading-[1.9] text-[#55605c] ${center ? "mx-auto max-w-[36em]" : "max-w-[34em]"}`}><J>{lead}</J></p>}
    </In>
  );
}
const Btn = ({ href, children, ghost = false, dark = false }: { href: string; children: React.ReactNode; ghost?: boolean; dark?: boolean }) => {
  const cls = ghost ? (dark ? "border border-white/30 text-white hover:bg-white/10" : "border border-[#0f1a17]/20 bg-white text-[#0f1a17] hover:border-[#0f1a17]/50") : "bg-[#00a37a] text-white hover:bg-[#008f6b]";
  const c = `inline-flex h-12 items-center justify-center gap-2 rounded-[6px] px-7 text-[0.92rem] font-semibold transition ${cls}`;
  return href.startsWith("#") ? <a href={href} className={c}>{children}</a> : <Link href={href} className={c}>{children}</Link>;
};
const Note = ({ dark = false }: { dark?: boolean }) => (
  <p className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.78rem] ${dark ? "text-white/60" : "text-[#6b7571]"}`}>{["カードの登録不要", "14日間無料", "いつでも解約"].map((t) => <span key={t} className="flex items-center gap-1"><Check size={13} className={dark ? "text-[#2fd9a6]" : "text-[#00a37a]"} />{t}</span>)}</p>
);

// ---------- データ ----------
const AIS = ["ChatGPT", "Gemini", "Claude", "Perplexity"];
const SITES = ["Shopify", "楽天市場", "Amazon", "Yahoo!ショッピング", "BASE", "STORES", "ほか"];
const STATS = [
  { v: 24.6, dec: 1, s: "%", l: "日本で、買い物に生成AIを使う人", src: "博報堂の調査（2026年）", href: "https://www.itmedia.co.jp/aiplus/article/2606/02/2000000046/" },
  { v: 41.5, dec: 1, s: "%", l: "アメリカで、商品を調べるのにAIを使った人（直近3か月）", src: "Product.aiの調査（2026年10月）", href: "https://product.ai/research/trust-in-ai-commerce-report/" },
  { v: 1.5, dec: 1, s: "倍", l: "AIから来たお客様の、買う割合（AI以外から来た人とくらべて）", src: "Adobeの調査（アメリカ、2026年5月）", href: "https://business.adobe.com/resources/sdk/.q3-ai-traffic-trends-report/q3-2026-ai-sourced-traffic-insights.pdf" },
];
const FEATS = [
  { n: "01", tag: "全商品の点検", icon: Stethoscope, t: "AIに選ばれる準備ができているか、全商品を毎週点検", d: "だれ向けか・成分・比較表・よくある質問・構造化データなど8つの項目で、全商品のページを自動で点検。直すべき商品と項目が、点数でひと目で分かります。", pts: ["8項目 × 全商品を毎週自動で", "直すと上がる点数の大きい順に並べる", "AIを使わない点検なので、何度でも"], img: "rank.webp", w: 1000, h: 738 },
  { n: "02", tag: "書き直し案", icon: PenLine, t: "足りないところに、そのまま使える文章とコードを", d: "足りない項目ごとに、商品説明の書き直し案・よくある質問・構造化データのコードを用意。ページにない事実は作らず、【】で空けてお店に確かめます。", pts: ["Shopifyは押すだけで反映", "楽天・Amazon・Yahoo!は取りこみ用CSV", "元の文章を残すので、いつでも戻せる"], img: "naosu.webp", w: 1000, h: 965 },
  { n: "03", tag: "AIの答えを測る", icon: BarChart3, t: "4つのAIに、お客様の質問を毎週聞いて数える", d: "すすめられた割合・1位の割合・自分のサイトが根拠になった割合・平均の順位。前の期間とくらべて、上がったか下がったかまで分かります。", pts: ["ChatGPT・Gemini・Claude・Perplexity", "ほかのブランドとの比較", "AIが裏で調べたキーワードへの答えの有無"], img: "gap.webp", w: 1000, h: 729 },
  { n: "04", tag: "売上で確かめる", icon: TrendingUp, t: "効いたかどうかを、AIから来た売上で", d: "計測タグを貼るだけで、ChatGPTやGeminiから来たお客様と、その売上を数えます。名前やメールなどの個人の情報は集めません。", pts: ["AIごとの来店と注文", "直す前とあとの比較", "タグを貼れないサイトは注文CSVで"], img: "sales.webp", w: 1000, h: 572 },
];
const ROWS: [string, number[]][] = [
  ["全商品のページを、毎週自動で点検", [2, 0, 1, 0]],
  ["直す文章と、構造化データのコード", [2, 1, 0, 1]],
  ["ショップへの反映（Shopify・楽天CSV）", [2, 0, 0, 0]],
  ["いくつものAIの答えを数える", [2, 2, 1, 0]],
  ["ほかのブランドとの比較", [2, 2, 1, 0]],
  ["AIから来た売上を確かめる", [2, 1, 1, 0]],
  ["月3,000円ほどから始められる", [2, 0, 1, 2]],
];
const COLS = ["TSURETE", "AI計測ツール", "SEOツール", "AIに自分で聞く"];
const PLANS = [
  { n: "フリー", p: "0", u: "円", d: "まず1商品で試す", f: ["1商品の診断と書き直し案（月1回）"] },
  { n: "スタンダード", p: "2,980", u: "円／月", d: "自分のお店を整える", f: ["50商品を毎週点検", "書き直し案 月50件", "反映・売上の計測", "ジャンル共通の測定（月1回）"], hi: true },
  { n: "プロ", p: "9,800", u: "円／月", d: "AIの答えまで深く見る", f: ["500商品（100商品ごと 980円で追加）", "書き直し案 月200件", "自分の質問15個を4つのAIで毎週", "ブランド比較・今すぐ測る（月2回）"] },
  { n: "代理店", p: "13,780", u: "円／月〜", d: "お客様のお店をまとめて見る", f: ["基本料 9,800円＋1店舗 3,980円", "全店の一覧・ロゴ入りレポート", "お店の人の招待・権限"] },
];
const FAQ = [
  { q: "必ずAIにすすめられるようになりますか？", a: "保証はできません。AIの答えは、AIを作っている会社のしくみで決まります。TSURETEは、AIが読み取りやすいページになるよう材料をそろえ、効いたかどうかを実際の来店と売上で確かめます。" },
  { q: "AIの答えを測るツールとは、何が違いますか？", a: "測るツールは、AIにどれだけ名前が出ているかを教えてくれます。TSURETEは測るだけでなく、足りないところを商品ページごとに見つけて、直す文章とコードを出し、ショップに反映し、AIから来た売上まで確かめます。" },
  { q: "AIの利用料はかかりますか？", a: "お店が払う必要はありません。点検はAIを使わずに行い、書き直し案と測定の費用は料金に含みます。" },
  { q: "サイトの文章が、勝手に変わることはありますか？", a: "ありません。変わるのは、お店の人が「この案を使う」を押したものだけです。元の文章は残すので、いつでも戻せます。" },
  { q: "無料トライアルのあと、自動で課金されますか？", a: "されません。14日間が終わると、続けるかどうかをお選びいただけます。カードの登録もいりません。" },
];

// ---------- ページ ----------
export default function Page() {
  useEffect(() => { const b = document.body.style.background; document.body.style.background = "#fff"; document.documentElement.style.colorScheme = "light"; return () => { document.body.style.background = b; document.documentElement.style.colorScheme = ""; }; }, []);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(scrollY > 520); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  const W = "mx-auto w-full max-w-[1160px] px-5 sm:px-8";
  return (
    <div className="lp2 min-h-screen overflow-x-clip bg-white text-[#0f1a17]">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 border-b border-[#0f1a17]/[.07] bg-white/92 backdrop-blur-xl">
        <div className={`${W} flex h-16 items-center gap-8`}>
          <Link href="/lp2/" className="flex shrink-0 items-center gap-2.5"><span className="grid h-7 w-7 place-items-center rounded-[6px] bg-[#0f1a17]"><i className="h-2 w-2 rounded-full bg-[#2fd9a6]" /></span><b className="text-[0.95rem] tracking-[.16em]">TSURETE</b><span className="hidden rounded-[3px] border border-[#0f1a17]/20 px-1.5 py-px text-[0.6rem] font-bold tracking-[.08em] text-[#55605c] sm:inline">AI検索対策</span></Link>
          <nav className="hidden gap-7 text-[0.84rem] text-[#3d4743] lg:flex">{[["機能", "#features"], ["料金", "#price"], ["比較", "#compare"], ["導入の流れ", "#flow"], ["サポート", "#support"], ["よくある質問", "#faq"]].map(([t, h]) => <a key={h} href={h} className="hover:text-[#00a37a]">{t}</a>)}<Link href="/manabu/" className="hover:text-[#00a37a]">学ぶ</Link></nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="hidden h-9 items-center rounded-[6px] border border-[#0f1a17]/20 px-4 text-[0.8rem] font-semibold sm:inline-flex">デモを見る</Link>
            <a href="#start" className="inline-flex h-9 items-center rounded-[6px] bg-[#00a37a] px-4 text-[0.8rem] font-semibold text-white hover:bg-[#008f6b]">無料で試す</a>
          </div>
        </div>
      </header>

      <main>
        {/* ヒーロー */}
        <section className="relative overflow-hidden border-b border-[#0f1a17]/[.06] bg-[linear-gradient(180deg,#f3f8f6_0%,#ffffff_70%)]">
          <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(15,26,23,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,26,23,.045)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(180deg,#000,transparent_85%)]" aria-hidden />
          <div className={`${W} relative grid grid-cols-1 items-center gap-12 pb-16 pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:pb-24 lg:pt-20`}>
            <In>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#00a37a]/30 bg-white px-3 py-1 text-[0.76rem] font-semibold text-[#00805f]"><i className="h-1.5 w-1.5 rounded-full bg-[#00a37a]" />ネットショップ向け AI検索対策ツール</p>
              <h1 className="mt-6 text-[1.7rem] font-bold leading-[1.35] tracking-[.01em] min-[400px]:text-[1.95rem] sm:text-[2.8rem] lg:text-[2.45rem] xl:text-[2.9rem]"><span className="inline-block">AIの答えに、</span><br /><span className="inline-block whitespace-nowrap text-[#00a37a]">選ばれる商品ページへ。</span></h1>
              <p className="mt-6 max-w-[32em] text-[1rem] leading-[1.95] text-[#3d4743]"><J>ChatGPTやGeminiに「おすすめは？」と聞かれたとき、あなたの商品が候補に入るように。全商品の点検から、書き直し、反映、AIから来た売上の確認まで、ひとつで。</J></p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Btn href="#start">14日間 無料で試す<ArrowRight size={17} /></Btn><Btn href="/" ghost>デモ画面を見る</Btn></div>
              <Note />
            </In>
            <In d={150} className="relative">
              <div className="pr-[12%]"><Laptop silver src={`${IMG}/dash-pc.webp?v=6`} alt="TSURETEの管理画面（パソコン）" /></div>
              <div className="absolute -bottom-2 right-0 w-[24%]"><Phone src={`${IMG}/dash-phone.webp?v=6`} alt="TSURETEの管理画面（スマホ）" /></div>
              <div className="absolute -left-2 top-[8%] hidden rounded-[10px] border border-[#0f1a17]/[.08] bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgba(15,26,23,.3)] sm:block"><p className="text-[0.68rem] text-[#6b7571]">AIにすすめられた割合</p><p className="mt-0.5 text-[1.3rem] font-bold">10% <span className="text-[#9aa39f]">→</span> <span className="text-[#00a37a]">70%</span></p><p className="text-[0.6rem] text-[#9aa39f]">架空のブランドでの模擬</p></div>
            </In>
          </div>
          <div className={`${W} relative pb-10`}>
            <div className="grid grid-cols-1 gap-4 rounded-[12px] border border-[#0f1a17]/[.07] bg-white px-5 py-4 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
              <p className="flex flex-wrap items-center gap-2 text-[0.8rem]"><span className="mr-1 font-semibold text-[#6b7571]">測るAI</span>{AIS.map((a) => <span key={a} className="rounded-[4px] bg-[#f3f6f5] px-2.5 py-1 font-semibold">{a}</span>)}</p>
              <p className="flex flex-wrap items-center gap-2 text-[0.8rem]"><span className="mr-1 font-semibold text-[#6b7571]">対応サイト</span>{SITES.map((a) => <span key={a} className="rounded-[4px] bg-[#f3f6f5] px-2.5 py-1 font-semibold">{a}</span>)}</p>
            </div>
          </div>
        </section>

        {/* 市場 */}
        <section className="py-20 sm:py-28">
          <div className={W}>
            <Head en="Market" t={<><span className="inline-block">お客様は、もう</span><span className="inline-block">「AIに聞いて」買っている。</span></>} lead="検索して何ページも見くらべるより、AIに「おすすめは？」と聞くほうが早い。AIの答えは、ふつう3つほど。そこに入らない商品は、候補から外れてしまいます。" />
            <div className="mt-14 grid grid-cols-1 divide-y divide-[#0f1a17]/[.08] rounded-[12px] border border-[#0f1a17]/[.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {STATS.map((x, i) => (
                <In key={x.l} d={i * 100} className="px-7 py-8">
                  <p className="text-[2.6rem] font-bold leading-none tracking-[-.02em] text-[#00a37a]"><Count to={x.v} dec={x.dec} /><span className="ml-1 text-[1.1rem]">{x.s}</span></p>
                  <p className="mt-3 text-[0.92rem] leading-[1.7]"><J>{x.l}</J></p>
                  <a href={x.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[0.74rem] text-[#6b7571] underline decoration-[#0f1a17]/20 underline-offset-4">{x.src}</a>
                </In>
              ))}
            </div>
          </div>
        </section>

        {/* 3ステップ */}
        <section className="border-y border-[#0f1a17]/[.06] bg-[#f6f8f7] py-20 sm:py-28">
          <div className={W}>
            <Head en="How it works" t={<><span className="inline-block">測って終わりにしない。</span><span className="inline-block">売上まで、ひとつで。</span></>} />
            <ol className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[{ i: Stethoscope, t: "点検する", d: "全商品のページを、AIに選ばれるための8項目で毎週点検。" }, { i: PenLine, t: "直す", d: "書き直し案とコードを用意。ショップへそのまま反映。" }, { i: LineIcon, t: "確かめる", d: "4つのAIの答えと、AIから来た売上で効果を確かめる。" }].map((x, k) => (
                <In key={x.t} d={k * 100} className="h-full"><li className="relative h-full rounded-[12px] border border-[#0f1a17]/[.07] bg-white p-7">
                  <p className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#e5f4ee] text-[#00805f]"><x.i size={21} /></span><span className="text-[0.8rem] font-bold tracking-[.14em] text-[#9aa39f]">STEP {k + 1}</span></p>
                  <b className="mt-5 block text-[1.2rem]">{x.t}</b><p className="mt-2 text-[0.92rem] leading-[1.85] text-[#55605c]"><J>{x.d}</J></p>
                  {k < 2 && <ChevronRight size={22} className="absolute -right-[17px] top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white text-[#9aa39f] ring-1 ring-[#0f1a17]/[.08] md:block" />}
                </li></In>
              ))}
            </ol>
          </div>
        </section>

        {/* 機能 */}
        <section id="features" className="scroll-mt-16 py-20 sm:py-28">
          <div className={W}>
            <Head en="Features" t={<><span className="inline-block">AI検索対策に必要なことを、</span><span className="inline-block">すべてTSURETEで。</span></>} />
            <div className="mt-16 space-y-20 sm:space-y-28">
              {FEATS.map((f, i) => (
                <div key={f.n} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <In className={i % 2 ? "lg:order-2" : ""}>
                    <p className="flex items-baseline gap-3"><span className="text-[2.4rem] font-bold leading-none text-[#00a37a]">{f.n}</span><span className="text-[0.85rem] font-semibold text-[#00805f]">{f.tag}</span></p>
                    <h3 className="mt-4 text-[1.45rem] font-bold leading-[1.5] sm:text-[1.75rem]"><J>{f.t}</J></h3>
                    <p className="mt-4 text-[0.96rem] leading-[1.95] text-[#3d4743]"><J>{f.d}</J></p>
                    <ul className="mt-6 space-y-2.5">{f.pts.map((p) => <li key={p} className="flex items-start gap-2.5 text-[0.92rem]"><Check size={17} className="mt-0.5 shrink-0 text-[#00a37a]" /><span className="min-w-0"><J>{p}</J></span></li>)}</ul>
                    <Link href="/" className="mt-7 inline-flex items-center gap-1 text-[0.88rem] font-semibold text-[#00805f] hover:underline">デモで見る<ChevronRight size={16} /></Link>
                  </In>
                  <In d={120} className={i % 2 ? "lg:order-1" : ""}>
                    <div className="rounded-[14px] border border-[#0f1a17]/[.07] bg-[#f6f8f7] p-3 sm:p-5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${IMG}/${f.img}?v=3`} alt={`「${f.tag}」の画面`} width={f.w} height={f.h} loading="lazy" className="block h-auto w-full rounded-[8px] border border-[#0f1a17]/[.06] bg-white" />
                    </div>
                  </In>
                </div>
              ))}
            </div>
            <In className="mt-20 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[{ i: Search, t: "AIが調べたキーワード" }, { i: Swords, t: "ブランドの比較" }, { i: FileSpreadsheet, t: "CSVの書き出し" }, { i: GraduationCap, t: "学べる講座" }].map((x) => <div key={x.t} className="flex items-center gap-3 rounded-[10px] border border-[#0f1a17]/[.07] px-4 py-3.5 text-[0.88rem] font-semibold"><x.i size={18} className="shrink-0 text-[#00a37a]" /><span className="min-w-0">{x.t}</span></div>)}
            </In>
          </div>
        </section>

        {/* 比較 */}
        <section id="compare" className="scroll-mt-16 border-y border-[#0f1a17]/[.06] bg-[#f6f8f7] py-20 sm:py-28">
          <div className={W}>
            <Head en="Comparison" t="ほかの方法との違い" lead="AIの答えを測るだけでも、文章を直すだけでもなく。測る・直す・反映・売上の確認を、ネットショップのためにひとつに。" />
            <In className="mt-12 overflow-x-auto rounded-[12px] border border-[#0f1a17]/[.08] bg-white">
              <table className="w-full min-w-[40rem] table-fixed text-[0.88rem]">
                <thead><tr className="border-b border-[#0f1a17]/[.08]"><th className="w-[36%] p-4 text-left text-[0.78rem] font-semibold text-[#6b7571]">比較項目</th>{COLS.map((c, i) => <th key={c} className={`px-2 py-4 text-center text-[0.82rem] font-bold ${i === 0 ? "bg-[#0f1a17] text-[#2fd9a6]" : ""}`}>{c}</th>)}</tr></thead>
                <tbody>{ROWS.map(([t, v]) => <tr key={t} className="border-t border-[#0f1a17]/[.06]"><td className="p-4 leading-[1.5]"><J>{t}</J></td>{v.map((x, i) => <td key={i} className={`py-4 ${i === 0 ? "bg-[#0f1a17]/[.03]" : ""}`}>{x === 2 ? <Check size={18} strokeWidth={2.4} className="mx-auto text-[#00a37a]" aria-label="できる" /> : x === 1 ? <span className="mx-auto block h-3 w-3 rounded-full border-[1.5px] border-[#9aa39f]" aria-label="一部できる" /> : <Minus size={15} className="mx-auto text-[#c9cfcc]" aria-label="できない" />}</td>)}</tr>)}</tbody>
              </table>
            </In>
            <p className="mt-3 text-center text-[0.74rem] text-[#6b7571]">◯ できる　○ 一部できる　− できない。一般的な特徴をもとにした比較で、特定の会社のサービスではありません。</p>
          </div>
        </section>

        {/* だれのため */}
        <section className="py-20 sm:py-28">
          <div className={W}>
            <Head en="For whom" t={<><span className="inline-block">1つのお店でも、</span><span className="inline-block">たくさんのお店でも。</span></>} />
            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
              {[{ img: "owner.webp?v=3", k: "自分のお店を運営する方", t: "ひとりでも、AI対策を続けられる。", d: "点検はぜんぶ自動。毎週届く「今週やること」を読んで、使う案を押すだけ。作業は週5分ほど。", p: "スタンダード・プロ" }, { img: "agency.webp?v=1", k: "制作会社・代理店・EC運用チーム", t: "お客様のお店を、まとめて見る。", d: "全店の点数と変化を1画面で。ロゴ入りのレポートを書き出して、そのまま報告に使えます。", p: "代理店プラン" }].map((x, i) => (
                <In key={x.k} d={i * 100} className="h-full"><div className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#0f1a17]/[.07]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${IMG}/${x.img}`} alt="" width={1376} height={768} loading="lazy" className="block aspect-[16/9] w-full object-cover" />
                  <div className="flex flex-1 flex-col p-7"><p className="text-[0.82rem] font-semibold text-[#00805f]">{x.k}</p><b className="mt-2 block text-[1.25rem] leading-[1.5]"><J>{x.t}</J></b><p className="mt-3 flex-1 text-[0.93rem] leading-[1.9] text-[#55605c]"><J>{x.d}</J></p><a href="#price" className="mt-6 inline-flex items-center gap-1 text-[0.88rem] font-semibold text-[#00805f] hover:underline">{x.p}<ChevronRight size={16} /></a></div>
                </div></In>
              ))}
            </div>
          </div>
        </section>

        {/* 料金 */}
        <section id="price" className="scroll-mt-16 border-y border-[#0f1a17]/[.06] bg-[#f6f8f7] py-20 sm:py-28">
          <div className={W}>
            <Head en="Pricing" t="料金プラン" lead="お店がAIの利用料を払う必要はありません。どのプランも14日間無料、カードの登録はいりません。" />
            <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {PLANS.map((x, i) => (
                <In key={x.n} d={i * 80} className="h-full"><div className={`flex h-full flex-col rounded-[12px] p-7 ${x.hi ? "bg-[#0f1a17] text-white" : "border border-[#0f1a17]/[.08] bg-white"}`}>
                  <p className="flex items-center justify-between"><b className="text-[1.05rem]">{x.n}</b>{x.hi && <span className="rounded-full bg-[#2fd9a6] px-2.5 py-0.5 text-[0.7rem] font-bold text-[#04211a]">おすすめ</span>}</p>
                  <p className={`mt-1 text-[0.82rem] ${x.hi ? "text-white/60" : "text-[#6b7571]"}`}>{x.d}</p>
                  <p className="mt-5"><b className="text-[2.3rem] leading-none tracking-[-.02em]">{x.p}</b><span className={`ml-1 text-[0.82rem] ${x.hi ? "text-white/60" : "text-[#6b7571]"}`}>{x.u}</span></p>
                  <ul className={`mt-6 flex-1 space-y-2.5 border-t pt-5 text-[0.88rem] ${x.hi ? "border-white/10" : "border-[#0f1a17]/[.07]"}`}>{x.f.map((t) => <li key={t} className="flex gap-2"><Check size={16} className={`mt-0.5 shrink-0 ${x.hi ? "text-[#2fd9a6]" : "text-[#00a37a]"}`} /><span className="min-w-0"><J>{t}</J></span></li>)}</ul>
                </div></In>
              ))}
            </div>
            <p className="mt-6 text-center text-[0.84rem]"><Link href="/lp/#price" className="inline-flex items-center gap-1 font-semibold text-[#00805f] hover:underline">プランでできることの比較表を見る<ChevronRight size={16} /></Link></p>
            <p className="mt-2 text-center text-[0.74rem] text-[#6b7571]">※デモ用の仮の料金です。実際の料金は決まっていません。</p>
          </div>
        </section>

        {/* 導入の流れ */}
        <section id="flow" className="scroll-mt-16 py-20 sm:py-28">
          <div className={W}>
            <Head en="Getting started" t="導入の流れ" lead="お申し込みから、最初の点検の結果が届くまで。" />
            <ol className="mx-auto mt-14 grid max-w-[60rem] grid-cols-1 gap-4 md:grid-cols-3">
              {[["アカウントを作る", "メールアドレスだけで、14日間の無料トライアルを開始。カードの登録はいりません。"], ["サイトをつなぐ", "Shopifyなどはボタンでつなぎ、楽天などは商品CSVを取りこみ。計測タグも貼ります。"], ["毎週、届くのを待つ", "翌週から、点検の結果と「今週やること」が届きます。"]].map(([t, d], i) => (
                <In key={t} d={i * 100} className="h-full"><li className="h-full rounded-[12px] border border-[#0f1a17]/[.07] p-7"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#00a37a] text-[0.9rem] font-bold text-white">{i + 1}</span><b className="mt-5 block text-[1.1rem]">{t}</b><p className="mt-2 text-[0.9rem] leading-[1.85] text-[#55605c]"><J>{d}</J></p></li></In>
              ))}
            </ol>
          </div>
        </section>

        {/* サポートと安心 */}
        <section id="support" className="scroll-mt-16 border-y border-[#0f1a17]/[.06] bg-[#f6f8f7] py-20 sm:py-28">
          <div className={`${W} grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16`}>
            <div>
              <Head center={false} en="Support" t="はじめてでも、ひとりにしない。" lead="設定から使い方まで、人がお手伝いします。" />
              <In className="mt-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${IMG}/support.webp?v=1`} alt="オンラインで設定を手伝うサポート担当" width={1376} height={768} loading="lazy" className="block h-auto w-full rounded-[12px] object-cover" />
              </In>
              <ul className="mt-6 space-y-3">{[[Mail, "はじめの設定を、オンライン（30分）で一緒に"], [Mail, "使い方の質問に、2営業日以内にメールでお返事"], [GraduationCap, "1レッスン約3分の講座を、登録なしで"]].map(([I, t], k) => { const Ic = I as typeof Mail; return <li key={k} className="flex items-center gap-3 text-[0.92rem]"><Ic size={17} className="shrink-0 text-[#00a37a]" /><J>{t as string}</J></li>; })}</ul>
              <p className="mt-3 text-[0.74rem] text-[#6b7571]">※デモのため、サポートの内容は予定です。</p>
            </div>
            <div>
              <Head center={false} en="Security" t="お店の大事なページだから。" />
              <div className="mt-8 space-y-3">
                {[{ i: ShieldCheck, t: "勝手に書きかえない", d: "サイトが変わるのは、お店の人が「この案を使う」を押したものだけ。" }, { i: RotateCcw, t: "いつでも、元に戻せる", d: "書きかえる前の文章を残しておくので、ひと押しで戻せます。" }, { i: PenLine, t: "分からない事実は、作らない", d: "ページにないことは【】で空けて、お店に確かめます。" }, { i: KeyRound, t: "パスワードは預からない", d: "サイトとは公式のつなぎ方だけ。計測タグは個人の情報を集めません。" }].map((x, k) => (
                  <In key={x.t} d={k * 70}><div className="flex gap-4 rounded-[12px] border border-[#0f1a17]/[.07] bg-white p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#e5f4ee] text-[#00805f]"><x.i size={19} /></span><span className="min-w-0"><b className="block text-[0.98rem]">{x.t}</b><span className="mt-1 block text-[0.86rem] leading-[1.75] text-[#55605c]"><J>{x.d}</J></span></span></div></In>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* よくある質問 */}
        <section id="faq" className="scroll-mt-16 py-20 sm:py-28">
          <div className={`${W} max-w-[52rem]`}>
            <Head en="FAQ" t="よくある質問" />
            <div className="mt-12 divide-y divide-[#0f1a17]/[.08] border-y border-[#0f1a17]/[.08]">
              {FAQ.map((x) => (
                <details key={x.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-4 py-5 text-[0.98rem] font-semibold [&::-webkit-details-marker]:hidden"><span className="text-[#00a37a]">Q</span><span className="min-w-0 flex-1"><J>{x.q}</J></span><Plus size={19} className="shrink-0 text-[#9aa39f] transition group-open:rotate-45" /></summary>
                  <p className="pb-6 pl-7 pr-8 text-[0.93rem] leading-[1.95] text-[#55605c]"><J>{x.a}</J></p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-center"><Link href="/manabu/#qa" className="inline-flex items-center gap-1 text-[0.88rem] font-semibold text-[#00805f] hover:underline">ほかの質問を見る<ChevronRight size={16} /></Link></p>
          </div>
        </section>

        {/* 最後の申し込み */}
        <section id="start" className="scroll-mt-16 pb-20 sm:pb-28">
          <div className={W}>
            <div className="relative overflow-hidden rounded-[14px] bg-[#0f1a17] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/cta-bg.webp?v=1`} alt="" width={1376} height={768} loading="lazy" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
              <div className="absolute inset-0 bg-[#0b1411]/80" aria-hidden />
              <div className="relative">
                <p className="lp2-eye lp2-eye-dark justify-center">Get started</p>
                <h2 className="mt-3 text-[1.75rem] font-bold leading-[1.45] sm:text-[2.5rem]"><span className="inline-block">AIに選ばれる準備を、</span><span className="inline-block">今日から。</span></h2>
                <p className="mx-auto mt-4 max-w-[30em] text-[0.96rem] leading-[1.9] text-white/75"><J>14日間、すべての機能を無料で試せます。まずは1商品の診断からでも。</J></p>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Btn href="/shindan/">無料で診断する<ArrowRight size={17} /></Btn><Btn href="/" ghost dark>デモ画面を見る</Btn><Btn href="/manabu/" ghost dark>使い方を見る</Btn></div>
                <div className="flex justify-center"><Note dark /></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-[#0f1a17] pb-28 pt-16 text-[0.82rem] text-white/70 sm:pb-12">
        <div className={`${W} grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]`}>
          <div className="col-span-2 md:col-span-1"><p className="flex items-center gap-2.5"><span className="grid h-7 w-7 place-items-center rounded-[6px] bg-white/10"><i className="h-2 w-2 rounded-full bg-[#2fd9a6]" /></span><b className="tracking-[.16em] text-white">TSURETE</b></p><p className="mt-4 max-w-[22em] leading-[1.85]"><J>ネットショップのための、AI検索対策ツール。点検・書き直し・測定・売上の確認を、ひとつで。</J></p></div>
          {[{ h: "製品", l: [["機能", "#features"], ["料金", "#price"], ["比較", "#compare"], ["導入の流れ", "#flow"]] }, { h: "始める・学ぶ", l: [["無料で試す", "#start"], ["デモ画面", "/"], ["学ぶ・使い方", "/manabu/"], ["よくある質問", "#faq"]] }, { h: "安心して使うために", l: [["セキュリティ", "#support"], ["利用規約（準備中）", ""], ["プライバシーポリシー（準備中）", ""], ["特定商取引法に基づく表記（準備中）", ""]] }].map((c) => (
            <div key={c.h} className="min-w-0"><p className="font-semibold text-white">{c.h}</p><ul className="mt-4 space-y-2.5">{c.l.map(([t, h]) => <li key={t}>{h ? (h.startsWith("#") ? <a href={h} className="hover:text-[#2fd9a6]">{t}</a> : <Link href={h} className="hover:text-[#2fd9a6]">{t}</Link>) : <span className="text-white/40">{t}</span>}</li>)}</ul></div>
          ))}
        </div>
        <div className={`${W} mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-[0.72rem] text-white/45 sm:flex-row sm:justify-between`}><span>TSURETE（デモ）</span><span><J>数字は架空のブランドでの模擬の結果です。AIにすすめられることは保証できません。</J></span></div>
      </footer>

      {/* スマホ：下に固定の申し込み */}
      <div className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#0f1a17]/[.08] bg-white/95 px-4 pb-[calc(.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl transition-transform duration-300 sm:hidden ${scrolled ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex gap-2"><a href="#start" className="flex h-11 flex-1 items-center justify-center rounded-[6px] bg-[#00a37a] text-[0.9rem] font-semibold text-white">14日間 無料で試す</a><Link href="/" className="flex h-11 items-center justify-center rounded-[6px] border border-[#0f1a17]/20 px-4 text-[0.85rem] font-semibold">デモ</Link></div>
      </div>
    </div>
  );
}
