"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, CircleHelp, Hand, Lightbulb, MonitorSmartphone, RotateCcw, Store } from "lucide-react";
import Shell from "@/components/Shell";

const IMG = "/sakuapp/works/tsurete/img/guide";

// 使い方ガイド：デモを「店長の佐藤さん」になったつもりで、この順に触ってもらう
const STEPS = [
  { n: 1, href: "/", title: "概要を見る", img: "1.webp",
    what: "お店の今の状態と、「今週やること」が出ます。お店の人は、まずこの画面を開きます。",
    try: ["「今週やること」の1つ目を押してみてください。その作業ができる画面に移ります。"],
    point: "やることは、効果の大きい順に最大3つだけ出します。全部を読まなくても、上から順にやれば大丈夫です。" },
  { n: 2, href: "/erabareru/", title: "AIに選ばれる", img: "2.webp",
    what: "お客様がChatGPTなどのAIに「みなと台でいい整体ある？」と聞いたとき、このお店がおすすめに入る割合（AI推薦シェア）と、近所のお店との比べっこが出ます。",
    try: ["「おすすめに入るためにやること」の「入れる」を押します。", "いちばん上の数字（はじめは16%）が上がるのを確かめてください。全部入れると72%まで上がります。"],
    point: "「どうして負けているか」を、AIがおすすめする時に見ている情報（営業時間・口コミ・駐車場など）から説明します。" },
  { n: 3, href: "/yoyaku/", title: "AIが予約できる", img: "3.webp",
    what: "お客様のAIが、空いている時間を確かめて、そのまま予約まで取れる「AI予約窓口」です。",
    try: ["「公開する」を押して、窓口を開けます。", "「今日の16時、肩こりで空いてる？」などの例を押すと、お客様とAIのやりとりが流れます。下の入力欄に自分で書いてもかまいません。", "最後に、取れた予約が「予約表」に入っているのを確かめてください。"],
    point: "満席のときは、AIが同じ日の別の時間をすすめます。緑色の小さい吹き出しは、AIとお店の窓口のあいだのやりとりです。" },
  { n: 4, href: "/akiwaku/", title: "空きを自動で埋める", img: "4.webp",
    what: "この先1週間で、予約が入りにくそうな時間を色で出します。オレンジのわくが「埋めたい時間」です。",
    try: ["下の呼びかけのカードで「出す」を押します。", "上の「呼びかけで埋まる見込み」の数字が増えます。", "「自動で出す」に切りかえると、押さなくても全部出るようになります。"],
    point: "雨の日には「雨の日だけ500円引き」のように、天気や時間に合わせた文をAIが書きます。" },
  { n: 5, href: "/machi/", title: "街ぐるみで送り合う", img: "5.webp",
    what: "近所のお店どうしで、お客様を紹介し合う画面です。地図と、紹介用のQRコード、毎月の精算表があります。",
    try: ["下の「相性のいい近所のお店」で「提携をお願いする」を押します。地図の印の色が変わります。"],
    point: "QRコードは実際に読み取れます。だれの紹介で来たかが記録され、月末に紹介のお礼を差し引きで計算します。" },
  { n: 6, href: "/settings/", title: "設定", img: "6.webp",
    what: "自分のお店の名前・地域・業種を入れたり、デモを最初の状態に戻したりします。",
    try: ["「最初の状態に戻す」を押すと、押したボタンがすべて元に戻ります。"],
    point: "AIのキー（APIキー）を入れると、「AIに選ばれる」の画面で、本物のAIに今のおすすめを聞くこともできます（キーはこのブラウザの中だけに保存します）。" },
];

const QA = [
  { q: "これはLP（宣伝のページ）ですか？", a: "いいえ。お店の人が毎日使う「管理画面（ツール）」の見本です。ボタンを押すと、本物のツールと同じように画面が動きます。" },
  { q: "だれが使うものですか？", a: "整体院・美容室・飲食店など、地域のお店の人です。お客様が見る画面ではありません（お客様は、いつも使っているAIに話しかけるだけです）。" },
  { q: "本物の予約や投稿がされますか？", a: "されません。デモの中だけで動きます。押した内容は、この端末のブラウザの中にだけ残ります。" },
  { q: "画面の数字は本物ですか？", a: "架空のお店「ほぐし処 そよかぜ」の、模擬の数字です。実際に使うときは、お店ごとにAIへ質問して測ります。" },
  { q: "実際に使うと、どれくらい手間がかかりますか？", a: "週に1回、「今週やること」を確かめて、承認のボタンを押すくらいを目指しています。呼びかけを「自動で出す」にすれば、さらに少なくなります。" },
];

function Guide() {
  return (
    <>
      <p className="text-[0.9rem] font-bold text-ai">はじめての方へ</p>
      <h1 className="mt-1 text-[1.9rem] font-bold leading-[1.4]">使い方ガイド</h1>

      <section className="mt-5 grid gap-3 md:grid-cols-3" aria-label="このデモについて">
        {[
          { icon: Store, t: "お店の人が使うツールです", b: "宣伝のページ（LP）ではなく、お店の人が使う管理画面の見本です。" },
          { icon: Hand, t: "押して試せます", b: "架空の整体院の店長「佐藤さん」になったつもりで、ボタンを押してみてください。" },
          { icon: RotateCcw, t: "何度でもやり直せます", b: "押した内容はこの端末の中だけ。「設定」から最初の状態に戻せます。" },
        ].map(({ icon: Icon, t, b }) => (
          <div key={t} className="card flex gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ai-2 text-ai"><Icon size={20} /></span>
            <span className="min-w-0"><b className="block text-[1rem] leading-[1.6]">{t}</b><span className="text-[0.88rem] leading-[1.8] text-sub">{b}</span></span>
          </div>
        ))}
      </section>

      <div className="mt-4 rounded-2xl border border-line bg-panel p-5 text-[0.95rem] leading-[1.95]">
        <b>TSURETEとは：</b>お客様がお店を「検索」ではなく「AIに聞いて」探す時代に、<b>AIにおすすめしてもらい、AIに予約まで取ってもらう</b>ための集客ツールです。いわば「Googleマップ対策」のAI版です。下の6つの順番に触ると、5分ほどで全体がわかります。
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
