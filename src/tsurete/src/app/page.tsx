"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import { SAMPLE_URL } from "@/lib/check";
import { BRAND, FIXES, PAGES, shelf } from "@/lib/demo";

const STEPS = [
  { href: "/shindan/", t: "診断する", d: "商品ページのURLか、商品一覧のCSVを入れます。AIに選ばれるために足りないところを調べます。" },
  { href: "/naosu/", t: "書き直す", d: "AIが書き直し案を出します。読んで「反映する」を押すだけです。" },
  { href: "/kouka/", t: "効果を見る", d: "お客様がAIに聞いたとき、すすめられるようになったかを確かめます。" },
];

function Home() {
  const router = useRouter();
  const [url, setUrl] = useState(SAMPLE_URL);
  const base = shelf([]), full = shelf(FIXES.map((f) => f.id));
  const pg = PAGES.lotion;
  return (
    <>
      <section className="mx-auto max-w-[44rem] pt-4 text-center sm:pt-10">
        <p className="text-[0.85rem] font-bold tracking-[.12em] text-ai">ネットショップのための AI集客ツール</p>
        <h1 className="mt-6 text-[2rem] font-bold leading-[1.55] tracking-[.06em] sm:text-[2.8rem]"><span className="inline-block">AIにすすめられる</span><span className="inline-block">商品ページへ。</span></h1>
        <p className="mx-auto mt-6 max-w-[34em] text-[0.98rem] leading-[2.1] text-sub">お客様は、ChatGPTに「おすすめの化粧水は？」と聞いて買い物をし始めています。URLを入れるだけで、AIに選ばれるために足りないところと、書き直し案をお出しします。</p>
        <form onSubmit={(e) => { e.preventDefault(); router.push(`/shindan/?url=${encodeURIComponent(url)}`); }} className="mx-auto mt-10 flex max-w-[36rem] flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="u">商品ページのURL</label>
          <input id="u" value={url} onChange={(e) => setUrl(e.target.value)} className="field num" inputMode="url" />
          <button type="submit" className="btn btn-ai shrink-0 px-8">無料で診断する</button>
        </form>
        <p className="mt-4 text-[0.82rem] text-sub">商品が多いときは <Link href="/shindan/?csv=1" className="text-ai underline underline-offset-4">CSVでまとめて診断</Link></p>
      </section>

      <section className="mt-28 sm:mt-36" aria-labelledby="st">
        <h2 id="st" className="text-center text-[1.3rem] font-bold tracking-[.06em]">使い方は3つ</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {STEPS.map((s, i) => (
            <li key={s.href} className="border-t hair pt-6">
              <p className="num text-[0.8rem] text-ai">0{i + 1}</p>
              <Link href={s.href} className="group mt-2 flex items-center gap-2 text-[1.15rem] font-bold">{s.t}<ArrowRight size={18} className="text-ai transition group-hover:translate-x-1" /></Link>
              <p className="mt-3 text-[0.9rem] leading-[2] text-sub">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-28 sm:mt-36" aria-labelledby="ba">
        <h2 id="ba" className="text-center text-[1.3rem] font-bold tracking-[.06em]">書き直すと、こう変わります</h2>
        <p className="mt-3 text-center text-[0.85rem] text-sub">見本：{BRAND.name} 化粧水 しっとり</p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="card p-7 sm:p-9">
            <p className="text-[0.8rem] font-bold text-sub">いまの商品説明</p>
            <p className="mt-4 text-[0.95rem] leading-[2.1] text-sub">{pg.target[0]}</p>
            <p className="mt-10 text-[0.8rem] text-sub">AIのおすすめに出る</p>
            <p className="num mt-1 text-[2.4rem] leading-none text-warn">{base.pct}%</p>
          </div>
          <div className="card p-7 ring-1 ring-ai/40 sm:p-9">
            <p className="text-[0.8rem] font-bold text-ai">AIが書き直した後</p>
            <p className="mt-4 text-[0.95rem] leading-[2.1]">{pg.target[1]}</p>
            <ul className="mt-5 space-y-1.5 text-[0.86rem]">{["無香料・アルコールフリーと明記", "1日あたり約55円と明記", "よくある質問を3つ追加"].map((t) => <li key={t} className="flex items-center gap-2"><Check size={15} className="text-ai" />{t}</li>)}</ul>
            <p className="mt-8 text-[0.8rem] text-sub">AIのおすすめに出る</p>
            <p className="num mt-1 text-[2.4rem] leading-none text-ai">{full.pct}%</p>
          </div>
        </div>
        <p className="mt-6 text-center text-[0.78rem] text-sub">数字は、架空のブランド {BRAND.name} での模擬の結果です。AIにすすめられることは保証できません。</p>
      </section>

      <section className="mt-28 text-center sm:mt-36">
        <Link href="/guide/" className="text-[0.9rem] text-sub underline underline-offset-4 hover:text-ai">はじめての方は、使い方ガイドへ</Link>
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Home /></Ready></Shell>; }
