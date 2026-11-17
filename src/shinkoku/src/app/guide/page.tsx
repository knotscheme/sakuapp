"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Lightbulb, ShieldCheck } from "lucide-react";
import Shell from "@/components/Shell";
import Speak from "@/components/Speak";

const IMG = "/sakuapp/works/shinkoku/img/guide";

// かんたんガイド：6つの手順を、実際の画面の写真といっしょに説明する
const STEPS = [
  { n: 1, href: "/torikomi/", title: "明細を取りこむ", when: "月に1回", img: "1.webp",
    body: "銀行やクレジットカードのサイトから「明細のファイル（CSV）」を保存して、ここに入れます。現金で払ったものは、レシートを写真に撮るか、手で入力します。",
    tip: "はじめは「見本の明細で試す」を押すと、どんな動きか分かります。" },
  { n: 2, href: "/kakunin/", title: "内容を確認する", when: "取りこんだあと", img: "2.webp",
    body: "明細が1件ずつ出てきます。「何に使ったお金ですか？」の中から当てはまるものを押して、「これでOK」を押すだけです。スマホや電気など家でも使うものは、仕事で使った割合もえらびます。",
    tip: "「次から自動で」にチェックを入れておくと、来月から同じ明細は自動でえらばれます。" },
  { n: 3, href: "/chobo/", title: "帳簿を見る", when: "気になったとき", img: "3.webp",
    body: "確認がすんだお金の記録（帳簿）が、日付の順に並びます。お店の名前・日付・金額でさがせます。まちがいに気づいたら、1件を押して「この内容を直す」を押します。",
    tip: "直した記録は消えずに残ります。帳簿は7年間の保存が必要です。" },
  { n: 4, href: "/kessan/", title: "1年のまとめ", when: "12月の終わり〜1月", img: "4.webp",
    body: "パソコンなど長く使う物の費用、売る物の在庫、家と仕事で分けたお金を確かめます。最後に「もうけの表」ができあがります。",
    tip: "10万円以上の物を買った年は、「長く使う物」に入っているか確かめましょう。" },
  { n: 5, href: "/shinkoku/", title: "税金を計算する", when: "1月〜2月", img: "5.webp",
    body: "年金・保険・医療費・ふるさと納税など、税金が安くなるもの（控除）を確かめます。所得税・消費税・住民税・事業税の目安が、計算の順番どおりに出ます。",
    tip: "帳簿の外で払ったもの（家族の口座から払った保険など）は、ここで足します。" },
  { n: 6, href: "/teishutsu/", title: "申告書を出す", when: "2月16日〜3月15日", img: "6.webp",
    body: "国税庁の「確定申告書等作成コーナー」を開き、この画面の案内どおりに数字を入れて、e-Tax（インターネット）で送ります。数字は「コピー」を押して、そのまま貼り付けられます。",
    tip: "マイナンバーカードと、読み取れるスマホを用意しておくと、スムーズです。" },
];

const YEARLY = [
  { m: "毎月", t: "明細を取りこんで、確認する（10分くらい）" },
  { m: "11月", t: "国民年金・保険の「控除証明書」が届いたら、なくさないように保管" },
  { m: "12月末", t: "「1年のまとめ」で、長く使う物・在庫を確かめる" },
  { m: "1〜2月", t: "「税金を計算する」で、控除を確かめる" },
  { m: "2月16日〜3月15日", t: "「申告書を出す」の案内どおりに、e-Taxで提出" },
  { m: "3月31日", t: "消費税の申告・支払いの期限（インボイス登録している人）" },
];

const WORDS = [
  { w: "経費（けいひ）", m: "仕事のために使ったお金。売上から引けるので、税金が少なくなります。" },
  { w: "控除（こうじょ）", m: "税金を計算するときに、所得から差し引けるもの。年金や保険などがあります。" },
  { w: "所得（しょとく）", m: "売上から経費を引いた、もうけのこと。税金はこの金額をもとに計算します。" },
  { w: "家事按分（かじあんぶん）", m: "家と仕事の両方で使うものを、仕事で使った割合で分けること。" },
  { w: "減価償却（げんかしょうきゃく）", m: "高い物の代金を、何年かに分けて経費にすること。" },
  { w: "青色申告（あおいろしんこく）", m: "きちんと帳簿をつけて申告する方法。最大65万円の控除があります。" },
  { w: "インボイス", m: "登録番号（Tから始まる番号）が書かれた請求書やレシート。消費税の計算に使います。" },
  { w: "e-Tax（イータックス）", m: "インターネットで申告書を出すしくみ。家から提出できます。" },
];

