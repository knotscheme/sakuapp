"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ExternalLink, ImagePlus, Pencil, Plus, Trash2, Video, X } from "lucide-react";
import { moveLp, moveProduct, renameSize, setLp, updateColor } from "@/components/cms/catalog";
import { TANS, colorsForLeather, toggleLeatherColor, toggleProductLeather, type LeatherDef, type Tan } from "@/components/cms/catalog";
import { addLeather, costOf, deleteLeather, leathersOf, updateLeather } from "@/components/cms/catalog";
import { lotChoices, rateFor, usePricing } from "@/lib/pricing";
import { MAX_SUB, skuList, addColor, addSize, deleteColor, deleteSize, setColorHex, addCat, deleteCat, deleteProduct, embedUrl, imgSrc, renameCat, saveProduct, shrinkImage, toggleVisible, useCatalog, type Product } from "@/components/cms/catalog";
import { Card, CardHead, NoAccess, Shell, TechNote } from "@/components/cms/ui";
import { Dot, VariantsEditor } from "./variants";
import { useAuth } from "@/components/cms/perm";
import { askConfirm } from "@/components/cms/Confirm";

const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;
const blank = (cat: string): Product => ({ id: `p-${Date.now().toString(36)}`, name: "", short: "", cat, feature: "", size: "", logo: "", unitPrice: 0, img: "", visible: true });

