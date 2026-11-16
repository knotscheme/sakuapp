"use client";

import { useState } from "react";
import { Plus, Trash2, Wand2, X } from "lucide-react";
import { MAX_OPTIONS, OPTION_PRESETS, autoSku, buildVariants, type Product, type VOption } from "@/components/cms/catalog";
import { TechNote } from "@/components/cms/ui";

// 商品編集：SKU品番とバリエーション（カラー・サイズなど、種類は用途に合わせて自由に）
export function VariantsEditor({ p, onChange, taken }: { p: Product; onChange: (next: Partial<Product>) => void; taken: string[] }) {
  const options = p.options ?? [];
  const variants = p.variants ?? [];
  const has = options.length > 0;
  const field = "w-full rounded-lg border border-line px-3 py-2 text-[13.5px] outline-none focus:border-ink";

  // 種類や値を変えたら、組み合わせを作り直す（入れたSKUは残す）
  const setOptions = (next: VOption[]) => onChange({ options: next, variants: buildVariants(next, variants) });
  const setOpt = (i: number, o: VOption) => setOptions(options.map((x, k) => (k === i ? o : x)));
  const addOpt = () => {
    const used = options.map((o) => o.name);
    const preset = OPTION_PRESETS.find((x) => !used.includes(x.name));
    setOptions([...options, { name: preset?.name ?? "", values: [] }]);
  };
  const setSku = (key: string, sku: string) => onChange({ variants: variants.map((v) => (v.key === key ? { ...v, sku } : v)) });
  const fillSku = (all: boolean) => onChange({ variants: variants.map((v) => (all || !v.sku.trim() ? { ...v, sku: autoSku(p.sku ?? "", options, v.values) } : v)) });

  // 重複のチェック（他の商品と、この商品の中で）
  const upper = (x: string) => x.trim().toUpperCase();
  const mine = variants.map((v) => upper(v.sku)).filter(Boolean);
  const dup = (sku: string) => !!upper(sku) && (taken.includes(upper(sku)) || mine.filter((x) => x === upper(sku)).length > 1);

  return (
    <div className="space-y-4">
      <label className="block font-medium">SKU品番（基本）
        <input value={p.sku ?? ""} onChange={(e) => onChange({ sku: e.target.value.toUpperCase() })} placeholder="例：CR-LW" className={`${field} mt-1.5 font-mono uppercase`} />
        {!has && p.sku && dup(p.sku) && <span className="mt-1 block text-[12px] text-red-600">この品番は、ほかの商品で使われています</span>}
        <span className="mt-1 block text-[11.5px] font-normal text-mute">{has ? "バリエーションのSKUを自動で作るときの、頭の部分になります。" : "バリエーションが無い商品は、この品番がそのままSKUになります。"}</span>
      </label>

      <label className="flex items-center gap-2.5 font-medium">
        <input type="checkbox" checked={has} onChange={(e) => (e.target.checked ? setOptions([{ ...OPTION_PRESETS[0] }]) : onChange({ options: [], variants: [] }))} className="h-4 w-4 accent-[#1a1a1a]" />
        カラーやサイズなどのバリエーションがある
      </label>

      {has && (
        <>
          {options.map((o, i) => <OptionRow key={i} o={o} others={options.filter((_, k) => k !== i).map((x) => x.name)} onChange={(x) => setOpt(i, x)} onRemove={() => setOptions(options.filter((_, k) => k !== i))} />)}
          {options.length < MAX_OPTIONS && (
            <button type="button" onClick={addOpt} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-line py-2.5 text-[12.5px] text-mute hover:border-ink hover:text-ink">
              <Plus size={14} />種類を追加（例：サイズ・素材）<span className="text-[11px]">最大{MAX_OPTIONS}つ</span>
            </button>
          )}

          {variants.length > 0 && (
            <div className="rounded-xl border border-line">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3.5 py-2.5">
                <p className="font-medium">組み合わせ {variants.length}通り</p>
                <button type="button" onClick={() => fillSku(false)} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] text-ink/80 hover:bg-[#f1f1f0]"><Wand2 size={13} />空欄のSKUを自動で作る</button>
              </div>
              <ul className="divide-y divide-line">
                {variants.map((v) => (
                  <li key={v.key} className={`px-3.5 py-2.5 ${v.visible ? "" : "bg-[#fafafa]"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-[13px] ${v.visible ? "" : "text-mute line-through"}`}>{v.values.join(" / ")}</p>
                      <label className="flex shrink-0 items-center gap-1.5 text-[11.5px] text-mute">
                        <input type="checkbox" checked={v.visible} onChange={(e) => onChange({ variants: variants.map((x) => (x.key === v.key ? { ...x, visible: e.target.checked } : x)) })} className="h-3.5 w-3.5 accent-[#1a1a1a]" />取り扱う
                      </label>
                    </div>
                    <input value={v.sku} onChange={(e) => setSku(v.key, e.target.value.toUpperCase())} disabled={!v.visible} placeholder={autoSku(p.sku ?? "", options, v.values)} aria-label={`${v.values.join(" / ")} のSKU`}
                      className={`${field} mt-1.5 py-1.5 font-mono text-[13px] uppercase disabled:bg-transparent disabled:text-mute ${dup(v.sku) ? "border-red-400" : ""}`} />
                    {dup(v.sku) && <p className="mt-1 text-[11.5px] text-red-600">この品番は、すでに使われています</p>}
                    {v.visible && !v.sku.trim() && <p className="mt-1 text-[11.5px] text-[#8a650c]">SKUを入れてください（薄い文字は自動で作るときの例）</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <TechNote>種類は product_options、組み合わせとSKUは product_variants テーブルに保存。SKUは重複できないように、データベースで一意の制約を付ける</TechNote>
        </>
      )}
    </div>
  );
}

// 種類1つ分：名前（よく使うものは押すだけ）と値
function OptionRow({ o, others, onChange, onRemove }: { o: VOption; others: string[]; onChange: (o: VOption) => void; onRemove: () => void }) {
  const [text, setText] = useState("");
  const add = () => {
    const vals = text.split(/[,、，\n]/).map((x) => x.trim()).filter((x) => x && !o.values.includes(x));
    if (vals.length) onChange({ ...o, values: [...o.values, ...vals] });
    setText("");
  };
  const presets = OPTION_PRESETS.filter((x) => !others.includes(x.name));
  return (
    <div className="rounded-xl border border-line p-3.5">
      <div className="flex items-center gap-2">
        <input value={o.name} onChange={(e) => onChange({ ...o, name: e.target.value })} placeholder="種類の名前（例：カラー）" aria-label="種類の名前" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-[13.5px] font-medium outline-none focus:border-ink" />
        <button type="button" onClick={onRemove} aria-label="この種類を消す" className="rounded-md p-2.5 text-mute hover:bg-[#f1f1f0] hover:text-red-600"><Trash2 size={15} /></button>
      </div>
      {!o.values.length && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map((x) => (
            <button key={x.name} type="button" onClick={() => onChange({ name: x.name, values: [...x.values] })} className="rounded-full bg-[#f1f1f0] px-3 py-1.5 text-[12px] hover:bg-ink hover:text-white">{x.name}（{x.values.join("・")}）</button>
          ))}
        </div>
      )}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {o.values.map((v) => (
          <span key={v} className="flex items-center gap-1 rounded-full border border-line bg-white py-1 pr-1 pl-3 text-[12.5px]">
            {v}
            <button type="button" onClick={() => onChange({ ...o, values: o.values.filter((x) => x !== v) })} aria-label={`${v}を消す`} className="rounded-full p-1 text-mute hover:bg-[#f1f1f0] hover:text-ink"><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); add(); } }} placeholder="値を追加（例：グレー、XL）" aria-label="値を追加" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-[13.5px] outline-none focus:border-ink" />
        <button type="button" onClick={add} className="shrink-0 rounded-lg border border-ink px-3.5 text-[12.5px]">追加</button>
      </div>
    </div>
  );
}
