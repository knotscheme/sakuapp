"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Download, Eye, ImagePlus, KeyRound, LayoutTemplate, ListChecks, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import Header from "@/components/Header";
import Frame from "@/components/Frame";
import { SAMPLES } from "@/lib/samples";
import { sampleDoc } from "@/lib/sampleDoc";
import { getTemplate } from "@/lib/templates";

const FLOW = [
  { icon: LayoutTemplate, t: "型をえらぶ", b: "化粧品・ものづくり・世界観の3つの型から、商品に合うものを。" },
  { icon: ListChecks, t: "必要な写真がわかる", b: "どんな写真が何枚いるか、AIに渡す指示文と撮り方のコツつきで一覧に。" },
  { icon: ImagePlus, t: "写真を入れる", b: "撮った写真でも、AIで作った画像でもOK。まとめてアップロードできます。" },
  { icon: Eye, t: "プレビューで仕上げ", b: "パソコン・スマホの見え方を確かめながら、文字をその場で直せます。" },
  { icon: Download, t: "ダウンロード", b: "単体のHTML・WordPress・Shopify の3つの形で書き出せます。" },
];

export default function Home() {
  const [docs, setDocs] = useState<Record<string, string>>({});
  useEffect(() => { setDocs(Object.fromEntries(SAMPLES.map((s) => [s.id, sampleDoc(s.id)]))); }, []);
  return (
    <>
      <Header />
      <main>
        {/* ファーストビュー */}
        <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
            <div className="fade-in">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] text-mute ring-1 ring-line"><span className="h-1.5 w-1.5 rounded-full bg-accent" />LP作成の自動化ツール（デモ版です）</p>
              <h1 className="mt-6 text-[clamp(32px,4.6vw,54px)] font-bold leading-[1.35] tracking-[.02em]">型をえらんで、<br />写真を入れるだけ。<br /><span className="text-accent">LPが、できあがる。</span></h1>
              <p className="mt-6 max-w-[34em] text-[15px] leading-[2] text-ink/80">必要な写真と、その撮り方・AIへの指示文まで一覧で案内。入れた写真はその場で切り抜いて差し込み、プレビューで確かめてそのままダウンロードできます。</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/build/" className="btn btn-accent px-7 py-3.5 text-[15px]">LPを作りはじめる<ArrowRight size={17} /></Link>
                <Link href="/works/" className="btn btn-line px-6 py-3.5 text-[15px]">作品例を見る</Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink/75">
                {["登録なし・無料で使える", "作ったものはこの端末だけに保存", "HTML・WordPress・Shopify"].map((x) => <li key={x} className="flex items-center gap-1.5"><Check size={14} className="text-ok" />{x}</li>)}
              </ul>
            </div>
            {/* 作品例を重ねて見せる */}
            <div className="relative h-[380px] sm:h-[460px]">
              {SAMPLES.map((s, i) => (
                <Link key={s.id} href={`/works/?id=${s.id}`} aria-label={`作品例：${s.title}`}
                  className="group absolute overflow-hidden rounded-xl bg-white shadow-[0_24px_60px_-24px_rgba(0,0,0,.35)] ring-1 ring-black/5 transition duration-500 hover:z-10 hover:-translate-y-2"
                  style={{ width: "72%", left: `${i * 14}%`, top: `${i * 12}%`, zIndex: 3 - i }}>
                  <div className="flex h-6 items-center gap-1 border-b border-line bg-[#fafaf8] px-2.5">{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 rounded-full bg-line" />)}</div>
                  <div className="aspect-[16/10]">{docs[s.id] && <Frame html={docs[s.id]} className="h-full w-full" title={s.title} />}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 流れ */}
        <section className="border-y border-line bg-white py-16">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <h2 className="text-[24px] font-bold sm:text-[28px]">5つのステップで完成</h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {FLOW.map(({ icon: Icon, t, b }, i) => (
                <li key={t} className="relative rounded-2xl bg-paper p-5">
                  <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-line"><Icon size={19} /></span><span className="font-display text-[26px] font-semibold text-ink/15">0{i + 1}</span></div>
                  <h3 className="mt-4 text-[15.5px] font-bold">{t}</h3>
                  <p className="mt-1.5 text-[13px] leading-[1.9] text-ink/75">{b}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 作品例 */}
        <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-[24px] font-bold sm:text-[28px]">このツールで作れるLP</h2><p className="mt-2 text-[14px] text-mute">3つの型それぞれに、架空のブランドで作った見本です。見本から作りはじめることもできます。</p></div>
            <Link href="/works/" className="flex items-center gap-1 text-[14px] font-medium hover:underline">作品例をすべて見る<ArrowRight size={15} /></Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SAMPLES.map((s) => {
              const t = getTemplate(s.tpl);
              return (
                <Link key={s.id} href={`/works/?id=${s.id}`} className="group card overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,.4)]">
                  <div className="aspect-[4/3] overflow-hidden border-b border-line">{docs[s.id] && <Frame html={docs[s.id]} className="h-full w-full transition duration-700 group-hover:scale-[1.02]" title={s.title} />}</div>
                  <div className="p-5">
                    <p className="text-[11.5px] font-medium tracking-wider text-accent">{t.name}｜{t.kind}</p>
                    <h3 className="mt-1 text-[16px] font-bold">{s.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-[1.85] text-ink/75">{s.lead}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* AI と費用 */}
        <section className="bg-ink py-16 text-white">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-[12px] tracking-[.2em] text-accent">AUTOMATION</p>
              <h2 className="mt-3 text-[26px] font-bold leading-[1.5] sm:text-[30px]">自分のAIのキーを入れると、<br />文章も写真も自動で。</h2>
              <p className="mt-5 text-[14px] leading-[2] text-white/75">Gemini・ChatGPT・Claude のAPIキーを設定すると、商品の情報からLPの文章を自動で書き、足りない写真もAIで作れます。キーが無くても、指示文をコピーして各社のAIに貼れば同じことができます。</p>
              <Link href="/settings/" className="btn mt-7 bg-white px-6 py-3 text-[14px] text-ink hover:bg-white/90"><Sparkles size={16} />AIを設定する</Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                { icon: KeyRound, t: "キーは端末の中だけ", b: "APIキーはこのブラウザの中にだけ保存し、各社のAIへ直接送ります。LP BUILDER のサーバーには届きません。" },
                { icon: Wallet, t: "ツールの月額は0円", b: "AIの費用は、使った分だけ各社に払う形です。Gemini は無料枠から始められます。" },
                { icon: ShieldCheck, t: "作ったものも端末に", b: "写真や文章はブラウザの中に自動で保存。ダウンロードしたzipから続きも作れます。" },
              ].map(({ icon: Icon, t, b }) => (
                <li key={t} className="rounded-2xl bg-white/[.06] p-5 ring-1 ring-white/10"><Icon size={20} className="text-accent" /><h3 className="mt-3 text-[15px] font-bold">{t}</h3><p className="mt-1.5 text-[12.5px] leading-[1.9] text-white/70">{b}</p></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6">
          <h2 className="text-[24px] font-bold sm:text-[28px]">さっそく、作ってみる</h2>
          <p className="mt-3 text-[14px] text-mute">見本の文章から始めるので、白紙で悩むことはありません。</p>
          <Link href="/build/" className="btn btn-accent mt-7 px-8 py-3.5 text-[15px]">LPを作りはじめる<ArrowRight size={17} /></Link>
        </section>
      </main>
      <footer className="border-t border-line py-8 text-center text-[12px] text-mute">LP BUILDER ※デモ版です。作品例の商品・会社・施設は架空のものです。</footer>
    </>
  );
}
