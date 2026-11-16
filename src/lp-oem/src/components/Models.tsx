"use client";

import { ArrowRight } from "lucide-react";
import { MODELS, yen } from "@/lib/models";
import { asset } from "@/lib/asset";
import { useLp } from "./LpContext";
import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

export default function Models() {
  const { chooseModelAndScroll } = useLp();
  return (
    <section id="models" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Base Models" ja="ベースモデル" sub="販売実績のある|定番型から|選べます。" />
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {MODELS.map((m, i) => (
            <article key={m.id} className="reveal group" style={{ transitionDelay: `${i * 0.08}s` }}>
              <button type="button" onClick={() => chooseModelAndScroll(m.id)} className="block w-full overflow-hidden bg-paper" aria-label={`${m.name}で利益計算する`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(m.img)} alt={m.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]" />
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
                <button type="button" onClick={() => chooseModelAndScroll(m.id)} className="inline-flex items-center gap-1 text-[12.5px] text-ink transition hover:text-gold">
                  利益を計算 <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
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
