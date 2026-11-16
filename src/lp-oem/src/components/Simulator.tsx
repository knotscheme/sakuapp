"use client";

import { ArrowRight, Info } from "lucide-react";
import { LOTS, MODELS, NORMAL_DIE_COST, PRICE_MAX, PRICE_MIN, PRICE_STEP, calcProfit, getModel, yen } from "@/lib/models";
import { useLp } from "./LpContext";
import SectionTitle from "./SectionTitle";
import { asset } from "@/lib/asset";
import { useCountUp } from "./useCountUp";

export default function Simulator() {
  const { model, lot, price, setModel, setLot, setPrice, sendToContact } = useLp();
  const r = calcProfit(model, lot, price);
  const m = getModel(model);
  const pct = ((price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const loss = r.grossPerItem <= 0;
  const cUnit = useCountUp(r.unit);
  const cTotal = useCountUp(r.total);
  const cGross = useCountUp(r.grossPerItem);
  const cMargin = useCountUp(r.margin * 1000) / 10;
  const cGrossTotal = useCountUp(r.grossTotal, 750);

  return (
    <section id="simulator" className="bg-[#f5f5f4] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionTitle en="Profit Simulator" ja="利益シミュレーター" sub="条件を選ぶだけで、|手元に残る利益が|すぐに分かります。" />

        <div className="reveal grid overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_70px_-40px_rgba(0,0,0,.4)] lg:grid-cols-[1.05fr_.95fr]">
          {/* 入力 */}
          <div className="space-y-9 p-6 md:p-10">
            <fieldset>
              <legend className="flex items-center gap-2 text-sm font-bold"><span className="font-display text-gold">01</span>ベースモデルを選ぶ</legend>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {MODELS.map((x) => (
                  <label
                    key={x.id}
                    className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition sm:flex-row sm:gap-2 sm:text-left ${model === x.id ? "border-gold bg-[#faf8f3] ring-1 ring-gold" : "border-line hover:border-gold-2"}`}
                  >
                    <input type="radio" name="sim-model" value={x.id} checked={model === x.id} onChange={() => setModel(x.id)} className="sr-only" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(x.img)} alt="" className="aspect-[4/3] w-20 shrink-0 rounded-lg object-cover sm:w-16" />
                    <span className="text-[12.5px] leading-snug font-bold">{x.short}<span className="block font-normal text-mute">{yen(x.unitPrice)}〜</span></span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="flex items-center gap-2 text-sm font-bold"><span className="font-display text-gold">02</span>発注ロット数</legend>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {LOTS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={lot === l}
                    onClick={() => setLot(l)}
                    className={`rounded-xl border py-3 text-center transition ${lot === l ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-gold-2"}`}
                  >
                    <span className="block text-[17px] font-bold">{l}<small className="ml-0.5 text-[11px] font-normal">個</small></span>
                    <span className={`block text-[10.5px] ${lot === l ? "text-gold-3" : "text-mute"}`}>{calcProfit(model, l, price).discount ? `単価 −${Math.round(calcProfit(model, l, price).discount * 100)}%` : "基本単価"}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="flex w-full items-baseline justify-between text-sm font-bold">
                <span className="flex items-center gap-2"><span className="font-display text-gold">03</span>想定販売価格（1個）</span>
                <output className="text-2xl font-bold tabular-nums">{yen(price)}</output>
              </legend>
              <input
                type="range"
                className="brass mt-5"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                style={{ ["--p" as string]: `${pct}%` }}
                aria-label="想定販売価格"
              />
              <div className="mt-2 flex justify-between text-[11px] text-mute"><span>{yen(PRICE_MIN)}</span><span>{yen(PRICE_MAX)}</span></div>
            </fieldset>
          </div>

          {/* 結果 */}
          <div className="relative bg-ink p-6 text-white md:p-10" aria-live="polite">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_100%_0%,rgba(197,160,89,.18),transparent_70%)]" />
            <div className="relative">
              <p className="text-xs tracking-widest text-white/50">{m.short} × {lot}個</p>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-gold-2/40 bg-gold/10 px-4 py-3">
                <span className="text-[13px] text-gold-3">初期費用（型代）</span>
                <span className="text-right">
                  <span className="mr-2 text-xs text-white/40 line-through">通常 {yen(NORMAL_DIE_COST)}〜</span>
                  <b className="text-2xl text-gold-2">0円</b>
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 text-[13px]">
                <div><dt className="text-white/50">1個あたりの仕入れ単価</dt><dd className="mt-1 text-xl font-bold tabular-nums">{yen(cUnit)}</dd></div>
                <div><dt className="text-white/50">仕入れ総額</dt><dd className="mt-1 text-xl font-bold tabular-nums">{yen(cTotal)}</dd></div>
                <div><dt className="text-white/50">1個あたりの粗利</dt><dd className={`mt-1 text-xl font-bold tabular-nums ${loss ? "text-red-300" : ""}`}>{yen(cGross)}</dd></div>
                <div><dt className="text-white/50">利益率</dt><dd className={`mt-1 text-xl font-bold tabular-nums ${loss ? "text-red-300" : ""}`}>{cMargin.toFixed(1)}%</dd></div>
              </dl>

              <div className="mt-8 border-t border-white/10 pt-7">
                <p className="text-sm text-gold-3">想定粗利益（手元に残る利益）</p>
                <p key={`${model}-${lot}`} className={`pulse-gold mt-2 font-bold tabular-nums ${loss ? "text-red-300" : "gold-text"} text-[40px] leading-none md:text-[56px]`}>
                  {yen(cGrossTotal)}
                </p>
                <p className="mt-3 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-white/45">
                  <Info size={13} className="mt-0.5 shrink-0" />
                  販売価格 − 仕入れ単価 で計算した、全数販売時の目安です（送料・販売手数料・税は含みません）。
                </p>
              </div>

              <button
                type="button"
                onClick={sendToContact}
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-[15px] font-bold tracking-wide text-white transition hover:bg-gold-2"
              >
                この条件で見積もり・相談する
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
