"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Shell";
import Ready from "@/components/Ready";
import { SAMPLE_URL } from "@/lib/check";
import { BRAND, shelf } from "@/lib/demo";
import { PLATFORMS } from "@/lib/platforms";
import { useStore } from "@/lib/store";

const STEPS = [
  { href: "/hakaru/", t: "測る", d: "お客様が聞きそうな質問を、ChatGPTなど4つのAIに毎週何度も聞きます。あなたの商品が何回すすめられたか、どの店に負けているかを記録します。" },
  { href: "/naosu/", t: "直す", d: "よくすすめられている店との差を、AIが商品ページの書き直し案にします。全商品まとめて、お店のサイトに合った方法で届けます。" },
  { href: "/kouka/", t: "売上で確かめる", d: "AIにすすめられて来たお客様と、その売上を数えます。直した効果を、お金で確かめられます。" },
];
const VS = [
  ["AIに1回聞く", "4つのAIに、何十通りの質問を、毎週何百回も聞いて記録"],
  ["自分の商品だけを見る", "よくすすめられている店のページと比べて、差を出す"],
  ["1商品ずつコピペ", "全商品まとめて、サイトに合わせて書きかえ・CSV・フィード"],
  ["効いたか分からない", "AI経由の売上で、効果を確かめる"],
];

function Lp() {
  const router = useRouter();
  const s = useStore();
  const [url, setUrl] = useState(SAMPLE_URL);
  const sh = shelf(s.applied);
  return (
    <>
      <section className="mx-auto max-w-[46rem] pt-4 text-center sm:pt-10">
        <p className="text-[0.85rem] font-bold tracking-[.12em] text-ai">ネットショップのための AI集客ツール</p>
        <h1 className="mt-6 text-[2rem] font-bold leading-[1.55] tracking-[.06em] sm:text-[2.8rem]"><span className="inline-block">AIの売り場で、</span><span className="inline-block">あなたの商品は何番目？</span></h1>
        <p className="mx-auto mt-6 max-w-[34em] text-[0.98rem] leading-[2.1] text-sub">お客様は、ChatGPTに「おすすめの化粧水は？」と聞いて買い物をし始めています。TSURETEは、AIにすすめられている回数を毎週はかり、負けている理由を見つけて、全商品の商品ページをまとめて直します。</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-ai px-8">デモを使ってみる<ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[40rem] text-center" aria-label="いまの結果">
        <p className="text-[0.82rem] text-sub">たとえば、デモのブランド {BRAND.name} の今週のAI推薦率は</p>
        <p className="mt-2"><b className="num text-[3.4rem] leading-none text-ai">{sh.pct}</b><span className="ml-1 text-sub">%</span></p>
      </section>

      <section className="mt-28 sm:mt-36" aria-labelledby="st">
        <h2 id="st" className="text-center text-[1.3rem] font-bold tracking-[.06em]">測る・直す・売上で確かめる</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {STEPS.map((x, i) => (
            <li key={x.href} className="border-t hair pt-6">
              <p className="num text-[0.8rem] text-ai">0{i + 1}</p>
              <p className="mt-2 text-[1.15rem] font-bold">{x.t}</p>
              <p className="mt-3 text-[0.9rem] leading-[2] text-sub">{x.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-28 sm:mt-36" aria-labelledby="vs">
        <h2 id="vs" className="text-center text-[1.3rem] font-bold tracking-[.06em]">AIに自分で聞くのと、何が違う？</h2>
        <ul className="mx-auto mt-12 max-w-[48rem] border-t hair">
          {VS.map(([a, b]) => (
            <li key={a} className="grid gap-1 border-b hair py-5 sm:grid-cols-[12rem_auto_1fr] sm:items-center sm:gap-6">
              <span className="text-[0.88rem] text-sub">{a}</span><ArrowRight size={16} className="hidden text-sub sm:block" /><b className="text-[0.95rem]">{b}</b>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-28 sm:mt-36" aria-labelledby="sites">
        <h2 id="sites" className="text-center text-[1.3rem] font-bold tracking-[.06em]">どのサイトでも使えます</h2>
        <p className="mx-auto mt-4 max-w-[36em] text-center text-[0.9rem] leading-[2] text-sub">測るのはサイトに何も入れずにできます。直すときは、サイトに合わせて「自動で書きかえ」「CSVで一括」「コピー」「商品フィード」から届け方を選びます。</p>
        <p className="mx-auto mt-10 flex max-w-[44rem] flex-wrap justify-center gap-x-6 gap-y-3 text-[0.92rem] font-bold text-sub">{PLATFORMS.map((p) => <span key={p.id}>{p.name}</span>)}</p>
      </section>

      <section className="mx-auto mt-28 max-w-[36rem] text-center sm:mt-36" aria-labelledby="try">
        <h2 id="try" className="text-[1.3rem] font-bold tracking-[.06em]">まずは1商品、無料で診断</h2>
        <form onSubmit={(e) => { e.preventDefault(); router.push(`/shindan/?url=${encodeURIComponent(url)}`); }} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="u">商品ページのURL</label>
          <input id="u" value={url} onChange={(e) => setUrl(e.target.value)} className="field num" inputMode="url" />
          <button type="submit" className="btn btn-ai shrink-0 px-8">診断する</button>
        </form>
        <p className="mt-4 text-[0.82rem] text-sub">商品が多いときは <Link href="/shindan/?csv=1" className="text-ai underline underline-offset-4">CSVでまとめて診断</Link></p>
        <p className="mt-12 text-[0.78rem] leading-[1.9] text-sub">数字は、架空のブランド {BRAND.name} での模擬の結果です。AIにすすめられることは保証できません。</p>
      </section>
    </>
  );
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1080px] items-center px-5 sm:px-8"><Logo href="/lp/" /><Link href="/" className="ml-auto text-[0.86rem] font-bold text-ai">デモを使う</Link></div>
      </header>
      <main className="mx-auto w-full max-w-[1080px] flex-1 px-5 pb-24 pt-10 sm:px-8 sm:pt-16"><Ready><Lp /></Ready></main>
      <footer className="mx-auto w-full max-w-[1080px] px-5 sm:px-8"><div className="flex flex-col gap-3 border-t hair py-10 text-[0.78rem] text-sub sm:flex-row sm:items-center sm:justify-between"><Logo href="/lp/" /><span>TSURETE はデモです。数字は架空のブランドでの模擬の結果です。</span></div></footer>
    </div>
  );
}
