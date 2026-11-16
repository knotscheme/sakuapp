"use client";

import { useState } from "react";
import { Plus, Trash2, Wand2, X } from "lucide-react";
import { MAX_OPTIONS, OPTION_PRESETS, autoSku, buildVariants, swatchOf, useCatalog, type ColorDef, type Product, type VOption } from "@/components/cms/catalog";
import { TechNote } from "@/components/cms/ui";

const KINDS = [
  { id: "color", ja: "カラー" },
  { id: "size", ja: "サイズ" },
  { id: "custom", ja: "自由に入力" },
] as const;

// 小さな丸の色
export function Dot({ c, size = 18, on = false }: { c?: ColorDef; size?: number; on?: boolean }) {
  return <span className={`inline-block shrink-0 rounded-full ${on ? "ring-2 ring-ink ring-offset-2" : "ring-1 ring-black/15"}`} style={{ width: size, height: size, background: c?.hex ?? "repeating-linear-gradient(45deg,#ddd 0 3px,#fff 3px 6px)" }} />;
}

// 商品編集：SKU品番とバリエーション（カラー・サイズは登録済みの中から選ぶ。そのほかは自由に）
export function VariantsEditor({ p, onChange, taken }: { p: Product; onChange: (next: Partial<Product>) => void; taken: string[] }) {
  const { colors } = useCatalog();
  const options = p.options ?? [];
  const variants = p.variants ?? [];
  const has = options.length > 0;
  const colorIdx = options.findIndex((o) => o.kind === "color");
  const codes = Object.fromEntries(colors.filter((c) => c.code).map((c) => [c.name, c.code!]));
  const [picking, setPicking] = useState<string | null>(null);
  const field = "w-full rounded-lg border border-line px-3 py-2 text-[13.5px] outline-none focus:border-ink";

  // 種類や値を変えたら、組み合わせを作り直す（入れたSKUは残す）
  const setOptions = (next: VOption[]) => onChange({ options: next, variants: buildVariants(next, variants) });
  const setOpt = (i: number, o: VOption) => setOptions(options.map((x, k) => (k === i ? o : x)));
  const addOpt = () => {
    const used = options.map((o) => o.name);
    const preset = OPTION_PRESETS.find((x) => !used.includes(x.name));
    setOptions([...options, preset ? { ...preset, values: [...preset.values] } : { name: "", kind: "custom", values: [] }]);
  };
  const setVar = (key: string, x: Partial<(typeof variants)[number]>) => onChange({ variants: variants.map((v) => (v.key === key ? { ...v, ...x } : v)) });
  const fillSku = () => onChange({ variants: variants.map((v) => (!v.sku.trim() ? { ...v, sku: autoSku(p.sku ?? "", options, v.values, codes) } : v)) });

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
        <input type="checkbox" checked={has} onChange={(e) => (e.target.checked ? setOptions([{ ...OPTION_PRESETS[0], values: [] }]) : onChange({ options: [], variants: [] }))} className="h-4 w-4 accent-[#1a1a1a]" />
        カラーやサイズなどのバリエーションがある
      </label>

      {has && (
        <>
          {options.map((o, i) => <OptionRow key={i} o={o} hasColor={options.some((x, k) => k !== i && x.kind === "color")} hasSize={options.some((x, k) => k !== i && x.kind === "size")} onChange={(x) => setOpt(i, x)} onRemove={() => setOptions(options.filter((_, k) => k !== i))} />)}
          {options.length < MAX_OPTIONS && (
            <button type="button" onClick={addOpt} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-line py-2.5 text-[12.5px] text-mute hover:border-ink hover:text-ink">
              <Plus size={14} />種類を追加（例：サイズ・素材）<span className="text-[11px]">最大{MAX_OPTIONS}つ</span>
            </button>
          )}

          {variants.length > 0 && (
            <div className="rounded-xl border border-line">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3.5 py-2.5">
                <p className="font-medium">組み合わせ {variants.length}通り</p>
                <button type="button" onClick={fillSku} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] text-ink/80 hover:bg-[#f1f1f0]"><Wand2 size={13} />空欄のSKUを自動で作る</button>
              </div>
              <ul className="divide-y divide-line">
                {variants.map((v) => {
                  const sw = swatchOf(colors, p, v);
                  return (
                    <li key={v.key} className={`px-3.5 py-2.5 ${v.visible ? "" : "bg-[#fafafa]"}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          {colorIdx >= 0 && (
                            <button type="button" onClick={() => setPicking(picking === v.key ? null : v.key)} aria-label={`${v.values.join(" / ")} の丸の色を選ぶ`} aria-expanded={picking === v.key} className="-m-1.5 rounded-full p-1.5 hover:bg-[#f1f1f0]"><Dot c={sw} /></button>
                          )}
                          <p className={`truncate text-[13px] ${v.visible ? "" : "text-mute line-through"}`}>{v.values.join(" / ")}</p>
                        </div>
                        <label className="flex shrink-0 items-center gap-1.5 text-[11.5px] text-mute">
                          <input type="checkbox" checked={v.visible} onChange={(e) => setVar(v.key, { visible: e.target.checked })} className="h-3.5 w-3.5 accent-[#1a1a1a]" />取り扱う
                        </label>
                      </div>
                      {picking === v.key && (
                        <div className="mt-2 rounded-lg bg-[#f6f6f5] p-2.5">
                          <p className="text-[11.5px] text-mute">製品一覧の丸に出す色（登録したカラーから）</p>
                          <div className="mt-2 flex flex-wrap gap-2.5">
                            {colors.map((c) => (
                              <button key={c.id} type="button" onClick={() => { setVar(v.key, { swatch: c.name === v.values[colorIdx] ? undefined : c.name }); setPicking(null); }} title={c.name} aria-label={c.name} className="flex flex-col items-center gap-1 text-[10.5px]">
                                <Dot c={c} size={24} on={sw?.name === c.name} /><span className="max-w-14 truncate">{c.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <input value={v.sku} onChange={(e) => setVar(v.key, { sku: e.target.value.toUpperCase() })} disabled={!v.visible} placeholder={autoSku(p.sku ?? "", options, v.values, codes)} aria-label={`${v.values.join(" / ")} のSKU`}
                        className={`${field} mt-1.5 py-1.5 font-mono text-[13px] uppercase disabled:bg-transparent disabled:text-mute ${dup(v.sku) ? "border-red-400" : ""}`} />
                      {dup(v.sku) && <p className="mt-1 text-[11.5px] text-red-600">この品番は、すでに使われています</p>}
                      {v.visible && !v.sku.trim() && <p className="mt-1 text-[11.5px] text-[#8a650c]">SKUを入れてください（薄い文字は自動で作るときの例）</p>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <TechNote>種類は product_options、組み合わせとSKUは product_variants テーブル。カラーとサイズは colors・sizes テーブルに登録しておき、選ぶだけにする。SKUは重複できないよう一意の制約を付ける</TechNote>
        </>
      )}
    </div>
  );
}

// 種類1つ分：タイプ（カラー・サイズ・自由）と値
function OptionRow({ o, hasColor, hasSize, onChange, onRemove }: { o: VOption; hasColor: boolean; hasSize: boolean; onChange: (o: VOption) => void; onRemove: () => void }) {
  const { colors, sizes } = useCatalog();
  const [text, setText] = useState("");
  const kind = o.kind ?? "custom";
  const add = () => {
    const vals = text.split(/[,、，\n]/).map((x) => x.trim()).filter((x) => x && !o.values.includes(x));
    if (vals.length) onChange({ ...o, values: [...o.values, ...vals] });
    setText("");
  };
  const toggle = (name: string, list: string[]) => {
    const on = o.values.includes(name);
    // 登録した順に並べる
    const next = on ? o.values.filter((x) => x !== name) : list.filter((x) => x === name || o.values.includes(x));
    onChange({ ...o, values: next });
  };
  const setKind = (k: VOption["kind"]) => onChange({ name: k === "color" ? "カラー" : k === "size" ? "サイズ" : o.kind === "custom" ? o.name : "", kind: k, values: [] });

  return (
    <div className="rounded-xl border border-line p-3.5">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 flex-wrap gap-1 rounded-lg bg-[#f1f1f0] p-1 text-[12px]">
          {KINDS.map((k) => {
            const disabled = (k.id === "color" && hasColor) || (k.id === "size" && hasSize);
            return <button key={k.id} type="button" disabled={disabled} onClick={() => setKind(k.id)} aria-pressed={kind === k.id} className={`flex-1 rounded-md px-2 py-1.5 whitespace-nowrap ${kind === k.id ? "bg-white font-medium shadow-sm" : "text-mute"} disabled:opacity-35`}>{k.ja}</button>;
          })}
        </div>
        <button type="button" onClick={onRemove} aria-label="この種類を消す" className="rounded-md p-2.5 text-mute hover:bg-[#f1f1f0] hover:text-red-600"><Trash2 size={15} /></button>
      </div>

      {kind === "custom" && (
        <input value={o.name} onChange={(e) => onChange({ ...o, name: e.target.value })} placeholder="種類の名前（例：素材、金具の色）" aria-label="種類の名前" className="mt-2.5 w-full rounded-lg border border-line px-3 py-2 text-[13.5px] font-medium outline-none focus:border-ink" />
      )}

      {kind === "color" && (
        <>
          <p className="mt-3 text-[11.5px] text-mute">登録したカラーから選ぶ（増やすときは、商品管理の「カラー」で登録）</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((c) => {
              const on = o.values.includes(c.name);
              return (
                <button key={c.id} type="button" onClick={() => toggle(c.name, colors.map((x) => x.name))} aria-pressed={on} className={`flex items-center gap-1.5 rounded-full border py-1 pr-3 pl-1.5 text-[12.5px] ${on ? "border-ink bg-white" : "border-line text-mute"}`}>
                  <Dot c={c} />{c.name}
                </button>
              );
            })}
          </div>
        </>
      )}

      {kind === "size" && (
        <>
          <p className="mt-3 text-[11.5px] text-mute">登録したサイズから選ぶ（増やすときは、商品管理の「サイズ」で登録）</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((z) => {
              const on = o.values.includes(z.name);
              return <button key={z.id} type="button" onClick={() => toggle(z.name, sizes.map((x) => x.name))} aria-pressed={on} className={`min-w-11 rounded-full border px-3 py-1.5 text-[12.5px] ${on ? "border-ink bg-ink text-white" : "border-line text-mute"}`}>{z.name}</button>;
            })}
          </div>
        </>
      )}

      {kind === "custom" && (
        <>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {o.values.map((v) => (
              <span key={v} className="flex items-center gap-1 rounded-full border border-line bg-white py-1 pr-1 pl-3 text-[12.5px]">
                {v}
                <button type="button" onClick={() => onChange({ ...o, values: o.values.filter((x) => x !== v) })} aria-label={`${v}を消す`} className="rounded-full p-1 text-mute hover:bg-[#f1f1f0] hover:text-ink"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); add(); } }} placeholder="値を追加（例：牛革、ゴールド）" aria-label="値を追加" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-[13.5px] outline-none focus:border-ink" />
            <button type="button" onClick={add} className="shrink-0 rounded-lg border border-ink px-3.5 text-[12.5px]">追加</button>
          </div>
        </>
      )}
    </div>
  );
}
