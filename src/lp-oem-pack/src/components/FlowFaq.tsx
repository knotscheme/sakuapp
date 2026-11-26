"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

import { FLOW, RULES } from "@/lib/packs";
import { asset } from "@/lib/asset";

const FAQ = [
  { q: "クラファンが|目標に届かなかったら|どうなりますか？", a: "All-or-Nothing 方式なら支援金は返金され、本生産は行いません。プラン料金のうちサンプル・撮影・LP制作の費用はかかりますが、本生産分（50個）は次の挑戦や一般販売に回せるようご相談します。" },
  { q: "既存の型の製品で|クラファンに|出せますか？", a: "多くのクラファンサイトでは、まだ世に出ていない新しい製品であることが求められるため、既存の型の製品は掲載できないことがほとんどです。そのため、パッケージはすべてオリジナル設計で、型紙・抜き型から起こします（料金に込み）。" },
  { q: "型紙や抜き型は|誰のものですか？", a: "あなた専用として保管し、ほかのお客様の製品には使いません。追加生産や、クラファン後の一般販売でそのままお使いいただけます。" },
  { q: "過去にクラファンで|成功した製品と|同じものを作れますか？", a: "いいえ。過去のプロジェクトの製品や型を販売・公開することはありません。お客様ごとに、定番の型をもとにオリジナルの製品をおつくりします。お伝えするのは、売り方・見せ方のノウハウです。" },
  { q: "LPやコピーの|権利はどうなりますか？", a: "納品したLP・写真・文章は、クラファン後の自社ECや広告にも自由にお使いいただけます。" },
  { q: "最低ロット数は|何個からですか？", a: "パッケージは本生産50個を含みます。OEMのみのご依頼は1モデル30個から。シュリンクレザーは300個からなど、革によって異なります。" },
  { q: "ロゴデータは|どの形式で|送ればいいですか？", a: "Illustrator（.ai）またはPDF・SVGが最適です。画像（PNG・JPG）しかない場合もトレースしてデータ化します。ロゴなしの無地でも作れます。" },
  { q: "打ち合わせは|ありますか？", a: "基本はチャットで完結します。日程調整を待たずに進められるので、スケジュールが遅れにくくなります。必要な場合はオンラインでもご相談いただけます。" },
  { q: "支払いの|タイミングは？", a: "ご契約時に50%、サンプル承認時に50%です。追加生産やShopify構築は、それぞれのご依頼時にお見積もりします。" },
];

export default function FlowFaq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Flow" ja="ご相談から|一般販売までの|流れ" sub="期間はプランや数量によって|前後します。" />
        {/* 縦のタイムライン：左に線と時期（目安）、右に写真カード */}
        <ol className="relative mx-auto max-w-3xl">
          <span aria-hidden className="absolute top-2 bottom-2 left-[52px] w-px bg-gradient-to-b from-gold via-line to-line md:left-[84px]" />
          {FLOW.map((s, i) => (
            <li key={s.t} className="reveal relative grid grid-cols-[52px_1fr] gap-x-5 pb-8 last:pb-0 md:grid-cols-[84px_1fr] md:gap-x-10 md:pb-12">
              <div className="relative pr-3 text-right md:pr-6">
                <p className="text-[9.5px] tracking-[0.2em] text-mute">{s.at?.[0]}</p>
                <p className="font-num text-[26px] leading-none font-light md:text-[34px]">{s.at?.[1]}</p>
                <span aria-hidden className={`absolute top-1 -right-[5px] h-[11px] w-[11px] rounded-full border-2 ${i === 0 ? "border-gold bg-gold" : "border-gold bg-white"}`} />
              </div>
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {s.img && <img src={asset(s.img)} alt="" loading="lazy" className="h-full w-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] text-ink">{s.d}</span>
                  <p className="absolute inset-x-0 bottom-0 p-3.5 text-[16px] leading-snug font-medium text-white md:p-5 md:text-[19px]"><span className="mr-2 font-num text-[13px] text-gold">{String(i + 1).padStart(2, "0")}</span>{s.t}</p>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-mute"><NoOrphan text={s.b} /></p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-[11.5px] text-mute">※時期は、ご相談からの目安です（クラファンの期間やロット数で前後します）。</p>

        <div className="mt-28">
          <SectionTitle en="Rules" ja="はじめに決めておく、|安心のルール" sub="やり取りや修正が膨らまないように、|最初に約束しておきます。" />
          <dl className="mx-auto grid max-w-4xl gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {RULES.map((r) => (
              <div key={r.k} className="reveal bg-white p-6">
                <dt className="text-[12px] tracking-[0.1em] text-gold">{r.k}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed"><NoOrphan text={r.v} /></dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-32">
          <SectionTitle en="FAQ" ja="よくある質問" />
          <div className="mx-auto max-w-3xl border-t border-line">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="reveal border-b border-line">
                  <button type="button" className="flex w-full items-center gap-6 py-7 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                    <span className="flex-1 text-[15.5px]">{f.q.split("|").map((t) => <span key={t} className="inline-block">{t}</span>)}</span>
                    <Plus size={18} strokeWidth={1.4} className={`shrink-0 text-mute transition duration-500 ${isOpen ? "rotate-45 text-ink" : ""}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="pb-7 text-[14px] leading-loose text-mute"><NoOrphan text={f.a} /></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
