"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ALL_MODELS, COLORS, MIN_LOT, PLATE_COST, yen } from "@/lib/models";
import { imgSrc, useCatalog } from "./cms/catalog";
import NoOrphan from "./NoOrphan";

const HOME = "/sakuapp/works/lp-oem/";

// 製品一覧：分類で絞り込み、各モデルからシミュレーター・相談へ進める
export default function ProductList() {
  // 管理画面の「商品管理」で登録・公開した商品を表示する
  const { cats, products } = useCatalog();
  const shown = products.filter((p) => p.visible);
  const [cat, setCat] = useState("all");
  const list = shown.filter((m) => cat === "all" || m.cat === cat);
  const tabs = [{ id: "all", name: "すべて" }, ...cats.filter((c) => shown.some((p) => p.cat === c.id))];
  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? "";
  const inSim = (id: string) => ALL_MODELS.some((m) => m.id === id);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line">
        <div className="flex gap-7" role="tablist" aria-label="製品の分類">
          {tabs.map((c) => {
            const n = c.id === "all" ? shown.length : shown.filter((m) => m.cat === c.id).length;
            return (
              <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}
                className={`-mb-px border-b pb-3 text-[14px] transition ${cat === c.id ? "border-ink text-ink" : "border-transparent text-mute hover:text-ink"}`}>
                {c.name}<span className="ml-1.5 font-display text-[12px] text-mute">{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <li key={m.id} className="fade-up group">
            <a href={inSim(m.id) ? `${HOME}?model=${m.id}#simulator` : `${HOME}?model=${m.id}#contact`} className="block overflow-hidden bg-paper" aria-label={`${m.short}の利益を計算する`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgSrc(m.img)} alt={m.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]" />
            </a>
            <p className="mt-5 text-[11.5px] tracking-[0.2em] text-mute">{catName(m.cat)}</p>
            <h2 className="mt-1.5 text-[19px] font-medium">{m.short}</h2>
            {m.name !== m.short && <p className="mt-0.5 text-[12px] text-mute">{m.name}</p>}
            <p className="mt-3 text-[13.5px] leading-relaxed text-mute"><NoOrphan text={m.feature} /></p>
            <dl className="mt-5 space-y-1.5 border-t border-line pt-5 text-[12.5px]">
              {[["サイズ", m.size], ["ロゴ位置", m.logo], ["革の色", COLORS], ["最小ロット", `${MIN_LOT}個から`]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex gap-3"><dt className="w-16 shrink-0 text-mute">{k}</dt><dd className="text-ink">{v.split("・").map((t, i, arr) => <span key={t} className="inline-block">{t}{i < arr.length - 1 ? "・" : ""}</span>)}</dd></div>
              ))}
            </dl>
            <p className="mt-5 text-[12px] text-mute">参考単価<span className="ml-2 text-[20px] font-medium text-ink">{yen(m.unitPrice)}〜</span></p>
            <div className="mt-5 flex items-center gap-6">
              <a href={`${HOME}?model=${m.id}#contact`} className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-[12.5px] tracking-[0.1em] text-white transition hover:bg-gold">
                このモデルで相談 <ArrowRight size={14} />
              </a>
              {inSim(m.id) && <a href={`${HOME}?model=${m.id}#simulator`} className="border-b border-ink/40 pb-0.5 text-[12.5px] text-ink transition hover:border-gold hover:text-gold">利益を計算</a>}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-16 text-center text-[12px] leading-relaxed text-mute">
        <span className="inline-block">※参考単価はロゴ加工（素押し）込み・</span><span className="inline-block">{MIN_LOT}個発注時の目安です。</span>
        <span className="inline-block">型代は0円、</span><span className="inline-block">ロゴの版代{yen(PLATE_COST)}（初回のみ）が別途かかります。</span>
      </p>
    </>
  );
}
