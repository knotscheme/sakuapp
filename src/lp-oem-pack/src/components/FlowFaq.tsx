"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

import { FLOW, RULES } from "@/lib/packs";

const FAQ = [
  { q: "クラファンが|目標に届かなかったら|どうなりますか？", a: "All-or-Nothing 方式なら支援金は返金され、本生産は行いません。プラン料金のうちサンプル・撮影・LP制作の費用はかかりますが、本生産分（50個）は次の挑戦や一般販売に回せるようご相談します。" },
  { q: "既存の型ではなく、|ゼロから作れますか？", a: "可能ですが、型紙から起こすとサンプルの修正が増え、期間と費用がかかります。まずは定番の型（ベースモデル）をもとに、内装・ステッチ・パーツをアレンジする方法（プレミアム）をおすすめしています。" },
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
        <ol className="mx-auto max-w-3xl border-l border-line">
          {FLOW.map((s, i) => (
            <li key={s.t} className="reveal relative pb-9 pl-8 last:pb-0" style={{ transitionDelay: `${i * 0.06}s` }}>
              <span className="absolute top-0.5 -left-[11px] flex h-[22px] w-[22px] items-center justify-center rounded-full border border-ink bg-white font-num text-[11px]">{i + 1}</span>
              <p className="flex flex-wrap items-baseline gap-x-3"><span className="text-[16px] font-medium">{s.t}</span><span className="text-[12px] text-gold">{s.d}</span></p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute"><NoOrphan text={s.b} /></p>
            </li>
          ))}
        </ol>

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
