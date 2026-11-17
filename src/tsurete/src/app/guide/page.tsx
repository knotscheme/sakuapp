"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, CircleHelp, Hand, Lightbulb, MonitorSmartphone, RotateCcw, Store } from "lucide-react";
import Shell from "@/components/Shell";
import J from "@/components/J";

const IMG = "/sakuapp/works/tsurete/img/guide";

// 使い方ガイド：デモを「店長の佐藤さん」になったつもりで、この順に触ってもらう
const STEPS = [
  { n: 1, href: "/hakaru/", title: "測る", img: "1.webp",
    what: "お客様が聞きそうな質問を、TSURETEが毎週自動で、ChatGPTなど4つのAIに何度も聞いて、あなたの商品が何回すすめられたかを記録した画面です。",
    try: ["いちばん上の「今週、AIにすすめられた割合」と、週ごとのグラフを見ます。", "「AIの売り場での順位」で、どの店に負けているかを見ます。", "「よくすすめられている店との差」で、自分のページに足りないもの（「なし」の行）を確かめます。"],
    point: "下の「お客様がAIに聞くと」で、AIの答えを再現できます。SORAEが出たら「商品を見る」→「買う」まで試せます。" },
  { n: 2, href: "/naosu/", title: "直す", img: "2.webp",
    what: "見つかった差を、AIが商品ページの書き直し案にした画面です。お店のサイトを選ぶと、届け方（自動で書きかえ・CSV・コピー）が変わります。",
    try: ["はじめに「お店のサイト」を選びます（例：Shopify、楽天市場）。", "点線の枠の「この案を使う」を押します。まとめて使うときは、上の大きなボタンを押します。", "楽天などCSVのサイトでは「楽天用のCSVで受け取る」で、取りこみ用のファイルを保存できます。"],
    point: "下の「商品フィード」は、どのサイトでも使える届け方です。デモでは、実際のサイトは変わりません。" },
  { n: 3, href: "/kouka/", title: "売上", img: "3.webp",
    what: "AIにすすめられて来たお客様と、その売上（今月の見込み）の画面です。",
    try: ["「直す前より +〇円」で、直した効果を確かめます。"],
    point: "どのAIから来たお客様かも分かります。" },
  { n: 4, href: "/shindan/", title: "無料診断", img: "4.webp",
    what: "どのサイトの商品でも、URLかCSVを入れるだけで、足りないところと書き直し案を出します。お試しの入り口です。",
    try: ["見本のURLのまま「診断する」を押します。", "「CSVでまとめて」→「見本で試す」で、8商品をまとめて診断できます。"],
    point: "それぞれの項目に「どうやって調べた？」「なぜ大事？」が出ます。" },
];

const QA = [
  { q: "AIに自分で聞くのと、何が違いますか？", a: "1回聞くだけでは、答えが毎回変わるため本当の順位は分かりません。TSURETEは4つのAIに何十通りの質問を毎週自動で何百回も聞いて記録し（お店の人が聞く必要はありません）、よくすすめられている店との差を出し、全商品まとめて直します。" },
  { q: "どのサイトでも使えますか？", a: "はい。測るのはサイトに何も入れずにできます。直すときは、Shopifyなどは自動で書きかえ、楽天・Amazonなどは取りこみ用のCSV、そのほかはコピーや商品フィードで届けます。" },
  { q: "だれ向けですか？", a: "Shopify・BASE・STORESなどで自社のネットショップを持つ、小さなブランドです。スキンケア・食品・雑貨など、お客様が比べて選ぶ商品に向いています。" },
  { q: "なぜ書き直すと、AIにすすめられるのですか？", a: "AIは「敏感肌向け」「無香料」「1日あたりの値段」のように、はっきり書かれた情報から商品を選びます。雰囲気だけの説明では、候補に入りにくくなります。" },
  { q: "商品が多くても使えますか？", a: "はい。ShopifyやBASEの商品CSVを入れると、全商品をまとめて診断し、書き直し案をCSVで受け取れます。" },
  { q: "本当にショップの文章が変わりますか？", a: "デモでは変わりません。実際のツールでは、Shopifyなどとつないで、承認したものだけを反映します。" },
  { q: "画面の数字は本物ですか？", a: "架空のブランド「SORAE」の、模擬の数字です。AIにすすめられることは保証できません。" },
];

