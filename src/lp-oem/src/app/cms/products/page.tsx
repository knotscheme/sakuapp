"use client";

import { useState } from "react";
import { ChevronLeft, ExternalLink, ImagePlus, Pencil, Plus, Trash2, Video, X } from "lucide-react";
import { MAX_SUB, skuList, addColor, addSize, deleteColor, deleteSize, setColorHex, addCat, deleteCat, deleteProduct, embedUrl, imgSrc, renameCat, saveProduct, shrinkImage, toggleVisible, useCatalog, type Product } from "@/components/cms/catalog";
import { Card, CardHead, NoAccess, Shell, TechNote } from "@/components/cms/ui";
import { Dot, VariantsEditor } from "./variants";
import { useAuth } from "@/components/cms/perm";
import { askConfirm } from "@/components/cms/Confirm";

const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;
const blank = (cat: string): Product => ({ id: `p-${Date.now().toString(36)}`, name: "", short: "", cat, feature: "", size: "", logo: "", unitPrice: 0, img: "", visible: true });

export default function ProductsAdmin() {
  const { cats, products } = useCatalog();
  const [cat, setCat] = useState("all");
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
        <ColorCard />
        <SizeCard />
        </div>
      </div>

      {edit && <Editor initial={edit} onClose={() => setEdit(null)} />}
    </Shell>
  );
}

function Editor({ initial, onClose }: { initial: Product; onClose: () => void }) {
  const { cats, products } = useCatalog();
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
          <div className="border-t border-line pt-5">
            <p className="mb-3 text-[14px] font-semibold">SKU品番とバリエーション</p>
            <VariantsEditor p={p} onChange={(x) => setP((cur) => ({ ...cur, ...x }))} taken={taken} />
          </div>
          <label className="flex items-center gap-2.5 font-medium">
            <input type="checkbox" checked={p.visible} onChange={(e) => set("visible", e.target.checked)} className="h-4 w-4 accent-[#1a1a1a]" />
            製品一覧に公開する
          </label>
        </div>
        {!skuOk && <p role="status" className="border-t border-line bg-[#fdf3f3] px-6 py-2.5 text-[12px] text-red-700">SKU品番に、空欄か、ほかと同じ品番があります。直すと保存できます。</p>}
        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
          {!isNew ? (
            <button type="button" onClick={async () => { if (await askConfirm({ title: "この商品を削除しますか？", body: "製品一覧からも消えます。元に戻せません。", ok: "削除する", danger: true })) { deleteProduct(p.id); onClose(); } }} className="flex items-center gap-1.5 text-[12.5px] text-red-600"><Trash2 size={14} /> 削除</button>
          ) : <span />}
          <button type="button" disabled={!ok} onClick={() => { saveProduct({ ...p, name: p.name.trim() || p.short.trim(), video: p.video?.trim() || undefined, sku: p.sku?.trim() || undefined, options: p.options?.filter((o) => o.name.trim() && o.values.length), variants: p.variants?.map((v) => ({ ...v, sku: v.sku.trim() })) }); onClose(); }} className="cms-btn bg-ink px-5 py-2.5 text-[13px] text-white disabled:bg-line disabled:text-mute">保存する</button>
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
      <ul className="divide-y divide-line border-t border-line">
        {colors.map((c) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-2">
            <label className="relative -m-2 cursor-pointer p-2" title="色を変える">
              <Dot c={c} size={22} />
              <input type="color" value={c.hex} onChange={(e) => setColorHex(c.id, e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label={`${c.name}の色を変える`} />
            </label>
            <span className="flex-1 text-[13px]">{c.name}</span>
            <span className="font-mono text-[11px] text-mute" title="SKUの記号">{c.code}</span>
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
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3.5">
        {sizes.map((z) => (
          <span key={z.id} className="flex items-center gap-1 rounded-full border border-line py-1 pr-1 pl-3 text-[12.5px]">
            {z.name}
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
