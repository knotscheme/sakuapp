"use client";

import { ChevronDown, Plus, X } from "lucide-react";
import { stageIndex, tierInfo, type Deal } from "@/lib/cms";
import { MIN_LOT } from "@/lib/models";
import { updateDeal } from "@/components/cms/store";
import { useCatalog } from "@/components/cms/catalog";
import { askConfirm } from "@/components/cms/Confirm";
import { Dot } from "../products/variants";

// カラーごとの数量：合計の数で数量割引（30・50・100・300個以上）が決まり、見積にそのまま反映される
export function ItemsEditor({ d, canEdit }: { d: Deal; canEdit: boolean }) {
  const { colors } = useCatalog();
  const items = d.items?.length ? d.items : [{ color: d.color, qty: d.lot }];
  const editable = canEdit && stageIndex(d.stage) <= 1; // 見積を送るまで変えられる
  const total = items.reduce((s, x) => s + (x.qty || 0), 0);
  const t = tierInfo(total);
  const save = (next: { color: string; qty: number }[]) => {
    const sum = next.reduce((s, x) => s + (x.qty || 0), 0);
    updateDeal(d.id, (x) => ({ ...x, items: next, lot: sum, color: next[0]?.color ?? x.color }));
  };
  const colorOf = (name: string) => colors.find((c) => c.name === name);
  const unused = colors.filter((c) => !items.some((x) => x.color === c.name));

  return (
    <div className="border-t border-line px-5 py-4">
      <p className="text-[12px] font-medium text-mute">カラーと数量</p>
      <ul className="mt-2 space-y-2">
        {items.map((x, i) => (
          <li key={i} className="flex items-center gap-2 text-[13px]">
            <Dot c={colorOf(x.color)} size={16} />
            {editable ? (
              <>
                <label className="relative flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[13px] focus-within:border-ink">
                  <span className="min-w-0 flex-1 truncate">{x.color}</span><ChevronDown size={13} className="shrink-0 text-mute" />
                  {/* 見た目は小さな文字。押すと、スマホの選択の一覧が開く */}
                  <select value={x.color} onChange={(e) => save(items.map((y, k) => (k === i ? { ...y, color: e.target.value } : y)))} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="カラー">
                    {[x.color, ...unused.map((c) => c.name)].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
                <input type="number" inputMode="numeric" min={0} step={10} value={x.qty || ""} onChange={(e) => save(items.map((y, k) => (k === i ? { ...y, qty: Math.max(0, Math.round(Number(e.target.value))) } : y)))} className="w-16 shrink-0 rounded-lg border border-line px-2 py-1.5 text-right text-[13px] tabular-nums outline-none focus:border-ink" aria-label={`${x.color}の数量`} />
                <span className="shrink-0 text-mute">個</span>
                {items.length > 1 && (
                  <button type="button" aria-label={`${x.color}を外す`} onClick={async () => { if (await askConfirm({ title: `「${x.color}」を外しますか？`, body: `${x.qty}個が見積から外れます。`, ok: "外す", danger: true })) save(items.filter((_, k) => k !== i)); }} className="rounded-md p-2 text-mute hover:bg-[#f1f1f0] hover:text-red-600"><X size={14} /></button>
                )}
              </>
            ) : (
              <><span className="flex-1">{x.color}</span><span className="tabular-nums">{x.qty}個</span></>
            )}
          </li>
        ))}
      </ul>
      {editable && unused.length > 0 && (
        <button type="button" onClick={() => save([...items, { color: unused[0].name, qty: 0 }])} className="mt-2.5 flex items-center gap-1.5 text-[12.5px] text-ink/80 hover:text-ink"><Plus size={14} />カラーを追加</button>
      )}
      <div className="mt-3 rounded-lg bg-[#f6f6f5] px-3.5 py-2.5 text-[12.5px] leading-relaxed">
        <p>合計 <b className="font-semibold tabular-nums">{total}個</b>
          {total < MIN_LOT ? <span className="ml-2 text-red-600">（{MIN_LOT}個から承ります）</span>
            : t.cur && t.cur.rate > 0 ? <span className="ml-2">→ {t.cur.at}個以上の数量割引（<b className="font-semibold">{Math.round(t.cur.rate * 100)}%引き</b>）</span>
            : <span className="ml-2 text-mute">（数量割引なし）</span>}
        </p>
        {t.next && total >= MIN_LOT && <p className="text-[#8a650c]">あと{t.need}個（合計{t.next.at}個）で {Math.round(t.next.rate * 100)}%引きになります</p>}
      </div>
      {!editable && canEdit && <p className="mt-2 text-[11.5px] text-mute">発注のあとは変更できません（本番では、変更の依頼として記録して見積を作り直す）</p>}
    </div>
  );
}
