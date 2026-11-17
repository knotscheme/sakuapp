"use client";

import { useState } from "react";
import { ChevronRight, Lock, Plus, RotateCcw, Trash2 } from "lucide-react";
import { ALL_MODELS } from "@/lib/models";
import { DEFAULT_PRICING, resetPricing, savePricing, usePricing, type Tier } from "@/lib/pricing";
import { useAuth } from "@/components/cms/perm";
import { askConfirm } from "@/components/cms/Confirm";
import { Card, CardHead, NoAccess, Shell } from "@/components/cms/ui";

// 価格と割引：数量割引の段階・版代・最小ロット。変えられるのはオーナーだけ
const yen = (n: number) => `${Math.round(n).toLocaleString("ja-JP")}円`;
const unitOf = (base: number, rate: number) => Math.round((base * (1 - rate)) / 10) * 10;

export default function Pricing() {
  const { can, isOwner, me } = useAuth();
  const pr = usePricing();
  const [minLot, setMinLot] = useState(pr.minLot);
  const [plate, setPlate] = useState(pr.plate);
  const [tiers, setTiers] = useState<{ at: number; pct: number }[]>(pr.tiers.map((t) => ({ at: t.at, pct: Math.round(t.rate * 1000) / 10 })));
  const [model, setModel] = useState(ALL_MODELS[0].id);
  if (!can("money.view")) return <Shell title="価格と割引"><NoAccess /></Shell>;

  const edit = isOwner;
  const sorted = [...tiers].sort((a, b) => a.at - b.at);
  // 入力のチェック
  const errs: string[] = [];
  if (!(minLot >= 1)) errs.push("最小ロットは1個以上にしてください");
  if (!(plate >= 0)) errs.push("版代は0円以上にしてください");
  if (sorted.some((t) => !(t.at > minLot))) errs.push(`割引の段階は、最小ロット（${minLot}個）より多い数にしてください`);
  if (new Set(sorted.map((t) => t.at)).size !== sorted.length) errs.push("同じ個数の段階が2つあります");
  if (sorted.some((t) => !(t.pct > 0 && t.pct <= 50))) errs.push("割引率は 0.1〜50% の間にしてください");
  const warn = sorted.some((t, i) => i > 0 && t.pct < sorted[i - 1].pct) ? "数が多いのに割引率が下がる段階があります（このままでも保存はできます）" : "";
  const next: Tier[] = sorted.map((t) => ({ at: t.at, rate: t.pct / 100 }));
  const dirty = JSON.stringify({ minLot, plate, next }) !== JSON.stringify({ minLot: pr.minLot, plate: pr.plate, next: pr.tiers });
  const base = ALL_MODELS.find((m) => m.id === model)!.unitPrice;
  const rows = [{ at: minLot, pct: 0 }, ...sorted];
  const field = "w-full rounded-lg border border-line bg-white px-3 py-2 text-right text-[14px] tabular-nums outline-none focus:border-ink disabled:bg-[#fafafa] disabled:text-ink";

  const save = async () => {
    if (!(await askConfirm({ title: "価格と割引を保存しますか？", body: "LPの見積もり・シミュレーター・製品一覧と、これから作る見積にすぐ反映されます。送った見積の金額は変わりません。", ok: "保存する" }))) return;
    savePricing({ minLot, plate, tiers: next }, me?.name ?? "オーナー");
  };

  return (
    <Shell title="価格と割引" note="price_rules テーブルに保存し、変更は履歴に残す。見積を送った案件は、その時点の価格で固定（quotes テーブル）">
      {!edit && <div className="cms-card mb-5 flex items-center gap-3 px-5 py-4 text-[13px]"><Lock size={16} className="shrink-0 text-mute" />価格と割引を変えられるのはオーナーだけです。あなたは確認だけできます。</div>}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHead note="合計の数がその個数以上になると、単価が割り引かれる（カラーをまたいだ合計で決まる）">数量割引</CardHead>
            <div className="border-t border-line px-5 py-4">
              <div className="grid grid-cols-[1fr_auto_1fr_auto_2.5rem] items-center gap-x-2 gap-y-2.5 text-[13px]">
                <span className="text-[11.5px] text-mute">合計の数</span><span /><span className="text-[11.5px] text-mute">割引率</span><span /><span />
                {/* 最小ロット（割引なし） */}
                <input type="number" inputMode="numeric" min={1} value={minLot || ""} disabled={!edit} onChange={(e) => setMinLot(Math.max(0, Math.round(Number(e.target.value))))} className={field} aria-label="最小ロット" />
                <span className="text-mute">個以上</span>
                <span className="px-3 text-right text-mute">割引なし</span><span /><span className="text-[10.5px] text-mute">最小</span>
                {tiers.map((t, i) => (
                  <Row key={i} t={t} edit={edit} field={field} onChange={(x) => setTiers(tiers.map((y, k) => (k === i ? x : y)))}
                    onRemove={async () => { if (await askConfirm({ title: `「${t.at}個以上で${t.pct}%引き」を消しますか？`, body: "保存するまでは、元に戻せます。", ok: "消す", danger: true })) setTiers(tiers.filter((_, k) => k !== i)); }} />
                ))}
              </div>
              {edit && (
                <button type="button" onClick={() => { const last = sorted[sorted.length - 1]; setTiers([...tiers, { at: last ? last.at * 2 : minLot * 2, pct: last ? Math.min(50, last.pct + 4) : 4 }]); }}
                  className="mt-3 flex items-center gap-1.5 text-[12.5px] text-ink/80 hover:text-ink"><Plus size={14} />段階を追加</button>
              )}
            </div>
          </Card>

          <Card>
            <CardHead note="ロゴを押すための版の代金。デザインごとに初回だけかかる">版代</CardHead>
            <div className="flex items-center gap-2 border-t border-line px-5 py-4 text-[13px]">
              <input type="number" inputMode="numeric" min={0} step={1000} value={plate} disabled={!edit} onChange={(e) => setPlate(Math.max(0, Math.round(Number(e.target.value))))} className={`${field} max-w-[10rem]`} aria-label="版代" />
              <span className="text-mute">円（税抜・1デザインにつき）</span>
            </div>
          </Card>

          {(errs.length > 0 || warn) && (
            <div className="space-y-1 rounded-xl bg-[#fdf3f3] px-4 py-3 text-[12.5px]">
              {errs.map((e) => <p key={e} className="text-red-700">{e}</p>)}
              {warn && <p className="text-[#8a650c]">{warn}</p>}
            </div>
          )}
          {edit && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={async () => { if (await askConfirm({ title: "初期の設定に戻しますか？", body: `最小${DEFAULT_PRICING.minLot}個・版代${yen(DEFAULT_PRICING.plate)}・${DEFAULT_PRICING.tiers.map((t) => `${t.at}個〜${t.rate * 100}%`).join("、")}`, ok: "戻す", danger: true })) { resetPricing(me?.name ?? "オーナー"); } }} className="tap flex items-center gap-1.5 text-[12.5px] text-mute hover:text-ink"><RotateCcw size={13} />初期の設定に戻す</button>
              <button type="button" disabled={!dirty || errs.length > 0} onClick={save} className="cms-btn bg-ink px-6 py-2.5 text-[13.5px] text-white disabled:bg-line disabled:text-mute">保存する</button>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* 単価の見本 */}
          <Card>
            <CardHead right={<select value={model} onChange={(e) => setModel(e.target.value as typeof model)} className="rounded-lg border border-line bg-white px-2 py-1.5 text-[12.5px] outline-none" aria-label="製品">{ALL_MODELS.map((m) => <option key={m.id} value={m.id}>{m.short}</option>)}</select>}>単価の見本</CardHead>
            <table className="w-full border-t border-line text-[13px]">
              <thead className="bg-[#fafafa] text-left text-[11.5px] text-mute"><tr><th className="px-5 py-2 font-normal">合計の数</th><th className="px-3 py-2 text-right font-normal">割引</th><th className="px-5 py-2 text-right font-normal">単価</th></tr></thead>
              <tbody className="divide-y divide-line">
                {rows.map((t) => <tr key={t.at}><td className="px-5 py-2.5 tabular-nums">{t.at}個〜</td><td className="px-3 py-2.5 text-right tabular-nums text-mute">{t.pct ? `${t.pct}%` : "—"}</td><td className="px-5 py-2.5 text-right whitespace-nowrap tabular-nums">{yen(unitOf(base, t.pct / 100))}</td></tr>)}
              </tbody>
            </table>
            <p className="border-t border-line px-5 py-3 text-[11.5px] text-mute">保存前の内容で計算しています。例：{rows[rows.length - 1].at}個なら {yen(unitOf(base, rows[rows.length - 1].pct / 100) * rows[rows.length - 1].at + plate)}（税抜・版代込み）</p>
          </Card>

          <Card>
            <CardHead>変更の履歴</CardHead>
            <ul className="divide-y divide-line border-t border-line">
              {pr.logs.map((l, i) => <li key={i} className="flex items-start gap-3 px-5 py-3 text-[12.5px]"><ChevronRight size={14} className="mt-0.5 shrink-0 text-mute" /><span className="flex-1">{l.text}</span><span className="shrink-0 text-[11px] text-mute">{l.at}・{l.by}</span></li>)}
              {!pr.logs.length && <li className="px-5 py-5 text-[12.5px] text-mute">まだ変更はありません。</li>}
            </ul>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Row({ t, edit, field, onChange, onRemove }: { t: { at: number; pct: number }; edit: boolean; field: string; onChange: (x: { at: number; pct: number }) => void; onRemove: () => void }) {
  return (
    <>
      <input type="number" inputMode="numeric" min={1} value={t.at || ""} disabled={!edit} onChange={(e) => onChange({ ...t, at: Math.max(0, Math.round(Number(e.target.value))) })} className={field} aria-label="個数" />
      <span className="text-mute">個以上</span>
      <input type="number" inputMode="decimal" min={0} max={50} step={0.5} value={t.pct || ""} disabled={!edit} onChange={(e) => onChange({ ...t, pct: Math.max(0, Math.min(50, Number(e.target.value))) })} className={field} aria-label="割引率" />
      <span className="text-mute">%引き</span>
      {edit ? <button type="button" onClick={onRemove} aria-label="この段階を消す" className="flex h-9 w-9 items-center justify-center rounded-md text-mute hover:bg-[#f1f1f0] hover:text-red-600"><Trash2 size={14} /></button> : <span />}
    </>
  );
}
