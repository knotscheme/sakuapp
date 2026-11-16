import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { asset } from "@/lib/asset";
import NoOrphan from "@/components/NoOrphan";
import { Ph } from "@/components/cms/Ph";

export const metadata: Metadata = {
  title: "CRAFT OEM｜サービスとツールの全体像",
  description: "革小物ロゴ入れOEMのLP・見積・管理画面（CMS）・工場とのやり取り・お客様の確認画面を、ひとつにまとめた確認用ページ（ポートフォリオ用の制作サンプル）",
};

// このサービス（LP＋管理画面＋工場＋お客様）を、まとめて確認するためのページ
type Screen = { img: string; title: string; who: string; href: string; points: string[] };
const GROUPS: { en: string; ja: string; lead: string; screens: Screen[] }[] = [
  {
    en: "For customers", ja: "お客様が見る画面", lead: "集客から見積もり、ロゴの確認まで。ログインなしで使えます。",
    screens: [
      { img: "lp", title: "LP（ランディングページ）", who: "見込みのお客様", href: "/", points: ["ブランド名を入れて、実物の財布で刻印を試せる", "利益シミュレーター", "見積もり・相談のフォーム"] },
      { img: "products", title: "製品一覧", who: "見込みのお客様", href: "/products/", points: ["管理画面で登録した商品がそのまま出る", "丸のカラーピッカーで色を選べる", "選んだ色のまま相談に進める"] },
      { img: "contact", title: "見積もりフォーム", who: "見込みのお客様", href: "/#contact", points: ["カラーごとに数量を入れられる", "合計の数で数量割引（30・50・100・300個〜）", "あと何個で割引かも、その場で分かる"] },
      { img: "portal", title: "お客様の確認画面", who: "注文したお客様", href: "/cms/portal/?id=C-1028", points: ["メールの専用リンクで、自分の案件だけ見える", "見積の承諾・ロゴ配置の承認", "修正のお願いもここから"] },
    ],
  },
  {
    en: "For the team", ja: "社内で使う画面（管理画面）", lead: "問い合わせから発送までを1つで管理。スマホでも同じように使えます。",
    screens: [
      { img: "dash", title: "ダッシュボード", who: "オーナー・営業", href: "/cms/", points: ["進行中の案件・受注金額・期日", "数字を押すと、その一覧が開く", "工場からの新しい連絡"] },
      { img: "deals", title: "案件ボード", who: "オーナー・営業", href: "/cms/deals/", points: ["段階ごとの列で、案件の今が分かる", "スマホは段階のボタンで移動", "一覧（カード）表示にも切り替え"] },
      { img: "deal", title: "案件の画面・ロゴ配置イメージ", who: "オーナー・営業", href: "/cms/deal/?id=C-1027", points: ["「次にやること」を押すだけで進む", "実物の写真にロゴを重ねた配置イメージ", "書類とメールは自動で作られる"] },
      { img: "quote", title: "見積（カラー別・数量割引）", who: "オーナー・営業", href: "/cms/deal/?id=C-1026", points: ["カラーごとの数量を入れると見積が変わる", "合計の数で数量割引が自動で入る", "原価・粗利も同じ画面で"] },
      { img: "product-edit", title: "商品登録（SKU・バリエーション）", who: "オーナー・営業", href: "/cms/products/", points: ["カラー・サイズは先に登録して選ぶだけ", "組み合わせごとにSKU品番（自動作成も）", "画像10枚・動画も登録できる"] },
      { img: "chat", title: "工場との連絡", who: "オーナー・営業", href: "/cms/messages/?id=C-1029", points: ["LINEのように、工場とのやり取りだけを並べる", "どの商品の話かが写真で分かる", "そのまま案件を開ける"] },
      { img: "manual", title: "使い方マニュアル", who: "全員", href: "/cms/manual/", points: ["役割ごとに、読むべき章を案内", "工場の人にはタイ語で表示", "困ったとき・言葉の説明"] },
    ],
  },
  {
    en: "For the factory", ja: "工場が使う画面", lead: "タイの工場の人は、ログインした時点からタイ語。お客様の情報や価格は見えません。",
    screens: [
      { img: "factory", title: "工場の画面（タイ語）", who: "工場（タイ）", href: "/cms/factory/", points: ["工程を押して進める（裁断→縫製→箔押し→仕上げ）", "日本への連絡は、日本語に変えて届く", "製造指示書は日本語・英語・タイ語"] },
    ],
  },
];

const FLOW = [
  { n: "01", t: "LPで相談", s: "刻印を試し、色と数で概算を見て送信" },
  { n: "02", t: "見積を送る", s: "管理画面でボタンを押すと、見積書とメール" },
  { n: "03", t: "承諾・入金", s: "お客様の画面で承諾。発注書と請求書" },
  { n: "04", t: "ロゴ配置の確認", s: "実物写真の配置イメージを承認" },
  { n: "05", t: "タイの工場で製造", s: "タイ語の画面で工程を進め、連絡もできる" },
  { n: "06", t: "日本で検品", s: "スマホでチェックし、検品報告書" },
  { n: "07", t: "発送・完了", s: "追跡番号つきのお知らせ" },
];

const FEATURES = [
  ["ロゴ配置イメージ", "お客様のロゴを、実物の写真に箔押し・素押しの見た目で重ね、修正の依頼と承認までやり取り"],
  ["カラー別の見積と数量割引", "色ごとの数量の合計で、単価が自動で下がる。あと何個で次の割引かも表示"],
  ["SKUとバリエーション", "カラー・サイズを登録しておき、組み合わせごとに品番。製品一覧には丸のカラーピッカー"],
  ["工場とのやり取り", "LINEのような画面。工場にはタイ語、日本には日本語で届く"],
  ["役割と権限", "オーナーだけが権限を変えられる。工場には顧客情報・価格を見せない"],
  ["スマホで完結", "下の小さなメニュー、押しやすい大きさ、文節で折り返す改行"],
];

