"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, ImagePlus, Plus, Printer, Trash2, X } from "lucide-react";
import { dieTotal, dsTotal, emptySpec, modelOf, yenOf, type Spec } from "@/lib/cms";
import { finishSpec, reopenSpec, saveSpec, useDeals } from "@/components/cms/store";
import { leathersOf, shrinkImage, useCatalog } from "@/components/cms/catalog";
import { useAuth } from "@/components/cms/perm";
import { askConfirm } from "@/components/cms/Confirm";
import { Card, CardHead, KindBadge, NoAccess, Shell, TechNote, useQuery } from "@/components/cms/ui";

// ODMの仕様書：お客様との打ち合わせで、寸法・パーツごとの革の量（デシ）・抜き型・金具などを決め、設計図をつけて確定する。
// 確定すると見積（抜き型代つき）へ進める。印刷すると、設計図つきの仕様書になる
export default function SpecPage() {
  const id = useQuery("id");
  const deals = useDeals();
  const d = deals.find((x) => x.id === id);
  const { can, me } = useAuth();
  if (!can("deals.view")) return <Shell title="仕様書"><NoAccess /></Shell>;
  if (!d) return <Shell title="仕様書"><p className="text-[13px] text-mute">{id ? "案件が見つかりません。" : "読み込み中…"}</p></Shell>;
  return <Editor key={d.id + (d.spec?.status ?? "")} dealId={d.id} who={me?.name ?? "担当"} edit={can("deals.advance")} />;
}

