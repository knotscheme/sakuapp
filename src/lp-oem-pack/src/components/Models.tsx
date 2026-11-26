"use client";

import { ArrowRight } from "lucide-react";
import { ALL_MODELS, yen, type ModelId } from "@/lib/models";
import { imgSrc, useLpProducts } from "./cms/catalog";
import { useLp } from "./LpContext";
import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

export default function Models() {
  const { chooseModelAndScroll, sendBrandToContact } = useLp();
  // 商品管理で「LPに出す」にした公開中の商品を、LPの表示順で出す
  const MODELS = useLpProducts();
  // 利益シミュレーターがある商品は「利益を計算」、ない商品（管理画面で追加した商品）は「この商品で相談」
  const sim = (id: string) => ALL_MODELS.some((x) => x.id === id);
  const go = (m: (typeof MODELS)[number]) => (sim(m.id) ? chooseModelAndScroll(m.id as ModelId) : sendBrandToContact(`【ご希望モデル】${m.name}`));
  return (
    <section id="models" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Base Models" ja="実績のある型を、|あなたの|オリジナルに。" sub="型から起こさず、|革・色・ステッチ・刻印・内装で|アレンジ。サンプルが1回で|決まりやすい作り方です。" />
        {/* 並びや数は読み込み後に変わるので、ふわっと出すのは一覧ごとにする */}
        <div className="reveal grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {MODELS.map((m, i) => (
            <article key={m.id} className="group">
              <button type="button" onClick={() => go(m)} className="block w-full overflow-hidden bg-paper" aria-label={sim(m.id) ? `${m.name}で利益計算する` : `${m.name}で相談する`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgSrc(m.img)} alt={m.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]" />
              </button>
              <p className="mt-5 font-display text-[12px] tracking-[0.3em] text-mute">MODEL {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1.5 text-[18px] font-medium">{m.short}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-mute"><NoOrphan text={m.feature} /></p>
              <dl className="mt-4 space-y-1 text-[12.5px] text-mute">
                <div className="flex gap-2"><dt className="w-16 shrink-0">サイズ</dt><dd className="whitespace-nowrap">{m.size}</dd></div>
                <div className="flex gap-2"><dt className="w-16 shrink-0">ロゴ位置</dt><dd>{m.logo}</dd></div>
              </dl>
              <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                <p className="text-[12px] text-mute">参考単価<span className="ml-2 text-[17px] font-medium text-ink">{yen(m.unitPrice)}〜</span></p>
                <button type="button" onClick={() => go(m)} className="inline-flex items-center gap-1 text-[12.5px] text-ink transition hover:text-gold">
                  {sim(m.id) ? "利益を計算" : "この商品で相談"} <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-14 text-center"><a href="products/" className="group inline-flex items-center gap-3 border border-ink px-8 py-3.5 text-[13px] tracking-[0.12em] text-ink transition hover:bg-ink hover:text-white">製品一覧を見る <ArrowRight size={15} className="transition group-hover:translate-x-1" /></a></div>
        <p className="mt-8 text-center text-[12px] text-mute"><span className="inline-block">※参考単価はロゴ加工（素押し）込み・</span><span className="inline-block">30個発注時の目安です。</span></p>
      </div>
    </section>
  );
}
