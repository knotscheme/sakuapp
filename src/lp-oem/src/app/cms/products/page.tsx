"use client";

import { useState } from "react";
import { ExternalLink, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { addCat, deleteCat, deleteProduct, imgSrc, renameCat, saveProduct, shrinkImage, toggleVisible, useCatalog, type Product } from "@/components/cms/catalog";
import { Card, CardHead, Shell, TechNote } from "@/components/cms/ui";

const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;
const blank = (cat: string): Product => ({ id: `p-${Date.now().toString(36)}`, name: "", short: "", cat, feature: "", size: "", logo: "", unitPrice: 0, img: "", visible: true });

export default function ProductsAdmin() {
  const { cats, products } = useCatalog();
  const [cat, setCat] = useState("all");
  const [edit, setEdit] = useState<Product | null>(null);
  const [newCat, setNewCat] = useState("");
  const list = products.filter((p) => cat === "all" || p.cat === cat);
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
          {/* カテゴリで絞り込み */}
          <div className="flex gap-1 overflow-x-auto border-b border-line px-4 pt-3">
            {[{ id: "all", name: "すべて" }, ...cats].map((c) => {
              const n = c.id === "all" ? products.length : products.filter((p) => p.cat === c.id).length;
              return (
                <button key={c.id} type="button" onClick={() => setCat(c.id)} className={`-mb-px shrink-0 border-b-2 px-3 pb-2.5 text-[13px] ${cat === c.id ? "border-ink font-medium" : "border-transparent text-mute hover:text-ink"}`}>
                  {c.name}<span className="ml-1.5 text-[11px] text-mute">{n}</span>
                </button>
              );
            })}
          </div>
          <ul className="divide-y divide-line">
            {list.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                {p.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgSrc(p.img)} alt="" className="aspect-[4/3] w-16 shrink-0 rounded-md object-cover" />
                ) : (
                  <span className="flex aspect-[4/3] w-16 shrink-0 items-center justify-center rounded-md bg-[#f1f1f0] text-mute"><ImagePlus size={16} /></span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium">{p.short || "（名前なし）"}</p>
                  <p className="truncate text-[11.5px] text-mute">{catName(p.cat)}・{yen(p.unitPrice)}〜</p>
                </div>
                <button type="button" onClick={() => toggleVisible(p.id)} className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] ${p.visible ? "bg-[#e6f4ea] text-[#1e6b34]" : "bg-[#f1f1f0] text-mute"}`}>
                  {p.visible ? "公開中" : "非公開"}
                </button>
                <button type="button" onClick={() => setEdit(p)} aria-label="編集" className="shrink-0 rounded-md p-2 text-mute hover:bg-[#f1f1f0] hover:text-ink"><Pencil size={15} /></button>
              </li>
            ))}
            {!list.length && <li className="px-5 py-10 text-center text-[13px] text-mute">このカテゴリには、まだ商品がありません。</li>}
          </ul>
        </Card>

        {/* カテゴリの管理 */}
        <Card className="self-start">
          <CardHead note="並び順・名前は categories テーブルで管理">カテゴリ</CardHead>
          <ul className="divide-y divide-line border-t border-line">
            {cats.map((c) => (
              <li key={c.id} className="flex items-center gap-2 px-4 py-2.5">
                <input defaultValue={c.name} onBlur={(e) => e.target.value.trim() && renameCat(c.id, e.target.value.trim())} className="min-w-0 flex-1 rounded-md px-2 py-1 text-[13px] outline-none hover:bg-[#f1f1f0] focus:bg-[#f1f1f0]" aria-label="カテゴリ名" />
                <span className="text-[11px] text-mute">{products.filter((p) => p.cat === c.id).length}</span>
                <button type="button" aria-label="削除" onClick={() => { if (!deleteCat(c.id)) alert("商品が入っているカテゴリは削除できません。先に商品を別のカテゴリへ移してください。"); }} className="rounded-md p-1.5 text-mute hover:bg-[#f1f1f0] hover:text-red-600"><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
          <form className="flex gap-2 border-t border-line p-4" onSubmit={(e) => { e.preventDefault(); if (!newCat.trim()) return; addCat(newCat.trim()); setNewCat(""); }}>
            <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="例：キーケース" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-ink" />
            <button className="cms-btn border border-ink px-3 text-[12.5px]">追加</button>
          </form>
        </Card>
      </div>

      {edit && <Editor initial={edit} onClose={() => setEdit(null)} />}
    </Shell>
  );
}

function Editor({ initial, onClose }: { initial: Product; onClose: () => void }) {
  const { cats, products } = useCatalog();
  const [p, setP] = useState<Product>(initial);
  const [busy, setBusy] = useState(false);
  const isNew = !products.some((x) => x.id === initial.id);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  const ok = p.short.trim() && p.cat && p.unitPrice > 0 && p.img;
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
            <p className="font-medium">商品画像<span className="ml-1 text-[11px] text-gold">必須</span></p>
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
            <label className="block font-medium">サイズ<input value={p.size} onChange={(e) => set("size", e.target.value)} placeholder="W10 × H7 × D2 cm" className={field} /></label>
            <label className="block font-medium">ロゴ位置<input value={p.logo} onChange={(e) => set("logo", e.target.value)} placeholder="表面中央" className={field} /></label>
          </div>
          <label className="block font-medium">参考単価（30個・円）<span className="ml-1 text-[11px] text-gold">必須</span>
            <input type="number" min={0} step={100} value={p.unitPrice || ""} onChange={(e) => set("unitPrice", Number(e.target.value))} className={field} />
          </label>
          <label className="flex items-center gap-2.5 font-medium">
            <input type="checkbox" checked={p.visible} onChange={(e) => set("visible", e.target.checked)} className="h-4 w-4 accent-[#1a1a1a]" />
            製品一覧に公開する
          </label>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
          {!isNew ? (
            <button type="button" onClick={() => { if (confirm("この商品を削除しますか？")) { deleteProduct(p.id); onClose(); } }} className="flex items-center gap-1.5 text-[12.5px] text-red-600"><Trash2 size={14} /> 削除</button>
          ) : <span />}
          <button type="button" disabled={!ok} onClick={() => { saveProduct({ ...p, name: p.name.trim() || p.short.trim() }); onClose(); }} className="cms-btn bg-ink px-5 py-2.5 text-[13px] text-white disabled:bg-line disabled:text-mute">保存する</button>
        </div>
      </div>
    </div>
  );
}