function Editor({ dealId, who, edit }: { dealId: string; who: string; edit: boolean }) {
  const d = useDeals().find((x) => x.id === dealId)!;
  const { products, leathers } = useCatalog();
  const { can } = useAuth();
  const [s, setS] = useState<Spec>(() => d.spec ?? emptySpec());
  const [busy, setBusy] = useState(false);
  const locked = d.spec?.status === "done" || !edit;
  const set = <K extends keyof Spec>(k: K, v: Spec[K]) => setS((x) => ({ ...x, [k]: v }));
  const choices = leathersOf(products.find((p) => p.id === d.model), leathers);
  const all = leathers.length ? leathers : choices;
  const price = (name: string) => all.find((l) => l.name === name)?.dsPrice ?? 0;
  const leatherCost = s.parts.reduce((t, x) => t + (x.ds || 0) * (x.qty || 0) * price(x.leather), 0);
  const unitCost = Math.round(leatherCost + (s.labor || 0));
  const missing = [!s.size.w || !s.size.h ? "寸法" : "", !s.parts.some((x) => x.ds > 0 && x.leather) ? "パーツと革の量" : "", !s.dies.some((x) => x.cost > 0) ? "抜き型" : "", !s.drawings.length ? "設計図" : ""].filter(Boolean);
  const field = "w-full rounded-md border border-line bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-ink disabled:bg-[#fafafa] disabled:text-ink";
  const num = `${field} text-right tabular-nums`;

  const done = async () => {
    if (missing.length) return;
    if (!(await askConfirm({ title: "仕様書を確定しますか？", body: `抜き型代 ${yenOf(dieTotal(s))}（初回のみ）が見積に入り、見積を送れるようになります。確定後に直すときは「修正する」を押します。`, ok: "確定する" }))) return;
    finishSpec(d.id, s, who);
  };

  return (
    <Shell title="仕様書（ODM）" actions={<button type="button" onClick={() => print()} className="hidden items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[12.5px] sm:flex"><Printer size={14} />印刷・PDF</button>}
      note="仕様書は specs テーブル、設計図は Supabase Storage。確定した版を製造指示書に使い、変更は版として残す">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] print:hidden">
        <Link href={`/cms/deal/?id=${d.id}`} className="tap flex items-center gap-1 text-mute hover:text-ink"><ArrowLeft size={14} />案件に戻る</Link>
        <span className="text-line">|</span><KindBadge d={d} long /><span className="font-medium">{d.id} {d.brand}</span><span className="text-mute">・{modelOf(d.model).short}をもとに・{d.lot}個</span>
      </div>

      {d.spec?.status === "done" ? (
        <p className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-[#e6f4ea] px-4 py-3 text-[13px] text-[#1e6b34] print:hidden"><CheckCircle2 size={16} />{d.spec.doneAt} に {d.spec.doneBy} が確定しました。見積に抜き型代が入っています。
          {edit && <button type="button" onClick={async () => { if (await askConfirm({ title: "仕様書を修正しますか？", body: "修正中は見積を送れません。直したら、もう一度確定してください。", ok: "修正する" })) reopenSpec(d.id, who); }} className="ml-auto rounded-full border border-[#1e6b34]/40 px-3 py-1 text-[12px]">修正する</button>}
        </p>
      ) : (
        <p className="mb-4 rounded-lg bg-[#fbf3e2] px-4 py-3 text-[13px] text-[#8a650c] print:hidden">お客様と打ち合わせて、寸法・革の量・抜き型・設計図をまとめてください。確定すると見積を送れるようになります。</p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHead>1. 打ち合わせ</CardHead>
            <div className="grid gap-3 border-t border-line p-5 sm:grid-cols-[10em_1fr]">
              <label className="text-[12px] text-mute">日付<input type="date" value={s.meetAt ?? ""} disabled={locked} onChange={(e) => set("meetAt", e.target.value)} className={`mt-1 ${field}`} /></label>
              <label className="text-[12px] text-mute">決めたこと・メモ<textarea value={s.meetMemo ?? ""} disabled={locked} onChange={(e) => set("meetMemo", e.target.value)} rows={3} placeholder="例）カード段は3段、小銭入れはマチ付き。革はハイブリッドの標準色から" className={`mt-1 resize-y ${field}`} /></label>
            </div>
          </Card>

          <Card>
            <CardHead>2. 寸法（仕上がり・cm）</CardHead>
            <div className="grid grid-cols-3 gap-3 border-t border-line p-5">
              {(["w", "h", "d"] as const).map((k) => (
                <label key={k} className="text-[12px] text-mute">{k === "w" ? "幅 W" : k === "h" ? "高さ H" : "厚み D"}<input type="number" min={0} step={0.5} value={s.size[k] || ""} disabled={locked} onChange={(e) => set("size", { ...s.size, [k]: Number(e.target.value) })} className={`mt-1 ${num}`} /></label>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead note="1デシ＝10×10cm。革代は商品管理の革素材のデシ単価で計算">3. パーツと革の量</CardHead>
            <div className="overflow-x-auto border-t border-line">
              <table className="w-full min-w-[560px] text-[12.5px]">
                <thead className="bg-[#fafafa] text-left text-[11px] text-mute"><tr><th className="px-3 py-2 font-normal">パーツ</th><th className="px-3 py-2 font-normal">革</th><th className="w-20 px-3 py-2 font-normal">デシ/枚</th><th className="w-16 px-3 py-2 font-normal">枚/個</th><th className="w-8" /></tr></thead>
                <tbody className="divide-y divide-line">
                  {s.parts.map((x, i) => {
                    const up = (p: Partial<typeof x>) => set("parts", s.parts.map((y, k) => (k === i ? { ...y, ...p } : y)));
                    return (
                      <tr key={i}>
                        <td className="px-2 py-1.5"><input value={x.name} disabled={locked} onChange={(e) => up({ name: e.target.value })} className={field} /></td>
                        <td className="px-2 py-1.5"><select value={x.leather} disabled={locked} onChange={(e) => up({ leather: e.target.value })} className={field}><option value="">選ぶ</option>{all.map((l) => <option key={l.id} value={l.name}>{l.name}</option>)}</select></td>
                        <td className="px-2 py-1.5"><input type="number" min={0} step={0.1} value={x.ds || ""} disabled={locked} onChange={(e) => up({ ds: Number(e.target.value) })} className={num} /></td>
                        <td className="px-2 py-1.5"><input type="number" min={0} step={1} value={x.qty || ""} disabled={locked} onChange={(e) => up({ qty: Number(e.target.value) })} className={num} /></td>
                        <td className="px-1">{!locked && s.parts.length > 1 && <button type="button" aria-label="消す" onClick={() => set("parts", s.parts.filter((_, k) => k !== i))} className="p-1.5 text-mute hover:text-red-600"><Trash2 size={14} /></button>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!locked && <button type="button" onClick={() => set("parts", [...s.parts, { name: "", leather: s.parts[0]?.leather ?? "", ds: 0, qty: 1 }])} className="m-3 flex items-center gap-1 text-[12.5px] text-mute hover:text-ink"><Plus size={14} />パーツを足す</button>}
            <p className="border-t border-line px-5 py-2.5 text-[12.5px]">革の量 合計 <b className="tabular-nums">{dsTotal(s).toFixed(1)}デシ</b>／個<span className="ml-2 text-mute">（{d.lot}個で約{Math.ceil(dsTotal(s) * d.lot * 1.15)}デシ・裁ち落とし15%込み）</span></p>
          </Card>

          <Card>
            <CardHead note="抜き型は初回のみ。お客様専用として保管し、追加生産でそのまま使う">4. 抜き型</CardHead>
            <ul className="divide-y divide-line border-t border-line">
              {s.dies.map((x, i) => {
                const up = (p: Partial<typeof x>) => set("dies", s.dies.map((y, k) => (k === i ? { ...y, ...p } : y)));
                return (
                  <li key={i} className="flex items-center gap-2 px-3 py-1.5">
                    <input value={x.name} disabled={locked} onChange={(e) => up({ name: e.target.value })} placeholder="型の名前（例：本体）" className={`min-w-0 flex-1 ${field}`} />
                    <input type="number" min={0} step={1000} value={x.cost || ""} disabled={locked} onChange={(e) => up({ cost: Number(e.target.value) })} placeholder="費用" className={`w-28 shrink-0 ${num.replace("w-full ", "")}`} /><span className="text-[12px] text-mute">円</span>
                    {!locked && s.dies.length > 1 && <button type="button" aria-label="消す" onClick={() => set("dies", s.dies.filter((_, k) => k !== i))} className="p-1.5 text-mute hover:text-red-600"><Trash2 size={14} /></button>}
                  </li>
                );
              })}
            </ul>
            {!locked && <button type="button" onClick={() => set("dies", [...s.dies, { name: "", cost: 0 }])} className="m-3 flex items-center gap-1 text-[12.5px] text-mute hover:text-ink"><Plus size={14} />抜き型を足す</button>}
            <p className="border-t border-line px-5 py-2.5 text-[12.5px]">抜き型代 合計 <b className="tabular-nums">{yenOf(dieTotal(s))}</b><span className="ml-2 text-mute">（{s.dies.length}型・初回のみ・見積に入る）</span></p>
          </Card>

          <Card>
            <CardHead>5. 金具・ステッチ・刻印・加工賃</CardHead>
            <div className="grid gap-3 border-t border-line p-5 sm:grid-cols-2">
              <label className="text-[12px] text-mute">金具<input value={s.hardware} disabled={locked} onChange={(e) => set("hardware", e.target.value)} placeholder="例）ホック（真鍮）1個" className={`mt-1 ${field}`} /></label>
              <label className="text-[12px] text-mute">ステッチ<input value={s.stitch} disabled={locked} onChange={(e) => set("stitch", e.target.value)} placeholder="例）生成り・8針/3cm" className={`mt-1 ${field}`} /></label>
              <label className="text-[12px] text-mute">刻印<input value={s.logo} disabled={locked} onChange={(e) => set("logo", e.target.value)} placeholder="例）外装の右下に素押し" className={`mt-1 ${field}`} /></label>
              {can("money.view") && <label className="text-[12px] text-mute">加工賃（1個・社内用）<input type="number" min={0} step={50} value={s.labor || ""} disabled={locked} onChange={(e) => set("labor", Number(e.target.value))} className={`mt-1 ${num}`} /></label>}
              <label className="text-[12px] text-mute sm:col-span-2">そのほか<textarea value={s.notes} disabled={locked} onChange={(e) => set("notes", e.target.value)} rows={2} className={`mt-1 resize-y ${field}`} /></label>
            </div>
          </Card>
        </div>

        <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHead note="寸法・パーツの形を書いた図面。工場の製造指示書にも入る">6. 設計図</CardHead>
            <div className="grid grid-cols-2 gap-2 border-t border-line p-3">
              {s.drawings.map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded-md border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`設計図 ${i + 1}`} className="aspect-[4/3] w-full object-contain" />
                  {!locked && <button type="button" aria-label="消す" onClick={() => set("drawings", s.drawings.filter((_, k) => k !== i))} className="absolute top-1 right-1 rounded-full bg-black/55 p-1 text-white"><X size={13} /></button>}
                </div>
              ))}
              {!locked && (
                <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line text-[11.5px] text-mute hover:border-ink">
                  <ImagePlus size={18} />{busy ? "読み込み中…" : "設計図を追加"}
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={async (e) => { const fs = Array.from(e.target.files ?? []); e.target.value = ""; if (!fs.length) return; setBusy(true); try { const out: string[] = []; for (const f of fs) out.push(await shrinkImage(f, 1200, 900, 0.85)); set("drawings", [...s.drawings, ...out]); } finally { setBusy(false); } }} />
                </label>
              )}
            </div>
            <TechNote className="mx-4 mb-3">デモは画像（PNG・JPG）。本番では PDF・AI もサーバーで画像に変換</TechNote>
          </Card>

          {can("money.view") && (
            <Card>
              <CardHead note="社内用・お客様には見えません">原価の目安（1個）</CardHead>
              <dl className="grid grid-cols-[1fr_auto] gap-y-1 border-t border-line px-5 py-3 text-[13px] tabular-nums">
                <dt className="text-mute">革代（デシ×デシ単価）</dt><dd>{yenOf(Math.round(leatherCost))}</dd>
                <dt className="text-mute">加工賃</dt><dd>{yenOf(s.labor || 0)}</dd>
                <dt className="border-t border-line pt-1 font-medium">1個の原価</dt><dd className="border-t border-line pt-1 font-medium">{yenOf(unitCost)}</dd>
                <dt className="text-mute">{d.lot}個の原価</dt><dd>{yenOf(unitCost * d.lot)}</dd>
                <dt className="text-mute">抜き型代（初回のみ）</dt><dd>{yenOf(dieTotal(s))}</dd>
              </dl>
            </Card>
          )}

          {!locked && (
            <div className="space-y-2 print:hidden">
              {missing.length > 0 && <p className="text-[12px] text-[#8a650c]">確定する前に入れてください：{missing.join("・")}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => saveSpec(d.id, s, who)} className="cms-btn flex-1 border border-ink py-2.5 text-[13px]">下書き保存</button>
                <button type="button" onClick={done} disabled={missing.length > 0} className="cms-btn flex-1 bg-ink py-2.5 text-[13px] text-white disabled:bg-line disabled:text-mute">仕様を確定</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
