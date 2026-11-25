"use client";

import { useState } from "react";
import { ArrowRight, Images, Play } from "lucide-react";
import { ALL_MODELS, COLORS, yen } from "@/lib/models";
import { usePricing } from "@/lib/pricing";
import { imgSrc, leathersOf, swatchOf, useCatalog, type ColorDef, type LeatherDef } from "./cms/catalog";
import NoOrphan from "./NoOrphan";
import Gallery from "./Gallery";
import type { Product } from "./cms/catalog";

const HOME = "/sakuapp/works/lp-oem/";

// 製品一覧：分類で絞り込み、各モデルからシミュレーター・相談へ進める
// 商品管理で登録したバリエーション（取り扱うものだけ）を、種類ごとに「ブラック・キャメル」のように並べる
function optionRows(m: Product): [string, string][] {
  const opts = m.options ?? [];
  if (!opts.length) return [["革の色", COLORS]];
  // カラーは丸のカラーピッカーで出す
  const vs = (m.variants ?? []).filter((v) => v.visible);
  return opts.map((o, i) => (o.kind === "color" ? ["", ""] : [o.name, o.values.filter((val) => vs.some((v) => v.values[i] === val)).join("・")]) as [string, string]).filter(([, v]) => v);
}

function colorChoices(m: Product, colors: ColorDef[]) {
  const i = (m.options ?? []).findIndex((o) => o.kind === "color");
  if (i < 0) return [];
  const out: { name: string; c?: ColorDef }[] = [];
  for (const v of (m.variants ?? []).filter((x) => x.visible)) {
    const name = v.values[i];
    if (!out.some((x) => x.name === name)) out.push({ name, c: swatchOf(colors, m, v) });
  }
  return out;
}

// 小さな丸のカラーピッカー（押すと選んだ色の名前が出て、そのまま相談できる）
function ColorPick({ m, colors, value, onChange }: { m: Product; colors: ColorDef[]; value?: string; onChange: (v?: string) => void }) {
  const list = colorChoices(m, colors);
  if (!list.length) return null;
  const label = m.options?.find((o) => o.kind === "color")?.name ?? "カラー";
  return (
    <div className="mt-5">
      <p className="text-[12px] text-mute">{label}<span className="ml-2 text-ink">{value ?? `${list.length}色`}</span></p>
      <div className="mt-2.5 flex flex-wrap gap-3" role="radiogroup" aria-label={label}>
        {list.map((x) => (
          <button key={x.name} type="button" role="radio" aria-checked={value === x.name} aria-label={x.name} title={x.name} onClick={() => onChange(value === x.name ? undefined : x.name)}
            className={`h-6 w-6 rounded-full transition ${value === x.name ? "ring-2 ring-ink ring-offset-2" : "ring-1 ring-black/15 hover:ring-black/40"}`} style={{ background: x.c?.hex ?? "#ccc" }} />
        ))}
      </div>
    </div>
  );
}

