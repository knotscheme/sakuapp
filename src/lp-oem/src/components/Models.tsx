"use client";

import { Calculator, MapPin, Ruler, Sparkles } from "lucide-react";
import { MODELS, yen } from "@/lib/models";
import { useLp } from "./LpContext";
import SectionTitle from "./SectionTitle";
import { asset } from "@/lib/asset";
import Tilt from "./Tilt";

export default function Models() {
  const { model, chooseModelAndScroll } = useLp();
  return (
    <section id="models" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionTitle en="Base Models" ja="ベースモデル" sub="販売実績のある|4つの定番型から|選べます。" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MODELS.map((m, i) => {
            const active = m.id === model;
            return (
              <div key={m.id} className="reveal h-full" style={{ transitionDelay: `${i * 0.08}s` }}>
              <Tilt className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,.35)] ${active ? "border-gold" : "border-line"}`}>
                <div className="relative overflow-hidden bg-white">
                  <span className="absolute top-3 left-3 z-10 rounded-full bg-ink px-2.5 py-1 font-display text-[11px] tracking-widest text-gold-2">MODEL {String(i + 1).padStart(2, "0")}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(m.img)} alt={m.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[18px] leading-snug font-bold">{m.short}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-mute">{m.feature}</p>
                  <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-[13px]">
                    <div className="flex gap-2"><Ruler size={15} className="mt-0.5 shrink-0 text-gold" /><dt className="sr-only">サイズ</dt><dd>{m.size}</dd></div>
                    <div className="flex gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-gold" /><dt className="sr-only">ロゴ入れ推奨位置</dt><dd>ロゴ位置：{m.logo}</dd></div>
                    <div className="flex gap-2"><Sparkles size={15} className="mt-0.5 shrink-0 text-gold" /><dt className="sr-only">参考仕入れ単価</dt><dd>参考単価 <b className="text-[15px] text-ink">{yen(m.unitPrice)}〜</b></dd></div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => chooseModelAndScroll(m.id)}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-ink py-3 text-[13.5px] font-bold transition group-hover:bg-ink group-hover:text-white"
                  >
                    <Calculator size={16} />
                    このモデルで利益計算する
                  </button>
                </div>
              </Tilt>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-mute">※参考単価はロゴ加工（素押し）込み・30個発注時の目安です。</p>
      </div>
    </section>
  );
}