export default function ProductsAdmin() {
  const { cats, products, lp } = useCatalog();
  const [cat, setCat] = useState("all");
  // 一覧の見方：製品一覧（カタログ）の並び順か、LPのトップの並び順か
  const [mode, setMode] = useState<"catalog" | "lp">("catalog");
  const [edit, setEdit] = useState<Product | null>(null);
  const [newCat, setNewCat] = useState("");
  const { can } = useAuth();
  const list = products.filter((p) => cat === "all" || p.cat === cat);
  if (!can("products.edit")) return <Shell title="商品管理"><NoAccess /></Shell>;
  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? "未分類";

  const actions = (
    <div className="flex items-center gap-3">
      <a href="/sakuapp/works/lp-oem/products/" target="_blank" className="hidden items-center gap-1.5 text-[12.5px] text-mute hover:text-ink sm:flex">製品一覧ページ <ExternalLink size={13} /></a>
      <button type="button" onClick={() => setEdit(blank(cat === "all" ? cats[0]?.id ?? "" : cat))} className="cms-btn inline-flex items-center gap-1.5 bg-ink px-4 py-2 text-[13px] text-white"><Plus size={15} /> 商品を追加</button>
    </div>
  );

  return (
    <Shell title="商品管理" actions={actions} note="商品は products、カテゴリは categories テーブル。画像は Supabase Storage。保存すると製品一覧ページに反映">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <Card>
          <div className="flex gap-1 border-b border-line p-2">
            {([["catalog", "製品一覧の並び"], ["lp", `LPに出す商品（${lp.filter((id) => products.some((p) => p.id === id)).length}）`]] as const).map(([k, t]) => (
              <button key={k} type="button" onClick={() => setMode(k)} className={`flex-1 rounded-lg py-2 text-[12.5px] ${mode === k ? "bg-[#f1f1f0] font-medium" : "text-mute hover:text-ink"}`}>{t}</button>
            ))}
          </div>
          {mode === "lp" ? <LpList onEdit={setEdit} /> : <>
          {/* カテゴリで絞り込み */}
          <div className="flex gap-1 overflow-x-auto border-b border-line px-4 pt-3">
            {[{ id: "all", name: "すべて" }, ...cats].map((c) => {
              const n = c.id === "all" ? products.length : products.filter((p) => p.cat === c.id).length;
              return (
                <button key={c.id} type="button" onClick={() => setCat(c.id)} className={`-mb-px shrink-0 border-b-2 px-3 pt-1 pb-3 text-[13px] ${cat === c.id ? "border-ink font-medium" : "border-transparent text-mute hover:text-ink"}`}>
                  {c.name}<span className="ml-1.5 text-[11px] text-mute">{n}</span>
                </button>
              );
            })}
          </div>
          <ul className="divide-y divide-line">
            {list.map((p, k) => (
              <li key={p.id} className="flex items-center gap-3 py-3.5 pr-5 pl-2 sm:gap-4">
                <UpDown first={k === 0} last={k === list.length - 1} onMove={(dir) => moveProduct(p.id, dir, list.map((x) => x.id))} label={p.short} />
                {p.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgSrc(p.img)} alt="" className="aspect-[4/3] w-16 shrink-0 rounded-md object-cover" />
                ) : (
                  <span className="flex aspect-[4/3] w-16 shrink-0 items-center justify-center rounded-md bg-[#f1f1f0] text-mute"><ImagePlus size={16} /></span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-[13.5px] font-medium">{p.short || "（名前なし）"}{lp.includes(p.id) && <span className="shrink-0 rounded bg-[#eef4ff] px-1.5 py-px text-[10px] font-normal text-[#2a4f9e]">LP</span>}</p>
                  <p className="truncate text-[11.5px] text-mute">{catName(p.cat)}・{yen(p.unitPrice)}〜{(p.subImgs?.length ?? 0) > 0 && `・写真+${p.subImgs!.length}`}{p.video && "・動画"}</p>
                  <p className="truncate font-mono text-[11px] text-mute">{p.variants?.length ? `${p.sku ?? "SKU"}・${p.variants.filter((v) => v.visible).length}通り` : p.sku ?? "SKU未登録"}</p>
                </div>
                <button type="button" onClick={() => toggleVisible(p.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] max-lg:min-h-9 ${p.visible ? "bg-[#e6f4ea] text-[#1e6b34]" : "bg-[#f1f1f0] text-mute"}`}>
                  {p.visible ? "公開中" : "非公開"}
                </button>
                <button type="button" onClick={() => setEdit(p)} aria-label="編集" className="shrink-0 rounded-md p-3 text-mute hover:bg-[#f1f1f0] hover:text-ink"><Pencil size={15} /></button>
              </li>
            ))}
            {!list.length && <li className="px-5 py-10 text-center text-[13px] text-mute">このカテゴリには、まだ商品がありません。</li>}
          </ul>
          <p className="border-t border-line px-5 py-3 text-[11.5px] text-mute">↑↓で、製品一覧ページでの表示順を変えられます。</p>
          </>}
        </Card>

        <div className="space-y-5 self-start">
        {/* カテゴリの管理 */}
        <Card>
          <CardHead note="並び順・名前は categories テーブルで管理">カテゴリ</CardHead>
          <ul className="divide-y divide-line border-t border-line">
            {cats.map((c) => (
              <li key={c.id} className="flex items-center gap-2 px-4 py-2.5">
                <input defaultValue={c.name} onBlur={(e) => e.target.value.trim() && renameCat(c.id, e.target.value.trim())} className="min-w-0 flex-1 rounded-md px-2 py-1 text-[13px] outline-none hover:bg-[#f1f1f0] focus:bg-[#f1f1f0]" aria-label="カテゴリ名" />
                <span className="text-[11px] text-mute">{products.filter((p) => p.cat === c.id).length}</span>
                <button type="button" aria-label="削除" onClick={async () => { if (!(await askConfirm({ title: `カテゴリ「${c.name}」を削除しますか？`, body: "削除すると元に戻せません。", ok: "削除する", danger: true }))) return; if (!deleteCat(c.id)) alert("商品が入っているカテゴリは削除できません。先に商品を別のカテゴリへ移してください。"); }} className="rounded-md p-3 text-mute hover:bg-[#f1f1f0] hover:text-red-600"><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
          <form className="flex gap-2 border-t border-line p-4" onSubmit={(e) => { e.preventDefault(); if (!newCat.trim()) return; addCat(newCat.trim()); setNewCat(""); }}>
            <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="例：キーケース" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-ink" />
            <button className="cms-btn border border-ink px-3 text-[12.5px]">追加</button>
          </form>
        </Card>
        <LeatherCard />
        <ColorCard />
        <SizeCard />
        </div>
      </div>

      {edit && <Editor initial={edit} onClose={() => setEdit(null)} />}
    </Shell>
  );
}

function Editor({ initial, onClose }: { initial: Product; onClose: () => void }) {
  const { cats, products, lp } = useCatalog();
  const [onLp, setOnLp] = useState(lp.includes(initial.id));
  const [p, setP] = useState<Product>(initial);
  const [busy, setBusy] = useState(false);
  const [busySub, setBusySub] = useState(false);
  const subs = p.subImgs ?? [];
  const embed = embedUrl(p.video);
  const move = (arr: string[], from: number, to: number) => { const a = [...arr]; const [x] = a.splice(from, 1); a.splice(to, 0, x); return a; };
  const isNew = !products.some((x) => x.id === initial.id);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  // SKU：ほかの商品と同じ品番は使えない。取り扱うバリエーションには、すべてSKUが必要
  const taken = skuList(products, initial.id);
  const vs = (p.variants ?? []).filter((v) => v.visible);
  const skus = vs.map((v) => v.sku.trim().toUpperCase());
  const skuOk = p.variants?.length
    ? vs.length > 0 && skus.every((x) => x && !taken.includes(x)) && new Set(skus).size === skus.length
    : !p.sku?.trim() || !taken.includes(p.sku.trim().toUpperCase());
  const ok = p.short.trim() && p.cat && p.unitPrice > 0 && p.img && (!p.video?.trim() || embedUrl(p.video)) && skuOk;
  const field = "mt-1.5 w-full rounded-lg border border-line px-3 py-2 text-[13.5px] outline-none focus:border-ink";

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <p className="text-[15px] font-semibold">{isNew ? "商品を追加" : "商品を編集"}</p>
          <button type="button" onClick={onClose} aria-label="閉じる" className="rounded-md p-1.5 hover:bg-[#f1f1f0]"><X size={18} /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6 text-[13px]">
          <div>
            <p className="font-medium">メイン画像<span className="ml-1 text-[11px] text-gold">必須</span></p>
            <label className="mt-1.5 flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-[#fafafa] hover:border-ink">
              {p.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgSrc(p.img)} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-2 text-mute"><ImagePlus size={22} />{busy ? "読み込み中…" : "画像を選ぶ"}</span>
              )}
              <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setBusy(true); try { set("img", await shrinkImage(f)); } finally { setBusy(false); } }} />
            </label>
            <TechNote className="mt-1.5">Supabase Storage に保存し、自動で縮小</TechNote>
          </div>
          <div>
            <p className="flex items-baseline justify-between font-medium">サブ画像<span className="text-[11px] font-normal text-mute">{subs.length} / {MAX_SUB}枚</span></p>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {subs.map((src, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-md bg-[#f1f1f0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgSrc(src)} alt="" className="h-full w-full object-cover" />
                  <button type="button" aria-label="削除" onClick={() => set("subImgs", subs.filter((_, k) => k !== i))} className="absolute top-1 right-1 rounded-full bg-black/55 p-1.5 text-white"><X size={14} /></button>
                  {i > 0 && <button type="button" aria-label="前へ" onClick={() => set("subImgs", move(subs, i, i - 1))} className="absolute top-1 left-1 rounded-full bg-black/55 p-1 text-white"><ChevronLeft size={13} /></button>}
                  <button type="button" onClick={() => setP((x) => ({ ...x, img: src, subImgs: x.img ? [x.img, ...subs.filter((_, k) => k !== i)] : subs.filter((_, k) => k !== i) }))} className="absolute inset-x-0 bottom-0 bg-black/50 py-1 text-[10.5px] whitespace-nowrap text-white">メインにする</button>
                </div>
              ))}
              {subs.length < MAX_SUB && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line text-[11px] text-mute hover:border-ink">
                  <Plus size={18} />{busySub ? "…" : "追加"}
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={async (e) => {
                    // ファイルの一覧は、入力欄を空にする前に配列にしておく（空にすると中身も消えるため）
                    const files = Array.from(e.target.files ?? []).slice(0, MAX_SUB - subs.length);
                    e.target.value = "";
                    if (!files.length) return;
                    setBusySub(true);
                    try {
                      const out: string[] = [];
                      for (const f of files) out.push(await shrinkImage(f, 800, 600, 0.72));
                      setP((x) => ({ ...x, subImgs: [...(x.subImgs ?? []), ...out].slice(0, MAX_SUB) }));
                    } finally { setBusySub(false); }
                  }} />
                </label>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-mute">複数まとめて選べます。「メインにする」でメイン画像と入れ替え、「＜」で順番を前へ。</p>
          </div>
          <div>
            <label className="block font-medium">動画のURL
              <input value={p.video ?? ""} onChange={(e) => set("video", e.target.value)} placeholder="YouTube・Vimeo のURL" inputMode="url" className={field} />
            </label>
            {p.video?.trim() && (embed ? (
              <div className="mt-2 aspect-video overflow-hidden rounded-lg bg-black">
                <iframe src={embed} title="動画のプレビュー" className="h-full w-full" allow="encrypted-media; picture-in-picture; fullscreen" />
              </div>
            ) : <p className="mt-1.5 text-[11.5px] text-red-600">YouTube か Vimeo の動画URLを入れてください。</p>)}
            <TechNote className="mt-1.5">動画はURLだけを保存し、YouTube・Vimeo のプレーヤーで埋め込み表示（容量を使わない）</TechNote>
          </div>
          <label className="block font-medium">カテゴリ<span className="ml-1 text-[11px] text-gold">必須</span>
            <select value={p.cat} onChange={(e) => set("cat", e.target.value)} className={field}>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block font-medium">一覧での名前<span className="ml-1 text-[11px] text-gold">必須</span>
            <input value={p.short} onChange={(e) => set("short", e.target.value)} placeholder="例：キーケース" className={field} />
          </label>
          <label className="block font-medium">正式名
            <input value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="例：本革スマートキーケース" className={field} />
          </label>
          <label className="block font-medium">特徴
            <textarea value={p.feature} onChange={(e) => set("feature", e.target.value)} rows={3} className={`${field} resize-y`} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block font-medium">寸法<input value={p.size} onChange={(e) => set("size", e.target.value)} placeholder="W10 × H7 × D2 cm" className={field} /></label>
            <label className="block font-medium">ロゴ位置<input value={p.logo} onChange={(e) => set("logo", e.target.value)} placeholder="表面中央" className={field} /></label>
          </div>
          <label className="block font-medium">参考単価（30個・円）<span className="ml-1 text-[11px] text-gold">必須</span>
            <input type="number" min={0} step={100} value={p.unitPrice || ""} onChange={(e) => set("unitPrice", Number(e.target.value))} className={field} />
          </label>
          <LeatherPick p={p} onChange={(leathers) => set("leathers", leathers)} />
          <CostBox p={p} onChange={(cost) => set("cost", cost)} />
          <div className="border-t border-line pt-5">
            <p className="mb-3 text-[14px] font-semibold">SKU品番とバリエーション</p>
            <VariantsEditor p={p} onChange={(x) => setP((cur) => ({ ...cur, ...x }))} taken={taken} />
          </div>
          <label className="flex items-center gap-2.5 font-medium">
            <input type="checkbox" checked={p.visible} onChange={(e) => set("visible", e.target.checked)} className="h-4 w-4 accent-[#1a1a1a]" />
            製品一覧に公開する
          </label>
          <label className="flex items-center gap-2.5 font-medium">
            <input type="checkbox" checked={onLp} onChange={(e) => setOnLp(e.target.checked)} className="h-4 w-4 accent-[#1a1a1a]" />
            LPのトップ（ベースモデル）にも出す
          </label>
          {onLp && !p.visible && <p className="-mt-3 text-[11.5px] text-mute">非公開のあいだは、LPにも出ません。</p>}
        </div>
        {!skuOk && <p role="status" className="border-t border-line bg-[#fdf3f3] px-6 py-2.5 text-[12px] text-red-700">SKU品番に、空欄か、ほかと同じ品番があります。直すと保存できます。</p>}
        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
          {!isNew ? (
            <button type="button" onClick={async () => { if (await askConfirm({ title: "この商品を削除しますか？", body: "製品一覧からも消えます。元に戻せません。", ok: "削除する", danger: true })) { deleteProduct(p.id); onClose(); } }} className="flex items-center gap-1.5 text-[12.5px] text-red-600"><Trash2 size={14} /> 削除</button>
          ) : <span />}
          <button type="button" disabled={!ok} onClick={() => { saveProduct({ ...p, name: p.name.trim() || p.short.trim(), video: p.video?.trim() || undefined, sku: p.sku?.trim() || undefined, options: p.options?.filter((o) => o.name.trim() && o.values.length), variants: p.variants?.map((v) => ({ ...v, sku: v.sku.trim() })) }); setLp(p.id, onLp); onClose(); }} className="cms-btn bg-ink px-5 py-2.5 text-[13px] text-white disabled:bg-line disabled:text-mute">保存する</button>
        </div>
      </div>
    </div>
  );
}

// カラーの登録：名前と色（丸の色）。商品のバリエーションでは、ここから選ぶ
function ColorCard() {
  const { colors } = useCatalog();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#8a6a4f");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <Card>
      <CardHead note="colors テーブル。色は製品一覧の丸に、記号（BKなど）はSKUの自動作成に使う">カラー</CardHead>
      <p className="border-t border-line px-4 py-2 text-[11px] text-mute">丸・名前・記号を押すと直せます。名前を変えると、その色を使っている商品にも反映されます。</p>
      <ul className="divide-y divide-line border-t border-line">
        {colors.map((c) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-2">
            <label className="relative -m-2 cursor-pointer p-2" title="色を変える">
              <Dot c={c} size={22} />
              <input type="color" value={c.hex} onChange={(e) => setColorHex(c.id, e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label={`${c.name}の色を変える`} />
            </label>
            {/* 名前と記号は、押すとその場で直せる（名前を変えると、使っている商品のバリエーションも同じ名前に変わる） */}
            <input key={`n-${c.name}`} defaultValue={c.name} aria-label={`${c.name}の名前`} onBlur={(e) => { const v = e.target.value.trim(); if (!v || v === c.name) { e.target.value = c.name; return; } if (!updateColor(c.id, { name: v })) { setMsg(`「${v}」はもう登録されています。`); e.target.value = c.name; } else setMsg(""); }} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} className="min-w-0 flex-1 rounded-md px-2 py-1 text-[13px] outline-none hover:bg-[#f1f1f0] focus:bg-[#f1f1f0]" />
            <input key={`c-${c.code}`} defaultValue={c.code} aria-label={`${c.name}の記号`} title="SKUの記号" maxLength={4} onBlur={(e) => { updateColor(c.id, { code: e.target.value }); }} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} className="w-12 rounded-md px-1.5 py-1 text-center font-mono text-[11px] text-mute uppercase outline-none hover:bg-[#f1f1f0] focus:bg-[#f1f1f0] focus:text-ink" />
            <button type="button" aria-label={`${c.name}を削除`} onClick={async () => { if (!(await askConfirm({ title: `カラー「${c.name}」を削除しますか？`, body: "削除すると元に戻せません。", ok: "削除する", danger: true }))) return; setMsg(deleteColor(c.id) ? "" : `「${c.name}」は商品で使われているため、削除できません。`); }} className="rounded-md p-3 text-mute hover:bg-[#f1f1f0] hover:text-red-600"><Trash2 size={14} /></button>
          </li>
        ))}
      </ul>
      {msg && <p className="border-t border-line bg-[#fdf3f3] px-4 py-2 text-[12px] text-red-700">{msg}</p>}
      <form className="flex items-center gap-2 border-t border-line p-4" onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (!n) return; setMsg(addColor(n, hex, code) ? "" : `「${n}」はもう登録されています。`); setName(""); setCode(""); }}>
        <label className="relative shrink-0 cursor-pointer" title="色を選ぶ">
          <span className="block h-9 w-9 rounded-full ring-1 ring-black/15" style={{ background: hex }} />
          <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="新しいカラーの色" />
        </label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例：ボルドー" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-ink" aria-label="新しいカラーの名前" />
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="記号 BD" maxLength={4} className="w-[4.5rem] rounded-lg border border-line px-2 py-1.5 font-mono text-[13px] uppercase outline-none focus:border-ink" aria-label="SKUに入れる記号" />
        <button className="cms-btn border border-ink px-3 py-1.5 text-[12.5px]">追加</button>
      </form>
    </Card>
  );
}

// サイズの登録
function SizeCard() {
  const { sizes } = useCatalog();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <Card>
      <CardHead note="sizes テーブル。商品のバリエーションでは、ここから選ぶ">サイズ</CardHead>
      <p className="border-t border-line px-4 py-2 text-[11px] text-mute">名前を押すと直せます。使っている商品にも反映されます。</p>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3.5">
        {sizes.map((z) => (
          <span key={z.id} className="flex items-center gap-1 rounded-full border border-line py-1 pr-1 pl-1.5 text-[12.5px]">
            <input key={z.name} defaultValue={z.name} aria-label={`サイズ「${z.name}」の名前`} style={{ width: `${[...z.name].reduce((w, ch) => w + (ch.charCodeAt(0) > 255 ? 1.05 : 0.65), 0) + 1}em` }} onBlur={(e) => { const v = e.target.value.trim(); if (!v || v === z.name) { e.target.value = z.name; return; } if (!renameSize(z.id, v)) { setMsg(`「${v}」はもう登録されています。`); e.target.value = z.name; } else setMsg(""); }} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} className="rounded-full px-1.5 py-0.5 text-[12.5px] outline-none hover:bg-[#f1f1f0] focus:bg-[#f1f1f0]" />
            <button type="button" aria-label={`${z.name}を削除`} onClick={async () => { if (!(await askConfirm({ title: `サイズ「${z.name}」を削除しますか？`, body: "削除すると元に戻せません。", ok: "削除する", danger: true }))) return; setMsg(deleteSize(z.id) ? "" : `「${z.name}」は商品で使われているため、削除できません。`); }} className="-my-1 rounded-full p-2.5 text-mute hover:bg-[#f1f1f0] hover:text-red-600"><X size={12} /></button>
          </span>
        ))}
      </div>
      {msg && <p className="border-t border-line bg-[#fdf3f3] px-4 py-2 text-[12px] text-red-700">{msg}</p>}
      <form className="flex gap-2 border-t border-line p-4" onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (!n) return; setMsg(addSize(n) ? "" : `「${n}」はもう登録されています。`); setName(""); }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例：XXL、ミニ" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-ink" aria-label="新しいサイズ" />
        <button className="cms-btn border border-ink px-3 text-[12.5px]">追加</button>
      </form>
    </Card>
  );
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

// 革素材の登録：お客様に見える名前と、社内用のデシ単価（1デシ＝10×10cm）、お客様の単価への上乗せ
function LeatherCard() {
  const { leathers, products, colors } = useCatalog();
  const pr = usePricing();
  const { can } = useAuth();
  const money = can("money.view");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [ds, setDs] = useState("");
  const [add, setAdd] = useState("");
  const [img, setImg] = useState<string | undefined>();
  const [group, setGroup] = useState("");
  const [tan, setTan] = useState<Tan>("タンニン鞣し");
  const [msg, setMsg] = useState("");
  // 系統ごとに見出しをつけて並べる（系統の並びは、最初に出てきた順）
  const groups = [...new Set(leathers.map((l) => l.group ?? ""))];
  const sel = "rounded-md border border-line bg-white px-1.5 py-1 text-[11.5px] outline-none focus:border-ink";
  // 革の見本の写真は小さく縮めて保存（本番では Supabase Storage）
  const pickImg = async (f: File | undefined) => (f ? shrinkImage(f, 320, 240, 0.8) : undefined);
  const num = "w-full rounded-md border border-line px-2 py-1 text-right text-[12.5px] tabular-nums outline-none focus:border-ink";
  return (
    <Card>
      <CardHead note="leathers テーブル。デシ単価は社内用で、お客様の画面には出ない">革素材</CardHead>
      <p className="border-t border-line px-4 py-2 text-[11px] text-mute">写真・名前・記号・金額・系統・鞣し・英語／タイ語の名前（工場向け）を押すと直せます。「作れる色」は丸を押して付け外し。</p>
      <datalist id="leather-groups">{groups.filter(Boolean).map((g) => <option key={g} value={g} />)}</datalist>
      {groups.map((g) => (
      <div key={g || "none"}>
      <p className="flex items-baseline gap-2 border-t border-line bg-[#fafafa] px-4 py-2 text-[12.5px] font-semibold">{g || "系統なし"}<span className="text-[11px] font-normal text-mute">{[...new Set(leathers.filter((l) => (l.group ?? "") === g).map((l) => l.tan).filter(Boolean))].join("・")}</span></p>
      <ul className="divide-y divide-line border-t border-line">
        {leathers.filter((l) => (l.group ?? "") === g).map((l) => {
          const n = products.filter((p) => p.leathers?.includes(l.id)).length;
          return (
            <li key={l.id} className="px-4 py-2.5">
              <div className="flex items-center gap-2">
                <LeatherImg img={l.img} label={`${l.name}の写真を変える`} onPick={async (f) => { const v = await pickImg(f); if (v) updateLeather(l.id, { img: v }); }} />
                <input defaultValue={l.name} onBlur={(e) => e.target.value.trim() && updateLeather(l.id, { name: e.target.value.trim() })} aria-label="革の名前" className="min-w-0 flex-1 rounded-md px-2 py-1 text-[13px] outline-none hover:bg-[#f1f1f0] focus:bg-[#f1f1f0]" />
                <input key={`c-${l.code}`} defaultValue={l.code} aria-label={`${l.name}の記号`} title="記号" maxLength={4} onBlur={(e) => { const v = e.target.value.normalize("NFKC").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4); if (v) updateLeather(l.id, { code: v }); else e.target.value = l.code; }} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} className="w-11 rounded-md px-1 py-1 text-center font-mono text-[11px] text-mute uppercase outline-none hover:bg-[#f1f1f0] focus:bg-[#f1f1f0] focus:text-ink" />
                <span className="text-[11px] text-mute" title="使っている商品">{n}</span>
                <button type="button" aria-label={`${l.name}を削除`} onClick={async () => { if (!(await askConfirm({ title: `革「${l.name}」を削除しますか？`, body: "削除すると元に戻せません。", ok: "削除する", danger: true }))) return; setMsg(deleteLeather(l.id) ? "" : `「${l.name}」を使っている商品があるため、削除できません。`); }} className="rounded-md p-2 text-mute hover:text-red-600"><Trash2 size={14} /></button>
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-2 pl-2 text-[11px] text-mute">
                {money && <label>デシ単価（円）<input type="number" min={0} step={1} defaultValue={l.dsPrice} onBlur={(e) => updateLeather(l.id, { dsPrice: Math.max(0, Number(e.target.value) || 0) })} className={num} /></label>}
                <label>お客様への上乗せ（1個・円）<input type="number" min={0} step={100} defaultValue={l.add} onBlur={(e) => updateLeather(l.id, { add: Math.max(0, Number(e.target.value) || 0) })} className={num} /></label>
              </div>
              {/* この革で作れるカラー（押して付け外し）。製品一覧と見積フォームでは、選んだ革で作れる色だけが出る */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-2">
                <span className="mr-0.5 text-[11px] text-mute">作れる色</span>
                {colors.map((c) => {
                  const on = !l.colors || l.colors.includes(c.name);
                  return (
                    <button key={c.id} type="button" aria-pressed={on} title={c.name} aria-label={`${l.name}：${c.name}`} onClick={() => toggleLeatherColor(l.id, c.name, colors.map((x) => x.name))}
                      className={`h-6 w-6 rounded-full transition ${on ? "ring-2 ring-ink ring-offset-1" : "opacity-25 ring-1 ring-black/15 hover:opacity-60"}`} style={{ background: c.hex }} />
                  );
                })}
                <span className="ml-1 text-[11px] text-mute">{l.colors ? `${colors.filter((c) => l.colors!.includes(c.name)).length}色` : "全色"}</span>
              </div>
              <LeatherMeta l={l} sel={sel} />
              {/* 最小ロット（この革だけ多いとき）と、この革に対応する商品（押して付け外し。商品の編集の「革素材」と同じ設定） */}
              <div className="mt-2 flex items-center gap-2 pl-2 text-[11px] text-mute">
                <label className="flex items-center gap-1.5">最小ロット
                  <input key={`m-${l.minLot}`} type="number" min={0} step={10} defaultValue={l.minLot ?? ""} placeholder={`${pr.minLot}`} aria-label={`${l.name}の最小ロット`} onBlur={(e) => { const v = Math.round(Number(e.target.value)); updateLeather(l.id, { minLot: v > 0 ? v : undefined }); }} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} className="w-16 rounded-md border border-line px-2 py-1 text-right text-[12px] tabular-nums outline-none focus:border-ink" />個から
                </label>
                {!l.minLot && <span>（空なら全体の{pr.minLot}個）</span>}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-2 text-[11px]">
                <span className="mr-0.5 text-mute">対応する商品</span>
                {products.map((p) => {
                  const on = !!p.leathers?.includes(l.id);
                  return <button key={p.id} type="button" aria-pressed={on} onClick={() => toggleProductLeather(p.id, l.id)} className={`rounded-full border px-2 py-0.5 ${on ? "border-ink bg-ink text-white" : "border-line text-mute hover:border-ink hover:text-ink"}`}>{p.short}</button>;
                })}
              </div>
            </li>
          );
        })}
      </ul>
      </div>
      ))}
      {msg && <p className="border-t border-line bg-[#fdf3f3] px-4 py-2 text-[12px] text-red-700">{msg}</p>}
      <form className="space-y-2 border-t border-line p-4" onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (!n) return; setMsg(addLeather(n, code, Number(ds) || 0, Number(add) || 0, img, group, tan) ? "" : `「${n}」はもう登録されています。`); setName(""); setCode(""); setDs(""); setAdd(""); setImg(undefined); }}>
        <div className="flex gap-2">
          <input value={group} onChange={(e) => setGroup(e.target.value)} list="leather-groups" placeholder="系統（例：イタリアンレザー）" aria-label="新しい革の系統" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-ink" />
          <select value={tan} onChange={(e) => setTan(e.target.value as Tan)} aria-label="鞣し" className="rounded-lg border border-line bg-white px-2 py-1.5 text-[12.5px] outline-none focus:border-ink">{TANS.map((x) => <option key={x}>{x}</option>)}</select>
        </div>
        <div className="flex gap-2">
          <LeatherImg img={img} label="新しい革の写真" onPick={async (f) => setImg(await pickImg(f))} />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例：コードバン" aria-label="新しい革の名前" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-ink" />
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="記号 CD" maxLength={4} aria-label="記号" className="w-[4.5rem] rounded-lg border border-line px-2 py-1.5 font-mono text-[13px] uppercase outline-none focus:border-ink" />
        </div>
        <div className="flex gap-2">
          {money && <input type="number" min={0} value={ds} onChange={(e) => setDs(e.target.value)} placeholder="デシ単価 円" aria-label="デシ単価" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-ink" />}
          <input type="number" min={0} step={100} value={add} onChange={(e) => setAdd(e.target.value)} placeholder="上乗せ 円" aria-label="お客様への上乗せ" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-ink" />
          <button className="cms-btn border border-ink px-3 py-1.5 text-[12.5px]">追加</button>
        </div>
      </form>
    </Card>
  );
}

// 革の系統・鞣し・工場向けの英語／タイ語の名前（英語・タイ語は、追加したときに辞書から自動で入る）
function LeatherMeta({ l, sel }: { l: LeatherDef; sel: string }) {
  const inp = "min-w-0 w-full rounded-md border border-line px-2 py-1 text-[11.5px] outline-none focus:border-ink";
  return (
    <div className="mt-2 space-y-1.5 pl-2 text-[11px] text-mute">
      <div className="flex gap-1.5">
        <input key={`g-${l.group}`} defaultValue={l.group ?? ""} list="leather-groups" placeholder="系統" aria-label={`${l.name}の系統`} onBlur={(e) => updateLeather(l.id, { group: e.target.value.trim() || undefined })} className={inp} />
        <select value={l.tan ?? ""} aria-label={`${l.name}の鞣し`} onChange={(e) => updateLeather(l.id, { tan: (e.target.value || undefined) as Tan | undefined })} className={sel}>
          <option value="">鞣し：未設定</option>{TANS.map((x) => <option key={x}>{x}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <input key={`en-${l.en}`} defaultValue={l.en ?? ""} placeholder="英語の名前" aria-label={`${l.name}の英語の名前`} onBlur={(e) => updateLeather(l.id, { en: e.target.value.trim() || undefined })} className={inp} />
        <input key={`th-${l.th}`} defaultValue={l.th ?? ""} placeholder="タイ語の名前" aria-label={`${l.name}のタイ語の名前`} onBlur={(e) => updateLeather(l.id, { th: e.target.value.trim() || undefined })} className={inp} />
      </div>
    </div>
  );
}

// 革の見本の写真（押すと写真を選べる）
function LeatherImg({ img, label, onPick }: { img?: string; label: string; onPick: (f?: File) => void }) {
  return (
    <label className="relative flex aspect-[4/3] w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-line bg-[#fafafa] text-mute hover:border-ink" title={label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img ? <img src={imgSrc(img)} alt="" className="h-full w-full object-cover" /> : <ImagePlus size={14} />}
      <input type="file" accept="image/*" aria-label={label} className="sr-only" onChange={(e) => { onPick(e.target.files?.[0]); e.target.value = ""; }} />
    </label>
  );
}

// 商品で選べる革素材（押した順に並び、先頭が標準）
function LeatherPick({ p, onChange }: { p: Product; onChange: (ids: string[]) => void }) {
  const { leathers, colors } = useCatalog();
  const on = p.leathers ?? [];
  // この商品のカラー（バリエーションで取り扱うもの）のうち、革ごとに作れる色
  const ci = (p.options ?? []).findIndex((o) => o.kind === "color");
  const pColors = ci < 0 ? [] : [...new Set((p.variants ?? []).filter((v) => v.visible).map((v) => v.values[ci]))];
  return (
    <div className="border-t border-line pt-5">
      <p className="text-[14px] font-semibold">革素材</p>
      <p className="mt-1 text-[11.5px] text-mute">お客様が見積もりで選べる革。最初に選んだものが標準になります。</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {leathers.map((l) => {
          const i = on.indexOf(l.id);
          return (
            <button key={l.id} type="button" aria-pressed={i >= 0} onClick={() => onChange(i >= 0 ? on.filter((x) => x !== l.id) : [...on, l.id])} className={`flex items-center gap-1.5 rounded-full border py-1 pr-3 pl-1 text-[12.5px] ${i >= 0 ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {l.img ? <img src={imgSrc(l.img)} alt="" className="h-6 w-6 rounded-full object-cover" /> : <span className="h-6 w-6 rounded-full bg-[#ececea]" />}
              {i === 0 && <span className="mr-1 text-[10.5px] text-white/70">標準</span>}{l.name}{l.add > 0 && <span className={`ml-1 text-[11px] ${i >= 0 ? "text-white/70" : "text-mute"}`}>+{yen(l.add)}</span>}
            </button>
          );
        })}
      </div>
      {pColors.length > 0 && on.length > 0 && (
        <ul className="mt-3 space-y-1.5 rounded-lg bg-[#f6f6f5] px-3.5 py-2.5 text-[12px]">
          {on.map((id) => leathers.find((l) => l.id === id)).filter((l) => !!l).map((l) => {
            const cs = colorsForLeather(pColors, l);
            return (
              <li key={l!.id} className="flex items-center gap-2">
                <span className="w-28 shrink-0 truncate text-mute">{l!.name}</span>
                {cs.length ? cs.map((n) => <span key={n} title={n} className="h-4 w-4 rounded-full ring-1 ring-black/15" style={{ background: colors.find((c) => c.name === n)?.hex ?? "#ccc" }} />) : <span className="text-red-600">この商品の色では作れません</span>}
              </li>
            );
          })}
          <li className="pt-0.5 text-[11px] text-mute">お客様には、選んだ革で作れる色だけが出ます。</li>
        </ul>
      )}
    </div>
  );
}

// 原価と利益（社内用）：デシ単価×使用デシ数＋加工賃＝合計原価。販売単価から利益と利益率を自動で出す
function CostBox({ p, onChange }: { p: Product; onChange: (c: Product["cost"]) => void }) {
  const { leathers } = useCatalog();
  const { can } = useAuth();
  const pr = usePricing();
  const lots = lotChoices(pr);
  const [lot, setLot] = useState(lots[0]);
  if (!can("money.view")) return null;
  const c = p.cost ?? { ds: 0, labor: 0 };
  const list = leathersOf(p, leathers);
  const rate = rateFor(lot, pr);
  const field = "mt-1 w-full rounded-lg border border-line px-3 py-2 text-right text-[13.5px] tabular-nums outline-none focus:border-ink";
  return (
    <div className="rounded-xl border border-[#e8d9b5] bg-[#fdfaf2] p-4">
      <p className="flex items-center justify-between text-[14px] font-semibold">原価と利益<span className="rounded-full bg-[#f3e7c8] px-2 py-0.5 text-[10.5px] font-normal text-[#8a650c]">社内用・お客様には見えません</span></p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block text-[12px] font-medium">使用デシ数（1個）<input type="number" min={0} step={0.5} value={c.ds || ""} onChange={(e) => onChange({ ...c, ds: Math.max(0, Number(e.target.value) || 0) })} className={field} /></label>
        <label className="block text-[12px] font-medium">加工賃（1個・円）<input type="number" min={0} step={50} value={c.labor || ""} onChange={(e) => onChange({ ...c, labor: Math.max(0, Number(e.target.value) || 0) })} className={field} /></label>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11.5px] text-mute">
        <span>数量</span>
        {lots.map((n) => <button key={n} type="button" onClick={() => setLot(n)} className={`rounded-full border px-2.5 py-1 tabular-nums ${lot === n ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>{n}個〜</button>)}
        {rate > 0 && <span className="ml-1">（単価 {Math.round(rate * 100)}%引きで計算）</span>}
      </div>
      {!list.length ? <p className="mt-3 text-[12px] text-mute">上の「革素材」を選ぶと計算します。</p> : (
        <ul className="mt-3 space-y-2">
          {list.map((l) => {
            const x = costOf(p, l, rate);
            return (
              <li key={l.id} className="rounded-lg bg-white px-3.5 py-3 text-[12px] ring-1 ring-[#efe3c4]">
                <p className="flex items-baseline justify-between gap-2"><span className="font-medium">{l.name}</span><span className="text-[11px] text-mute tabular-nums">デシ単価 {yen(l.dsPrice)}</span></p>
                <dl className="mt-1.5 grid grid-cols-[1fr_auto] gap-y-0.5 tabular-nums">
                  <dt className="text-mute">革代（{x.ds}デシ × {yen(l.dsPrice)}）</dt><dd className="text-right">{yen(x.leather)}</dd>
                  <dt className="text-mute">加工賃</dt><dd className="text-right">{yen(x.labor)}</dd>
                  <dt className="border-t border-line pt-0.5 font-medium">合計原価</dt><dd className="border-t border-line pt-0.5 text-right font-medium">{yen(x.total)}</dd>
                  <dt className="text-mute">販売単価{l.add > 0 ? `（+${yen(l.add)}）` : ""}</dt><dd className="text-right">{yen(x.price)}</dd>
                  <dt className="font-medium">利益（1個）</dt><dd className={`text-right font-semibold ${x.profit < 0 ? "text-red-600" : "text-[#2f7a4a]"}`}>{yen(x.profit)}<span className="ml-1.5 text-[11px] font-normal">利益率 {pct(x.margin)}</span></dd>
                  <dt className="text-mute">{lot}個の利益</dt><dd className="text-right text-mute">{yen(x.profit * lot)}</dd>
                </dl>
              </li>
            );
          })}
        </ul>
      )}
      <TechNote className="mt-2.5">原価は products.cost と leathers.ds_price。RLS で「原価・粗利・売上を見る」権限の人だけが読める</TechNote>
    </div>
  );
}

// 表示順を1つずつ動かすボタン
function UpDown({ first, last, onMove, label }: { first: boolean; last: boolean; onMove: (dir: -1 | 1) => void; label: string }) {
  const b = "rounded-md p-1.5 text-mute hover:bg-[#f1f1f0] hover:text-ink disabled:opacity-25 disabled:hover:bg-transparent";
  return (
    <span className="flex shrink-0 flex-col">
      <button type="button" disabled={first} onClick={() => onMove(-1)} aria-label={`${label}を上へ`} className={b}><ArrowUp size={14} /></button>
      <button type="button" disabled={last} onClick={() => onMove(1)} aria-label={`${label}を下へ`} className={b}><ArrowDown size={14} /></button>
    </span>
  );
}

// LPのトップ（ベースモデル）に出す商品と、その並び順
function LpList({ onEdit }: { onEdit: (p: Product) => void }) {
  const { products, lp } = useCatalog();
  const on = lp.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p);
  const off = products.filter((p) => !lp.includes(p.id));
  const Thumb = ({ p }: { p: Product }) => (p.img ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imgSrc(p.img)} alt="" className="aspect-[4/3] w-14 shrink-0 rounded-md object-cover" />
  ) : <span className="aspect-[4/3] w-14 shrink-0 rounded-md bg-[#f1f1f0]" />);
  return (
    <div>
      <p className="px-5 pt-3 text-[11.5px] text-mute">LPのトップの「ベースモデル」に、この順で出ます。利益シミュレーターと見積フォームの並びも同じです。</p>
      <ol className="mt-2 divide-y divide-line border-y border-line">
        {on.map((p, k) => (
          <li key={p.id} className="flex items-center gap-3 py-3 pr-4 pl-2">
            <UpDown first={k === 0} last={k === on.length - 1} onMove={(dir) => moveLp(p.id, dir)} label={p.short} />
            <span className="w-5 shrink-0 text-center text-[12px] text-mute tabular-nums">{k + 1}</span>
            <Thumb p={p} />
            <button type="button" onClick={() => onEdit(p)} className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[13.5px] font-medium">{p.short}</span>
              <span className="block truncate text-[11.5px] text-mute">{p.visible ? yen(p.unitPrice) + "〜" : "非公開のため、いまはLPに出ていません"}</span>
            </button>
            <button type="button" onClick={() => setLp(p.id, false)} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[11.5px] text-mute hover:border-ink hover:text-ink">外す</button>
          </li>
        ))}
        {!on.length && <li className="px-5 py-8 text-center text-[13px] text-mute">LPに出す商品がありません。下から選んでください。</li>}
      </ol>
      {off.length > 0 && (
        <>
          <p className="px-5 pt-4 pb-1 text-[12px] font-medium">LPに出していない商品</p>
          <ul className="divide-y divide-line">
            {off.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-2.5">
                <Thumb p={p} />
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink/80">{p.short}{!p.visible && <span className="ml-1.5 text-[11px] text-mute">非公開</span>}</span>
                <button type="button" onClick={() => setLp(p.id, true)} className="shrink-0 rounded-full border border-ink px-3 py-1.5 text-[11.5px] hover:bg-ink hover:text-white">LPに出す</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
