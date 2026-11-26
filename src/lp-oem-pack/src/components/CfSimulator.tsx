"use client";

import { useState } from "react";
import { PLANS, yen, type PlanId } from "@/lib/packs";
import { unitPriceOf } from "@/lib/cms";
import { useLpModels } from "./cms/catalog";
import SectionTitle from "./SectionTitle";

// クラファンの収支シミュレーター：支援額から、手数料・追加生産・送料・プラン料金を引いて手元に残る額
// クラファンの手数料（サイトに払う手数料＋決済手数料の合計の目安）。サイトやプランで変わるので選べる・直せる
const SITES = [
  { id: "makuake", name: "Makuake", fee: 20 },
  { id: "campfire", name: "CAMPFIRE", fee: 17 },
  { id: "greenfunding", name: "GREEN FUNDING", fee: 20 },
  { id: "custom", name: "その他", fee: 20 },
];
const SHIP = 600; // 1件あたりの梱包・送料の目安
export default function CfSimulator() {
  const models = useLpModels();
  const [model, setModel] = useState(models[0]?.id ?? "trifold");
  const [price, setPrice] = useState(9800);
  const [backers, setBackers] = useState(300);
  const [plan, setPlan] = useState<Exclude<PlanId, "oem">>("standard");
  const [site, setSite] = useState("makuake");
  const [feePct, setFeePct] = useState(20);
  const FEE = feePct / 100;
  const p = PLANS.find((x) => x.id === plan)!;
  const total = price * backers;
  const fee = Math.round(total * FEE);
  const extra = Math.max(0, backers - (p.qty ?? 0));
  const make = extra * unitPriceOf(model as Parameters<typeof unitPriceOf>[0], extra || 1);
  const ship = backers * SHIP;
  const left = total - fee - make - ship - p.price!;
  const rows: [string, number, boolean?][] = [["支援総額", total], [`クラファン手数料（${SITES.find((x) => x.id === site)!.name}・${feePct}%）`, -fee], [`プラン料金（${p.name}・設計と50個込み）`, -p.price!], [`追加の生産（${extra}個）`, -make], [`梱包・送料（${backers}件）`, -ship]];
  const num = "w-full border border-line bg-white px-3 py-2.5 text-right font-num text-[16px] tabular-nums outline-none focus:border-ink";
  return (
    <section id="cfsim" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <SectionTitle en="Crowdfunding Simulator" ja="クラファンで、|手元にいくら|残る？" sub="リターンの価格と支援者数を入れると、|プラン料金や生産費を引いた|手元の金額が分かります。" />
        <div className="reveal grid overflow-hidden border border-line bg-white lg:grid-cols-2">
          <div className="space-y-6 p-6 md:p-9">
            <label className="block text-[13px] font-bold">製品
              <select value={model} onChange={(e) => setModel(e.target.value as typeof model)} className="mt-2 w-full border border-line bg-white px-3 py-2.5 text-[14px] font-normal outline-none focus:border-ink">
                {models.map((m) => <option key={m.id} value={m.id}>{m.short}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-[13px] font-bold">リターンの価格（円）<input type="number" inputMode="numeric" min={1000} step={100} value={price || ""} onChange={(e) => setPrice(Math.max(0, Math.round(Number(e.target.value))))} className={`mt-2 ${num}`} /></label>
              <label className="block text-[13px] font-bold">支援者数（人）<input type="number" inputMode="numeric" min={1} step={10} value={backers || ""} onChange={(e) => setBackers(Math.max(0, Math.round(Number(e.target.value))))} className={`mt-2 ${num}`} /></label>
            </div>
            <fieldset>
              <legend className="text-[13px] font-bold">クラファンのサイト</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SITES.map((x) => (
                  <label key={x.id} className={`cursor-pointer border py-2.5 text-center text-[12.5px] transition ${site === x.id ? "border-ink bg-ink text-white" : "border-line hover:border-mute"}`}>
                    <input type="radio" name="cf-site" checked={site === x.id} onChange={() => { setSite(x.id); setFeePct(x.fee); }} className="sr-only" />{x.name}
                  </label>
                ))}
              </div>
              <label className="mt-2.5 flex items-center justify-between gap-3 text-[12.5px]">
                <span className="text-mute">手数料（サイト＋決済の合計）</span>
                <span className="flex items-center gap-1"><input type="number" inputMode="decimal" min={0} max={50} step={0.5} value={feePct} onChange={(e) => setFeePct(Math.max(0, Math.min(50, Number(e.target.value) || 0)))} className="w-16 border border-line px-2 py-1.5 text-right font-num tabular-nums outline-none focus:border-ink" />%</span>
              </label>
            </fieldset>
            <fieldset>
              <legend className="text-[13px] font-bold">プラン</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {PLANS.map((x) => (
                  <label key={x.id} className={`cursor-pointer border py-2.5 text-center text-[12.5px] transition ${plan === x.id ? "border-ink bg-ink text-white" : "border-line hover:border-mute"}`}>
                    <input type="radio" name="cf-plan-sim" checked={plan === x.id} onChange={() => setPlan(x.id as typeof plan)} className="sr-only" />{x.name}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="border-t border-line bg-[#fbfaf7] p-6 md:p-9 lg:border-t-0 lg:border-l">
            <dl className="space-y-2.5 text-[13.5px]">
              {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-mute">{k}</dt><dd className="font-num whitespace-nowrap tabular-nums">{v < 0 ? `−${yen(-v)}` : yen(v)}</dd></div>)}
            </dl>
            <div className="mt-5 border-t border-ink/80 pt-5">
              <p className="text-[13px] font-bold">手元に残る金額</p>
              <p className={`mt-1 font-num text-[34px] leading-tight font-medium tabular-nums ${left < 0 ? "text-red-600" : "text-ink"}`}>{left < 0 ? `−${yen(-left)}` : yen(left)}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-mute">{left > 0 ? `プラン料金の約${(left / p.price! + 1).toFixed(1)}倍の支援額を回収できる計算です。` : "支援者数かリターンの価格を見直すと、黒字になります。"}</p>
            </div>
            <p className="mt-6 text-[11px] leading-relaxed text-mute">※概算です（デモ版）。クラファン手数料はサイトやプラン（掲載方式・オプション）で変わるため、各サイトの最新の条件で直してください。送料は目安、追加生産は数量割引後の参考単価で計算しています。在庫は持たず、支援が集まった分だけ生産します。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