// 革素材のえらび（2種類以上あるときだけ）。上乗せのある革は「+800円」のように出す
function LeatherPick({ list, value, onChange }: { list: LeatherDef[]; value?: string; onChange: (v?: string) => void }) {
  if (list.length < 2) return null;
  const cur = list.find((l) => l.id === value) ?? list[0];
  return (
    <div className="mt-4">
      <p className="text-[12px] text-mute">革素材<span className="ml-2 text-ink">{cur.name}</span></p>
      <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label="革素材">
        {list.map((l) => (
          <button key={l.id} type="button" role="radio" aria-checked={cur.id === l.id} onClick={() => onChange(l.id)}
            className={`flex items-center gap-1.5 border py-1 pr-2.5 pl-1 text-[11.5px] transition ${cur.id === l.id ? "border-ink bg-ink text-white" : "border-line text-ink/80 hover:border-ink"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {l.img && <img src={imgSrc(l.img)} alt="" className="h-6 w-8 object-cover" />}
            {l.name.replace(/（標準）$/, "")}{l.add > 0 && <span className={cur.id === l.id ? "ml-1 text-white/70" : "ml-1 text-mute"}>+{yen(l.add)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductList() {
  const { minLot: MIN_LOT, plate: PLATE_COST } = usePricing();
  // 管理画面の「商品管理」で登録・公開した商品を表示する
  const { cats, products, colors, leathers } = useCatalog();
  const [picked, setPicked] = useState<Record<string, string | undefined>>({});
  const [pickedL, setPickedL] = useState<Record<string, string | undefined>>({});
  const shown = products.filter((p) => p.visible);
  const [cat, setCat] = useState("all");
  const list = shown.filter((m) => cat === "all" || m.cat === cat);
  const tabs = [{ id: "all", name: "すべて" }, ...cats.filter((c) => shown.some((p) => p.cat === c.id))];
  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? "";
  const inSim = (id: string) => ALL_MODELS.some((m) => m.id === id);
  const [view, setView] = useState<Product | null>(null);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line">
        <div className="flex gap-7" role="tablist" aria-label="製品の分類">
          {tabs.map((c) => {
            const n = c.id === "all" ? shown.length : shown.filter((m) => m.cat === c.id).length;
            return (
              <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}
                className={`-mb-px border-b pb-3 text-[14px] transition ${cat === c.id ? "border-ink text-ink" : "border-transparent text-mute hover:text-ink"}`}>
                {c.name}<span className="ml-1.5 font-num text-[11.5px] text-mute">{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <li key={m.id} className="fade-up group">
            <button type="button" onClick={() => setView(m)} className="relative block w-full overflow-hidden bg-paper" aria-label={`${m.short}の写真を見る`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgSrc(m.img)} alt={m.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]" />
              {((m.subImgs?.length ?? 0) > 0 || m.video) && (
                <span className="absolute right-3 bottom-3 flex items-center gap-2 bg-white/85 px-2.5 py-1 text-[11px] text-ink backdrop-blur">
                  {(m.subImgs?.length ?? 0) > 0 && <span className="flex items-center gap-1"><Images size={12} />{(m.subImgs?.length ?? 0) + 1}</span>}
                  {m.video && <span className="flex items-center gap-1"><Play size={11} />動画</span>}
                </span>
              )}
            </button>
            <p className="mt-5 text-[11.5px] tracking-[0.2em] text-mute">{catName(m.cat)}</p>
            <h2 className="mt-1.5 text-[19px] font-medium">{m.short}</h2>
            {m.name !== m.short && <p className="mt-0.5 text-[12px] text-mute">{m.name}</p>}
            <p className="mt-3 text-[13.5px] leading-relaxed text-mute"><NoOrphan text={m.feature} /></p>
            <ColorPick m={m} colors={colors} value={picked[m.id]} onChange={(v) => setPicked((x) => ({ ...x, [m.id]: v }))} />
            <LeatherPick list={leathersOf(m, leathers)} value={pickedL[m.id]} onChange={(v) => setPickedL((x) => ({ ...x, [m.id]: v }))} />
            <dl className="mt-5 space-y-1.5 border-t border-line pt-5 text-[12.5px]">
              {[["寸法", m.size], ["ロゴ位置", m.logo], ...optionRows(m), ["最小ロット", `${MIN_LOT}個から`]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex gap-3"><dt className="w-16 shrink-0 text-mute">{k}</dt><dd className="text-ink">{v.split("・").map((t, i, arr) => <span key={t} className="inline-block">{t}{i < arr.length - 1 ? "・" : ""}</span>)}</dd></div>
              ))}
            </dl>
            <p className="mt-5 text-[12px] text-mute">参考単価<span className="ml-2 text-[20px] font-medium text-ink">{yen(m.unitPrice + (leathersOf(m, leathers).find((l) => l.id === pickedL[m.id])?.add ?? 0))}〜</span></p>
            <div className="mt-5 flex items-center gap-6">
              <a href={`${HOME}?model=${m.id}${picked[m.id] ? `&color=${encodeURIComponent(picked[m.id]!)}` : ""}${pickedL[m.id] ? `&leather=${pickedL[m.id]}` : ""}#contact`} className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-[12.5px] tracking-[0.1em] text-white transition hover:bg-gold">
                このモデルで相談 <ArrowRight size={14} />
              </a>
              {inSim(m.id) && <a href={`${HOME}?model=${m.id}#simulator`} className="border-b border-ink/40 pb-0.5 text-[12.5px] text-ink transition hover:border-gold hover:text-gold">利益を計算</a>}
            </div>
          </li>
        ))}
      </ul>

      {view && <Gallery p={view} onClose={() => setView(null)} />}

      <p className="mt-16 text-center text-[12px] leading-relaxed text-mute">
        <span className="inline-block">※参考単価はロゴ加工（素押し）込み・</span><span className="inline-block">{MIN_LOT}個発注時の目安です。</span>
        <span className="inline-block">型代は0円、</span><span className="inline-block">ロゴの版代{yen(PLATE_COST)}（初回のみ）が別途かかります。</span>
      </p>
    </>
  );
}
