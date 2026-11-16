"use client";

import { useState } from "react";
import { asset } from "@/lib/asset";
import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

type Finish = "plain" | "gold" | "silver";
const FINISHES: { id: Finish; img: string; name: string; en: string; body: string }[] = [
  { id: "plain", img: "finish-blind", name: "素押し", en: "Blind", body: "熱と圧で革そのものに刻む、控えめで上品な仕上げ。使うほどに馴染みます。" },
  { id: "gold", img: "finish-gold", name: "金箔押し", en: "Gold foil", body: "真鍮色の箔で、ロゴを華やかに。ギフト向けのブランドに選ばれています。" },
  { id: "silver", img: "finish-silver", name: "銀箔押し", en: "Silver foil", body: "シャープで洗練された印象に。ネイビーやブラックの革と相性のよい仕上げです。" },
];

export default function Options() {
  const [f, setF] = useState<Finish>("gold");
  const cur = FINISHES.find((x) => x.id === f)!;
  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Logo Finish" ja="ロゴ加工" sub="加工ひとつで、|印象は大きく|変わります。" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div className="reveal-l relative aspect-[1408/768] overflow-hidden">
            {FINISHES.map((x) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={x.id} src={asset(`/images/${x.img}.webp`)} alt={`${x.name}のロゴ`} loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ${f === x.id ? "scale-100 opacity-100" : "scale-[1.05] opacity-0"}`} />
            ))}
            {f !== "plain" && <span key={f} className="foil-sweep" aria-hidden />}
          </div>

          <div className="reveal-r">
            <div className="flex gap-8 border-b border-line" role="tablist" aria-label="ロゴ加工の種類">
              {FINISHES.map((x) => (
                <button key={x.id} role="tab" aria-selected={f === x.id} onClick={() => setF(x.id)}
                  className={`-mb-px border-b pb-3 text-[15px] transition ${f === x.id ? "border-ink text-ink" : "border-transparent text-mute hover:text-ink"}`}>
                  {x.name}
                </button>
              ))}
            </div>
            <p className="mt-8 font-display text-[13px] tracking-[0.3em] text-gold uppercase">{cur.en}</p>
            <p key={cur.id} className="fade-up mt-3 min-h-[4em] text-[15px] leading-loose text-ink"><NoOrphan text={cur.body} /></p>

            <div className="mt-12 flex items-center gap-5 border-t border-line pt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/images/giftbox.webp")} alt="ロゴ入りの白い化粧箱に入った革財布" loading="lazy" className="h-20 w-32 shrink-0 object-cover" />
              <div>
                <p className="text-[12px] tracking-widest text-mute">OPTION</p>
                <p className="mt-1 text-[15px] font-medium">オリジナル化粧箱</p>
                <p className="mt-1 text-[13px] leading-relaxed text-mute"><span className="inline-block">ロゴ入りの箱で、</span><span className="inline-block">開けた瞬間から</span><span className="inline-block">ブランドの</span><span className="inline-block">世界観を。</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="reveal mx-auto mt-24 max-w-2xl border-t border-line pt-10 text-center">
          <p className="text-[12px] tracking-widest text-mute">SPECIAL ORDER</p>
          <p className="mt-3 text-[17px] font-medium"><span className="inline-block">完全オリジナル設計</span><span className="inline-block">（ODM）も対応</span></p>
          <p className="mt-3 text-[13.5px] leading-loose text-mute">
            ポケット配置の変更や、オリジナルの型作成も可能です（別途、型代・設計費がかかります）。<br className="hidden md:block" />
            まずは手軽なロゴ入れOEMから始められるお客様が9割です。
          </p>
          <a href="#contact" className="mt-5 inline-block border-b border-ink pb-0.5 text-[13px] transition hover:border-gold hover:text-gold">ODMについて相談する</a>
        </div>
      </div>
    </section>
  );
}