function Guide() {
  const all = `かんたんガイド。じぶん申告は、6つの手順で、確定申告まで進められます。${STEPS.map((s) => `手順${s.n}、${s.title}。${s.body}`).join("")}`;
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-[1rem] text-sub">はじめての方へ</p><h1 className="text-[1.75rem] font-bold">かんたんガイド</h1></div>
        <Speak text={all} label="ガイドをぜんぶ読み上げる" />
      </div>
      <div className="mt-4 rounded-2xl border-2 border-[#c9dfd3] bg-ok-2 p-5 text-[1.05rem] leading-[1.95]">
        じぶん申告は、<b>6つの手順</b>で確定申告まで進められます。左のメニュー（スマホは右上の「メニュー」）の<b>数字の順に</b>進めてください。<br />
        むずかしい言葉は、なるべく使っていません。わからない言葉は、このページの下の「言葉の説明」を見てください。
      </div>

      <nav aria-label="手順の目次" className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s) => <a key={s.n} href={`#step${s.n}`} className="flex min-h-[3.2rem] items-center gap-2 rounded-2xl border-2 border-line bg-white px-3 py-2 text-[1rem] font-bold leading-[1.4] hover:border-ink"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[0.85rem] text-white">{s.n}</span><span className="flex-1">{s.title}</span><ChevronRight size={20} className="shrink-0 text-sub" /></a>)}
      </nav>

      <ol className="mt-6 space-y-6">
        {STEPS.map((s) => (
          <li key={s.n} id={`step${s.n}`} className="card scroll-mt-24 overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
              <div className="border-b-2 border-line bg-paper px-4 pb-0 pt-5 lg:border-b-0 lg:border-r-2 lg:p-3">
                {/* スマホではスマホの画面、パソコンではパソコンの画面の写真を出す */}
                <picture>
                  <source media="(min-width: 1024px)" srcSet={`${IMG}/${s.img}`} />
                  <img src={`${IMG}/${s.img.replace(".webp", "-sp.webp")}`} alt={`「${s.title}」の画面`} width={390} height={600} loading="lazy"
                    className="mx-auto block w-full max-w-[17rem] rounded-t-[1.6rem] border-[5px] border-b-0 border-ink bg-white lg:max-w-none lg:rounded-xl lg:border-2 lg:border-b-2 lg:border-line" />
                </picture>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ok text-[1.4rem] font-bold text-white">{s.n}</span>
                  <div><h2 className="text-[1.4rem] font-bold leading-[1.4]">{s.title}</h2><p className="flex items-center gap-1 text-[0.95rem] text-sub"><CalendarDays size={16} />{s.when}</p></div>
                </div>
                <p className="mt-4 text-[1.05rem] leading-[1.95]">{s.body}</p>
                <p className="mt-3 flex gap-2 rounded-xl bg-warn-2 p-3 text-[0.98rem] leading-[1.85]"><Lightbulb size={20} className="mt-1 shrink-0 text-warn" /><span>{s.tip}</span></p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={s.href} className="btn btn-main">この画面をひらく<ArrowRight size={20} /></Link>
                  <Speak text={`手順${s.n}、${s.title}。${s.body}${s.tip}`} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section className="card mt-8 p-5 sm:p-6" aria-labelledby="yr">
        <h2 id="yr" className="flex items-center gap-2 text-[1.4rem] font-bold"><CalendarDays size={26} className="text-ok" />1年の流れ</h2>
        <ol className="mt-4 space-y-2">
          {YEARLY.map((y) => <li key={y.m} className="flex flex-wrap gap-x-4 gap-y-1 rounded-2xl bg-paper px-4 py-3 text-[1.03rem]"><b className="w-[9.5em] shrink-0 text-ok">{y.m}</b><span className="min-w-0 flex-1">{y.t}</span></li>)}
        </ol>
      </section>

      <section className="card mt-6 p-5 sm:p-6" aria-labelledby="wd">
        <h2 id="wd" className="text-[1.4rem] font-bold">言葉の説明</h2>
        <dl className="mt-4 grid gap-3 md:grid-cols-2">
          {WORDS.map((w) => <div key={w.w} className="rounded-2xl border-2 border-line p-4"><dt className="text-[1.1rem] font-bold">{w.w}</dt><dd className="mt-1 text-[1rem] leading-[1.85] text-sub">{w.m}</dd></div>)}
        </dl>
      </section>

      <section className="mt-6 flex gap-3 rounded-2xl border-2 border-line bg-white p-5 text-[1rem] leading-[1.9]" aria-label="安心して使うために">
        <ShieldCheck size={30} className="shrink-0 text-ok" />
        <p><b className="block text-[1.1rem]">安心して使うために</b>データは、この端末の中だけに保存されます。端末をなくすと消えてしまうので、「設定」から<b>月に1回バックアップ</b>を書き出してください。税額は目安です。迷ったときは「わからないことを聞く」か、税務署の電話相談を使ってください。</p>
      </section>
      <div className="mt-6"><Link href="/torikomi/" className="btn btn-main min-h-[3.6rem] text-[1.15rem]">さっそく、手順1からはじめる<ArrowRight size={22} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Guide /></Shell>; }