function Guide() {
  return (
    <>
      <p className="text-[0.9rem] font-bold text-ai">はじめての方へ</p>
      <h1 className="mt-1 text-[1.9rem] font-bold leading-[1.4]">使い方ガイド</h1>

      <section className="mt-5 grid gap-3 md:grid-cols-3" aria-label="このデモについて">
        {[
          { icon: Store, t: "お店の人が使うツールです", b: "宣伝のページ（LP）ではなく、ネットショップの人が使う管理画面の見本です。" },
          { icon: Hand, t: "押して試せます", b: "架空のスキンケアブランド「SORAE」の佐藤さんになったつもりで、押してみてください。" },
          { icon: RotateCcw, t: "何度でもやり直せます", b: "押した内容はこの端末の中だけ。「設定」から最初の状態に戻せます。" },
        ].map(({ icon: Icon, t, b }) => (
          <div key={t} className="card flex gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ai-2 text-ai"><Icon size={20} /></span>
            <span className="min-w-0"><b className="block text-[1rem] leading-[1.6]">{t}</b><span className="text-[0.88rem] leading-[1.8] text-sub"><J>{b}</J></span></span>
          </div>
        ))}
      </section>

      <div className="mt-4 rounded-2xl border border-line bg-panel p-5 text-[0.95rem] leading-[1.95]">
        <b>TSURETEとは：</b><J>お客様がChatGPTなどのAIに商品を聞いたとき、あなたの商品が何回すすめられているかを毎週自動ではかり、負けている理由を直すツールです。Shopify・楽天・Amazonなど、どのサイトでも使えます。</J>
      </div>

      <nav aria-label="手順の目次" className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s) => <a key={s.n} href={`#step${s.n}`} className="flex min-h-[3.2rem] items-center gap-2 rounded-2xl border border-line bg-panel px-3 py-2 text-[0.98rem] font-bold leading-[1.4] hover:border-ai"><span className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-deep text-[0.85rem] text-white">{s.n}</span><span className="flex-1">{s.title}</span><ChevronRight size={18} className="shrink-0 text-sub" /></a>)}
      </nav>

      <ol className="mt-6 space-y-6">
        {STEPS.map((s) => (
          <li key={s.n} id={`step${s.n}`} className="card scroll-mt-24 overflow-hidden p-0">
            <div className="grid lg:grid-cols-[1.1fr_1fr]">
              <div className="border-b border-line bg-paper px-4 pt-5 lg:border-b-0 lg:border-r lg:p-4">
                {/* スマホではスマホの画面、パソコンではパソコンの画面の写真を出す */}
                <picture>
                  <source media="(min-width: 1024px)" srcSet={`${IMG}/${s.img}`} />
                  <img src={`${IMG}/${s.img.replace(".webp", "-sp.webp")}`} alt={`「${s.title}」の画面`} width={390} height={600} loading="lazy"
                    className="mx-auto block w-full max-w-[16rem] rounded-t-[1.6rem] border-[5px] border-b-0 border-deep bg-panel lg:max-w-none lg:rounded-xl lg:border lg:border-line" />
                </picture>
              </div>
              <div className="p-5 sm:p-6">
                <p className="flex items-center gap-2"><span className="num grid h-8 w-8 place-items-center rounded-full bg-ai text-[#03140f]">{s.n}</span><b className="text-[1.25rem]">{s.title}</b></p>
                <p className="mt-3 text-[0.95rem] leading-[1.9]"><J>{s.what}</J></p>
                <p className="mt-4 text-[0.85rem] font-bold text-ai">押してみよう</p>
                <ol className="mt-1 space-y-1.5">
                  {s.try.map((t, i) => <li key={t} className="flex gap-2 text-[0.93rem] leading-[1.8]"><span className="num mt-[0.2rem] grid h-5 w-5 shrink-0 place-items-center rounded-full border border-ai text-[0.7rem] text-ai">{i + 1}</span><span className="min-w-0"><J>{t}</J></span></li>)}
                </ol>
                <p className="mt-4 flex gap-2 rounded-xl bg-warn/10 p-3 text-[0.86rem] leading-[1.8]"><Lightbulb size={18} className="mt-[0.15rem] shrink-0 text-warn" /><span className="min-w-0"><J>{s.point}</J></span></p>
                <Link href={s.href} className="btn btn-ai mt-4 w-full sm:w-auto">この画面を開く<ArrowRight size={18} /></Link>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-8" aria-labelledby="qa">
        <h2 id="qa" className="flex items-center gap-2 text-[1.25rem] font-bold"><CircleHelp size={22} className="text-ai" />よくある質問</h2>
        <div className="mt-3 space-y-2">
          {QA.map((x) => (
            <details key={x.q} className="card group p-0">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-[0.98rem] font-bold"><span className="min-w-0 flex-1">{x.q}</span><ChevronRight size={18} className="shrink-0 text-sub transition group-open:rotate-90" /></summary>
              <p className="px-4 pb-4 text-[0.92rem] leading-[1.9] text-sub"><J>{x.a}</J></p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-6 flex gap-2 text-[0.85rem] leading-[1.8] text-sub"><MonitorSmartphone size={18} className="mt-[0.15rem] shrink-0" /><span className="min-w-0">スマホでは、画面の下のボタン（ホーム・測る・直す・売上）で移れます。</span></p>
      <div className="mt-6"><Link href="/" className="btn btn-ai">さっそく試す（概要へ）<ArrowRight size={18} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Guide /></Shell>; }