const TECH = ["Next.js（App Router）", "Supabase（データベース・ログイン・ファイル保存・リアルタイム）", "行レベルの権限（RLS）", "Resend（メールの自動送信）", "@react-pdf（書類のPDF）", "翻訳API（タイ語・英語）"];

export default function Overview() {
  return (
    <main className="min-h-[100svh] bg-white text-ink">
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:px-8 md:pt-24">
        <p className="font-display text-[12px] tracking-[0.4em] text-mute">CRAFT OEM / OVERVIEW</p>
        <h1 className="mt-5 text-[26px] leading-snug font-medium tracking-[0.04em] md:text-[38px]">
          <span className="inline-block">革小物のロゴ入れOEMを、</span><span className="inline-block">集客から納品まで。</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[14px] leading-loose text-mute">
          <span className="inline-block">お客様が見るLPと見積もり、</span><span className="inline-block">社内の管理画面、</span><span className="inline-block">タイの工場とのやり取り、</span><span className="inline-block">お客様の確認画面までを、</span><span className="inline-block">ひとつのサービスとしてつないでいます。</span><span className="inline-block">このページから、すべての画面を確かめられます。</span>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={asset("/")} className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[13px] tracking-[0.1em] text-white transition hover:bg-gold">LPを見る<ArrowUpRight size={15} /></a>
          <a href={asset("/cms/")} className="inline-flex items-center gap-2 border border-ink px-6 py-3.5 text-[13px] tracking-[0.1em] transition hover:bg-ink hover:text-white">管理画面を見る<ArrowUpRight size={15} /></a>
        </div>
        <p className="mt-6 text-[11.5px] text-mute"><NoOrphan text="※ポートフォリオ用の制作サンプルです。会社名・金額・データはすべて架空で、操作した内容は見ている人のブラウザにだけ保存されます。" /></p>
      </header>

      {/* 流れ */}
      <section className="border-y border-line bg-paper py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <p className="font-display text-[12px] tracking-[0.4em] text-mute">FLOW</p>
          <h2 className="mt-3 text-[20px] font-medium tracking-[0.04em] md:text-[24px]">問い合わせから納品までの流れ</h2>
          <ol className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-7">
            {FLOW.map((f) => (
              <li key={f.n} className="bg-white px-4 py-5">
                <p className="font-display text-[13px] tracking-[0.2em] text-gold">{f.n}</p>
                <p className="mt-2 text-[14px] font-medium">{f.t}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-mute"><NoOrphan text={f.s} n={5} /></p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 画面ごと */}
      {GROUPS.map((g) => (
        <section key={g.en} className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-20">
          <p className="font-display text-[12px] tracking-[0.4em] text-mute">{g.en.toUpperCase()}</p>
          <h2 className="mt-3 text-[20px] font-medium tracking-[0.04em] md:text-[24px]">{g.ja}</h2>
          <p className="mt-2 text-[13.5px] text-mute"><NoOrphan text={g.lead} n={5} /></p>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {g.screens.map((s) => (
              <li key={s.title}>
                <a href={asset(s.href)} className="group block">
                  <div className="overflow-hidden rounded-[22px] border border-line bg-[#f4f4f2] p-1.5 shadow-[0_8px_30px_rgba(0,0,0,.06)] transition group-hover:shadow-[0_12px_40px_rgba(0,0,0,.12)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(`/images/overview/${s.img}.webp`)} alt={`${s.title}の画面`} loading="lazy" width={540} height={1052} className="block h-auto w-full rounded-[16px]" />
                  </div>
                  <p className="mt-3.5 flex items-start justify-between gap-2 text-[14px] font-medium leading-snug">
                    <span><Ph>{s.title}</Ph></span><ArrowUpRight size={15} className="mt-0.5 shrink-0 text-mute transition group-hover:text-gold" />
                  </p>
                </a>
                <p className="mt-1 text-[11.5px] text-gold">{s.who}</p>
                <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-ink/75">
                  {s.points.map((x) => <li key={x} className="flex gap-1.5"><span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ink/30" /><span><NoOrphan text={x} n={5} /></span></li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* 主な機能・使う技術 */}
      <section className="border-t border-line bg-paper py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:px-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="font-display text-[12px] tracking-[0.4em] text-mute">FEATURES</p>
            <h2 className="mt-3 text-[20px] font-medium tracking-[0.04em] md:text-[24px]">主な機能</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {FEATURES.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[11em_1fr] sm:gap-4">
                  <dt className="text-[14px] font-medium">{k}</dt>
                  <dd className="text-[13px] leading-relaxed text-ink/75"><NoOrphan text={v} n={5} /></dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="font-display text-[12px] tracking-[0.4em] text-mute">TECH</p>
            <h2 className="mt-3 text-[20px] font-medium tracking-[0.04em] md:text-[24px]">本番で使う仕組み</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {TECH.map((x) => <li key={x} className="rounded-full border border-line bg-white px-3.5 py-2 text-[12.5px]"><Ph>{x}</Ph></li>)}
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-mute">このデモでは、データを見ている人のブラウザに保存しています。各画面の「※本番では」に、本番でどの仕組みを使うかを書いています。</p>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center">
        <p className="font-display text-[13px] tracking-[0.3em]">CRAFT <span className="text-gold">OEM</span></p>
        <p className="mt-2 text-[11px] text-mute">© CRAFT OEM (SAMPLE)</p>
      </footer>
    </main>
  );
}
