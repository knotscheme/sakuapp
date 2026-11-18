"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, CircleHelp, Hand, Lightbulb, MonitorSmartphone, RotateCcw, Store } from "lucide-react";
import Shell from "@/components/Shell";
import J from "@/components/J";

const IMG = "/sakuapp/works/tsurete/img/guide";

// 使い方ガイド：デモを「店長の佐藤さん」になったつもりで、この順に触ってもらう
const STEPS = [
  { n: 1, href: "/kenko/", title: "診断", img: "1.webp",
    what: "全商品のページを、AIに選ばれるための8つの項目（向いている人、比較表、よくある質問、構造化データなど）で点検した画面です。AIは使わないので、AIの利用料はかかりません。",
    try: ["いちばん上の点数（ページの健康スコア）を見ます。", "商品の行を押すと、×がついた項目（足りないところ）が開きます。", "「直す」を押すと、その商品の処方箋に移ります。"],
    point: "まだ登録していない商品は、下の「URLで診断」「CSVでまとめて診断」から点検できます。" },
  { n: 2, href: "/naosu/", title: "直す", img: "2.webp",
    what: "診断で足りなかったところの、処方箋（書き直し案と貼るコード）の画面です。お店のサイトを選ぶと、届け方（コピー・CSV・自動で書きかえ）が変わります。",
    try: ["はじめに「お店のサイト」を選びます（例：Shopify、楽天市場）。", "「案を見る」で書き直し案を確かめます。", "「コピーする」（サイトによっては「反映する」）を押します。"],
    point: "反映されるのは、お店の人が「この案を使う」を押したものだけです。デモでは、実際のサイトは変わりません。" },
  { n: 3, href: "/kouka/", title: "売上", img: "3.webp",
    what: "お店のサイトに貼った計測タグで、AIから来たお客様と、その売上を数える画面です。推測ではなく、実際の来店と注文です。",
    try: ["「設定」の「計測タグ」で、サイトに合った貼り方を見て、「貼ったので確認する」を押します。", "戻ってきて、どのAIから何人来て、いくら売れたかを見ます。"],
    point: "Googleの無料の公式ツール「Search Console」の使い方も、この画面で案内しています。" },
  { n: 4, href: "/hakaru/", title: "測る（プロ）", img: "4.webp",
    what: "同じジャンルのお店とまとめてAIに聞いた結果を、共有して見る画面です。どの質問で、どの店に負けているか、AIがどのサイトを根拠にしたかが分かります。",
    try: ["「AIの売り場での順位」で、どの店に負けているかを見ます。", "「AIが根拠にしたサイト」で、載ると有利なサイトを確かめます。", "自分でAIに聞いた結果も、「自分で聞いた結果の記録」に残せます。"],
    point: "お店がAIの利用料を払う必要はありません。数字は目安です。" },
];

const QA = [
  { q: "AIに自分で聞くのと、何が違いますか？", a: "AIの答えは人や回ごとに変わるので、自分で聞いた1回の答えは当てになりません。TSURETEは、AIの答えを当てにいくのではなく、AIが読み取りやすいページかを点検して直し、効いたかどうかを計測タグで実際の来店と売上で確かめます。" },
  { q: "AIの利用料はかかりますか？", a: "お店が払う必要はありません。点検はAIを使わずに行い、書き直し案を作る分の小さな費用は、TSURETEの料金に含みます。" },
  { q: "どのサイトでも使えますか？", a: "はい。診断と処方箋は、どのサイトでも使えます。届け方は、Shopifyなどは自動で書きかえ、楽天・Amazonなどは取りこみ用のCSV、そのほかはコピーです。計測タグは、Shopify・WordPress・自作のサイトなどに貼れます。" },
  { q: "だれ向けですか？", a: "Shopify・BASE・STORESなどで自社のネットショップを持つ、小さなブランドです。スキンケア・食品・雑貨など、お客様が比べて選ぶ商品に向いています。" },
  { q: "なぜ書き直すと、AIにすすめられるのですか？", a: "AIは「敏感肌向け」「無香料」「1日あたりの値段」のように、はっきり書かれた情報や、表・質問と答えの形の情報から商品を選びます。雰囲気だけの説明では、候補に入りにくくなります。" },
  { q: "本当にショップの文章が変わりますか？", a: "デモでは変わりません。実際のツールでは、お店の人が確認したものだけを反映します。" },
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
        <b>TSURETEとは：</b><J>AIに選ばれる商品ページにするための、健康診断と処方箋のツールです。全商品のページを点検して書き直し案を出し、効いたかどうかを実際の来店と売上で確かめます。お店がAIの利用料を払う必要はありません。</J>
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
                  <source media="(min-width: 1024px)" srcSet={`${IMG}/${s.img}?v=5`} />
                  <img src={`${IMG}/${s.img.replace(".webp", "-sp.webp")}?v=5`} alt={`「${s.title}」の画面`} width={390} height={600} loading="lazy"
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

      <p className="mt-6 flex gap-2 text-[0.85rem] leading-[1.8] text-sub"><MonitorSmartphone size={18} className="mt-[0.15rem] shrink-0" /><span className="min-w-0">スマホでは、画面の下のボタン（ホーム・診断・直す・売上）で移れます。「測る」は、ホームと売上の画面の下から開けます。</span></p>
      <div className="mt-6"><Link href="/" className="btn btn-ai">さっそく試す（概要へ）<ArrowRight size={18} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Guide /></Shell>; }
