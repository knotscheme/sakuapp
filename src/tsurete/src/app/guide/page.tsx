"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, CircleHelp, Hand, Lightbulb, MonitorSmartphone, RotateCcw, Store } from "lucide-react";
import Shell from "@/components/Shell";

const IMG = "/sakuapp/works/tsurete/img/guide";

// 使い方ガイド：デモを「店長の佐藤さん」になったつもりで、この順に触ってもらう
const STEPS = [
  { n: 1, href: "/ai/", title: "お客様のAI画面", img: "1.webp",
    what: "お客様がChatGPTなどのAIに「敏感肌でも使える化粧水は？」と聞いたときの答えを、再現した画面です。",
    try: ["右の質問を押すと、AIがおすすめを3つ答えます。いまはSORAEがほとんど出ません。", "「同じ質問を、もう一度聞く」を押すと、答えが少し変わります。", "上の「ぜんぶ直したあと」を押すと、SORAEが出るようになり、「商品を見る」→「買う」まで試せます。"],
    point: "AIの答えは聞くたびに変わるので、1回ではなく「20回聞いて何回出たか」で見ます。" },
  { n: 2, href: "/tana/", title: "棚チェック", img: "2.webp",
    what: "お客様が聞きそうな質問を4つのAIに何度も聞いて、SORAEが出た回数を数えた画面です。",
    try: ["いちばん上の「出たのは〇回」を見ます。はじめは約10%です。", "「出ない理由」で、足りない情報（オレンジ色）を確かめます。"],
    point: "代わりに出ているブランドと、質問ごとの回数も見られます。設定でAIのキーを入れると、本物のAIにも聞けます。" },
  { n: 3, href: "/naosu/", title: "直す", img: "3.webp",
    what: "出ない理由から、やることを効き目の大きい順に並べた画面です。商品説明やよくある質問の文章は、AIが下書きします。",
    try: ["「前と後をくらべる」で、直す前と直した後の文章を見ます。", "「反映する」を押します。「出る回数 +〇回」の分だけ、数字が上がります。"],
    point: "全部反映すると、出る割合が約10%から約70%まで上がります（デモの模擬の数字です）。" },
  { n: 4, href: "/uriage/", title: "売れたか", img: "4.webp",
    what: "AIのおすすめから来たお客様の数と、その売上（今月の見込み）の画面です。",
    try: ["「直す前より +〇円」で、直した効果を確かめます。", "1の画面で「買う」を押した注文も、ここに入ります。"],
    point: "どのAIから来たお客様かも分かります。" },
  { n: 5, href: "/settings/", title: "設定", img: "5.webp",
    what: "自分のブランド名を入れたり、デモを最初の状態に戻したりします。",
    try: ["「最初の状態に戻す」を押すと、反映した内容と注文がすべて元に戻ります。"],
    point: "AIのキーは、この端末の中だけに保存します。" },
];

const QA = [
  { q: "これはLP（宣伝のページ）ですか？", a: "いいえ。ネットショップを運営する人が使う「管理画面（ツール）」の見本です。" },
  { q: "だれ向けですか？", a: "Shopify・BASE・STORESなどで自社のネットショップを持つ、小さなブランドです。スキンケア・食品・雑貨など、お客様が比べて選ぶ商品に向いています。" },
  { q: "「AIのおすすめに出る」とは？", a: "お客様がChatGPTなどに「おすすめの〇〇は？」と聞いたとき、答えの中に自分の商品が入ることです。検索の代わりにAIに聞く人が増えています。" },
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
            <span className="min-w-0"><b className="block text-[1rem] leading-[1.6]">{t}</b><span className="text-[0.88rem] leading-[1.8] text-sub">{b}</span></span>
          </div>
        ))}
      </section>

      <div className="mt-4 rounded-2xl border border-line bg-panel p-5 text-[0.95rem] leading-[1.95]">
        <b>TSURETEとは：</b>お客様がChatGPTなどのAIに「おすすめの化粧水は？」と聞いたとき、<b>あなたの商品がすすめられ、そのまま買われる</b>ようにする、ネットショップのための集客ツールです。下の順番に触ると、5分ほどで全体がわかります。
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
                <p className="mt-3 text-[0.95rem] leading-[1.9]">{s.what}</p>
                <p className="mt-4 text-[0.85rem] font-bold text-ai">押してみよう</p>
                <ol className="mt-1 space-y-1.5">
                  {s.try.map((t, i) => <li key={t} className="flex gap-2 text-[0.93rem] leading-[1.8]"><span className="num mt-[0.2rem] grid h-5 w-5 shrink-0 place-items-center rounded-full border border-ai text-[0.7rem] text-ai">{i + 1}</span><span className="min-w-0">{t}</span></li>)}
                </ol>
                <p className="mt-4 flex gap-2 rounded-xl bg-warn/10 p-3 text-[0.86rem] leading-[1.8]"><Lightbulb size={18} className="mt-[0.15rem] shrink-0 text-warn" /><span className="min-w-0">{s.point}</span></p>
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
              <p className="px-4 pb-4 text-[0.92rem] leading-[1.9] text-sub">{x.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-6 flex gap-2 text-[0.85rem] leading-[1.8] text-sub"><MonitorSmartphone size={18} className="mt-[0.15rem] shrink-0" /><span className="min-w-0">スマホでは、右上の「メニュー」から各画面に移れます。</span></p>
      <div className="mt-6"><Link href="/" className="btn btn-ai">さっそく試す（概要へ）<ArrowRight size={18} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Guide /></Shell>; }
